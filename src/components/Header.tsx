import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { site } from '../data/site';

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
          <button
            type="button"
            className="flex items-center space-x-2 rounded-lg text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800"
            onClick={() => setCurrentView('home')}
              aria-label={`Return to ${site.name} home page`}
            >
              <img
                src="/logo.png"
              alt=""
              className="h-16 w-auto object-contain"
            />
            <div>
              <span className="text-xl font-bold text-white">{site.name}</span>
              <p className="text-sm text-yellow-400">{site.regionLabel} Handyman</p>
            </div>
          </button>

          <nav className="hidden md:flex items-center space-x-8" role="navigation" aria-label="Main navigation">
            <button
              onClick={() => setCurrentView('home')}
              aria-current={currentView === 'home' ? 'page' : undefined}
              className={`rounded-sm text-lg font-medium transition-colors border-b-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 ${currentView === 'home'
                ? 'text-yellow-400 border-yellow-400 pb-1'
                : 'text-gray-300 hover:text-yellow-400 border-transparent'
                }`}
            >
              Home
            </button>
            <button
              onClick={() => setCurrentView('services')}
              aria-current={currentView === 'services' ? 'page' : undefined}
              className={`rounded-sm text-lg font-medium transition-colors border-b-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 ${currentView === 'services'
                ? 'text-yellow-400 border-yellow-400 pb-1'
                : 'text-gray-300 hover:text-yellow-400 border-transparent'
                }`}
            >
              Services
            </button>
            <button
              onClick={() => setCurrentView('quote')}
              aria-current={currentView === 'quote' ? 'page' : undefined}
              className={`rounded-sm text-lg font-medium transition-colors border-b-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 ${currentView === 'quote'
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
              type="button"
              className="relative rounded-full bg-yellow-500 p-2 text-gray-800 transition-colors hover:bg-yellow-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800"
              aria-label={`Open quote cart${itemCount > 0 ? ` with ${itemCount} item${itemCount === 1 ? '' : 's'}` : ''}`}
            >
              <ShoppingCart className="h-6 w-6" aria-hidden="true" />
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
              type="button"
              aria-current={currentView === 'home' ? 'page' : undefined}
              className={`rounded-sm text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 ${currentView === 'home' ? 'text-yellow-400' : 'text-gray-300'
                }`}
            >
              Home
            </button>
            <button
              onClick={() => setCurrentView('services')}
              type="button"
              aria-current={currentView === 'services' ? 'page' : undefined}
              className={`rounded-sm text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 ${currentView === 'services' ? 'text-yellow-400' : 'text-gray-300'
                }`}
            >
              Services
            </button>
            <button
              onClick={() => setCurrentView('quote')}
              type="button"
              aria-current={currentView === 'quote' ? 'page' : undefined}
              className={`rounded-sm text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 ${currentView === 'quote' ? 'text-yellow-400' : 'text-gray-300'
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
