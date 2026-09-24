import { ArrowRight, MapPin, Phone } from 'lucide-react';
import { routes } from '../data/routes';
import { site } from '../data/site';

const serviceGroups = [
  {
    title: 'Drywall and interior finish work',
    description: 'Talk through drywall repairs, interior painting, trim, and other nonstructural finish work. Sharing the surface type and the size of the area helps Devon understand the request.',
    links: [
      { label: 'Drywall repair', href: routes.drywall },
      { label: 'Interior painting', href: routes.painting },
      { label: 'Trim and molding', href: routes.trimMolding },
    ],
  },
  {
    title: 'Exterior upkeep and deck care',
    description: 'Ask about cleaning suitable exterior surfaces, clearing accessible gutters, or maintaining an existing deck. Include the surface material and any areas of concern.',
    links: [
      { label: 'Pressure washing', href: routes.pressureWashing },
      { label: 'Deck cleaning and maintenance', href: routes.deckMaintenance },
      { label: 'Gutter cleaning', href: routes.gutterCleaning },
    ],
  },
  {
    title: 'Home updates and repairs',
    description: 'Share a punch list or a room update. Devon can review the details and confirm which tasks fit his handyman scope before scheduling.',
    links: [
      { label: 'General home repairs', href: routes.generalHomeRepairs },
      { label: 'Kitchen finish updates', href: routes.kitchenFinishUpdates },
      { label: 'Bathroom finish updates', href: routes.bathroomFinishUpdates },
    ],
  },
];

export default function StAugustineDetail({ setCurrentView }: { setCurrentView: (view: string) => void }) {
  return (
    <>
      <section className="relative overflow-hidden bg-[#172230] py-20 text-white sm:py-28">
        <div className="pointer-events-none absolute -right-32 top-0 hidden h-96 w-96 rounded-full border border-white/10 sm:block" aria-hidden="true" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <a href={routes.services} onClick={(event) => { event.preventDefault(); setCurrentView('services'); }} className="text-sm font-semibold text-amber-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400">All services</a>
          <p className="eyebrow mt-14 text-amber-300"><MapPin className="mr-2 inline h-4 w-4" aria-hidden="true" />Serving St. Augustine</p>
          <h1 className="mt-4 max-w-5xl font-display text-4xl font-black leading-[1.06] tracking-tight sm:text-6xl lg:text-7xl">Handyman in St. Augustine, FL</h1>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-300">Devon McCleese travels to St. Augustine homes for drywall repairs, painting, finish updates, outdoor upkeep, and practical punch-list work. Share the project address and details so he can confirm the location and scope.</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a href={routes.quote} onClick={(event) => { event.preventDefault(); setCurrentView('quote'); }} className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-6 py-3.5 font-bold text-slate-950 hover:bg-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">Request a quote <ArrowRight className="h-4 w-4" aria-hidden="true" /></a>
            <a href={site.phoneHref} className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-6 py-3.5 font-bold text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"><Phone className="h-4 w-4" aria-hidden="true" />Call {site.phone}</a>
          </div>
        </div>
      </section>

      <section className="bg-[#f5f2eb] py-20 sm:py-24" aria-labelledby="st-augustine-services-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="eyebrow">Work to talk through</p>
            <h2 id="st-augustine-services-heading" className="mt-4 font-display text-4xl font-bold leading-tight tracking-tight text-slate-950 sm:text-5xl">Start with the repair or update your home needs.</h2>
            <p className="mt-6 text-lg leading-8 text-slate-600">A clear description helps Devon understand whether a task is a fit. Browse the service breakdowns or include several related items in one quote request.</p>
          </div>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {serviceGroups.map(({ title, description, links }) => (
              <article key={title} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-7 shadow-[0_20px_45px_-35px_rgba(15,23,42,0.45)]">
                <h3 className="font-display text-xl font-bold text-slate-950">{title}</h3>
                <p className="mt-3 flex-1 leading-7 text-slate-600">{description}</p>
                <ul className="mt-6 space-y-3 border-t border-slate-200 pt-5 text-sm font-semibold">
                  {links.map((link) => (
                    <li key={link.href}><a className="inline-flex items-center gap-2 text-amber-900 underline decoration-amber-500 underline-offset-4 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500" href={link.href}>{link.label}<ArrowRight className="h-4 w-4" aria-hidden="true" /></a></li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <p className="mt-8 text-sm leading-7 text-slate-600">Need another kind of home project? <a className="font-semibold text-amber-900 underline decoration-amber-500 underline-offset-4" href={routes.customProject}>Describe a custom project</a> and Devon can confirm whether it fits his scope.</p>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-24" aria-labelledby="historic-home-heading">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start lg:gap-16 lg:px-8">
          <div>
            <p className="eyebrow">Planning exterior work</p>
            <h2 id="historic-home-heading" className="mt-4 font-display text-4xl font-bold leading-tight tracking-tight text-slate-950">Check historic-property requirements before exterior changes.</h2>
            <p className="mt-6 text-lg leading-8 text-slate-600">If a St. Augustine property is locally designated or in a historic-preservation district, removing an exterior architectural feature and replacing it with a different design or material can require city review. Check the City’s current guidance for the property before planning that work.</p>
            <a href="https://www.citystaug.com/195/Historic-Architectural-Review-Board-Appl" target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 font-semibold text-amber-900 underline decoration-amber-500 underline-offset-4 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500">Read the City of St. Augustine’s HARB guidance <ArrowRight className="h-4 w-4" aria-hidden="true" /></a>
          </div>
          <aside className="rounded-2xl bg-[#f5f2eb] p-7 sm:p-9">
            <p className="eyebrow">Help Devon review the project</p>
            <h3 className="mt-3 font-display text-2xl font-bold text-slate-950">A few details make the quote conversation easier.</h3>
            <ol className="mt-6 space-y-4 text-slate-700">
              <li className="flex gap-3"><span className="font-bold text-amber-800">01</span><span>Include the St. Augustine project address and a short list of the work.</span></li>
              <li className="flex gap-3"><span className="font-bold text-amber-800">02</span><span>Mention surface materials, access, and any previous repairs you know about.</span></li>
              <li className="flex gap-3"><span className="font-bold text-amber-800">03</span><span>After submitting the quote request, text or email project photos with the address.</span></li>
            </ol>
            <a href={routes.quote} onClick={(event) => { event.preventDefault(); setCurrentView('quote'); }} className="mt-8 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 font-bold text-white hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500">Tell Devon about your project <ArrowRight className="h-4 w-4" aria-hidden="true" /></a>
          </aside>
        </div>
      </section>
    </>
  );
}
