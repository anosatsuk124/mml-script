import { m, s, addPlayer, Player, Scale } from '../dist';

const mml = s(
  `
l2
1 2 3 4 5 6 7
1# 2# 3 4 5 6 7
+1 ++2 --3 4 5 6 7
+1 +2 +3 +4 +5 +6 +7
1- 2# 3,4 4,4 5,4 6,4 7,4
`
).scale(Scale.get('C4 major'));

addPlayer(mml);

console.log(Player.toFixed());
