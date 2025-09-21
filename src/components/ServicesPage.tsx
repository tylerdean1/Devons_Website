import { useState } from 'react';
import { Filter } from 'lucide-react';
import ServiceCard from './ServiceCard';
import { services } from '../data/services';

export default function ServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...Array.from(new Set(services.map(s => s.category)))];
  const filteredServices = selectedCategory === 'All'
    ? services
    : services.filter(s => s.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Professional handyman services for all your home improvement needs across Clay County and Duval County, Florida.
            Hover over each service to see details and add to your quote.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-2 bg-white rounded-lg p-1 shadow-md">
            <Filter className="h-5 w-5 text-gray-400 ml-3" />
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${selectedCategory === category
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
        <p className="text-sm text-gray-500 text-center mb-6">
          Available throughout Jacksonville, Jacksonville Beach, Mandarin, Riverside, Orange Park, Fleming Island, Middleburg,
          Green Cove Springs, and surrounding First Coast communities.
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
    </div>
  );
}