import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('GitHub Pages has a root static build with the canonical public URL', () => {
  const packageJson = JSON.parse(read('package.json'));
  const html = read('index.html');
  const viteConfig = read('vite.github.config.ts');

  assert.equal(
    packageJson.scripts['build:pages'],
    'vite build --config vite.github.config.ts',
  );
  assert.match(viteConfig, /base:\s*['"]\/['"]/);
  assert.match(viteConfig, /outDir:\s*['"]pages-dist['"]/);
  assert.match(html, /<link rel="canonical" href="https:\/\/xulong66\.github\.io\/"/);
  assert.match(html, /property="og:url" content="https:\/\/xulong66\.github\.io\/"/);
  assert.match(
    html,
    /property="og:image" content="https:\/\/xulong66\.github\.io\/og\.png"/,
  );
  assert.doesNotMatch(html, /localhost|127\.0\.0\.1/i);
  assert.ok(existsSync(new URL('../public/.nojekyll', import.meta.url)));
});

test('GitHub Actions validates, builds, and deploys the Pages artifact', () => {
  const workflow = read('.github/workflows/pages.yml');

  assert.match(workflow, /npm ci/);
  assert.match(workflow, /npm test/);
  assert.match(workflow, /npm run lint/);
  assert.match(workflow, /npm run build:pages/);
  assert.match(workflow, /actions\/configure-pages@v5/);
  assert.match(workflow, /actions\/upload-pages-artifact@v4/);
  assert.match(workflow, /path:\s*pages-dist/);
  assert.match(workflow, /actions\/deploy-pages@v4/);
});
