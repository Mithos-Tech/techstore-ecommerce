
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../types';
import { ShoppingCartIcon, StarIcon, HeartIcon } from './icons/Icons';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';

interface ProductCardProps {
    product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const { addToCart } = useContext(CartContext);
    const { wishlist, toggleWishlist } = useContext(WishlistContext);
    
    const isInWishlist = wishlist.some(item => item.id === product.id);

    const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        addToCart(product);

        // Ripple effect
        const button = e.currentTarget;
        const circle = document.createElement("span");
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;

        circle.style.width = circle.style.height = `${diameter}px`;
        const rect = button.getBoundingClientRect();
        circle.style.left = `${e.clientX - rect.left - radius}px`;
        circle.style.top = `${e.clientY - rect.top - radius}px`;
        circle.classList.add("ripple");

        const existingRipple = button.getElementsByClassName("ripple")[0];
        if (existingRipple) {
            existingRipple.remove();
        }

        button.appendChild(circle);
    };

    const handleWishlistToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        toggleWishlist(product);
    };

    const renderStars = () => {
        const rating = product.rating || 0;
        const fullStars = Math.floor(rating);
        return Array.from({ length: 5 }, (_, i) => (
            <StarIcon 
                key={i} 
                className={`w-4 h-4 ${i < fullStars ? 'text-yellow-400' : 'text-gray-300'}`} 
            />
        ));
    };

    return (
        <Link to={`/producto/${product.id}`} className="block group w-full h-full">
            <div className="bg-white rounded-[14px] overflow-hidden border border-gray-100/80 group-hover:border-blue-electric/20 group-hover:shadow-2xl group-hover:shadow-navy-dark/10 group-hover:-translate-y-1.5 transition-all duration-300 ease-in-out h-full flex flex-col">
                <div className="relative w-full h-56 bg-gray-100 overflow-hidden">
                    <img 
                      src={product.imageUrl} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-2 transition-transform duration-500 ease-in-out" 
                      loading="lazy" 
                      decoding="async" 
                    />
                    {product.discount && (
                        <div className="absolute top-4 left-4 bg-gradient-to-br from-red-500 to-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg shadow-red-500/40 animate-pulse-badge">
                            {product.discount}
                        </div>
                    )}
                    <button 
                        onClick={handleWishlistToggle}
                        className={`absolute top-3 right-3 p-2 bg-white/60 backdrop-blur-sm rounded-full transition-all duration-300 text-gray-600 hover:text-red-500 hover:scale-110 z-10 ${isInWishlist ? 'text-red-500' : ''}`}
                        aria-label={isInWishlist ? 'Quitar de la lista de deseos' : 'Añadir a la lista de deseos'}
                    >
                        <HeartIcon className={`w-6 h-6 ${isInWishlist ? 'fill-current' : 'fill-none'}`} />
                    </button>
                </div>
                <div className="p-5 flex flex-col flex-grow">
                    <span className="text-sm text-gray-500 mb-1">{product.category}</span>
                    <h3 className="text-lg font-semibold text-navy-dark leading-tight group-hover:text-blue-electric transition-colors duration-300">
                      {product.name}
                    </h3>
                    
                    <div className="flex items-center gap-1 mt-2">
                        {renderStars()}
                        <span className="text-xs text-gray-500 ml-1">({product.rating})</span>
                    </div>

                    <div className="mt-4 flex-grow" />

                    <div className="mt-4 flex items-end justify-between">
                         <div>
                            {product.originalPrice && (
                                <p className="text-sm text-gray-400 line-through">S/{product.originalPrice.toFixed(2)}</p>
                            )}
                            <p className="text-xl font-bold text-navy-dark relative price-underline">S/{product.price.toFixed(2)}</p>
                         </div>
                        {product.inStock !== undefined && (
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full ${
                                product.inStock ? 'bg-gradient-to-br from-green-100 to-green-200 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                                {product.inStock && <span className="w-2 h-2 bg-green-500 rounded-full animate-blink"></span>}
                                {product.inStock ? 'En Stock' : 'Agotado'}
                            </span>
                        )}
                    </div>
                    
                    <div className="mt-4 h-12 relative">
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transform translate-y-3 group-hover:translate-y-0 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]">
                            <button 
                                onClick={handleAddToCart}
                                className="w-full h-full bg-blue-electric text-white font-semibold rounded-full flex items-center justify-center space-x-2 hover:bg-navy-dark transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed relative overflow-hidden"
                                disabled={!product.inStock}
                            >
                                <ShoppingCartIcon className="w-5 h-5" />
                                <span>{product.inStock ? 'Añadir al carrito' : 'Agotado'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};