import { m, play } from '../lib';

const mml = m('o5 c d e f g a b').stack(
  //
  m('c d e f g')
);
console.log(play(mml));

const mml2 = m('o4 c d e f g a b').queue(
  //
  m('o5 c d e f g a b')
);

console.log(play(mml2));
