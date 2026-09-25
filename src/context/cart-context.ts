import { createContext, type Dispatch } from 'react';
import type { CartAction, CartState } from './cartReducer';

interface CartContextValue {
  state: CartState;
  dispatch: Dispatch<CartAction>;
}

export const CartContext = createContext<CartContextValue | null>(null);
