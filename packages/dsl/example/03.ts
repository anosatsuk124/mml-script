import { m, s, addPlayer, Player, Scale } from '../dist';

const mml = s(`
l4
1 2 3 4 5 6 7
+1 +2 +3 +4 +5 +6 +7
`)
  .scale('C4 major pentatonic')
  .queue(s(`1 2 3 4 5`).scale('C4 major pentatonic'));

addPlayer(mml);

const mml2 = s(`l4`).queue(
  s(`
1 2 3 4 5 6 7
`).scale('C4 major'),
  s(`
1 2 3 4 5 6 7
`).scale('C5 major')
);

addPlayer(mml2);

console.log(Player.toFixed());
