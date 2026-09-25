import React, { useReducer, type ReactNode } from 'react';
import { cartReducer } from './cartReducer';
import { CartContext } from './cart-context';

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 });

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}
