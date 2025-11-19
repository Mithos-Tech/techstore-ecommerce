import React from 'react';
import type { Order } from '../../types';

interface SalesChartProps {
    orders: Order[];
}

const SalesChart: React.FC<SalesChartProps> = ({ orders }) => {
    // Basic data aggregation for the last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toISOString().split('T')[0];
    }).reverse();

    const salesData = last7Days.map(date => {
        const dailySales = orders
            .filter(order => order.date.startsWith(date))
            .reduce((sum, order) => sum + order.total, 0);
        return { date, sales: dailySales };
    });

    const maxSales = Math.max(...salesData.map(d => d.sales), 1); // Avoid division by zero

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg h-full">
            <h3 className="text-xl font-bold text-navy-dark mb-4">Ventas (Últimos 7 Días)</h3>
            <div className="flex justify-between items-end h-64 space-x-2">
                {salesData.map(({ date, sales }) => (
                    <div key={date} className="flex-1 flex flex-col items-center justify-end group">
                        <div 
                            className="w-full bg-blue-electric/20 rounded-t-lg transition-all duration-300 hover:bg-blue-electric" 
                            style={{ height: `${(sales / maxSales) * 100}%` }}
                        >
                            <div className="opacity-0 group-hover:opacity-100 bg-navy-dark text-white text-xs rounded py-1 px-2 relative -top-8 mx-auto w-max">
                                S/{sales.toFixed(0)}
                            </div>
                        </div>
                        <span className="text-xs text-gray-500 mt-2">{new Date(date).getDate()}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SalesChart;
