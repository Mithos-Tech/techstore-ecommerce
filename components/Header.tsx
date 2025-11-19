
import React, { useContext, useState, useCallback, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { SearchIcon, ShoppingCartIcon, UserIcon, MenuIcon, XIcon, HeartIcon } from './icons/Icons';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';

const Header: React.FC = React.memo(() => {
  const { cart } = useContext(CartContext);
  const { wishlist } = useContext(WishlistContext);
  const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0);
  const totalWishlistItems = wishlist.length;
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSearchSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
      // Opcional: limpiar búsqueda tras navegar o mantenerla. 
      // Mantenerla suele ser mejor UX si el usuario quiere refinar.
       searchInputRef.current?.blur();
    }
  }, [searchQuery, navigate]);

  const clearSearch = () => {
    setSearchQuery('');
    searchInputRef.current?.focus();
  };
  
  const handleMobileLinkClick = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);

    if (location.pathname === '/') {
      const element = document.getElementById(hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(`/${hash}`);
    }
  }, [location.pathname, navigate]);

  const handleHomeClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    setIsMobileMenuOpen(false);
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.pathname]);

  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
      <div className="container mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 z-50" onClick={() => setIsMobileMenuOpen(false)}>
            <img src="https://res.cloudinary.com/dkoshgzxo/image/upload/v1763264025/logo-main_cfhexg.svg" alt="TechStore Logo" className="h-9 w-auto" />
            <span className="text-2xl font-bold text-navy-dark tracking-tighter">TechStore</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8 text-navy-dark font-medium">
            <Link to="/" onClick={handleHomeClick} className="link-underline">Inicio</Link>
            <a href="/#categoria" onClick={(e) => handleNavClick(e, '#categoria')} className="link-underline">Categorías</a>
            <a href="/#oferta" onClick={(e) => handleNavClick(e, '#oferta')} className="link-underline">Ofertas</a>
            <Link to="/search" className="link-underline">Productos</Link>
          </nav>

          <div className="flex items-center space-x-2 sm:space-x-4">
             {/* Desktop Search */}
             <form onSubmit={handleSearchSubmit} className="relative hidden sm:block w-64 lg:w-80 group">
                <input 
                    ref={searchInputRef}
                    type="text" 
                    placeholder="Buscar productos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-5 pr-12 py-2.5 rounded-full border border-gray-200 bg-gray-50 text-navy-dark placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-electric/20 focus:border-blue-electric transition-all duration-300 ease-in-out text-sm"
                />
                {searchQuery && (
                    <button 
                        type="button" 
                        onClick={clearSearch}
                        className="absolute inset-y-0 right-10 flex items-center text-gray-400 hover:text-red-500 transition-colors"
                    >
                        <XIcon className="h-4 w-4" />
                    </button>
                )}
                <button type="submit" aria-label="Buscar" className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 group-focus-within:text-blue-electric transition-colors">
                  <SearchIcon className="h-5 w-5"/>
                </button>
            </form>

            <Link to="/wishlist" className="relative group p-2 hidden sm:block">
              <HeartIcon className="w-6 h-6 text-navy-dark group-hover:text-blue-electric transition-colors" />
              {totalWishlistItems > 0 && (
                <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-blue-electric text-white text-xs flex items-center justify-center transform translate-x-1/3 -translate-y-1/3 border-2 border-white">
                  {totalWishlistItems}
                </span>
              )}
            </Link>

            <Link to="/carrito" className="relative group p-2">
              <ShoppingCartIcon className="w-6 h-6 text-navy-dark group-hover:text-blue-electric transition-colors"/>
              {totalCartItems > 0 && (
                <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-blue-electric text-white text-xs flex items-center justify-center transform translate-x-1/3 -translate-y-1/3 border-2 border-white">
                  {totalCartItems}
                </span>
              )}
            </Link>

            <Link to="/admin/login" className="group p-2 hidden sm:block" title="Acceso Administrador">
              <UserIcon className="w-6 h-6 text-navy-dark group-hover:text-blue-electric transition-colors"/>
            </Link>

            <button className="md:hidden p-2 z-50 relative" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"} aria-expanded={isMobileMenuOpen}>
              {isMobileMenuOpen ? (
                  <XIcon className="w-6 h-6 text-navy-dark"/>
              ) : (
                  <MenuIcon className="w-6 h-6 text-navy-dark" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div className={`md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl shadow-xl border-t border-gray-100 z-40 overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
         <div className="flex flex-col p-6 space-y-6">
            {/* Mobile Search Bar */}
            <form onSubmit={handleSearchSubmit} className="relative w-full">
                <input 
                    type="text" 
                    placeholder="¿Qué estás buscando?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-5 pr-12 py-3.5 rounded-2xl border border-gray-200 bg-gray-50 text-navy-dark focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-electric focus:border-transparent transition-all shadow-inner"
                />
                <button type="submit" className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-electric">
                    <SearchIcon className="h-6 w-6" />
                </button>
            </form>

            <nav className="flex flex-col space-y-4 text-navy-dark font-medium text-lg">
                <Link to="/" onClick={handleHomeClick} className="flex items-center justify-between py-2 border-b border-gray-100 hover:text-blue-electric">
                    Inicio <span className="text-gray-300">›</span>
                </Link>
                <a href="/#categoria" onClick={(e) => handleNavClick(e, '#categoria')} className="flex items-center justify-between py-2 border-b border-gray-100 hover:text-blue-electric">
                    Categorías <span className="text-gray-300">›</span>
                </a>
                <a href="/#oferta" onClick={(e) => handleNavClick(e, '#oferta')} className="flex items-center justify-between py-2 border-b border-gray-100 hover:text-blue-electric">
                    Ofertas <span className="text-gray-300">›</span>
                </a>
                <Link to="/search" className="flex items-center justify-between py-2 border-b border-gray-100 hover:text-blue-electric" onClick={handleMobileLinkClick}>
                    Catálogo Completo <span className="text-gray-300">›</span>
                </Link>
                 <Link to="/wishlist" className="flex items-center justify-between py-2 border-b border-gray-100 hover:text-blue-electric" onClick={handleMobileLinkClick}>
                    Lista de Deseos ({totalWishlistItems}) <HeartIcon className="w-5 h-5" />
                </Link>
                 <Link to="/admin/login" className="flex items-center justify-between py-2 hover:text-blue-electric text-gray-500" onClick={handleMobileLinkClick}>
                    Admin Panel <UserIcon className="w-5 h-5" />
                </Link>
            </nav>
        </div>
      </div>
    </header>
  );
});

export default Header;
