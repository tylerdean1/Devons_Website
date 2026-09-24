import { build } from 'esbuild';
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';

const require = createRequire(import.meta.url);
const origin = 'https://devonmccleese.com';
const pages = [
  { view: 'home', path: '/', title: 'St. Augustine Handyman | Devon’s Handyman Services', description: 'St. Augustine handyman Devon McCleese handles drywall, painting, home repairs, and outdoor upkeep in St. Augustine Beach, Crescent Beach, and St. Johns County.' },
  { view: 'services', path: '/services/', title: 'Handyman Services in St. Augustine, FL | Devon McCleese', description: 'Drywall, painting, flooring, doors, pressure washing, and handyman repairs in St. Augustine, St. Augustine Beach, Crescent Beach, and St. Johns County.' },
  { view: 'stAugustineBeach', path: '/areas/st-augustine-beach/', title: 'St. Augustine Beach Handyman | Devon’s Handyman Services', description: 'Looking for a handyman in St. Augustine Beach, FL? Ask Devon about drywall repair, painting, pressure washing, and nonstructural home maintenance.' },
  { view: 'quote', path: '/quote/', title: 'Request a Handyman Quote | Devon McCleese', description: 'Tell Devon McCleese about your home repair or improvement project in St. Augustine and St. Johns County.' , noindex: true },
  { view: 'cart', path: '/cart/', title: 'Your Project List | Devon McCleese', description: 'Review the handyman services you want to discuss with Devon McCleese.', noindex: true },
  { view: 'invoices', path: '/invoices/', title: 'Invoice Manager | Devon’s Handyman Services', description: 'Private invoice management for Devon’s Handyman Services.', noindex: true },
];

const escapeHtml = (value) => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const business = {
  '@type': 'HomeAndConstructionBusiness',
  '@id': `${origin}/#business`,
  name: "Devon's Handyman Services",
  url: `${origin}/`,
  telephone: '+1-904-501-7147',
  email: 'devonmgm@gmail.com',
  openingHoursSpecification: [{
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['https://schema.org/Monday', 'https://schema.org/Tuesday', 'https://schema.org/Wednesday', 'https://schema.org/Thursday', 'https://schema.org/Friday', 'https://schema.org/Saturday', 'https://schema.org/Sunday'],
    opens: '06:00',
    closes: '20:00',
  }],
  image: `${origin}/image.png`,
  logo: `${origin}/logo.png`,
  description: 'Handyman services for home repairs and improvements in St. Augustine and St. Johns County, Florida.',
  areaServed: [{ '@type': 'City', name: 'St. Augustine, Florida' }, { '@type': 'City', name: 'St. Augustine Beach, Florida' }, { '@type': 'Place', name: 'Crescent Beach, Florida' }, { '@type': 'AdministrativeArea', name: 'St. Johns County, Florida' }],
};

function schemaFor(page) {
  const webPage = { '@type': 'WebPage', '@id': `${origin}${page.path}#webpage`, url: `${origin}${page.path}`, name: page.title, description: page.description, about: { '@id': business['@id'] } };
  const graph = [business, webPage];
  if (page.path !== '/' && !page.noindex) {
    const breadcrumbItems = [{ name: 'Home', url: `${origin}/` }];
    if (page.serviceName) {
      breadcrumbItems.push({ name: 'Services', url: `${origin}/services/` });
      breadcrumbItems.push({ name: page.serviceName, url: `${origin}${page.path}` });
    } else if (page.path === '/services/') {
      breadcrumbItems.push({ name: 'Services', url: `${origin}${page.path}` });
    } else {
      breadcrumbItems.push({ name: 'St. Augustine Beach', url: `${origin}${page.path}` });
    }
    const breadcrumbId = `${origin}${page.path}#breadcrumb`;
    webPage.breadcrumb = { '@id': breadcrumbId };
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': breadcrumbId,
      itemListElement: breadcrumbItems.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url,
      })),
    });
  }
  if (page.serviceName) {
    graph.push({ '@type': 'Service', name: page.serviceName, serviceType: page.serviceName, description: page.description, provider: { '@id': business['@id'] }, areaServed: business.areaServed, url: `${origin}${page.path}` });
  }
  if (page.view === 'stAugustineBeach') {
    graph.push({ '@type': 'Service', name: 'Nonstructural handyman services in St. Augustine Beach', serviceType: 'Home repair and maintenance within handyman scope', provider: { '@id': business['@id'] }, areaServed: { '@type': 'City', name: 'St. Augustine Beach, Florida' }, url: `${origin}${page.path}` });
  }
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replaceAll('<', '\\u003c');
}

await build({ entryPoints: ['src/entry-server.tsx'], outfile: 'dist/entry-server.cjs', bundle: true, platform: 'node', format: 'cjs', jsx: 'automatic', logLevel: 'warning' });
const { render, prerenderServicePages } = require(path.resolve('dist/entry-server.cjs'));
const template = await readFile('dist/index.html', 'utf8');

pages.splice(3, 0, ...prerenderServicePages.map((servicePage) => ({ ...servicePage })));

for (const page of pages) {
  let html = template;
  const canonical = `${origin}${page.path}`;
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(page.title)}</title>`);
  html = html.replace(/<meta name="description"[\s\S]*?\/>/, `<meta name="description" content="${escapeHtml(page.description)}" />`);
  html = html.replace(/<meta name="keywords"[\s\S]*?\/>/, '');
  html = html.replace(/<meta property="og:title"[^>]*\/>/, `<meta property="og:title" content="${escapeHtml(page.title)}" />`);
  html = html.replace(/<meta property="og:description"[\s\S]*?\/>/, `<meta property="og:description" content="${escapeHtml(page.description)}" />`);
  html = html.replace(/<meta property="og:url"[^>]*\/>/, `<meta property="og:url" content="${canonical}" />`);
  html = html.replace(/<meta name="twitter:title"[^>]*\/>/, `<meta name="twitter:title" content="${escapeHtml(page.title)}" />`);
  html = html.replace(/<meta name="twitter:description"[\s\S]*?\/>/, `<meta name="twitter:description" content="${escapeHtml(page.description)}" />`);
  html = html.replace(/<meta property="og:image:width"[^>]*\/>/, '');
  html = html.replace(/<meta property="og:image:height"[^>]*\/>/, '');
  html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, `<script type="application/ld+json">${schemaFor(page)}</script>`);
  html = html.replace(/<link rel="canonical"[^>]*\/>/, `<link rel="canonical" href="${canonical}" />`);
  if (page.noindex) html = html.replace('<head>', '<head>\n  <meta name="robots" content="noindex,follow" />');
  if (page.view !== 'home') html = html.replace(/<link rel="preload" as="image"[^>]*\/>/, '');
  html = html.replace('<div id="root"></div>', `<div id="root">${render(page.view)}</div>`);
  const file = path.join('dist', page.path === '/' ? 'index.html' : `${page.path.slice(1)}index.html`);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, html);
  console.log(`Rendered ${page.path}`);
}

await rm('dist/entry-server.cjs');
