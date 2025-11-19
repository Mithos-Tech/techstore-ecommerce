
import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import type { Product } from '../types';
import { ToastContext } from './ToastContext';

interface WishlistContextType {
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
}

export const WishlistContext = createContext<WishlistContextType>({
  wishlist: [],
  toggleWishlist: () => {},
});

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const localData = localStorage.getItem('wishlist');
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      console.error("Could not parse wishlist from localStorage", error);
      return [];
    }
  });

  const { showToast } = useContext(ToastContext);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (product: Product) => {
    setWishlist(prevWishlist => {
      const isInWishlist = prevWishlist.some(item => item.id === product.id);
      if (isInWishlist) {
        showToast('Producto quitado de la lista');
        return prevWishlist.filter(item => item.id !== product.id);
      } else {
        showToast('Producto agregado a la lista ✓');
        return [...prevWishlist, product];
      }
    });
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};