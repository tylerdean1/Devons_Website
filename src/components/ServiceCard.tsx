import { Plus } from 'lucide-react';
import * as Icons from 'lucide-react';
import { Service } from '../types';
import { useCart } from '../context/CartContext';

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const { dispatch } = useCart();

  // Dynamically get the icon component
  const IconComponent = ((Icons as unknown) as Record<string, React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>>)[service.icon] || Icons.Hammer;

  const handleAddToCart = () => {
    dispatch({ type: 'ADD_ITEM', payload: service });
  };

  return (
    <div
      className="flex min-h-[280px] flex-col rounded-xl bg-white shadow-lg transition-shadow duration-300 hover:shadow-xl"
    >
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-4">
          <IconComponent className="h-8 w-8 text-gray-700" aria-hidden="true" />
          <span className="text-sm font-medium text-yellow-600 bg-yellow-100 px-2 py-1 rounded">
            {service.category}
          </span>
        </div>

        <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.name}</h3>

        <div className="flex-grow">
          <p className="text-gray-600">{service.description}</p>
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-gray-800 px-4 py-2 font-medium text-yellow-400 transition-colors hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:ring-offset-2"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add to Quote
        </button>
      </div>
    </div>
  );
}
