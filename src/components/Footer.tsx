import { Clock, Hammer, Mail, MapPin, MessageSquare, Phone } from 'lucide-react';
import { site } from '../data/site';
import { routes } from '../data/routes';

export default function Footer() {
  return (
    <footer className="bg-[#101923] text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 border-b border-white/10 pb-12 md:grid-cols-[1.2fr_1fr_1fr_1fr]">
          <div className="max-w-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-400 text-slate-900">
                <Hammer className="h-6 w-6 stroke-[1.8]" aria-hidden="true" />
              </span>
              <div>
                <p className="text-lg font-bold leading-tight">Devon McCleese</p>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-300">Handyman Services</p>
              </div>
            </div>
            <p className="mt-6 text-sm leading-7 text-slate-300">
              Thoughtful repairs and improvements for homes in {site.serviceAreaLabel}.
            </p>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-amber-300">Explore services</h2>
            <ul className="mt-6 space-y-3 text-sm text-slate-300">
              <li><a href={routes.services} className="hover:text-white">All services</a></li>
              <li><a href={routes.stAugustineBeach} className="hover:text-white">St. Augustine Beach handyman</a></li>
              <li><a href={routes.drywall} className="hover:text-white">Drywall repair</a></li>
              <li><a href={routes.painting} className="hover:text-white">Interior painting</a></li>
              <li><a href={routes.pressureWashing} className="hover:text-white">Pressure washing</a></li>
            </ul>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-amber-300">Get in touch</h2>
            <div className="mt-6 space-y-4 text-sm text-slate-300">
              <a className="flex items-center gap-3 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400" href={site.phoneHref}>
                <Phone className="h-4 w-4 text-amber-300" aria-hidden="true" />{site.phone}
              </a>
              <a className="flex items-center gap-3 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400" href={site.emailHref}>
                <Mail className="h-4 w-4 text-amber-300" aria-hidden="true" />{site.email}
              </a>
              <p className="flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" aria-hidden="true" />
                <span>{site.businessHoursLabel}</span>
              </p>
              <a className="flex items-center gap-3 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400" href={site.googleReviewUrl} target="_blank" rel="noopener noreferrer">
                <MessageSquare className="h-4 w-4 text-amber-300" aria-hidden="true" />Leave a Google review
              </a>
            </div>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-amber-300">Service area</h2>
            <p className="mt-6 flex items-start gap-3 text-sm leading-7 text-slate-300">
              <MapPin className="mt-1 h-4 w-4 shrink-0 text-amber-300" aria-hidden="true" />
              {site.serviceAreaLabel}, Florida
            </p>
          </div>
        </div>

        <p className="pt-8 text-sm text-slate-400">© {new Date().getFullYear()} {site.businessName}. All rights reserved.</p>
      </div>
    </footer>
  );
}
