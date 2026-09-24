import { ArrowRight, ArrowUpRight, Check, MapPin, Phone } from 'lucide-react';
import { routes, pathForView, type ServiceView } from '../data/routes';
import { serviceDetails } from '../data/serviceDetails';
import { services } from '../data/services';
import { site } from '../data/site';

export default function ServiceDetail({ view, setCurrentView }: { view: ServiceView; setCurrentView: (view: string) => void }) {
  const service = services.find((item) => item.view === view);
  const detail = serviceDetails[view];

  if (!service) return null;

  const sameCategory = services.filter((item) => item.view !== view && item.category === service.category);
  const relatedServices = (sameCategory.length ? sameCategory : services.filter((item) => item.view !== view)).slice(0, 3);

  return (
    <>
      <section className="relative overflow-hidden bg-[#172230] py-20 text-white sm:py-28">
        <div className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full border border-white/10" aria-hidden="true" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <a href={routes.services} onClick={(event) => { event.preventDefault(); setCurrentView('services'); }} className="inline-flex items-center gap-2 text-sm font-semibold text-amber-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400">← All services</a>
          <p className="eyebrow mt-14 text-amber-300">{detail.eyebrow} · St. Johns County</p>
          <h1 className="mt-4 max-w-4xl font-display text-4xl font-black leading-[1.06] tracking-tight sm:text-6xl lg:text-7xl">{detail.title}</h1>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-300">{detail.intro}</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a href={routes.quote} onClick={(event) => { event.preventDefault(); setCurrentView('quote'); }} className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-6 py-3.5 font-bold text-slate-950 hover:bg-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">Request a quote <ArrowRight className="h-4 w-4" aria-hidden="true" /></a>
            <a href={site.phoneHref} className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-6 py-3.5 font-bold text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"><Phone className="h-4 w-4" aria-hidden="true" /> Call {site.phone}</a>
          </div>
        </div>
      </section>

      <section className="bg-[#f5f2eb] py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-24 lg:px-8">
          <div>
            <p className="eyebrow">What to expect</p>
            <h2 className="mt-4 font-display text-4xl font-bold leading-tight tracking-tight text-slate-950">{detail.lead}</h2>
            <p className="mt-6 text-lg leading-8 text-slate-600">{detail.body}</p>
            <p className="mt-8 inline-flex items-start gap-2 text-sm font-semibold text-slate-700"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" aria-hidden="true" />Serving St. Augustine, St. Augustine Beach, Crescent Beach, and nearby St. Johns County communities</p>
          </div>
          <div className="rounded-[2rem] bg-white p-8 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.45)] sm:p-10">
            <p className="eyebrow">Project breakdown</p>
            <h2 className="mt-3 font-display text-2xl font-bold text-slate-950">{service.name}</h2>
            <ul className="mt-7 space-y-5">
              {detail.tasks.map((task) => <li key={task} className="flex items-start gap-3 leading-7 text-slate-700"><Check className="mt-1 h-5 w-5 shrink-0 text-amber-700" aria-hidden="true" />{task}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:px-8">
          <div>
            <p className="eyebrow">Before you reach out</p>
            <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-slate-950">A few details make the conversation easier.</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">{detail.prepare}</p>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              Have project photos? After sending the request, text Devon at{' '}
              <a className="font-semibold text-slate-900 underline decoration-amber-500 underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2" href={site.phoneHref}>{site.phone}</a>{' '}
              or email <a className="font-semibold text-slate-900 underline decoration-amber-500 underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2" href={site.emailHref}>{site.email}</a> with the project address.
            </p>
          </div>
          {detail.scopeNote && (
            <aside className="self-start rounded-2xl border-l-4 border-amber-500 bg-amber-50 p-6 sm:p-8" aria-label="Service scope">
              <p className="eyebrow">Scope and fit</p>
              <p className="mt-3 leading-7 text-slate-700">{detail.scopeNote}</p>
            </aside>
          )}
          <div className="lg:col-span-2">
            <a href={routes.quote} onClick={(event) => { event.preventDefault(); setCurrentView('quote'); }} className="inline-flex items-center gap-2 border-b-2 border-amber-500 pb-2 font-bold text-slate-950 hover:text-amber-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500">Tell Devon about your project <ArrowUpRight className="h-4 w-4" aria-hidden="true" /></a>
          </div>
        </div>
      </section>

      <section className="bg-[#f5f2eb] py-16 sm:py-20" aria-labelledby="related-services-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="eyebrow">Keep planning</p>
              <h2 id="related-services-heading" className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-950">Related services</h2>
            </div>
            <a href={routes.services} onClick={(event) => { event.preventDefault(); setCurrentView('services'); }} className="inline-flex items-center gap-2 font-semibold text-slate-900 underline decoration-amber-500 decoration-2 underline-offset-4 hover:text-amber-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500">Browse all services <ArrowRight className="h-4 w-4" aria-hidden="true" /></a>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {relatedServices.map((related) => (
              <a key={related.id} href={pathForView(related.view)} onClick={(event) => { event.preventDefault(); setCurrentView(related.view); }} className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-700">{related.category}</p>
                <span className="mt-3 flex items-center justify-between gap-3 font-display text-xl font-bold text-slate-950">{related.name}<ArrowRight className="h-4 w-4 shrink-0 text-amber-700 transition-transform group-hover:translate-x-1" aria-hidden="true" /></span>
                <p className="mt-3 text-sm leading-6 text-slate-600">{related.description}</p>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
