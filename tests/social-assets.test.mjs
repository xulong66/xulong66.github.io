import assert from 'node:assert/strict';
import { open, stat } from 'node:fs/promises';
import test from 'node:test';

test('the dedicated social preview is a substantial local asset', async () => {
  const socialPreview = await stat(
    new URL('../public/og.png', import.meta.url),
  );
  assert.ok(socialPreview.size > 20_000);

  const file = await open(new URL('../public/og.png', import.meta.url), 'r');
  const header = Buffer.alloc(24);
  await file.read(header, 0, 24, 0);
  await file.close();
  assert.equal(header.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
  assert.equal(header.subarray(12, 16).toString('ascii'), 'IHDR');
  assert.equal(header.readUInt32BE(16), 1200);
  assert.equal(header.readUInt32BE(20), 630);
});
