export interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: 'Bath' | 'BrickWall' | 'CloudRain' | 'CookingPot' | 'DoorOpen'
    | 'Droplets' | 'Fence' | 'Hammer' | 'Layers3' | 'PaintBucket' | 'PaintRoller'
    | 'PanelsTopLeft' | 'PlugZap' | 'Ruler' | 'Rows3' | 'SprayCan';
}

export interface CartItem {
  service: Service;
  quantity: number;
}

export interface QuoteRequest {
  name: string;
  email: string;
  phone: string;
  address: string;
  preferredDate: string;
  preferredTime: string;
  services: CartItem[];
  additionalNotes?: string;
}
