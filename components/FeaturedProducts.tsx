
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from './icons/Icons';
import { PRODUCTS_DATA } from '../constants';
import type { Product } from '../types';
import { useFirebaseData } from '../hooks/useFirebaseData';
import { SkeletonCard } from './skeletons/SkeletonCard';

const FeaturedProductCard: React.FC<{ product: Product; large?: boolean }> = ({ product, large = false }) => (
    <Link 
        to={`/producto/${product.id}`}
        className={`group relative rounded-3xl overflow-hidden block transition-all duration-300 hover:shadow-2xl hover:shadow-navy-dark/15 hover:-translate-y-1
        w-full ${large ? 'md:col-span-2 md:row-span-2 min-h-[400px] md:min-h-[600px]' : 'min-h-[300px] md:min-h-[280px]'}`}
    >
        {/* Image Layer */}
        <div className="absolute inset-0 bg-gray-200">
             <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
                decoding="async"
             />
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100"></div>
        
        {/* Badges */}
        {product.discount && (
            <div className="absolute top-6 left-6 bg-gradient-to-br from-red-500 to-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg shadow-red-500/40 animate-pulse-badge z-10">
                {product.discount}
            </div>
        )}

        {/* Content */}
        <div className="absolute bottom-0 left-0 w-full p-6 text-white z-20">
            <h3 className="text-xl md:text-2xl font-semibold mb-1 leading-tight drop-shadow-md">{product.name}</h3>
            <div className="flex items-baseline gap-2 mb-3">
                <p className="text-lg md:text-xl font-bold text-white">S/{product.price.toFixed(2)}</p>
                {product.originalPrice && (
                    <p className="text-sm text-gray-300 line-through opacity-80">S/{product.originalPrice.toFixed(2)}</p>
                )}
            </div>
            <span className="inline-flex items-center text-xs font-medium text-white/90 border border-white/30 px-3 py-1.5 rounded-full backdrop-blur-md bg-white/10 group-hover:bg-white/20 transition-colors">
                Ver detalles <ArrowRightIcon className="ml-1 w-3 h-3" />
            </span>
        </div>
    </Link>
);

const FeaturedProducts: React.FC = () => {
  // Use Firebase data, falling back to constants if offline or empty
  const { data: products, loading } = useFirebaseData<Product>('productos', PRODUCTS_DATA);
  
  const displayProducts = products && products.length > 0 ? products : PRODUCTS_DATA;
  const featuredProducts = displayProducts.slice(0, 5);

  if (loading && (!products || products.length === 0)) {
      return (
        <section className="py-16 md:py-24">
            <div className="container mx-auto max-w-7xl px-6">
                <div className="flex items-center justify-between mb-12">
                  <div className="h-10 w-64 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 lg:gap-6">
                    {/* Large Skeleton */}
                    <div className="md:col-span-2 md:row-span-2 min-h-[400px] md:min-h-[600px] bg-gray-200 rounded-3xl animate-pulse"></div>
                    {/* Small Skeletons */}
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                </div>
            </div>
        </section>
      );
  }

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-navy-dark">Productos Destacados</h2>
           <Link to="/search" className="hidden sm:flex items-center space-x-2 bg-white text-navy-dark font-semibold px-5 py-2.5 rounded-full shadow-sm hover:shadow-lg border border-gray-200 hover:text-blue-electric hover:-translate-y-0.5 transform transition-all duration-300">
            <span>Ver todo</span>
            <ArrowRightIcon className="w-5 h-5" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 lg:gap-6">
          {featuredProducts.map((product, index) => (
             <FeaturedProductCard key={product.id} product={product} large={index === 0} />
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
             <Link to="/search" className="inline-flex items-center space-x-2 bg-white text-navy-dark font-semibold px-6 py-3 rounded-full shadow border border-gray-200">
                <span>Ver catálogo completo</span>
                <ArrowRightIcon className="w-5 h-5" />
             </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
