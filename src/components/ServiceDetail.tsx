import { ArrowRight, ArrowUpRight, Check, MapPin, Phone } from 'lucide-react';
import { routes, type View } from '../data/routes';
import { site } from '../data/site';

const details = {
  drywall: {
    eyebrow: 'Interior repairs',
    title: 'Drywall repair in St. Augustine, FL',
    intro: 'Dings, holes, cracks, and damaged corners can make an otherwise good room feel unfinished. Devon can help you plan the repair and get the wall ready for the next step.',
    lead: 'A cleaner wall starts with the right repair.',
    body: 'Drywall work is more than filling a hole. The size and location of the damage, the condition behind the wall, and the existing texture all affect the approach. Share a description of the damage in your quote request so Devon can discuss the right scope with you.',
    tasks: ['Wall and ceiling patching', 'Damaged corners and small sections', 'Surface prep for painting', 'Drywall installation for home improvements'],
    prepare: 'Tell Devon where the damage is, roughly how large it is, and whether there is any sign of moisture or a recurring crack. A photo can make the first conversation easier.',
    serviceName: 'Drywall Installation & Repair',
  },
  painting: {
    eyebrow: 'Interior finishes',
    title: 'Interior painting in St. Augustine, FL',
    intro: 'A new coat of paint should make the room feel finished, not draw attention to the prep that was skipped. Devon handles interior painting with a focus on clean lines and an even result.',
    lead: 'The finish starts before the first coat.',
    body: 'Walls, ceilings, doors, and trim each need a different level of preparation. The condition of the surface, existing color, and how the room is used shape the plan. Describe the spaces you want painted so Devon can review the scope and timing with you.',
    tasks: ['Walls and ceilings', 'Doors, baseboards, and trim', 'Surface preparation and touchups', 'Room refreshes and larger interior projects'],
    prepare: 'List the rooms or surfaces, approximate sizes, current condition, and any color changes you have in mind. Mention repairs that should happen before painting.',
    serviceName: 'Interior Painting',
  },
  pressureWashing: {
    eyebrow: 'Outdoor upkeep',
    title: 'Pressure washing in St. Augustine, FL',
    intro: 'Outdoor surfaces collect dirt and buildup over time. A careful cleaning can refresh the parts of your property you see every day.',
    lead: 'A fresh look for hard-working outdoor spaces.',
    body: 'Driveways, walkways, decks, and siding call for different cleaning methods. Surface material and condition matter. Devon can talk through what you want cleaned and the right approach for each area before work begins.',
    tasks: ['Driveways and walkways', 'Decks and patios', 'Exterior surfaces where appropriate', 'Prep for selected outdoor improvement work'],
    prepare: 'Share the surface type, approximate area, and any delicate finishes or existing damage. That helps Devon assess the work and avoid treating every surface the same way.',
    serviceName: 'Pressure Washing',
  },
} as const;

export default function ServiceDetail({ view, setCurrentView }: { view: Extract<View, 'drywall' | 'painting' | 'pressureWashing'>; setCurrentView: (view: string) => void }) {
  const detail = details[view];
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
            <p className="mt-8 inline-flex items-start gap-2 text-sm font-semibold text-slate-700"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" aria-hidden="true" /> Serving St. Augustine and nearby St. Johns County communities</p>
          </div>
          <div className="rounded-[2rem] bg-white p-8 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.45)] sm:p-10">
            <p className="eyebrow">Projects to discuss</p>
            <h2 className="mt-3 font-display text-2xl font-bold text-slate-950">{detail.serviceName}</h2>
            <ul className="mt-7 space-y-5">
              {detail.tasks.map((task) => <li key={task} className="flex items-start gap-3 leading-7 text-slate-700"><Check className="mt-1 h-5 w-5 shrink-0 text-amber-700" aria-hidden="true" />{task}</li>)}
            </ul>
          </div>
        </div>
      </section>
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-10 px-4 sm:px-6 lg:flex-row lg:items-end lg:px-8">
          <div className="max-w-3xl">
            <p className="eyebrow">Before you reach out</p>
            <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-slate-950">A few details make the conversation easier.</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">{detail.prepare}</p>
          </div>
          <a href={routes.quote} onClick={(event) => { event.preventDefault(); setCurrentView('quote'); }} className="inline-flex shrink-0 items-center gap-2 self-start border-b-2 border-amber-500 pb-2 font-bold text-slate-950 hover:text-amber-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500">Tell Devon about your project <ArrowUpRight className="h-4 w-4" aria-hidden="true" /></a>
        </div>
      </section>
    </>
  );
}
