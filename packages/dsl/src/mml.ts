import { Note, Scale } from 'tonal';
import { make_wav, pico_compile_to_midi } from 'picosakura';

export interface Fixable {
  toFixed(): string;
}

export interface IMML extends Fixable {
  track(num: number): IMML;
  channel(num: number): IMML;
}

export interface IQueue<T> extends IMML {
  queue(...items: T[]): IQueue<T>;
}

export interface IStack<T> extends IMML {
  stack(...items: T[]): IStack<T>;
}

export class MML implements IMML, IStack<MML>, IQueue<MML> {
  constructor(
    mml: string | MML,
    track: number | undefined = undefined,
    channel: number | undefined = undefined
  ) {
    this.raw_code = mml instanceof MML ? mml.raw_code : mml;

    this.track_number = track;
    this.channel_number = channel;
  }

  // property declarations
  readonly raw_code: string;
  readonly track_number: number | undefined;
  readonly channel_number: number | undefined;

  // override methods
  toString(): string {
    return this.toFixed();
  }

  // static methods
  static from(str: string): MML {
    return new MML(str);
  }

  // instance methods
  toFixed(): string {
    const track = this.track_number ? `TRACK(${this.track_number})` : '';

    const channel = this.channel_number
      ? `CHANNEL(${this.channel_number})`
      : '';

    const code = `${track} ${channel} ${this.raw_code}`.replace(/\n/g, ' ');

    return `${code}`;
  }

  track(num: number): IMML {
    return new MML(this.raw_code, num, this.channel_number);
  }

  channel(num: number): IMML {
    return new MML(this.raw_code, this.track_number, num);
  }

  stack(...mml: MML[]): IStack<IMML> {
    const stack = new Stack<MML>();

    stack.push(this);
    for (const m of mml) {
      stack.push(m);
    }

    return stack;
  }

  queue(...mml: MML[]): IQueue<IMML> {
    const queue = new Queue<MML>();

    queue.push(this);
    for (const m of mml) {
      queue.push(m);
    }

    return queue;
  }
}

export class ScaledMML extends MML {
  // 's1 s2 s3'
  scale(scale_name: string | Scale.Scale): MML {
    const regex_note = /(?<![\w,])([-\+])*(\d+)([-\+#]*)/g;
    let codeToReplace = this.raw_code;

    const scale_obj =
      typeof scale_name === 'string' ? Scale.get(scale_name) : scale_name;
    const scale_length = scale_obj.notes.length;
    const scale_names = scale_obj.name;

    const scale2degree = Scale.degrees(scale_names);

    codeToReplace = codeToReplace.replace(regex_note, (match) => {
      const matches = match.matchAll(regex_note);

      let height = 0;
      for (const m of matches) {
        const height_prefix = m[1];
        if (height_prefix === '-') {
          height -= 1;
        }
        if (height_prefix === '+') {
          height += 1;
        }
      }

      let semitone = 0;
      for (const m of matches) {
        const semitone_suffix = m[3];
        if (semitone_suffix === '-') {
          semitone -= 1;
        }
        if (semitone_suffix === '+' || semitone_suffix === '#') {
          semitone += 1;
        }
      }

      const degree_str = match.replace(regex_note, '$2');
      const degree = parseInt(degree_str);
      const note = scale2degree(degree + height * scale_length);
      const midi = Note.get(note).midi;

      if (midi === null) {
        throw new Error(`Invalid note: ${note}`);
      }
      return `n${midi + semitone}`;
    });

    return new MML(codeToReplace, this.track_number, this.channel_number);
  }
}

export class Queue<T extends IMML> implements IQueue<T> {
  constructor(queue: Array<T> = []) {
    this._queue = queue;
  }

  readonly _queue: Array<T>;

  queue(...items: T[]): IQueue<T> {
    const queue = new Queue([...this._queue]);
    for (const item of items) {
      queue.push(item);
    }

    return queue;
  }

  push(item: T): void {
    this._queue.push(item);
  }

  toFixed(): string {
    return this._queue.map((item) => item.toFixed()).join(' ');
  }

  track(num: number): IQueue<T> {
    return new Queue(this._queue.map((item) => item.track(num)));
  }

  channel(num: number): IQueue<T> {
    return new Queue(this._queue.map((item) => item.channel(num)));
  }
}

export class Stack<T extends IMML> implements IStack<T> {
  constructor(stack: Array<T> = []) {
    this._stack = stack;
  }

  readonly _stack: Array<T>;

  stack(...items: T[]): IStack<T> {
    const stack = new Stack([...this._stack]);

    for (const item of items) {
      stack.push(item);
    }

    return stack;
  }

  push(item: T): void {
    this._stack.push(item);
  }

  toFixed(): string {
    return this._stack.map((item) => `SUB{ ${item.toFixed()} }`).join(' ');
  }

  track(num: number): IStack<T> {
    return new Stack(this._stack.map((item) => item.track(num)));
  }

  channel(num: number): IStack<T> {
    return new Stack(this._stack.map((item) => item.channel(num)));
  }
}

export class MMLPlayer implements Fixable {
  constructor(queue: Array<Fixable> = []) {
    this._queue = queue;
  }

  readonly _queue: Array<Fixable>;

  push = (item: Fixable): void => {
    this._queue.push(item);
  };

  toFixed(): string {
    const mmls = this._queue.map((item) => `{ ${item.toFixed()} }`);

    let result = 'PLAY(';
    while (mmls.length) {
      result += mmls.shift();
      if (mmls.length) {
        result += ', ';
      }
    }

    result += ')';

    return `${result}`;
  }

  play_audio(sound_font: Uint8Array): Uint8Array {
    const fixed = this.toFixed();
    const wav = make_wav(fixed, sound_font);

    if (wav.result) {
      return wav.get_bin();
    } else {
      return new Uint8Array();
    }
  }

  compile_to_midi(): Uint8Array {
    const fixed = this.toFixed();
    const midi = pico_compile_to_midi(fixed);

    if (midi.result) {
      return midi.get_bin();
    } else {
      return new Uint8Array();
    }
  }
}
