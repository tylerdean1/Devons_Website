import { ArrowRight, Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartProps {
  setCurrentView: (view: string) => void;
}

export default function Cart({ setCurrentView }: CartProps) {
  const { state, dispatch } = useCart();
  const itemCount = state.items.reduce((total, item) => total + item.quantity, 0);

  return (
    <section className="min-h-screen bg-[#f7f6f2] py-16" aria-labelledby="cart-heading">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-amber-700">Your project list</p>
        <h1 id="cart-heading" className="text-4xl font-bold tracking-tight text-slate-900">Your Quote Cart</h1>
        <p className="mt-4 text-lg text-slate-600">Review the services you want to discuss with Devon.</p>

        {state.items.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <p className="text-lg text-slate-600">Your list is empty. Browse the services and add the work you have in mind.</p>
            <button
              type="button"
              onClick={() => setCurrentView('services')}
              className="mt-7 rounded-xl bg-slate-900 px-7 py-3 font-semibold text-white transition-colors hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            >
              Browse services
            </button>
          </div>
        ) : (
          <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
            <div className="space-y-3">
              {state.items.map((item) => (
                <div key={item.service.id} className="flex flex-col justify-between gap-5 rounded-xl border border-slate-200 p-5 sm:flex-row sm:items-center">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-amber-700">{item.service.category}</p>
                    <h2 className="mt-1 text-lg font-semibold text-slate-900">{item.service.name}</h2>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{item.service.description}</p>
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    <div className="flex items-center rounded-lg border border-slate-200">
                      <button
                        type="button"
                        onClick={() => dispatch({ type: 'UPDATE_QUANTITY', payload: { id: item.service.id, quantity: Math.max(0, item.quantity - 1) } })}
                        aria-label={`Decrease ${item.service.name} quantity`}
                        className="rounded-l-lg p-2 text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                      >
                        <Minus className="h-4 w-4" aria-hidden="true" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold text-slate-900">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => dispatch({ type: 'UPDATE_QUANTITY', payload: { id: item.service.id, quantity: item.quantity + 1 } })}
                        aria-label={`Increase ${item.service.name} quantity`}
                        className="rounded-r-lg p-2 text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                      >
                        <Plus className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item.service.id })}
                      aria-label={`Remove ${item.service.name} from quote`}
                      className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                    >
                      <Trash2 className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-6 text-base font-semibold text-slate-900">
              <span>Services selected</span>
              <span>{itemCount}</span>
            </div>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setCurrentView('services')}
                className="flex-1 rounded-xl border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-800 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              >
                Add more services
              </button>
              <button
                type="button"
                onClick={() => setCurrentView('quote')}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-amber-400 px-6 py-3 font-semibold text-slate-900 transition-colors hover:bg-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              >
                Request a quote <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
