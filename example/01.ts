import { m, addPlayer, Player, Scale } from '../lib';

const mml = m('o5 c d e f g a b')
  .stack(
    //
    m('o4 c d e f g')
  )
  .track(1);
addPlayer(mml);

const mml2 = m('o4 c d e f g a b')
  .queue(
    //
    m('o5 c d e f g a b')
  )
  .track(2);

const cmajor = Scale.degrees('C major');

const mml3 = m('o4 s1 s2 s3 s4 s5 s6 s7')
  //
  .withScale(cmajor)
  .track(3);
addPlayer(mml2, mml3);

const mml4 = m('o4 s{1 2 3 4 5 6 7}').withScale(cmajor).track(4);
addPlayer(mml4);

const dminor = Scale.degrees('D minor');

const mml5 = m('o4 s{1# 2- 3 4 5 6 < 7}').withScale(dminor).track(5);
addPlayer(mml5);

console.log(Player.toFixed());
