import { Phone, Mail, MapPin, Star } from 'lucide-react';
import { site } from '../data/site';

interface HeroProps {
  setCurrentView: (view: string) => void;
}

export default function Hero({ setCurrentView }: HeroProps) {
  return (
    <section className="bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white" aria-labelledby="hero-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-yellow-400">Local home repair, done right</p>
            <h1 id="hero-heading" className="text-4xl lg:text-6xl font-bold mb-6 text-balance">
              Trusted handyman services in
              <span className="text-yellow-400"> {site.primaryArea}, FL</span>
            </h1>
            <p className="text-xl mb-4 text-gray-300">
              15 years of construction experience helping homeowners care for their homes in St. Augustine and across St. Johns County.
            </p>
            <p className="text-lg mb-8 text-gray-400">
              {site.name} delivers responsive repairs, remodels, and maintenance tailored to North Florida homes so you can protect your biggest investment.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button
                onClick={() => setCurrentView('services')}
                type="button"
                className="rounded-lg bg-yellow-500 px-8 py-3 font-semibold text-gray-800 transition-colors hover:bg-yellow-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
              >
                View Services
              </button>
              <button
                onClick={() => setCurrentView('quote')}
                type="button"
                className="rounded-lg border-2 border-yellow-400 bg-transparent px-8 py-3 font-semibold text-yellow-400 transition-colors hover:bg-yellow-400 hover:text-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
              >
                Get Free Quote
              </button>
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-current text-yellow-400" aria-hidden="true" />
                <span>15+ Years Experience</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                <span>Serving {site.regionLabel}</span>
              </div>
              <div className="flex items-center gap-1">
                <Phone className="h-4 w-4" aria-hidden="true" />
                <span>Call (904) 501-7147 Today</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <h3 className="text-2xl font-semibold mb-4">Quick Contact</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                  <a className="hover:text-yellow-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400" href={site.phoneHref}>{site.phone}</a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                  <a className="hover:text-yellow-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400" href={site.emailHref}>{site.email}</a>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                  <span>{site.regionLabel}, Florida</span>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Proudly repairing homes in {site.serviceAreaLabel} with clear communication from the first call through the final detail.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
