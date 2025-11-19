
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PRODUCTS_DATA } from '../constants';
import { ShoppingCartIcon, HeartIcon } from '../components/icons/Icons';
import type { Product } from '../types';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import SEO from '../components/SEO';
import { getProductById } from '../firebase';
import LoadingSpinner from '../components/LoadingSpinner';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useContext(CartContext);
  const { wishlist, toggleWishlist } = useContext(WishlistContext);
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      if (id) {
        // Intenta obtener de Firebase primero
        const firebaseProduct = await getProductById(id);
        if (firebaseProduct) {
            setProduct(firebaseProduct);
        } else {
            // Si falla o no existe en Firebase, busca en constantes (fallback)
            const staticProduct = PRODUCTS_DATA.find(p => p.id === id);
            setProduct(staticProduct || null);
        }
      }
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  const pageTitle = product ? `${product.name} | TechStore` : 'Producto no encontrado';
  const pageDescription = product ? product.description || `Compra ${product.name} al mejor precio en TechStore. Calidad y rendimiento garantizados.` : 'El producto que buscas no está disponible.';
  const isInWishlist = product ? wishlist.some(item => item.id === product.id) : false;

  if (loading) {
      return <LoadingSpinner />;
  }

  if (!product) {
    return (
      <>
        <SEO title={pageTitle} description={pageDescription} />
        <div className="container mx-auto max-w-7xl px-6 py-24 text-center">
          <h1 className="text-3xl font-bold text-navy-dark">Producto no encontrado</h1>
          <p className="mt-4 text-gray-600">Lo sentimos, no pudimos encontrar el producto que estás buscando.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO title={pageTitle} description={pageDescription} />
      <div className="container mx-auto max-w-7xl px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Image Gallery */}
          <div className="bg-gray-100 rounded-3xl p-8 sticky top-24 flex items-center justify-center min-h-[400px]">
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="w-full h-auto object-contain rounded-2xl max-h-[500px]" 
              loading="eager" 
              decoding="async"
            />
          </div>
          
          {/* Product Info */}
          <div>
            <span className="text-sm font-semibold text-blue-electric uppercase tracking-wider">{product.category}</span>
            <h1 className="mt-2 text-4xl md:text-5xl font-bold text-navy-dark leading-tight">
              {product.name}
            </h1>
            <div className="mt-4 flex items-center space-x-4">
              <p className="text-4xl font-bold text-navy-dark">S/{product.price.toFixed(2)}</p>
              {product.inStock !== undefined && (
                  <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                      product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                      {product.inStock ? 'En Stock' : 'Agotado'}
                  </span>
              )}
            </div>
            
            {/* Discount info if available */}
            {product.originalPrice && (
                <div className="mt-2 text-gray-500 line-through">
                    Antes: S/{product.originalPrice.toFixed(2)}
                </div>
            )}

            <p className="mt-6 text-gray-600 leading-relaxed text-lg">
              {product.description || 'Descripción detallada no disponible. Este componente de alta calidad ofrece un rendimiento excepcional y una durabilidad garantizada, ideal para entusiastas que buscan mejorar su setup.'}
            </p>
            <div className="mt-8 flex items-center space-x-4">
              <button 
                  onClick={() => addToCart(product)}
                  className="w-full lg:w-auto h-14 px-10 bg-blue-electric text-white font-semibold rounded-full flex items-center justify-center space-x-3 text-lg hover:bg-navy-dark transform hover:-translate-y-1 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg shadow-blue-electric/30"
                  disabled={!product.inStock}
              >
                  <ShoppingCartIcon className="w-6 h-6" />
                  <span>{product.inStock ? 'Añadir al carrito' : 'Agotado'}</span>
              </button>
              <button
                onClick={() => toggleWishlist(product)}
                className={`flex-shrink-0 w-14 h-14 flex items-center justify-center rounded-full border-2 transition-all duration-300 transform hover:-translate-y-1 ${
                  isInWishlist ? 'bg-red-50 border-red-200 text-red-500' : 'bg-gray-100 border-gray-200 text-gray-500 hover:text-red-500'
                }`}
                aria-label={isInWishlist ? 'Quitar de la lista de deseos' : 'Añadir a la lista de deseos'}
              >
                  <HeartIcon className={`w-7 h-7 ${isInWishlist ? 'fill-current' : 'fill-none'}`} />
              </button>
            </div>
            <div className="mt-10 border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-navy-dark">Especificaciones</h3>
                <ul className="mt-4 space-y-2 text-gray-600">
                    <li><span className="font-medium">Categoría:</span> {product.category}</li>
                    <li><span className="font-medium">Disponibilidad:</span> {product.inStock ? 'Inmediata' : 'Consultar'}</li>
                    <li><span className="font-medium">Garantía:</span> 1 año de garantía directa</li>
                    <li><span className="font-medium">Envío:</span> Gratis en Lima Metropolitana (Pedidos +S/199)</li>
                </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetailPage;
