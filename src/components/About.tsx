import { ClipboardCheck, MapPin, MessageCircle, Wrench } from 'lucide-react';
import { site } from '../data/site';

const values = [
  { Icon: Wrench, title: 'Practical experience', detail: '15 years of construction work behind each repair and improvement.' },
  { Icon: MessageCircle, title: 'A direct conversation', detail: 'Talk through the work, timing, and priorities with the person doing the job.' },
  { Icon: ClipboardCheck, title: 'A clear plan', detail: 'Start with the scope and details that matter to your home.' },
];

export default function About() {
  return (
    <section id="about" className="bg-[#f7f6f2] py-20 sm:py-24" aria-labelledby="about-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div className="relative max-w-lg">
            <img
              src="/image.png"
              alt="Devon McCleese outdoors in North Florida"
              loading="lazy"
              className="aspect-[4/4.2] w-full rounded-[2rem] object-cover object-center shadow-[0_24px_60px_-35px_rgba(15,23,42,0.5)]"
            />
            <div className="absolute -bottom-5 left-5 rounded-xl bg-white px-5 py-4 shadow-lg sm:left-8">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700">Meet the person behind the work</p>
              <p className="mt-1 text-lg font-bold text-slate-900">Devon McCleese</p>
            </div>
          </div>

          <div className="pt-4 lg:pt-0">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-amber-700">About Devon</p>
            <h2 id="about-heading" className="max-w-2xl text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl">
              Good work starts with a conversation.
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              I bring 15 years of construction experience to home repairs and improvements in {site.serviceAreaLabel}. I want you to understand the work, feel comfortable asking questions, and know who to call when something needs attention.
            </p>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              From a small repair to a longer punch list, we can walk through your priorities and find the right next step for your home.
            </p>
            <p className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
              <MapPin className="h-4 w-4 text-amber-700" aria-hidden="true" />
              Local service in {site.regionLabel}
            </p>
          </div>
        </div>

        <div className="mt-20 grid gap-5 md:grid-cols-3">
          {values.map(({ Icon, title, detail }) => (
            <div key={title} className="rounded-2xl border border-slate-200 bg-white p-7">
              <Icon className="h-7 w-7 stroke-[1.8] text-amber-700" aria-hidden="true" />
              <h3 className="mt-5 text-lg font-semibold text-slate-900">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
