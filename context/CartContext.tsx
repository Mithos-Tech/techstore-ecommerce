
import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import type { Product } from '../types';
import { ToastContext } from './ToastContext';

interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

export const CartContext = createContext<CartContextType>({
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
});

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const localData = localStorage.getItem('cart');
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      console.error("Could not parse cart from localStorage", error);
      return [];
    }
  });

  const { showToast } = useContext(ToastContext);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      const stock = product.stock ?? 99;

      if (existingItem) {
        if (existingItem.quantity >= stock) {
          showToast('Stock máximo alcanzado para este producto', 'error');
          return prevCart;
        }
        showToast('Producto agregado al carrito ✓');
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      if (stock > 0) {
        showToast('Producto agregado al carrito ✓');
        return [...prevCart, { ...product, quantity: 1 }];
      } else {
        showToast('Este producto está agotado', 'error');
        return prevCart;
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    const itemInCart = cart.find(item => item.id === productId);
    const stock = itemInCart?.stock ?? 99;

    if (quantity > stock) {
      showToast('Stock máximo alcanzado', 'error');
      return;
    }

    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };
  
  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};