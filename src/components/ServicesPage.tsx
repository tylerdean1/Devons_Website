import { useState } from 'react';
import { MapPin } from 'lucide-react';
import ServiceCard from './ServiceCard';
import { services } from '../data/services';
import { site } from '../data/site';
import { routes } from '../data/routes';

export default function ServicesPage({ setCurrentView }: { setCurrentView: (view: string) => void }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const categories = ['All', ...Array.from(new Set(services.map((service) => service.category)))];
  const filteredServices = selectedCategory === 'All'
    ? services
    : services.filter((service) => service.category === selectedCategory);

  return (
    <section className="min-h-screen bg-[#f7f6f2] py-16 sm:py-20" aria-labelledby="services-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-3xl">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-amber-700">What we can help with</p>
          <h1 id="services-heading" className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">Handyman services in St. Augustine</h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            Explore what each service covers, then add the work you want to discuss to your quote request.
          </p>
          <p className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500">
            <MapPin className="h-4 w-4 text-amber-600" aria-hidden="true" />
            Serving {site.serviceAreaLabel}
          </p>
          <p className="mt-5 text-sm leading-7 text-slate-600">Choose “View service details” on any card for a breakdown of typical project scope and what to share when you request a quote. See the <a className="font-semibold text-amber-800 underline" href={routes.stAugustineBeach}>St. Augustine Beach service area</a> for local coverage.</p>
          <p className="mt-4 rounded-xl border-l-4 border-amber-500 bg-amber-50 px-5 py-4 text-sm leading-7 text-slate-700">Plumbing and electrical work, window or door installation and replacement, and structural or permit-required work are not offered. Contact an appropriately licensed contractor for those projects.</p>
        </div>

        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter services by category">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                aria-pressed={selectedCategory === category}
                className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 ${selectedCategory === category
                  ? 'bg-slate-900 text-white'
                  : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-400'
                }`}
              >
                {category === 'All' ? 'All services' : category}
              </button>
            ))}
          </div>
          <p className="text-sm text-slate-500">{filteredServices.length} services</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredServices.map((service) => (
            <ServiceCard key={service.id} service={service} setCurrentView={setCurrentView} />
          ))}
        </div>
      </div>
    </section>
  );
}
