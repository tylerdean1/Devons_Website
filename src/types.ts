export interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
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