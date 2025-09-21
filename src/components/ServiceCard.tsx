import { useState } from 'react';
import { Plus } from 'lucide-react';
import * as Icons from 'lucide-react';
import { Service } from '../types';
import { useCart } from '../context/CartContext';

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { dispatch } = useCart();

  // Dynamically get the icon component
  const IconComponent = ((Icons as unknown) as Record<string, React.ComponentType<{ className?: string }>>)[service.icon] || Icons.Hammer;

  const handleAddToCart = () => {
    dispatch({ type: 'ADD_ITEM', payload: service });
  };

  return (
    <div
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 min-h-[280px] flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-4">
          <IconComponent className="h-8 w-8 text-gray-700" />
          <span className="text-sm font-medium text-yellow-600 bg-yellow-100 px-2 py-1 rounded">
            {service.category}
          </span>
        </div>

        <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.name}</h3>

        <div className="flex-grow">
          <p
            className={`text-gray-600 transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-70'
              }`}
          >
            {service.description}
          </p>
        </div>

        <div className={`transition-all duration-300 ${isHovered ? 'opacity-100 mt-4' : 'opacity-0 mt-0'
          }`}>
          <button
            onClick={handleAddToCart}
            className="w-full bg-gray-800 hover:bg-gray-700 text-yellow-400 py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add to Quote
          </button>
        </div>
      </div>
    </div>
  );
}