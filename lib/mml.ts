export interface Fixable {
  toFixed(): string;
}

export class MML implements Fixable, IStack<MML>, IQueue<MML> {
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

  track(num: number): MML {
    return new MML(this.raw_code, num, this.channel_number);
  }

  channel(num: number): MML {
    return new MML(this.raw_code, this.track_number, num);
  }

  stack(mml: MML): IStack<MML> {
    const stack = new Stack<MML>();

    stack.push(this);
    stack.push(mml);

    return stack;
  }

  queue(mml: MML): IQueue<MML> {
    const queue = new Queue<MML>();

    queue.push(this);
    queue.push(mml);

    return queue;
  }
}

export interface IQueue<T> extends Fixable {
  queue(i: T): IQueue<T>;
}

export class Queue<T extends MML> implements IQueue<T> {
  constructor(queue: Array<T> = []) {
    this._queue = queue;
  }

  readonly _queue: Array<T>;

  queue(i: T): IQueue<T> {
    return new Queue([...this._queue, i]);
  }

  push(item: T): void {
    this._queue.push(item);
  }

  toFixed(): string {
    return this._queue.map((item) => item.toFixed()).join(' ');
  }
}

export interface IStack<T> extends Fixable {
  stack(i: T): IStack<T>;
}

export class Stack<T extends MML> implements IStack<T> {
  constructor(stack: Array<T> = []) {
    this._stack = stack;
  }

  readonly _stack: Array<T>;

  stack(i: T): Stack<T> {
    return new Stack([...this._stack, i]);
  }

  push(item: T): void {
    this._stack.push(item);
  }

  toFixed(): string {
    return this._stack.map((item) => `SUB{ ${item.toFixed()} }`).join(' ');
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
}
