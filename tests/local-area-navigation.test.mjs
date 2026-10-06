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

test('every rendered service page links directly to St. Augustine Beach coverage', async (t) => {
  const sitemapPath = 'public/sitemap.xml';
  try {
    await access('dist/services/drywall-repair/index.html');
  } catch {
    t.skip('Run npm run build before validating rendered service-area links.');
    return;
  }

  const sitemap = await readFile(sitemapPath, 'utf8');
  const servicePaths = [...sitemap.matchAll(/<loc>https:\/\/devonmccleese\.com(\/services\/[^<]+)<\/loc>/g)]
    .map(([, pathname]) => pathname);

  assert.ok(servicePaths.length > 0, 'sitemap should list service detail pages');

  for (const servicePath of servicePaths) {
    const htmlPath = `dist${servicePath}index.html`;
    const html = await readFile(htmlPath, 'utf8');
    assert.match(
      html,
      /Serving St\. Augustine, St\. Augustine Beach, Crescent Beach, and nearby St\. Johns County communities\.[\s\S]{0,900}<a\b[^>]*href="\/areas\/st-augustine-beach\/"[^>]*>[\s\S]*?St\. Augustine Beach[\s\S]*?<\/a>/,
      `${servicePath} should link St. Augustine Beach from its in-page service-area section`,
    );
  }
});
