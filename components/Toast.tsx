
import React, { useContext } from 'react';
import { ToastContext } from '../context/ToastContext';
import { CheckIcon, XIcon } from './icons/Icons';

const Toast: React.FC = () => {
    const { toast } = useContext(ToastContext);

    if (!toast) {
        return null;
    }
    
    const isError = toast.type === 'error';

    return (
        <div 
            className={`fixed top-5 right-5 z-[100] flex items-center gap-4 p-4 rounded-xl shadow-2xl text-white animate-toast ${
                isError ? 'bg-red-500' : 'bg-navy-dark'
            }`}
            role="alert"
        >
            {isError ? (
                <div className="bg-red-600 p-1 rounded-full"><XIcon className="w-5 h-5"/></div>
            ) : (
                <div className="bg-green-500 p-1 rounded-full"><CheckIcon className="w-5 h-5"/></div>
            )}
            <p className="font-semibold">{toast.message}</p>
        </div>
    );
};

export default Toast;