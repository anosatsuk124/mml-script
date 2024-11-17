import { Fixable, MML, MMLPlayer } from './mml';

export const m = MML.from;

export const stack = <T>(...items: T[]): T[] => items;

export const Player = new MMLPlayer();

export const addPlayer = <T extends Fixable>(...mmls: T[]) => {
  for (const mml of mmls) {
    Player.push(mml);
  }

  return Player.toFixed();
};
