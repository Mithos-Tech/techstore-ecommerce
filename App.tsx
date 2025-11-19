
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { ArrowUpIcon, WhatsappIcon } from './components/icons/Icons';
import Toast from './components/Toast';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy-loaded pages for code splitting and performance
const HomePage = lazy(() => import('./pages/HomePage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const OrderConfirmationPage = lazy(() => import('./pages/OrderConfirmationPage'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));


// Admin Pages
const AdminLoginPage = lazy(() => import('./pages/LoginPage'));
const ProtectedRoute = lazy(() => import('./components/ProtectedRoute'));
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'));
const AdminProductsPage = lazy(() => import('./pages/AdminProductsPage'));
const AdminOrdersPage = lazy(() => import('./pages/AdminOrdersPage'));


const App: React.FC = () => {
  const [isScrollButtonVisible, setIsScrollButtonVisible] = useState(false);
  const location = useLocation();

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsScrollButtonVisible(true);
    } else {
      setIsScrollButtonVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const phoneNumber = "51987654321"; // Placeholder phone number for Peru
  const message = "Hola, estoy interesado en los productos de TechStore.";

  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="bg-white text-navy-dark font-sans">
      {!isAdminRoute && <Header />}
      <Toast />
      <main className={!isAdminRoute ? "animate-page-fade-in" : ""} key={location.pathname}>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/producto/:id" element={<ProductDetailPage />} />
            <Route path="/carrito" element={<CartPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboardPage />} />
              <Route path="products" element={<AdminProductsPage />} />
              <Route path="orders" element={<AdminOrdersPage />} />
            </Route>
          </Routes>
        </Suspense>
      </main>
      {!isAdminRoute && <Footer />}
       {/* Floating Action Buttons */}
       {!isAdminRoute && (
         <div className="hidden md:flex flex-col items-center space-y-4 fixed bottom-6 right-6 z-50">
            <a
              href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contactar por WhatsApp"
              className="w-14 h-14 flex items-center justify-center bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transform hover:scale-110 transition-all duration-300"
            >
              <WhatsappIcon className="w-8 h-8" />
            </a>
            {isScrollButtonVisible && (
              <button
                onClick={scrollToTop}
                aria-label="Volver arriba"
                className="w-14 h-14 flex items-center justify-center bg-blue-electric text-white rounded-full shadow-lg hover:bg-navy-dark transform hover:scale-110 transition-all duration-300 animate-fade-in"
              >
                <ArrowUpIcon className="w-6 h-6" />
              </button>
            )}
        </div>
       )}
    </div>
  );
};

export default App;
