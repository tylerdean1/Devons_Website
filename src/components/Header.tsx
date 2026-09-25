import { Hammer, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/useCart';
import { site } from '../data/site';
import { isServiceView, pathForView } from '../data/routes';

interface HeaderProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

const navigation = [
  { view: 'home', label: 'Home' },
  { view: 'services', label: 'Services' },
  { view: 'quote', label: 'Get a Quote' },
];

export default function Header({ currentView, setCurrentView }: HeaderProps) {
  const { state } = useCart();
  const itemCount = state.items.reduce((total, item) => total + item.quantity, 0);
  const activeView = isServiceView(currentView)
    ? 'services'
    : ['stAugustine', 'stAugustineBeach', 'stJohnsCounty'].includes(currentView)
      ? 'home'
      : currentView;

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#172230] text-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          <a
            href="/"
            onClick={(event) => { event.preventDefault(); setCurrentView('home'); }}
            aria-label={`Return to ${site.businessName} home page`}
            className="flex min-w-0 items-center gap-3 rounded-lg text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-400 text-slate-900">
              <Hammer className="h-6 w-6 stroke-[1.8]" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-base font-bold leading-tight tracking-tight sm:text-lg">Devon McCleese</span>
              <span className="block truncate text-[10px] font-bold uppercase tracking-[0.18em] text-amber-300 sm:text-xs">Handyman Services</span>
            </span>
          </a>

          <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
            {navigation.map(({ view, label }) => (
              <a
                key={view}
                href={pathForView(view)}
                onClick={(event) => { event.preventDefault(); setCurrentView(view); }}
                aria-current={activeView === view ? 'page' : undefined}
                className={`border-b-2 pb-1 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${activeView === view
                  ? 'border-amber-400 text-amber-300'
                  : 'border-transparent text-slate-200 hover:text-white'
                }`}
              >
                {label}
              </a>
            ))}
          </nav>

          <a
            href={pathForView('cart')}
            onClick={(event) => { event.preventDefault(); setCurrentView('cart'); }}
            aria-label={`Open quote cart${itemCount > 0 ? ` with ${itemCount} item${itemCount === 1 ? '' : 's'}` : ''}`}
            className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-amber-400/50 text-amber-300 transition-colors hover:bg-amber-400 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
          >
            <ShoppingCart className="h-5 w-5" aria-hidden="true" />
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-400 px-1 text-[11px] font-bold text-slate-900">
                {itemCount}
              </span>
            )}
          </a>
        </div>

        <nav className="flex justify-center gap-7 border-t border-white/10 py-3 md:hidden" aria-label="Mobile navigation">
          {navigation.map(({ view, label }) => (
            <a
              key={view}
              href={pathForView(view)}
              onClick={(event) => { event.preventDefault(); setCurrentView(view); }}
              aria-current={activeView === view ? 'page' : undefined}
              className={`rounded-sm text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${activeView === view ? 'text-amber-300' : 'text-slate-200'}`}
            >
              {label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
