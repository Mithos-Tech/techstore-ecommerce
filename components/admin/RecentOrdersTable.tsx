import React from 'react';
import type { Order } from '../../types';
import { ArrowRightIcon } from '../icons/Icons';

interface RecentOrdersTableProps {
    orders: Order[];
}

const statusStyles: { [key: string]: string } = {
    pendiente: 'bg-yellow-100 text-yellow-800',
    'en proceso': 'bg-blue-100 text-blue-800',
    enviado: 'bg-green-100 text-green-800',
    cancelado: 'bg-red-100 text-red-800',
};

const RecentOrdersTable: React.FC<RecentOrdersTableProps> = ({ orders }) => {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-navy-dark">Órdenes Recientes</h3>
                <button className="text-sm font-semibold text-blue-electric hover:underline flex items-center gap-1">
                    Ver Todas <ArrowRightIcon className="w-4 h-4" />
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Orden ID</th>
                            <th scope="col" className="px-6 py-3">Cliente</th>
                            <th scope="col" className="px-6 py-3">Total</th>
                            <th scope="col" className="px-6 py-3">Estado</th>
                            <th scope="col" className="px-6 py-3">Fecha</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.slice(0, 5).map((order) => (
                            <tr key={order.id} className="bg-white border-b hover:bg-gray-50">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{order.orderId}</th>
                                <td className="px-6 py-4">{order.customer.name}</td>
                                <td className="px-6 py-4 font-semibold">S/{order.total.toFixed(2)}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 font-semibold leading-tight rounded-full text-xs capitalize ${statusStyles[order.status]}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">{new Date(order.date).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecentOrdersTable;
