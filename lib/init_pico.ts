import { initSync } from 'picosakura';

initSync(
  await fetch('picosakura_bg.wasm').then((response) => response.arrayBuffer())
);
