import { Fixable, MML, MMLPlayer, ScaledMML } from './mml';

export const m = MML.from;

export const s = (mml: string) => new ScaledMML(mml);

export const Player = new MMLPlayer();

export const addPlayer = <T extends Fixable>(...mmls: T[]) => {
  for (const mml of mmls) {
    Player.push(mml);
  }

  return Player.toFixed();
};
