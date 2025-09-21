import React from 'react';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartProps {
  setCurrentView: (view: string) => void;
}

export default function Cart({ setCurrentView }: CartProps) {
  const { state, dispatch } = useCart();

  const updateQuantity = (id: string, newQuantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity: newQuantity } });
  };

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const proceedToQuote = () => {
    setCurrentView('quote');
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Quote Cart</h1>
            <p className="text-xl text-gray-600 mb-8">Your cart is empty. Add some services to get started!</p>
            <button
              onClick={() => setCurrentView('services')}
              className="bg-gray-800 hover:bg-gray-700 text-yellow-400 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Browse Services
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Your Quote Cart</h1>
          
          <div className="space-y-6">
            {state.items.map((item) => (
              <div key={item.service.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{item.service.name}</h3>
                  <p className="text-gray-600 text-sm mt-1">{item.service.description}</p>
                  <span className="inline-block mt-2 text-xs font-medium text-orange-600 bg-orange-100 px-2 py-1 rounded">
                  <span className="inline-block mt-2 text-xs font-medium text-yellow-600 bg-yellow-100 px-2 py-1 rounded">
                    {item.service.category}
                  </span>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.service.id, Math.max(0, item.quantity - 1))}
                      className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.service.id, item.quantity + 1)}
                      className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <button
                    onClick={() => removeItem(item.service.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between text-lg font-semibold text-gray-900 mb-6">
              <span>Total Services:</span>
              <span>{state.items.reduce((total, item) => total + item.quantity, 0)} items</span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setCurrentView('services')}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Continue Shopping
              </button>
              <button
                onClick={proceedToQuote}
               className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-gray-800 px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                Request Quote <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
    )
    }
    </div>
  );
}