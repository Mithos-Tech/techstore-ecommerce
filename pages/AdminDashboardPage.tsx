
import React, { useState, useEffect } from 'react';
import SEO from '../components/SEO';
import StatCard from '../components/admin/StatCard';
import SalesChart from '../components/admin/SalesChart';
import RecentOrdersTable from '../components/admin/RecentOrdersTable';
import { useFirebaseData } from '../hooks/useFirebaseData';
import { getOrders } from '../firebase';
import type { Product, Order } from '../types';
import { ShoppingCartIcon, PackageIcon, ShoppingBagIcon } from '../components/icons/Icons';

const AdminDashboardPage: React.FC = () => {
    const { data: products, loading: productsLoading } = useFirebaseData<Product>('productos');
    const [orders, setOrders] = useState<Order[]>([]);
    const [ordersLoading, setOrdersLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            setOrdersLoading(true);
            const fetchedOrders = await getOrders();
            setOrders(fetchedOrders);
            setOrdersLoading(false);
        };
        fetchOrders();
    }, []);

    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    const totalProducts = products.length;

    if (productsLoading || ordersLoading) {
        return (
            <div className="flex items-center justify-center h-full text-navy-dark font-medium">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-8 w-8 bg-blue-electric rounded-full mb-2"></div>
                    Cargando dashboard...
                </div>
            </div>
        );
    }

    return (
        <>
            <SEO title="Dashboard | Admin Panel" description="Visión general de la tienda TechStore." />
            <div className="space-y-10 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h1 className="text-3xl font-bold text-navy-dark tracking-tight">Dashboard General</h1>
                    <span className="text-sm text-gray-500 font-medium bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
                        Última actualización: {new Date().toLocaleTimeString()}
                    </span>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    <StatCard 
                        title="Ingresos Totales" 
                        value={`S/${totalRevenue.toFixed(2)}`} 
                        icon={ShoppingCartIcon}
                        colorClass="bg-blue-electric" // Changed to match modified StatCard logic if needed, or keep as bg-
                    />
                    <StatCard 
                        title="Órdenes Totales" 
                        value={totalOrders} 
                        icon={ShoppingBagIcon}
                        colorClass="bg-purple-accent"
                    />
                    <StatCard 
                        title="Inventario Activo" 
                        value={totalProducts} 
                        icon={PackageIcon}
                        colorClass="bg-green-500"
                    />
                </div>

                {/* Charts and Tables */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 h-full">
                        <SalesChart orders={orders} />
                    </div>
                    <div className="lg:col-span-3">
                        <RecentOrdersTable orders={orders} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminDashboardPage;
