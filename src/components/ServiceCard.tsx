import React, { useState } from 'react';
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
  const IconComponent = (Icons as any)[service.icon] || Icons.Hammer;

  const handleAddToCart = () => {
    dispatch({ type: 'ADD_ITEM', payload: service });
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <IconComponent className="h-8 w-8 text-gray-700" />
          <span className="text-sm font-medium text-yellow-600 bg-yellow-100 px-2 py-1 rounded">
            {service.category}
          </span>
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.name}</h3>
        
        <div className="relative">
          <p 
            className={`text-gray-600 transition-all duration-300 ${
              isHovered ? 'opacity-100 max-h-20' : 'opacity-70 max-h-12 overflow-hidden'
            }`}
          >
            {service.description}
          </p>
        </div>

        <div className={`transition-all duration-300 ${
          isHovered ? 'opacity-100 max-h-20 mt-4' : 'opacity-0 max-h-0 mt-0'
        } overflow-hidden`}>
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