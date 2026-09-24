import { ArrowUpRight, ClipboardCheck, MapPin, MessageCircle, Wrench } from 'lucide-react';
import { site } from '../data/site';

const values = [
  { Icon: Wrench, title: 'Experience that shows', detail: '15 years of construction work behind each repair and improvement.' },
  { Icon: MessageCircle, title: 'A direct conversation', detail: 'Talk through the work, timing, and priorities with the person doing the job.' },
  { Icon: ClipboardCheck, title: 'A clear starting point', detail: 'Share your project details and get a practical next step for your home.' },
];

export default function About() {
  return (
    <section id="about" className="bg-white py-20 sm:py-28" aria-labelledby="about-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div><p className="eyebrow">The person behind the work</p><h2 id="about-heading" className="mt-4 font-display text-4xl font-bold leading-tight tracking-tight text-slate-950 sm:text-5xl">Good work starts with a conversation.</h2><p className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-700"><MapPin className="h-4 w-4 text-amber-700" aria-hidden="true" />Local service in {site.regionLabel}</p></div>
          <div><p className="text-xl leading-9 text-slate-700">Devon brings 15 years of construction experience to home repairs and improvements in {site.serviceAreaLabel}. He wants you to understand the work, feel comfortable asking questions, and know who to call when something needs attention.</p><p className="mt-6 font-display text-lg font-bold text-slate-950">Devon McCleese</p><p className="mt-1 text-sm text-slate-500">Handyman and owner</p></div>
        </div>
        <div className="mt-16 grid gap-4 md:grid-cols-3">{values.map(({ Icon, title, detail }) => <div key={title} className="rounded-2xl border border-slate-200 bg-[#f5f2eb] p-7"><Icon className="h-8 w-8 stroke-[1.7] text-amber-700" aria-hidden="true" /><h3 className="mt-6 font-display text-xl font-bold text-slate-950">{title}</h3><p className="mt-3 text-sm leading-7 text-slate-600">{detail}</p></div>)}</div>
        <div className="mt-10 flex flex-col gap-6 rounded-2xl border border-amber-200 bg-amber-50 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="max-w-2xl">
            <h3 className="font-display text-xl font-bold text-slate-950">Worked with Devon?</h3>
            <p className="mt-2 text-sm leading-7 text-slate-600">If Devon has completed a project for you, share an honest Google review. Your feedback helps nearby homeowners decide who to call.</p>
          </div>
          <a href={site.googleReviewUrl} target="_blank" rel="noopener noreferrer" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white transition-colors hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2">
            Leave a Google review <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
