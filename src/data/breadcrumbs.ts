import { routes, type View } from './routes';
import { services } from './services';

type Breadcrumb = {
  name: string;
  path: string;
};

const home: Breadcrumb = { name: 'Home', path: routes.home };
const servicesPage: Breadcrumb = { name: 'Services', path: routes.services };

function breadcrumbItems(view: View): Breadcrumb[] {
  const service = services.find((item) => item.view === view);
  if (service) {
    return [home, servicesPage, { name: service.name, path: routes[service.view] }];
  }

  switch (view) {
    case 'services':
      return [home, servicesPage];
    case 'stAugustine':
      return [home, { name: 'St. Augustine', path: routes.stAugustine }];
    case 'stAugustineBeach':
      return [home, { name: 'St. Augustine Beach', path: routes.stAugustineBeach }];
    case 'stJohnsCounty':
      return [home, { name: 'St. Johns County', path: routes.stJohnsCounty }];
    default:
      return [];
  }
}

export function breadcrumbJsonLd(view: View) {
  const items = breadcrumbItems(view);
  if (items.length < 2) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map(({ name, path }, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name,
      item: new URL(path, 'https://devonmccleese.com').toString(),
    })),
  };
}
