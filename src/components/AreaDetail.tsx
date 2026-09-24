import { ArrowRight, CheckCircle2, MapPin, Phone } from 'lucide-react';
import { routes } from '../data/routes';
import { site } from '../data/site';

const projectTypes = [
  {
    title: 'Interior repairs and finishes',
    description: 'Drywall patching, interior painting, trim, shelving, furniture assembly, and other nonstructural home repairs.',
  },
  {
    title: 'Outdoor upkeep',
    description: 'Pressure washing, gutter cleaning, and suitable minor maintenance for decks and other exterior surfaces.',
  },
  {
    title: 'Flooring and small updates',
    description: 'Discuss suitable residential flooring, tile, hardware, and finish updates. Devon will confirm whether the requested scope is a fit; condo flooring is excluded from the local handyman scope.',
  },
];

const preparation = [
  'Share the St. Augustine Beach project address and a short description of the work.',
  'Add measurements or photos when they help explain the repair or finish you have in mind.',
  'Mention any existing damage, access details, or permit questions so the scope can be reviewed before scheduling.',
];

export default function AreaDetail({ setCurrentView }: { setCurrentView: (view: string) => void }) {
  return (
    <>
      <section className="relative overflow-hidden bg-[#172230] py-20 text-white sm:py-28">
        <div className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full border border-white/10" aria-hidden="true" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <a href={routes.services} onClick={(event) => { event.preventDefault(); setCurrentView('services'); }} className="text-sm font-semibold text-amber-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400">All services</a>
          <p className="eyebrow mt-14 text-amber-300"><MapPin className="mr-2 inline h-4 w-4" aria-hidden="true" />Serving St. Augustine Beach</p>
          <h1 className="mt-4 max-w-5xl font-display text-4xl font-black leading-[1.06] tracking-tight sm:text-6xl lg:text-7xl">Handyman services in St. Augustine Beach, FL</h1>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-300">Devon travels to customers in St. Augustine Beach for home repairs, painting, drywall, pressure washing, and practical punch-list projects. Share your address and project details so he can confirm whether the work is a fit.</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a href={routes.quote} onClick={(event) => { event.preventDefault(); setCurrentView('quote'); }} className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-6 py-3.5 font-bold text-slate-950 hover:bg-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">Request a quote <ArrowRight className="h-4 w-4" aria-hidden="true" /></a>
            <a href={site.phoneHref} className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-6 py-3.5 font-bold text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"><Phone className="h-4 w-4" aria-hidden="true" />Call {site.phone}</a>
          </div>
        </div>
      </section>

      <section className="bg-[#f5f2eb] py-20 sm:py-24" aria-labelledby="area-projects-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="eyebrow">Projects to discuss</p>
            <h2 id="area-projects-heading" className="mt-4 font-display text-4xl font-bold leading-tight tracking-tight text-slate-950 sm:text-5xl">A useful hand with the list around your home.</h2>
            <p className="mt-6 text-lg leading-8 text-slate-600">Whether you have one repair or several small projects, describe what needs attention. Devon can review the details with you and confirm the appropriate scope before work is scheduled.</p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {projectTypes.map(({ title, description }) => (
              <article key={title} className="rounded-2xl border border-slate-200 bg-white p-7 shadow-[0_20px_45px_-35px_rgba(15,23,42,0.45)]">
                <CheckCircle2 className="h-7 w-7 text-amber-700" strokeWidth={1.7} aria-hidden="true" />
                <h3 className="mt-6 font-display text-xl font-bold text-slate-950">{title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{description}</p>
              </article>
            ))}
          </div>
          <div className="mt-8 rounded-2xl border-l-4 border-amber-500 bg-white px-6 py-5 text-slate-700">
            <h3 className="font-bold text-slate-950">Work that needs a licensed contractor</h3>
            <p className="mt-2 leading-7">Electrical and plumbing work, window or door installation and replacement, and structural or permit-required projects are outside this handyman service. For plumbing fixture repair or replacement, contact an appropriately licensed plumber.</p>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold">
            <a className="text-amber-900 underline decoration-amber-500 underline-offset-4 hover:text-slate-950" href={routes.drywall}>Drywall repair in St. Augustine</a>
            <a className="text-amber-900 underline decoration-amber-500 underline-offset-4 hover:text-slate-950" href={routes.painting}>Interior painting in St. Augustine</a>
            <a className="text-amber-900 underline decoration-amber-500 underline-offset-4 hover:text-slate-950" href={routes.pressureWashing}>Pressure washing in St. Augustine</a>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-24" aria-labelledby="area-request-heading">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24 lg:px-8">
          <div>
            <p className="eyebrow">Make the first conversation count</p>
            <h2 id="area-request-heading" className="mt-4 font-display text-4xl font-bold leading-tight tracking-tight text-slate-950">A few project details help Devon plan.</h2>
            <p className="mt-6 leading-8 text-slate-600">The quote form lets you describe the work, project location, and preferred timing. Devon can follow up to discuss scope and next steps.</p>
            <a href={routes.quote} onClick={(event) => { event.preventDefault(); setCurrentView('quote'); }} className="mt-8 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 font-bold text-white hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500">Tell Devon about your project <ArrowRight className="h-4 w-4" aria-hidden="true" /></a>
          </div>
          <ol className="space-y-5">
            {preparation.map((item, index) => (
              <li key={item} className="flex gap-4 rounded-2xl bg-[#f5f2eb] p-6">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-400 font-bold text-slate-950" aria-hidden="true">{index + 1}</span>
                <span className="pt-1 leading-7 text-slate-700">{item}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
