import { ArrowRight } from 'lucide-react';
import {
  Bath,
  BrickWall,
  CloudRain,
  CookingPot,
  DoorOpen,
  Droplets,
  Fence,
  Hammer,
  Layers3,
  PaintBucket,
  PaintRoller,
  PanelsTopLeft,
  PlugZap,
  Plus,
  Ruler,
  Rows3,
  SprayCan,
  type LucideIcon,
} from 'lucide-react';
import type { Service } from '../types';
import { useCart } from '../context/useCart';
import { pathForView } from '../data/routes';

interface ServiceCardProps {
  service: Service;
  setCurrentView: (view: string) => void;
}

const serviceIcons: Record<Service['icon'], LucideIcon> = {
  Bath,
  BrickWall,
  CloudRain,
  CookingPot,
  DoorOpen,
  Droplets,
  Fence,
  Hammer,
  Layers3,
  PaintBucket,
  PaintRoller,
  PanelsTopLeft,
  PlugZap,
  Ruler,
  Rows3,
  SprayCan,
};

export default function ServiceCard({ service, setCurrentView }: ServiceCardProps) {
  const { dispatch } = useCart();
  const Icon = serviceIcons[service.icon];

  return (
    <article className="group flex min-h-[320px] flex-col rounded-2xl border border-slate-200 bg-white p-7 shadow-[0_12px_35px_-25px_rgba(15,23,42,0.45)] transition duration-300 hover:-translate-y-1 hover:border-amber-300 hover:shadow-[0_20px_45px_-25px_rgba(15,23,42,0.4)]">
      <a
        href={pathForView(service.view)}
        aria-label={`View ${service.name} service details`}
        onClick={(event) => {
          if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
          event.preventDefault();
          setCurrentView(service.view);
        }}
        className="flex flex-1 flex-col rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-4"
      >
        <div className="mb-7 flex items-start justify-between gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-200 bg-amber-50 text-slate-800 transition-colors group-hover:bg-amber-100">
            <Icon className="h-8 w-8 stroke-[1.7]" aria-hidden="true" />
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-600">
            {service.category}
          </span>
        </div>

        <h3 className="mb-3 text-xl font-semibold leading-snug tracking-tight text-slate-900">{service.name}</h3>
        <p className="flex-1 text-[15px] leading-7 text-slate-600">{service.description}</p>

        <span className="mt-6 inline-flex items-center gap-2 font-semibold text-slate-900 underline decoration-amber-500 decoration-2 underline-offset-4 transition-colors group-hover:text-amber-800">
          View service details <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </span>
      </a>

      <button
        type="button"
        aria-label={`Add ${service.name} to quote`}
        onClick={() => dispatch({ type: 'ADD_ITEM', payload: service })}
        className="mt-7 flex w-full items-center justify-between rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
      >
        Add to quote
        <Plus className="h-4 w-4 text-amber-300" aria-hidden="true" />
      </button>
    </article>
  );
}
