
import React, { createContext, useState, ReactNode } from 'react';

interface ToastMessage {
  message: string;
  type: 'success' | 'error';
}

interface ToastContextType {
  toast: ToastMessage | null;
  showToast: (message: string, type?: 'success' | 'error') => void;
}

export const ToastContext = createContext<ToastContextType>({
  toast: null,
  showToast: () => {},
});

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
        setToast(null);
    }, 3800);
  };

  return (
    <ToastContext.Provider value={{ toast, showToast }}>
      {children}
    </ToastContext.Provider>
  );
};