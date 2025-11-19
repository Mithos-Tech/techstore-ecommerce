import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { MenuIcon, XIcon } from '../icons/Icons';

const AdminLayout: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar for desktop */}
            <div className="hidden lg:flex lg:flex-shrink-0">
                <Sidebar />
            </div>

            {/* Mobile sidebar */}
            <div className={`fixed inset-0 z-50 flex transition-transform duration-300 ease-in-out lg:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <Sidebar />
                <div className="flex-shrink-0 w-14" aria-hidden="true" onClick={() => setIsSidebarOpen(false)}>
                    {/* Dummy element to close sidebar on outside click */}
                </div>
            </div>

            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Mobile header */}
                <header className="relative z-40 flex-shrink-0 flex h-16 bg-white shadow-md lg:hidden">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-electric"
                        aria-label="Open sidebar"
                    >
                       <MenuIcon className="h-6 w-6" />
                    </button>
                    <div className="flex-1 px-4 flex justify-between items-center">
                       <h1 className="text-xl font-bold text-navy-dark">Admin Panel</h1>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-6 md:p-10">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
