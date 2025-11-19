import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import SEO from '../components/SEO';
import { useFirebaseData } from '../hooks/useFirebaseData';
import { SkeletonCard } from '../components/skeletons/SkeletonCard';
import type { Product } from '../types';
import { PRODUCTS_DATA } from '../constants';
import MobileFilterDrawer from '../components/MobileFilterDrawer';
import { FilterIcon } from '../components/icons/Icons';

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Fetch products from Firebase with local fallback data
  const { data: allProducts, loading, error, refetch } = useFirebaseData<Product>('productos', PRODUCTS_DATA);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  // Get filter values from URL
  const query = searchParams.get('q')?.toLowerCase() || '';
  const selectedCategory = searchParams.get('category') || 'Todos';

  // Derive categories from products (either from Firebase or fallback)
  const categories = useMemo(() => {
    if (!allProducts) return ['Todos'];
    return ['Todos', ...new Set(allProducts.map(p => p.category))];
  }, [allProducts]);

  // Handle filtering logic when data or URL params change
  useEffect(() => {
    if (allProducts) {
      let products = [...allProducts];
      
      if (selectedCategory !== 'Todos') {
        products = products.filter(p => p.category === selectedCategory);
      }

      if (query) {
        products = products.filter(p => 
          p.name.toLowerCase().includes(query) || 
          p.description?.toLowerCase().includes(query)
        );
      }

      setFilteredProducts(products);
    }
  }, [allProducts, selectedCategory, query]);

  const handleCategoryClick = (category: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (category === 'Todos') {
      newSearchParams.delete('category');
    } else {
      newSearchParams.set('category', category);
    }
    setSearchParams(newSearchParams, { replace: true });
    setIsFilterOpen(false); // Close drawer on selection
  };

  const getPageTitle = () => {
    if (query) return `Resultados para "${query}"`;
    if (selectedCategory !== 'Todos') return `Categoría: ${selectedCategory}`;
    return 'Todos Nuestros Productos';
  };

  const pageTitle = getPageTitle();
  const pageDescription = `Explora ${pageTitle.toLowerCase()} en TechStore. Encuentra los mejores componentes y periféricos de gaming.`;

  const renderContent = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, index) => <SkeletonCard key={index} />)}
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-16 bg-gray-50 rounded-2xl">
          <p className="text-xl text-red-600">Error al Cargar Productos</p>
          <p className="mt-2 text-gray-500">Mostrando productos de respaldo. Puede haber un problema con la conexión.</p>
          <button onClick={refetch} className="mt-8 inline-block bg-blue-electric text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:bg-navy-dark transform hover:-translate-y-1 transition-all duration-300">
            Reintentar Conexión
          </button>
        </div>
      );
    }

    if (filteredProducts.length > 0) {
      return (
        <>
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">Mostrando {filteredProducts.length} productos.</p>
            <button
              onClick={() => setIsFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-full font-semibold text-navy-dark"
            >
              <FilterIcon className="w-5 h-5" />
              <span>Filtros</span>
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      );
    }

    return (
      <div className="text-center py-16 bg-gray-50 rounded-2xl">
        <h3 className="text-2xl font-semibold text-navy-dark">Sin resultados</h3>
        <p className="mt-2 text-gray-600">
          No encontramos productos con esos filtros.
        </p>
        <button onClick={() => {
          setSearchParams({}, { replace: true });
        }} className="mt-8 inline-block bg-blue-electric text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:bg-navy-dark transform hover:-translate-y-1 transition-all duration-300">
          Limpiar filtros
        </button>
      </div>
    );
  };

  return (
    <>
      <SEO title={`${pageTitle} | TechStore`} description={pageDescription} />
      <MobileFilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategoryClick}
      />
      <div className="bg-white">
        <div className="container mx-auto max-w-7xl px-6 py-16 md:py-24 min-h-[60vh]">
          <h1 className="text-3xl md:text-4xl font-bold text-navy-dark mb-12 text-center lg:text-left">
            {pageTitle}
          </h1>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">
            <aside className="hidden lg:block lg:col-span-1">
              <div className="bg-gray-50 p-6 rounded-2xl shadow-sm sticky top-28">
                <h3 className="text-xl font-semibold text-navy-dark border-b border-gray-200 pb-4">Categorías</h3>
                <ul className="space-y-2 pt-4">
                  {categories.map(category => (
                    <li key={category}>
                      <button
                        onClick={() => handleCategoryClick(category)}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-200 ${
                          selectedCategory === category
                            ? 'bg-white text-blue-electric font-semibold shadow-sm'
                            : 'text-gray-600 hover:bg-white hover:text-navy-dark'
                        }`}
                      >
                        {category}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>

            <main className="lg:col-span-3">
              {renderContent()}
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchPage;