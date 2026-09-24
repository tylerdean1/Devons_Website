import { ArrowRight, Check, MapPin, Phone } from 'lucide-react';
import { routes } from '../data/routes';
import { site } from '../data/site';

export default function Hero({ setCurrentView }: { setCurrentView: (view: string) => void }) {
  return (
    <section className="relative overflow-hidden bg-[#172230] text-white" aria-labelledby="hero-heading">
      <div className="pointer-events-none absolute inset-0 hero-grid opacity-40" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-36 -top-52 h-[38rem] w-[38rem] rounded-full border border-white/10" aria-hidden="true" />
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 pb-24 pt-20 sm:px-6 sm:pb-28 sm:pt-24 lg:grid-cols-[1.12fr_0.88fr] lg:gap-20 lg:px-8 lg:py-28">
        <div className="relative z-10">
          <p className="eyebrow inline-flex items-center gap-2 text-amber-300"><MapPin className="h-4 w-4" aria-hidden="true" />St. Augustine · St. Johns County</p>
          <h1 id="hero-heading" className="mt-7 max-w-3xl font-display text-5xl font-black leading-[0.98] tracking-tight text-balance sm:text-6xl lg:text-7xl xl:text-[5.5rem]">Your local <span className="text-amber-300">handyman.</span><br />Your home, handled.</h1>
          <p className="mt-8 max-w-xl text-lg leading-8 text-slate-300">Repairs, painting, and home improvements in St. Augustine, St. Augustine Beach, Crescent Beach, and nearby St. Johns County communities. Work directly with Devon McCleese, backed by 15 years in construction.</p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a href={routes.quote} onClick={(event) => { event.preventDefault(); setCurrentView('quote'); }} className="inline-flex items-center justify-center gap-3 rounded-xl bg-amber-400 px-7 py-4 font-bold text-slate-950 transition-colors hover:bg-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900">Get a project quote <ArrowRight className="h-4 w-4" aria-hidden="true" /></a>
            <a href={routes.services} onClick={(event) => { event.preventDefault(); setCurrentView('services'); }} className="inline-flex items-center justify-center rounded-xl border border-white/30 px-7 py-4 font-bold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900">Browse services</a>
          </div>
          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t border-white/10 pt-6 text-sm text-slate-300">{['Direct communication', 'Clear project scope', 'Careful workmanship'].map((item) => <span key={item} className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-amber-300" aria-hidden="true" />{item}</span>)}</div>
        </div>
        <div className="relative z-10 mx-auto w-full max-w-md lg:ml-auto">
          <div className="absolute -inset-3 rounded-[2rem] border border-amber-300/40 sm:-inset-5" aria-hidden="true" />
          <div className="relative overflow-hidden rounded-[1.5rem] bg-slate-700 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.65)]">
            <img src="/image.png" alt="Devon McCleese in St. Augustine" className="aspect-[4/4.7] w-full object-cover object-center" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/65 to-transparent px-7 pb-7 pt-20 sm:px-9 sm:pb-9"><p className="eyebrow text-amber-300">Meet Devon</p><p className="mt-2 font-display text-2xl font-bold">A real person for the work on your list.</p></div>
          </div>
          <div className="mt-5 flex justify-start">
            <div className="rounded-xl bg-amber-400 px-5 py-4 text-slate-950 shadow-xl sm:px-6"><p className="font-display text-3xl font-black leading-none">15 years</p><p className="mt-1 text-xs font-bold uppercase tracking-wider">construction experience</p></div>
          </div>
        </div>
      </div>
      <div className="relative z-10 border-t border-white/10 bg-[#111b26]"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 px-4 py-5 text-sm sm:px-6 md:flex-row md:items-center lg:px-8"><p className="font-medium text-slate-300">Have a question before you start?</p><a href={site.phoneHref} className="inline-flex items-center gap-2 font-bold text-amber-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"><Phone className="h-4 w-4" aria-hidden="true" /> Call Devon at {site.phone}</a></div></div>
    </section>
  );
}
