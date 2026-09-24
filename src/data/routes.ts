import { services, type ServiceView } from './services';

export const routes = {
  home: '/',
  services: '/services/',
  stAugustineBeach: '/areas/st-augustine-beach/',
  ...Object.fromEntries(services.map((service) => [service.view, `/services/${service.slug}/`])) as Record<ServiceView, string>,
  quote: '/quote/',
  cart: '/cart/',
  invoices: '/invoices/',
} as const;

export type View = keyof typeof routes;
export type { ServiceView };

export function isServiceView(view: string): view is ServiceView {
  return services.some((service) => service.view === view);
}

export function viewForPath(pathname: string): View {
  const normalized = pathname === '/' ? '/' : `${pathname.replace(/\/+$/, '')}/`;
  return (Object.entries(routes).find(([, path]) => path === normalized)?.[0] as View | undefined) ?? 'home';
}

export function pathForView(view: string): string {
  return routes[view as View] ?? '/';
}
