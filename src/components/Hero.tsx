import { ArrowRight, Check, MapPin, Phone } from 'lucide-react';
import { site } from '../data/site';

interface HeroProps {
  setCurrentView: (view: string) => void;
}

const steps = [
  { number: '01', title: 'Choose your services', detail: 'Pick the repairs and improvements on your list.' },
  { number: '02', title: 'Share the details', detail: 'Tell Devon about the space, timing, and priorities.' },
  { number: '03', title: 'Get a personal reply', detail: 'Review the next steps directly with Devon.' },
];

export default function Hero({ setCurrentView }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-[#172230] text-white" aria-labelledby="hero-heading">
      <div className="pointer-events-none absolute -right-40 -top-52 h-[36rem] w-[36rem] rounded-full border border-white/10" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-20 -top-28 h-[26rem] w-[26rem] rounded-full border border-white/10" aria-hidden="true" />
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 py-20 sm:px-6 sm:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-28">
        <div className="relative z-10">
          <p className="mb-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-amber-300">
            <MapPin className="h-4 w-4" aria-hidden="true" />
            St. Augustine & St. Johns County
          </p>
          <h1 id="hero-heading" className="max-w-2xl text-4xl font-bold leading-[1.08] tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Home projects done right in <span className="text-amber-300">St. Augustine.</span>
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-slate-300">
            From drywall and painting to kitchens, baths, and outdoor work, Devon brings 15 years of construction experience to the jobs on your list.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => setCurrentView('services')}
              className="inline-flex items-center justify-center gap-3 rounded-xl bg-amber-400 px-6 py-3.5 font-bold text-slate-900 transition-colors hover:bg-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            >
              Explore services <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setCurrentView('quote')}
              className="inline-flex items-center justify-center rounded-xl border border-white/30 px-6 py-3.5 font-bold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            >
              Request a quote
            </button>
          </div>
          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t border-white/10 pt-6 text-sm text-slate-300">
            {['Direct communication', 'Clear project scope', 'Careful workmanship'].map((item) => (
              <span key={item} className="inline-flex items-center gap-2">
                <Check className="h-4 w-4 text-amber-300" aria-hidden="true" />{item}
              </span>
            ))}
          </div>
        </div>

        <div className="relative z-10 rounded-[2rem] border border-white/10 bg-white p-7 text-slate-900 shadow-2xl sm:p-9">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-700">A simple way to get started</p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">Tell us what your home needs.</h2>
          <div className="mt-8 space-y-6">
            {steps.map((step) => (
              <div key={step.number} className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-800">{step.number}</span>
                <div>
                  <h3 className="font-semibold text-slate-900">{step.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{step.detail}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 border-t border-slate-200 pt-6">
            <a href={site.phoneHref} className="inline-flex items-center gap-2 text-sm font-bold text-slate-900 underline decoration-amber-400 decoration-2 underline-offset-4 hover:text-amber-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500">
              <Phone className="h-4 w-4" aria-hidden="true" />
              Prefer to talk? Call {site.phone}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
