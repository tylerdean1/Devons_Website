import { useState } from 'react';
import { Filter } from 'lucide-react';
import ServiceCard from './ServiceCard';
import { services } from '../data/services';
import { site } from '../data/site';

export default function ServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...Array.from(new Set(services.map(s => s.category)))];
  const filteredServices = selectedCategory === 'All'
    ? services
    : services.filter(s => s.category === selectedCategory);

  return (
    <section className="min-h-screen bg-gray-50 py-12" aria-labelledby="services-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 id="services-heading" className="text-4xl font-bold text-gray-900 mb-4">Our Services</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Professional handyman services for repairs, maintenance, and improvements in {site.serviceAreaLabel}.
            Choose any service to add it to your quote request.
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8 flex items-center justify-center">
          <div className="flex max-w-full flex-wrap items-center justify-center gap-2 rounded-lg bg-white p-2 shadow-md">
            <Filter className="ml-2 h-5 w-5 text-gray-400" aria-hidden="true" />
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                aria-pressed={selectedCategory === category}
                className={`rounded-md px-4 py-2 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 ${selectedCategory === category
                    ? 'bg-gray-800 text-yellow-400'
                    : 'text-gray-700 hover:bg-gray-100'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <p className="mb-6 text-center text-sm text-gray-500">
          Available throughout {site.serviceAreaLabel}.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500">No services found in this category.</p>
          </div>
        )}
      </div>
    </section>
  );
}
