import { Fixable, MML, MMLPlayer, ScaledMML } from './mml';

export const m = (mml: string | MML) => new MML(mml);

export const s = (mml: string | MML) => new ScaledMML(mml);

export const Player = new MMLPlayer();

export const addPlayer = <T extends Fixable>(...mmls: T[]) => {
  for (const mml of mmls) {
    Player.push(mml);
  }

  return Player.toFixed();
};
