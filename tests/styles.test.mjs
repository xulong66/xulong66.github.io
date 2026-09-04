import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const css = await readFile(
  new URL('../app/globals.css', import.meta.url),
  'utf8',
);
const root = css.match(/:root\s*\{([\s\S]*?)\}/)?.[1] ?? '';

function token(name) {
  const value = root.match(
    new RegExp(`--${name}:\\s*(#[0-9a-f]{6})`, 'i'),
  )?.[1];
  assert.ok(value, `missing --${name} color token`);
  return value;
}

function luminance(hex) {
  const channels = [1, 3, 5].map(
    (offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255,
  );
  const [red, green, blue] = channels.map((value) =>
    value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4,
  );
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrast(foreground, background) {
  const values = [luminance(foreground), luminance(background)].sort(
    (a, b) => b - a,
  );
  return (values[0] + 0.05) / (values[1] + 0.05);
}

test('small light-theme text tokens meet WCAG AA contrast', () => {
  for (const foreground of [token('muted'), token('gold')]) {
    for (const background of [token('paper'), token('surface')]) {
      assert.ok(
        contrast(foreground, background) >= 4.5,
        `${foreground} on ${background}`,
      );
    }
  }
});

test('focus colors are visible and the navy contact card has an inverse treatment', () => {
  assert.ok(contrast(token('focus-ring'), token('paper')) >= 3);
  assert.ok(contrast(token('focus-ring-inverse'), '#132d49') >= 3);
  assert.match(
    css,
    /a:focus-visible\s*\{[^}]*outline:\s*3px solid var\(--focus-ring\)/s,
  );
  assert.match(
    css,
    /\.contact-card a:focus-visible\s*\{[^}]*outline-color:\s*var\(--focus-ring-inverse\)/s,
  );
});

test('the oversized decorative signal field cannot expand the page canvas', () => {
  assert.match(css, /\.hero\s*\{[^}]*overflow:\s*(?:clip|hidden)/s);
});
