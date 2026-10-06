import { ArrowRight, CheckCircle2, ClipboardList, Home, MapPin, MessageSquareText } from 'lucide-react';
import { routes } from '../data/routes';
import { site } from '../data/site';
import { services } from '../data/services';

const featured = [
  { number: '01', title: 'Drywall repair', description: 'Patches, damaged corners, and wall surfaces prepared for a clean finish.', view: 'drywall', path: routes.drywall },
  { number: '02', title: 'Interior painting', description: 'Prep, walls, ceilings, and trim with attention to the details you see every day.', view: 'painting', path: routes.painting },
  { number: '03', title: 'Pressure washing', description: 'A practical refresh for walkways, driveways, decks, and other outdoor surfaces.', view: 'pressureWashing', path: routes.pressureWashing },
];

const projectHighlights = [
  {
    title: 'Kitchen remodel',
    area: 'Flagler Beach',
    service: 'Kitchen finish updates',
    image: '/images/projects/flagler-beach-kitchen-remodel.jpg',
    alt: 'Finished kitchen with white cabinets, tiled floor, and stainless steel appliances',
    view: 'kitchenFinishUpdates',
    path: routes.kitchenFinishUpdates,
  },
  {
    title: 'Bathroom remodel',
    area: 'Flagler Beach',
    service: 'Bathroom finish updates',
    image: '/images/projects/flagler-beach-bathroom-finish.jpg',
    alt: 'Bathroom with a glass vessel sink, wood vanity, tiled shower, and curtain',
    view: 'bathroomFinishUpdates',
    path: routes.bathroomFinishUpdates,
  },
  {
    title: 'Cypress porch ceiling',
    area: 'North Florida',
    service: 'Custom home project',
    image: '/images/projects/cypress-tongue-and-groove-ceiling.jpg',
    alt: 'Cypress tongue-and-groove ceiling with finished wood trim on a covered porch',
    view: 'customProject',
    path: routes.customProject,
  },
];

const questions = [
  { question: 'What areas do you serve?', answer: `Devon works with homeowners in ${site.primaryArea} and nearby communities throughout ${site.countyArea}, Florida. Include your address in the quote request so he can confirm the project location.` },
  { question: 'Can I ask about more than one project?', answer: 'Yes. Add several services to one quote request or describe your full punch list in the notes. Devon can review the scope with you directly.' },
  { question: 'What if my project involves electrical work?', answer: 'Electrical work, including wiring, outlets, switches, and ceiling fans, should be handled by an appropriately licensed electrician. Mention it when discussing a larger project so the scope can be planned correctly.' },
  { question: 'What if the work requires a contractor license or permit?', answer: 'Tell Devon about the whole project. He can discuss the handyman work within scope and point you to an appropriately licensed contractor for regulated trades, window replacement, or structural construction.' },
  { question: 'How do I get an estimate?', answer: `Use the quote form to describe the work, project location, and your preferred timing. You can also call ${site.phone} to talk through the next step.` },
];

export default function HomeSections({ setCurrentView }: { setCurrentView: (view: string) => void }) {
  return (
    <>
      <section id="services" className="bg-[#f5f2eb] py-20 sm:py-28" aria-labelledby="featured-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-7 md:flex-row md:items-end">
            <div className="max-w-3xl">
              <p className="eyebrow">The work</p>
              <h2 id="featured-heading" className="mt-4 font-display text-4xl font-bold leading-tight tracking-tight text-slate-950 sm:text-6xl">Your list has met its match.</h2>
              <p className="mt-5 text-lg leading-8 text-slate-600">From a wall that needs patching to a room that needs a fresh start, get thoughtful handyman help close to home.</p>
            </div>
            <a href={routes.services} onClick={(event) => { event.preventDefault(); setCurrentView('services'); }} className="inline-flex shrink-0 items-center gap-2 self-start border-b-2 border-amber-500 pb-2 font-bold text-slate-900 hover:text-amber-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500">
              See all {services.length} services <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            {featured.map((item) => (
              <article key={item.number} className="group flex min-h-80 flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-7 shadow-[0_20px_45px_-35px_rgba(15,23,42,0.45)] transition-transform hover:-translate-y-1 sm:p-9">
                <div>
                  <span className="font-display text-6xl font-black leading-none text-amber-800" aria-hidden="true">{item.number}</span>
                  <h3 className="mt-8 font-display text-2xl font-bold tracking-tight text-slate-950">{item.title}</h3>
                  <p className="mt-3 leading-7 text-slate-600">{item.description}</p>
                </div>
                <a href={item.path} onClick={(event) => { event.preventDefault(); setCurrentView(item.view); }} className="mt-8 inline-flex items-center gap-2 font-bold text-slate-900 underline decoration-amber-500 decoration-2 underline-offset-8 group-hover:text-amber-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500">
                  Explore {item.title.toLowerCase()} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-28" aria-labelledby="project-experience-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="eyebrow">Selected project experience</p>
            <h2 id="project-experience-heading" className="mt-4 font-display text-4xl font-bold leading-tight tracking-tight text-slate-950 sm:text-5xl">A closer look at Devon’s construction experience.</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">These photos show past projects Devon contributed to with Island Builders of North Florida. For new work, Devon will review the details and confirm the project scope directly with you.</p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {projectHighlights.map((project) => (
              <article key={project.title} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_20px_45px_-35px_rgba(15,23,42,0.45)]">
                <a href={project.path} onClick={(event) => { event.preventDefault(); setCurrentView(project.view); }} className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-amber-500">
                  <img src={project.image} alt={project.alt} loading="lazy" decoding="async" className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" />
                  <div className="p-6">
                    <p className="eyebrow">{project.area}</p>
                    <h3 className="mt-2 font-display text-xl font-bold text-slate-950">{project.title}</h3>
                    <span className="mt-4 inline-flex items-center gap-2 font-semibold text-amber-900 underline decoration-amber-500 underline-offset-4 group-hover:text-slate-950">{project.service}<ArrowRight className="h-4 w-4" aria-hidden="true" /></span>
                  </div>
                </a>
                <p className="px-6 pb-6 text-sm leading-6 text-slate-600">Past project Devon contributed to with Island Builders of North Florida.</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-28" aria-labelledby="process-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
            <div>
              <p className="eyebrow">The approach</p>
              <h2 id="process-heading" className="mt-4 font-display text-4xl font-bold leading-tight tracking-tight text-slate-950 sm:text-5xl">A better way to get things done.</h2>
              <p className="mt-6 leading-8 text-slate-600">No mystery process. Tell Devon what is going on, share the details that matter, and talk through the work with the person doing it.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { icon: ClipboardList, title: 'Share your list', copy: 'Choose services or describe the repairs and improvements in your own words.' },
                { icon: MessageSquareText, title: 'Talk it through', copy: 'Discuss the scope, timing, and what a good result looks like for your home.' },
                { icon: CheckCircle2, title: 'Get it handled', copy: 'Move forward with a plan that fits the work and your priorities.' },
              ].map(({ icon: Icon, title, copy }) => (
                <div key={title} className="rounded-2xl bg-[#f5f2eb] p-6">
                  <Icon className="h-8 w-8 text-amber-700" strokeWidth={1.7} aria-hidden="true" />
                  <h3 className="mt-8 font-display text-xl font-bold text-slate-950">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{copy}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#172230] py-20 text-white sm:py-24" aria-labelledby="area-heading">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_0.8fr] lg:items-center lg:px-8">
          <div>
            <p className="eyebrow text-amber-300"><MapPin className="mr-2 inline h-4 w-4" aria-hidden="true" />Right around here</p>
            <h2 id="area-heading" className="mt-4 font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl">Handyman help in St. Augustine, St. Augustine Beach, Crescent Beach, and St. Johns County.</h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">Local homes come with real to-do lists. Devon handles repairs, finish work, painting, and outdoor upkeep for homeowners across the area. Tell him where the project is and what needs attention.</p>
            <a href={routes.stAugustine} onClick={(event) => { event.preventDefault(); setCurrentView('stAugustine'); }} className="mt-6 inline-flex items-center gap-2 font-bold text-amber-300 underline decoration-amber-300 underline-offset-4 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">Handyman services in St. Augustine <ArrowRight className="h-4 w-4" aria-hidden="true" /></a>
            <a href={routes.stAugustineBeach} onClick={(event) => { event.preventDefault(); setCurrentView('stAugustineBeach'); }} className="mt-6 inline-flex items-center gap-2 font-bold text-amber-300 underline decoration-amber-300 underline-offset-4 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">Handyman services in St. Augustine Beach <ArrowRight className="h-4 w-4" aria-hidden="true" /></a>
            <a href={routes.stJohnsCounty} onClick={(event) => { event.preventDefault(); setCurrentView('stJohnsCounty'); }} className="mt-4 inline-flex items-center gap-2 font-bold text-amber-300 underline decoration-amber-300 underline-offset-4 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">Handyman services in St. Johns County <ArrowRight className="h-4 w-4" aria-hidden="true" /></a>
            <a href={routes.quote} onClick={(event) => { event.preventDefault(); setCurrentView('quote'); }} className="mt-8 inline-flex items-center gap-2 rounded-xl bg-amber-400 px-6 py-3 font-bold text-slate-950 hover:bg-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
              Start a quote request <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 sm:p-10">
            <Home className="h-9 w-9 text-amber-300" strokeWidth={1.5} aria-hidden="true" />
            <p className="mt-8 font-display text-3xl font-bold">One home. One long list. One place to start.</p>
            <p className="mt-4 leading-7 text-slate-300">Drywall, painting, doors, flooring, outdoor maintenance, and more. Browse the services or explain what your home needs.</p>
          </div>
        </div>
      </section>

      <section className="bg-[#f5f2eb] py-20 sm:py-24" aria-labelledby="faq-heading">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.65fr_1fr] lg:gap-24 lg:px-8">
          <div>
            <p className="eyebrow">Good to know</p>
            <h2 id="faq-heading" className="mt-4 font-display text-4xl font-bold tracking-tight text-slate-950">Common questions.</h2>
          </div>
          <div className="divide-y divide-slate-300/70 border-t border-slate-300/70">
            {questions.map(({ question, answer }) => (
              <div key={question} className="py-6">
                <h3 className="font-display text-lg font-bold text-slate-950">{question}</h3>
                <p className="mt-3 leading-7 text-slate-600">{answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
