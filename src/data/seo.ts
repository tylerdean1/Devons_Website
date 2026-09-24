import type { View } from './routes';

export const pageSeo: Record<View, { title: string; description: string }> = {
  home: { title: 'St. Augustine Handyman | Devon’s Handyman Services', description: 'Handyman services in St. Augustine and St. Johns County, FL. Work directly with Devon McCleese on home repairs, painting, drywall, and outdoor upkeep.' },
  services: { title: 'Handyman Services in St. Augustine, FL | Devon McCleese', description: 'Explore drywall, painting, flooring, doors, pressure washing, and other handyman services for homes in St. Augustine and St. Johns County.' },
  stAugustineBeach: { title: 'St. Augustine Beach Handyman | Devon’s Handyman Services', description: 'Looking for a handyman in St. Augustine Beach, FL? Ask Devon about drywall repair, painting, pressure washing, and nonstructural home maintenance.' },
  drywall: { title: 'Drywall Repair in St. Augustine, FL | Devon McCleese', description: 'Need drywall repair in St. Augustine? Talk with Devon McCleese about wall and ceiling patches, damaged corners, installation, and paint-ready prep.' },
  painting: { title: 'Interior Painting in St. Augustine, FL | Devon McCleese', description: 'Refresh your St. Augustine home with interior painting by Devon McCleese. Discuss walls, ceilings, trim, surface prep, and your project scope.' },
  pressureWashing: { title: 'Pressure Washing in St. Augustine, FL | Devon McCleese', description: 'Ask Devon McCleese about pressure washing driveways, walkways, decks, and outdoor surfaces in St. Augustine and nearby St. Johns County.' },
  quote: { title: 'Request a Handyman Quote | Devon McCleese', description: 'Tell Devon McCleese about your home repair or improvement project in St. Augustine and St. Johns County.' },
  cart: { title: 'Your Project List | Devon McCleese', description: 'Review the handyman services you want to discuss with Devon McCleese.' },
};
