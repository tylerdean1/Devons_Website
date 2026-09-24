export const routes = {
  home: '/',
  services: '/services/',
  drywall: '/services/drywall-repair/',
  painting: '/services/interior-painting/',
  pressureWashing: '/services/pressure-washing/',
  quote: '/quote/',
  cart: '/cart/',
} as const;

export type View = keyof typeof routes;

export function viewForPath(pathname: string): View {
  const normalized = pathname === '/' ? '/' : `${pathname.replace(/\/+$/, '')}/`;
  return (Object.entries(routes).find(([, path]) => path === normalized)?.[0] as View | undefined) ?? 'home';
}

export function pathForView(view: string): string {
  return routes[view as View] ?? '/';
}
