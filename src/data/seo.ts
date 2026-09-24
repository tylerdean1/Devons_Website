import { services } from './services';
import { serviceDetails } from './serviceDetails';
import type { ServiceView, View } from './routes';

const baseSeo = {
  home: { title: 'St. Augustine Handyman | Devon’s Handyman Services', description: 'St. Augustine handyman Devon McCleese handles drywall, painting, home repairs, and outdoor upkeep in St. Augustine Beach, Crescent Beach, and St. Johns County.' },
  services: { title: 'Handyman Services in St. Augustine, FL | Devon McCleese', description: 'Drywall, painting, flooring, doors, pressure washing, and handyman repairs in St. Augustine, St. Augustine Beach, Crescent Beach, and St. Johns County.' },
  stAugustineBeach: { title: 'St. Augustine Beach Handyman | Devon’s Handyman Services', description: 'Looking for a handyman in St. Augustine Beach, FL? Ask Devon about drywall repair, painting, pressure washing, and nonstructural home maintenance.' },
  quote: { title: 'Request a Handyman Quote | Devon McCleese', description: 'Tell Devon McCleese about your home repair or improvement project in St. Augustine and St. Johns County.' },
  cart: { title: 'Your Project List | Devon McCleese', description: 'Review the handyman services you want to discuss with Devon McCleese.' },
} as const;

const serviceSeo = Object.fromEntries(services.map(({ view }) => {
  const detail = serviceDetails[view];
  return [view, { title: detail.metaTitle, description: detail.metaDescription }];
})) as Record<ServiceView, { title: string; description: string }>;

export const pageSeo: Record<View, { title: string; description: string }> = {
  ...baseSeo,
  ...serviceSeo,
};
