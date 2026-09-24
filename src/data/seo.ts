import { services } from './services';
import { serviceDetails } from './serviceDetails';
import type { ServiceView, View } from './routes';

const baseSeo = {
  home: { title: 'St. Augustine Handyman | Devon’s Handyman Services', description: 'St. Augustine handyman Devon McCleese handles drywall, painting, home repairs, and outdoor upkeep in St. Augustine Beach, Crescent Beach, and St. Johns County.' },
  services: { title: 'Handyman Services in St. Augustine, FL | Devon McCleese', description: 'Drywall, painting, flooring, doors, pressure washing, and handyman repairs in St. Augustine, St. Augustine Beach, Crescent Beach, and St. Johns County.' },
  stAugustine: { title: 'Handyman in St. Augustine, FL | Devon McCleese', description: 'Need a handyman in St. Augustine? Devon travels to local homes for drywall repair, painting, deck care, pressure washing, and nonstructural home repairs.' },
  stAugustineBeach: { title: 'St. Augustine Beach Handyman | Devon’s Handyman Services', description: 'Looking for a handyman in St. Augustine Beach, FL? Ask Devon about drywall repair, painting, pressure washing, and nonstructural home maintenance.' },
  stJohnsCounty: { title: 'St. Johns County Handyman | Devon’s Handyman Services', description: 'Handyman services across St. Johns County, including St. Augustine, St. Augustine Beach, Crescent Beach, and nearby communities.' },
  quote: { title: 'Request a Handyman Quote | Devon McCleese', description: 'Tell Devon McCleese about your home repair or improvement project in St. Augustine and St. Johns County.' },
  cart: { title: 'Your Project List | Devon McCleese', description: 'Review the handyman services you want to discuss with Devon McCleese.' },
  invoices: { title: 'Invoice Manager | Devon’s Handyman Services', description: 'Private invoice management for Devon’s Handyman Services.' },
} as const;

const serviceSeo = Object.fromEntries(services.map(({ view }) => {
  const detail = serviceDetails[view];
  return [view, { title: detail.metaTitle, description: detail.metaDescription }];
})) as Record<ServiceView, { title: string; description: string }>;

export const pageSeo: Record<View, { title: string; description: string }> = {
  ...baseSeo,
  ...serviceSeo,
};
