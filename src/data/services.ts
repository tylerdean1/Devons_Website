import { Service } from '../types';

export const services = [
  {
    id: '1',
    view: 'drywall',
    slug: 'drywall-repair',
    name: 'Drywall Installation & Repair',
    description: 'Wall repairs, seamless patches, and clean installation for a smooth, paint-ready finish.',
    category: 'Interior',
    icon: 'BrickWall'
  },
  {
    id: '2',
    view: 'painting',
    slug: 'interior-painting',
    name: 'Interior Painting',
    description: 'Careful prep, crisp edges, and even finishes for walls, ceilings, and trim.',
    category: 'Interior',
    icon: 'PaintRoller'
  },
  {
    id: '3',
    view: 'exteriorPainting',
    slug: 'exterior-painting',
    name: 'Exterior Painting',
    description: 'Surface preparation and durable coatings to refresh siding, doors, and outdoor details.',
    category: 'Exterior',
    icon: 'PaintBucket'
  },
  {
    id: '4',
    view: 'flooringInstallation',
    slug: 'flooring-installation',
    name: 'Flooring Installation',
    description: 'Residential floor covering and tile installation, with precise cuts and clean transitions. Condo flooring is excluded from the local handyman scope.',
    category: 'Interior',
    icon: 'Layers3'
  },
  {
    id: '5',
    view: 'kitchenFinishUpdates',
    slug: 'kitchen-finish-updates',
    name: 'Kitchen Finish Updates',
    description: 'Refresh cabinets, hardware, backsplashes, and other nonstructural kitchen finishes.',
    category: 'Interior',
    icon: 'CookingPot'
  },
  {
    id: '6',
    view: 'bathroomFinishUpdates',
    slug: 'bathroom-finish-updates',
    name: 'Bathroom Finish Updates',
    description: 'Refresh tile, trim, paint, and other nonstructural finishes around your existing fixtures.',
    category: 'Interior',
    icon: 'Bath'
  },
  {
    id: '7',
    view: 'deckMaintenance',
    slug: 'deck-maintenance',
    name: 'Deck Cleaning & Maintenance',
    description: 'Cleaning, staining, and sealing existing decks to keep outdoor spaces looking cared for.',
    category: 'Exterior',
    icon: 'Hammer'
  },
  {
    id: '8',
    view: 'fenceInstallation',
    slug: 'fence-installation',
    name: 'Fence Installation',
    description: 'Wood, vinyl, and chain-link fencing with sturdy posts and tidy finishes.',
    category: 'Exterior',
    icon: 'Fence'
  },
  {
    id: '9',
    view: 'doorLocksHardware',
    slug: 'door-locks-hardware',
    name: 'Door Locks & Hardware',
    description: 'Lock and hardware changes for existing doors. New door installation is referred to an appropriately licensed contractor.',
    category: 'Interior',
    icon: 'DoorOpen'
  },
  {
    id: '10',
    view: 'interiorWindowTrim',
    slug: 'interior-window-trim-finishing',
    name: 'Interior Window Trim & Finishing',
    description: 'Interior trim and finish details around existing windows. Window or door installation and replacement are not offered.',
    category: 'Interior',
    icon: 'PanelsTopLeft'
  },
  {
    id: '11',
    view: 'trimMolding',
    slug: 'trim-molding',
    name: 'Trim & Molding',
    description: 'Baseboards, crown molding, and finishing details that bring a room together.',
    category: 'Interior',
    icon: 'Ruler'
  },
  {
    id: '12',
    view: 'pressureWashing',
    slug: 'pressure-washing',
    name: 'Pressure Washing',
    description: 'Driveways, walkways, decks, and siding cleaned with care for each surface.',
    category: 'Exterior',
    icon: 'SprayCan'
  },
  {
    id: '13',
    view: 'gutterMaintenance',
    slug: 'gutter-maintenance',
    name: 'Gutter Maintenance',
    description: 'Cleaning and suitable minor upkeep to help gutters drain; ask about any larger repair or replacement scope.',
    category: 'Exterior',
    icon: 'CloudRain'
  },
  {
    id: '16',
    view: 'shelvingStorage',
    slug: 'shelving-storage',
    name: 'Shelving & Storage',
    description: 'Shelves and storage that make better use of closets, garages, and living spaces.',
    category: 'Interior',
    icon: 'Rows3'
  },
  {
    id: '17',
    view: 'flooringRepair',
    slug: 'flooring-repair',
    name: 'Flooring Repair',
    description: 'Discuss damaged boards, loose transitions, or a worn section of flooring and the best repair approach.',
    category: 'Interior',
    icon: 'Layers3'
  },
  {
    id: '18',
    view: 'furnitureAssembly',
    slug: 'furniture-assembly',
    name: 'Furniture Assembly',
    description: 'Help assembling furniture and storage pieces, with attention to fit, hardware, and placement.',
    category: 'Interior',
    icon: 'Hammer'
  },
  {
    id: '19',
    view: 'generalHomeRepairs',
    slug: 'general-home-repairs',
    name: 'General Home Repairs',
    description: 'Nonstructural repairs and finish work. Projects requiring permits or a licensed contractor are referred to the right trade.',
    category: 'Interior',
    icon: 'Ruler'
  },
  {
    id: '20',
    view: 'gutterCleaning',
    slug: 'gutter-cleaning',
    name: 'Gutter Cleaning',
    description: 'Clear leaves and debris from accessible gutters to help rainwater move away from your home.',
    category: 'Exterior',
    icon: 'CloudRain'
  },
  {
    id: '21',
    view: 'inHomeMovingAssistance',
    slug: 'in-home-moving-assistance',
    name: 'In-Home Moving Assistance',
    description: 'Help with moving or rearranging items within your home during a project; ask about the scope and access.',
    category: 'Interior',
    icon: 'Rows3'
  },
  {
    id: '23',
    view: 'tileReplacement',
    slug: 'tile-replacement',
    name: 'Tile Replacement',
    description: 'Replace damaged or dated tile in suitable areas with careful prep, alignment, and finishing.',
    category: 'Interior',
    icon: 'Layers3'
  },
  {
    id: '24',
    view: 'tvMounting',
    slug: 'tv-mounting',
    name: 'TV Mounting',
    description: 'Plan mounting location, wall support, and hardware for a clean, secure installation.',
    category: 'Interior',
    icon: 'PanelsTopLeft'
  },
  {
    id: '25',
    view: 'customProject',
    slug: 'custom-projects',
    name: 'Custom Project / Other',
    description: 'Have another home repair or improvement in mind? Describe it so Devon can confirm whether it fits the handyman scope. Licensed trade, structural, and permit-required work is excluded.',
    category: 'Other',
    icon: 'Hammer'
  }
] as const satisfies readonly Service[];

export type ServiceView = (typeof services)[number]['view'];
