
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { WishlistContext } from '../context/WishlistContext';
import { ProductCard } from '../components/ProductCard';
import SEO from '../components/SEO';
import { HeartIcon } from '../components/icons/Icons';

const WishlistPage: React.FC = () => {
  const { wishlist } = useContext(WishlistContext);

  return (
    <>
      <SEO title="Mi Lista de Deseos | TechStore" description="Revisa los productos que has guardado para más tarde." />
      <div className="bg-gray-50/50 min-h-[60vh]">
        <div className="container mx-auto max-w-7xl px-6 py-16 md:py-24">
          <h1 className="text-3xl md:text-4xl font-bold text-navy-dark mb-12">Mi Lista de Deseos</h1>
          
          {wishlist.length === 0 ? (
            <div className="text-center py-16 px-6 bg-white rounded-3xl shadow-lg flex flex-col items-center">
              <HeartIcon className="w-24 h-24 text-gray-200" />
              <h2 className="mt-8 text-2xl font-bold text-navy-dark">Tu lista de deseos está vacía</h2>
              <p className="mt-4 text-gray-600 max-w-md">
                Haz clic en el corazón de tus productos favoritos para guardarlos aquí y no perderlos de vista.
              </p>
              <Link 
                to="/search" 
                className="btn-transition mt-8 inline-block bg-blue-electric text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:bg-navy-dark"
              >
                Explorar Productos
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {wishlist.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default WishlistPage;