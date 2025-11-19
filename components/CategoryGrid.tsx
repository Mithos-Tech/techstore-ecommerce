
import React from 'react';
import { CATEGORIES_DATA } from '../constants';
import { ArrowRightIcon } from './icons/Icons';
import type { Category } from '../types';

interface CategoryCardProps {
  category: Category;
  className?: string;
  isFeatured?: boolean;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, className, isFeatured = false }) => (
    <div className={`relative rounded-3xl overflow-hidden group transition-all duration-300 transform-gpu hover:-translate-y-2 hover:scale-[1.01] hover:shadow-2xl hover:shadow-navy-dark/15 h-80 md:h-auto ${className}`}>
        {isFeatured && (
            <div className="absolute top-6 left-6 bg-blue-electric/90 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full z-10 animate-pulse-subtle">
                Destacado
            </div>
        )}
        <img 
            src={category.imageUrl} 
            alt={category.name} 
            className="absolute inset-0 w-full h-full object-cover transition-all duration-500 filter brightness-[.85] group-hover:brightness-100 group-hover:scale-105" 
            loading="lazy" 
            decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/80 via-navy-dark/40 to-transparent transition-all duration-300 group-hover:from-navy-dark/90"></div>
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 text-white">
            <h3 className="text-2xl md:text-3xl font-bold">{category.name}</h3>
            <div className="mt-2 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transform-gpu translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                <span>{category.description}</span>
                <ArrowRightIcon className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
        </div>
    </div>
);

const CategoryGrid: React.FC = () => {
    const categories = CATEGORIES_DATA.slice(0, 5); // Ensure we only take 5 for the bento layout

    const gridLayoutClasses = [
        'lg:col-start-1 lg:col-end-7 lg:row-start-1 lg:row-end-3', // Teclados
        'lg:col-start-7 lg:col-end-10 lg:row-start-1 lg:row-end-2', // Mouses
        'lg:col-start-10 lg:col-end-13 lg:row-start-1 lg:row-end-3', // Monitores
        'lg:col-start-7 lg:col-end-10 lg:row-start-2 lg:row-end-3', // Audio
        'lg:col-start-1 lg:col-end-13 lg:row-start-3 lg:row-end-4'  // Componentes
    ];

    return (
        <section className="py-16 md:py-24 bg-gray-50">
            <div className="container mx-auto max-w-7xl px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 lg:grid-rows-3 gap-6 lg:h-[800px]">
                    {categories.map((category, index) => (
                        <CategoryCard 
                            key={category.id} 
                            category={category} 
                            className={gridLayoutClasses[index]} 
                            isFeatured={index === 0}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CategoryGrid;
