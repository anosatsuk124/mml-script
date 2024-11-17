import { Fixable, MML, MMLPlayer } from './mml';

export const m = MML.from;

export const stack = <T>(...items: T[]): T[] => items;

export const Player = new MMLPlayer();

export const play = <T extends Fixable>(mml: T) => {
  Player.push(mml);

  return Player.toFixed();
};
