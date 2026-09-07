import assert from 'node:assert/strict';
import { stat } from 'node:fs/promises';
import test from 'node:test';

test('the approved front-facing portrait is stored locally', async () => {
  const portrait = await stat(new URL('../public/long-xu-portrait.png', import.meta.url));
  assert.ok(portrait.size > 5_000);
});
