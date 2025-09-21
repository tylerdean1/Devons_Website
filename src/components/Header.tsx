import { Hammer, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface HeaderProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

export default function Header({ currentView, setCurrentView }: HeaderProps) {
  const { state } = useCart();
  const itemCount = state.items.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="bg-gray-800 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => setCurrentView('home')}
          >
            <Hammer className="h-8 w-8 text-yellow-400" />
            <div>
              <h1 className="text-xl font-bold text-white">Devon McCleese</h1>
              <p className="text-sm text-yellow-400">Handyman Services</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => setCurrentView('home')}
              className={`text-lg font-medium transition-colors border-b-2 ${currentView === 'home'
                  ? 'text-yellow-400 border-yellow-400 pb-1'
                  : 'text-gray-300 hover:text-yellow-400 border-transparent'
                }`}
            >
              Home
            </button>
            <button
              onClick={() => setCurrentView('services')}
              className={`text-lg font-medium transition-colors border-b-2 ${currentView === 'services'
                  ? 'text-yellow-400 border-yellow-400 pb-1'
                  : 'text-gray-300 hover:text-yellow-400 border-transparent'
                }`}
            >
              Services
            </button>
            <button
              onClick={() => setCurrentView('quote')}
              className={`text-lg font-medium transition-colors border-b-2 ${currentView === 'quote'
                  ? 'text-yellow-400 border-yellow-400 pb-1'
                  : 'text-gray-300 hover:text-yellow-400 border-transparent'
                }`}
            >
              Get Quote
            </button>
          </nav>

          <div className="flex items-center">
            <button
              onClick={() => setCurrentView('cart')}
              className="relative p-2 bg-yellow-500 text-gray-800 rounded-full hover:bg-yellow-400 transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gray-800 text-yellow-400 text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-4">
          <div className="flex justify-center space-x-6">
            <button
              onClick={() => setCurrentView('home')}
              className={`text-sm font-medium transition-colors ${currentView === 'home' ? 'text-yellow-400' : 'text-gray-300'
                }`}
            >
              Home
            </button>
            <button
              onClick={() => setCurrentView('services')}
              className={`text-sm font-medium transition-colors ${currentView === 'services' ? 'text-yellow-400' : 'text-gray-300'
                }`}
            >
              Services
            </button>
            <button
              onClick={() => setCurrentView('quote')}
              className={`text-sm font-medium transition-colors ${currentView === 'quote' ? 'text-yellow-400' : 'text-gray-300'
                }`}
            >
              Get Quote
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}