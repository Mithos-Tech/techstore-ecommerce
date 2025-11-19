
import React from 'react';
import { XIcon } from './icons/Icons';

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: string[];
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

const MobileFilterDrawer: React.FC<MobileFilterDrawerProps> = ({
  isOpen,
  onClose,
  categories,
  selectedCategory,
  onCategorySelect,
}) => {
  return (
    <div
      className={`fixed inset-0 z-[200] transition-opacity duration-300 lg:hidden ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`relative flex flex-col w-full max-w-xs h-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-navy-dark">Filtros</h2>
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-navy-dark">
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto">
          <h3 className="text-lg font-semibold text-navy-dark mb-4">Categorías</h3>
          <ul className="space-y-2">
            {categories.map((category) => (
              <li key={category}>
                <button
                  onClick={() => onCategorySelect(category)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                    selectedCategory === category
                      ? 'bg-blue-electric/10 text-blue-electric font-semibold'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {category}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MobileFilterDrawer;
