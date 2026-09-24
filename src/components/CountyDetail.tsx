import { ArrowRight, CheckCircle2, MapPin, Phone } from 'lucide-react';
import { routes } from '../data/routes';
import { site } from '../data/site';

const projectTypes = [
  {
    title: 'Repairs and drywall',
    description: 'Talk through wall repairs, drywall patches, trim, hardware, and practical punch-list work around the home.',
  },
  {
    title: 'Painting and finish updates',
    description: 'Plan interior painting, flooring updates, tile replacement, and other finish projects around your home.',
  },
  {
    title: 'Outdoor upkeep and decks',
    description: 'Ask about pressure washing, gutter cleaning, and cleaning or finish maintenance for an existing deck.',
  },
];

const quoteDetails = [
  'Include the project address or ZIP code so Devon can confirm service coverage and availability.',
  'List each repair or improvement and describe the result you want.',
  'If photos help explain the work, text or email them to Devon after you submit the request and include the project address.',
];

const buildingResources = [
  {
    title: 'St. Johns County',
    description: 'Building permits, inspections, and contractor-licensing information.',
    href: 'https://www.sjcfl.us/departments/building-department/',
    linkLabel: 'County Building Department',
  },
  {
    title: 'City of St. Augustine',
    description: 'City permit information and guidance for historic properties.',
    href: 'https://www.citystaug.com/1199/Building-Permit-Information',
    linkLabel: 'City building permit information',
  },
  {
    title: 'St. Augustine Beach',
    description: 'City Building & Zoning contacts, permit submittals, and inspections.',
    href: 'https://www.staugbch.com/288/Building-Zoning',
    linkLabel: 'City Building & Zoning guidance',
  },
];

const questions = [
  {
    question: 'Does Devon travel to homes across St. Johns County?',
    answer: 'Yes. Devon travels to customers in the county, including St. Augustine, St. Augustine Beach, Crescent Beach, and nearby communities. Share the project address so he can confirm the location and availability.',
  },
  {
    question: 'What should I include in a quote request?',
    answer: 'Send the project location, a short list of the work, and your preferred timing. After you submit the request, you can text or email photos to Devon with the project address.',
  },
  {
    question: 'Can I ask about a custom project?',
    answer: 'Yes. Describe what you want to get done, and Devon can review whether the project fits his handyman services before you plan the next step.',
  },
];

export default function CountyDetail({ setCurrentView }: { setCurrentView: (view: string) => void }) {
  return (
    <>
      <section className="relative overflow-hidden bg-[#172230] py-20 text-white sm:py-28">
        <div className="pointer-events-none absolute -right-32 top-0 hidden h-96 w-96 rounded-full border border-white/10 sm:block" aria-hidden="true" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <a href={routes.services} onClick={(event) => { event.preventDefault(); setCurrentView('services'); }} className="text-sm font-semibold text-amber-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400">All services</a>
          <p className="eyebrow mt-14 text-amber-300"><MapPin className="mr-2 inline h-4 w-4" aria-hidden="true" />Serving St. Johns County</p>
          <h1 className="mt-4 max-w-5xl font-display text-4xl font-black leading-[1.06] tracking-tight sm:text-6xl lg:text-7xl">Handyman services across St. Johns County</h1>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-300">Devon McCleese travels to customers across St. Johns County for home repairs, finish projects, and outdoor upkeep. Share the project address and what needs attention so he can confirm the scope and availability.</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a href={routes.quote} onClick={(event) => { event.preventDefault(); setCurrentView('quote'); }} className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-6 py-3.5 font-bold text-slate-950 hover:bg-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">Request a quote <ArrowRight className="h-4 w-4" aria-hidden="true" /></a>
            <a href={site.phoneHref} className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-6 py-3.5 font-bold text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"><Phone className="h-4 w-4" aria-hidden="true" />Call {site.phone}</a>
          </div>
        </div>
      </section>

      <section className="bg-[#f5f2eb] py-20 sm:py-24" aria-labelledby="county-projects-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="eyebrow">Home projects, handled locally</p>
            <h2 id="county-projects-heading" className="mt-4 font-display text-4xl font-bold leading-tight tracking-tight text-slate-950 sm:text-5xl">Bring the whole to-do list.</h2>
            <p className="mt-6 text-lg leading-8 text-slate-600">Whether you have one repair or a few updates to coordinate, describe the work and where it is. Devon can review the details with you and confirm a practical next step.</p>
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
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold">
            <a className="text-amber-900 underline decoration-amber-500 underline-offset-4 hover:text-slate-950" href={routes.drywall}>Drywall repair</a>
            <a className="text-amber-900 underline decoration-amber-500 underline-offset-4 hover:text-slate-950" href={routes.painting}>Interior painting</a>
            <a className="text-amber-900 underline decoration-amber-500 underline-offset-4 hover:text-slate-950" href={routes.pressureWashing}>Pressure washing</a>
            <a className="text-amber-900 underline decoration-amber-500 underline-offset-4 hover:text-slate-950" href={routes.deckMaintenance}>Deck cleaning and maintenance</a>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-24" aria-labelledby="county-coverage-heading">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24 lg:px-8">
          <div>
            <p className="eyebrow">Service coverage</p>
            <h2 id="county-coverage-heading" className="mt-4 font-display text-4xl font-bold leading-tight tracking-tight text-slate-950 sm:text-5xl">Service across the St. Augustine area.</h2>
            <p className="mt-6 leading-8 text-slate-600">Devon serves St. Augustine, St. Augustine Beach, Crescent Beach, and nearby St. Johns County communities. Not sure whether your address is covered? Include it with your project details and Devon can confirm.</p>
            <a href={routes.stAugustine} className="mt-8 inline-flex items-center gap-2 border-b-2 border-amber-500 pb-2 font-bold text-slate-950 hover:text-amber-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500">Handyman services in St. Augustine <ArrowRight className="h-4 w-4" aria-hidden="true" /></a>
            <a href={routes.stAugustineBeach} className="mt-6 inline-flex items-center gap-2 border-b-2 border-amber-500 pb-2 font-bold text-slate-950 hover:text-amber-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500">Handyman services in St. Augustine Beach <ArrowRight className="h-4 w-4" aria-hidden="true" /></a>
            <a href={routes.services} onClick={(event) => { event.preventDefault(); setCurrentView('services'); }} className="mt-6 inline-flex items-center gap-2 border-b-2 border-amber-500 pb-2 font-bold text-slate-950 hover:text-amber-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500">Browse all services <ArrowRight className="h-4 w-4" aria-hidden="true" /></a>
          </div>
          <ol className="space-y-5">
            {quoteDetails.map((item, index) => (
              <li key={item} className="flex gap-4 rounded-2xl bg-[#f5f2eb] p-6">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-400 font-bold text-slate-950" aria-hidden="true">{index + 1}</span>
                <span className="pt-1 leading-7 text-slate-700">{item}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-white pb-20 sm:pb-24" aria-labelledby="county-building-resources-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="eyebrow">Local homeowner resources</p>
            <h2 id="county-building-resources-heading" className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight text-slate-950 sm:text-4xl">Check project requirements with the right local office.</h2>
            <p className="mt-5 leading-7 text-slate-600">Permit and inspection requirements depend on the property address and project. These official offices publish local guidance; contact the jurisdiction responsible for your address when you are unsure.</p>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {buildingResources.map(({ title, description, href, linkLabel }) => (
              <article key={title} className="rounded-2xl border border-slate-200 bg-[#f5f2eb] p-7">
                <h3 className="font-display text-xl font-bold text-slate-950">{title}</h3>
                <p className="mt-3 min-h-14 leading-7 text-slate-600">{description}</p>
                <a href={href} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 font-semibold text-amber-900 underline decoration-amber-500 underline-offset-4 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500">
                  {linkLabel} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f5f2eb] py-20 sm:py-24" aria-labelledby="county-faq-heading">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.65fr_1fr] lg:gap-24 lg:px-8">
          <div>
            <p className="eyebrow">Good to know</p>
            <h2 id="county-faq-heading" className="mt-4 font-display text-4xl font-bold tracking-tight text-slate-950">St. Johns County handyman questions.</h2>
          </div>
          <div className="divide-y divide-slate-300/70 border-t border-slate-300/70">
            {questions.map(({ question, answer }) => (
              <article key={question} className="py-6">
                <h3 className="font-display text-xl font-bold text-slate-950">{question}</h3>
                <p className="mt-3 leading-7 text-slate-600">{answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
