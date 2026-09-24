import { renderToString } from 'react-dom/server';
import App from './App';
import type { View } from './data/routes';
import { pathForView } from './data/routes';
import { pageSeo } from './data/seo';
import { services } from './data/services';

export function render(view: View) {
  return renderToString(<App initialView={view} />);
}

export const prerenderServicePages = services.map((service) => ({
  view: service.view,
  path: pathForView(service.view),
  title: pageSeo[service.view].title,
  description: pageSeo[service.view].description,
  serviceName: service.name,
}));
