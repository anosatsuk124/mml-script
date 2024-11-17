import { expect, test } from 'vitest';
import { MML } from './mml';

test('MML', () => {
  const mml = new MML('cdefgab');
  expect(mml).toBeInstanceOf(MML);
});
