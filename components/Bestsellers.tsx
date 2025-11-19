
import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ProductCard } from './ProductCard';
import { ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon } from './icons/Icons';
import { PRODUCTS_DATA } from '../constants';
import { useFirebaseData } from '../hooks/useFirebaseData';
import type { Product } from '../types';

const Bestsellers: React.FC = () => {
  // Fetch real data from Firebase
  const { data: products, loading } = useFirebaseData<Product>('productos', PRODUCTS_DATA);
  
  // Sort by rating or some other metric to simulate "Bestsellers"
  const bestsellers = useMemo(() => {
    const source = products.length > 0 ? products : PRODUCTS_DATA;
    return [...source]
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 7);
  }, [products]);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollability = () => {
    const el = scrollContainerRef.current;
    if (el) {
      const tolerance = 1;
      setCanScrollLeft(el.scrollLeft > tolerance);
      setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - tolerance);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (el) {
      const scrollAmount = el.clientWidth * 0.8;
      el.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };
  
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (el) {
        let timeoutId: number | null = null;
        const debouncedCheck = () => {
            if (timeoutId !== null) {
                clearTimeout(timeoutId);
            }
            timeoutId = window.setTimeout(checkScrollability, 150);
        };
        
        checkScrollability();
        el.addEventListener('scroll', debouncedCheck);
        window.addEventListener('resize', debouncedCheck);

        return () => {
            el.removeEventListener('scroll', debouncedCheck);
            window.removeEventListener('resize', debouncedCheck);
            if (timeoutId !== null) {
                clearTimeout(timeoutId);
            }
        };
    }
  }, [bestsellers]);


  return (
    <section className="py-16 md:py-24 relative">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-navy-dark">Lo Más Vendido</h2>
          <Link to="/search" className="hidden sm:flex items-center space-x-2 bg-white text-navy-dark font-semibold px-5 py-2.5 rounded-full shadow-sm hover:shadow-lg border border-gray-200 hover:text-blue-electric hover:-translate-y-0.5 transform transition-all duration-300">
              <span>Ver todo</span>
              <ArrowRightIcon className="w-5 h-5" />
          </Link>
        </div>
        
        {loading && bestsellers.length === 0 ? (
            <div className="flex space-x-6 overflow-hidden">
                {[1,2,3,4].map(i => (
                    <div key={i} className="w-64 h-80 bg-gray-100 rounded-2xl animate-pulse"></div>
                ))}
            </div>
        ) : (
            <div className="relative group/slider">
                <button
                    onClick={() => scroll('left')}
                    aria-label="Anterior"
                    className={`absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 z-20 p-3 bg-white rounded-full shadow-lg border border-gray-100 transition-all duration-300 hover:bg-blue-electric hover:text-white hover:scale-110 disabled:opacity-0 disabled:pointer-events-none ${canScrollLeft ? 'opacity-100' : 'opacity-0'}`}
                    disabled={!canScrollLeft}
                >
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <div ref={scrollContainerRef} className="flex space-x-6 overflow-x-auto pb-8 -mx-6 px-6 no-scrollbar" style={{ scrollSnapType: 'x mandatory' }}>
                    {bestsellers.map(product => (
                        <div key={product.id} className="flex-shrink-0 w-4/5 sm:w-[45%] md:w-1/3 lg:w-1/4 h-full" style={{ scrollSnapAlign: 'center' }}>
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
                <button
                    onClick={() => scroll('right')}
                    aria-label="Siguiente"
                    className={`absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 z-20 p-3 bg-white rounded-full shadow-lg border border-gray-100 transition-all duration-300 hover:bg-blue-electric hover:text-white hover:scale-110 disabled:opacity-0 disabled:pointer-events-none ${canScrollRight ? 'opacity-100' : 'opacity-0'}`}
                    disabled={!canScrollRight}
                >
                    <ChevronRightIcon className="w-6 h-6" />
                </button>
            </div>
        )}
      </div>
    </section>
  );
};

export default Bestsellers;
