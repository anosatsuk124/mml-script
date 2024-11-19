import { m, s, addPlayer, Player, Scale } from '../dist';

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

addPlayer(mml2);

const cmajor = Scale.get('C4 major');

const mml4 = s('1 2 3 4 5 6 7').scale(cmajor).track(4);
addPlayer(mml4);

const dminor = Scale.get('D4 minor');

const mml5 = s('1# 2- -3 ++4 -+5 6 7').scale(dminor).track(5);
addPlayer(mml5);

console.log(Player.toFixed());
