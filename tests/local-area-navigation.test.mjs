import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import test from 'node:test';

test('desktop and mobile navigation link directly to St. Augustine service coverage', async (t) => {
  try {
    await access('dist/index.html');
  } catch {
    t.skip('Run npm run build before validating rendered navigation.');
    return;
  }

  const html = await readFile('dist/index.html', 'utf8');
  const navs = [...html.matchAll(/<nav\b[^>]*aria-label="([^"]+)"[^>]*>[\s\S]*?<\/nav>/g)];
  const mainNavigation = navs.find(([, label]) => label === 'Main navigation')?.[0];
  const mobileNavigation = navs.find(([, label]) => label === 'Mobile navigation')?.[0];

  assert.ok(mainNavigation, 'rendered page should include the desktop navigation');
  assert.ok(mobileNavigation, 'rendered page should include the mobile navigation');
  for (const [label, navigation] of [
    ['desktop', mainNavigation],
    ['mobile', mobileNavigation],
  ]) {
    assert.match(
      navigation,
      /<a\b[^>]*href="\/areas\/st-augustine\/"[^>]*>[\s\S]*?St\. Augustine[\s\S]*?<\/a>/,
      `${label} navigation should expose a crawlable St. Augustine link`,
    );
  }
});
