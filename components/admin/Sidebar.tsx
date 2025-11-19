
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import { HomeIcon, PackageIcon, LogOutIcon, ShoppingBagIcon } from '../icons/Icons';

const Sidebar: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        if (auth) {
            await signOut(auth);
        }
        navigate('/admin/login');
    };

    const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
        `flex items-center px-6 py-4 text-sm font-semibold rounded-2xl transition-all duration-300 mx-4 mb-2 ${
            isActive 
            ? 'bg-blue-electric text-white shadow-lg shadow-blue-electric/30 translate-x-1' 
            : 'text-gray-500 hover:bg-blue-50 hover:text-blue-electric'
        }`;

    return (
        <aside className="flex flex-col w-72 bg-white border-r border-gray-100 h-full shadow-sm z-50">
            <div className="flex items-center justify-center h-24 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                    <div className="bg-blue-electric p-2 rounded-lg">
                        <img src="https://res.cloudinary.com/dkoshgzxo/image/upload/v1763264025/logo-main_cfhexg.svg" alt="TechStore Logo" className="h-6 w-auto filter brightness-0 invert" />
                    </div>
                    <span className="text-xl font-bold text-navy-dark tracking-tight">TechStore<span className="text-blue-electric">.Admin</span></span>
                </div>
            </div>
            
            <div className="flex-1 overflow-y-auto py-8">
                <div className="px-6 mb-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Principal</div>
                <nav>
                    <NavLink to="/admin" end className={navLinkClasses}>
                        <HomeIcon className="w-5 h-5 mr-3" />
                        Dashboard
                    </NavLink>
                    <NavLink to="/admin/products" className={navLinkClasses}>
                        <PackageIcon className="w-5 h-5 mr-3" />
                        Inventario
                    </NavLink>
                    <NavLink to="/admin/orders" className={navLinkClasses}>
                        <ShoppingBagIcon className="w-5 h-5 mr-3" />
                        Pedidos
                    </NavLink>
                </nav>
            </div>

            <div className="p-6 border-t border-gray-100">
                <button
                    onClick={handleLogout}
                    className="flex items-center justify-center w-full px-4 py-3 text-sm font-semibold text-red-500 bg-red-50 rounded-xl hover:bg-red-100 hover:shadow-md transition-all duration-200"
                >
                    <LogOutIcon className="w-5 h-5 mr-2" />
                    Cerrar Sesión
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
