
import React, { useState, useEffect } from 'react';
import { db, deleteOrder, updateOrderStatus } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import type { Order } from '../types';
import SEO from '../components/SEO';
import { SearchIcon, TrashIcon, ChevronRightIcon, UserIcon } from '../components/icons/Icons';

const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    if (!db) {
        setLoading(false);
        return;
    }

    const unsubscribe = onSnapshot(collection(db, 'ordenes'), (snapshot) => {
        const ordersData = snapshot.docs.map(doc => {
             const data = doc.data();
             return { 
                id: doc.id, 
                ...data,
                date: data.date && typeof data.date.toDate === 'function' ? data.date.toDate().toISOString() : new Date().toISOString()
             } as Order;
        });
        // Sort by date desc
        setOrders(ordersData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
      if (!db) return;
      try {
          await updateOrderStatus(orderId, newStatus);
      } catch (error) {
          alert("Error al actualizar el estado");
      }
  };

  const handleDelete = async (orderId: string) => {
      if (!db) return;
      if (window.confirm("¿Estás seguro de eliminar esta orden permanentemente?")) {
          try {
              await deleteOrder(orderId);
          } catch (error) {
              alert("Error al eliminar la orden");
          }
      }
  };

  const filteredOrders = orders.filter(o => 
      o.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
      switch(status) {
          case 'pendiente': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
          case 'en proceso': return 'bg-blue-100 text-blue-700 border-blue-200';
          case 'enviado': return 'bg-green-100 text-green-700 border-green-200';
          case 'cancelado': return 'bg-red-100 text-red-700 border-red-200';
          default: return 'bg-gray-100 text-gray-600';
      }
  };

  return (
    <>
      <SEO title="Gestión de Pedidos | Admin Panel" description="Administra y procesa las órdenes de compra." />
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
              <h1 className="text-3xl font-bold text-navy-dark tracking-tight">Gestión de Pedidos</h1>
              <p className="text-gray-500 mt-1">Supervisa el estado de las ventas</p>
          </div>
          <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Buscar orden, cliente..." 
                className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-electric/20 text-sm w-full md:w-72 bg-white shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white shadow-xl shadow-gray-100 rounded-[24px] overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">ID Orden</th>
                  <th className="px-6 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Cliente</th>
                  <th className="px-6 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Fecha</th>
                  <th className="px-6 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-5 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr><td colSpan={6} className="text-center py-12 text-gray-400">Cargando pedidos...</td></tr>
                ) : (
                  filteredOrders.length === 0 ? (
                      <tr><td colSpan={6} className="text-center py-12 text-gray-400">No se encontraron pedidos recientes.</td></tr>
                  ) : (
                      filteredOrders.map(order => (
                        <React.Fragment key={order.id}>
                            <tr className="group hover:bg-blue-50/30 transition-colors duration-200">
                                <td className="px-6 py-4">
                                    <div className="font-mono font-semibold text-gray-600 text-sm bg-gray-100 px-2 py-1 rounded-md inline-block">
                                        {order.orderId}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                                            <UserIcon className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-navy-dark text-sm">{order.customer.name}</div>
                                            <div className="text-xs text-gray-400">{order.customer.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {new Date(order.date).toLocaleDateString()} <span className="text-gray-400 text-xs">{new Date(order.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                </td>
                                <td className="px-6 py-4 font-bold text-navy-dark">
                                    S/{order.total.toFixed(2)}
                                </td>
                                <td className="px-6 py-4">
                                    <select 
                                        value={order.status} 
                                        onChange={(e) => handleStatusChange(order.id!, e.target.value)}
                                        className={`text-xs font-bold px-3 py-1.5 rounded-full border appearance-none cursor-pointer outline-none transition-colors ${getStatusColor(order.status)}`}
                                    >
                                        <option value="pendiente">Pendiente</option>
                                        <option value="en proceso">En Proceso</option>
                                        <option value="enviado">Enviado</option>
                                        <option value="cancelado">Cancelado</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <button 
                                        onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id!)}
                                        className="text-blue-electric hover:bg-blue-50 p-2 rounded-lg transition-colors"
                                        title="Ver detalles"
                                    >
                                        <ChevronRightIcon className={`w-5 h-5 transition-transform duration-300 ${expandedOrderId === order.id ? 'rotate-90' : ''}`} />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(order.id!)} 
                                        className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                        title="Eliminar"
                                    >
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                            {/* Expanded Details */}
                            {expandedOrderId === order.id && (
                                <tr className="bg-gray-50/50">
                                    <td colSpan={6} className="px-8 py-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
                                            <div>
                                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Productos</h4>
                                                <div className="space-y-3">
                                                    {order.products.map(p => (
                                                        <div key={p.id} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                                                            <img src={p.imageUrl} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                                                            <div className="flex-1">
                                                                <p className="text-sm font-semibold text-navy-dark line-clamp-1">{p.name}</p>
                                                                <p className="text-xs text-gray-500">Cant: {p.quantity} x S/{p.price}</p>
                                                            </div>
                                                            <p className="font-bold text-sm text-navy-dark">S/{(p.quantity * p.price).toFixed(2)}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Datos de Envío</h4>
                                                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-sm text-gray-700 space-y-2">
                                                    <div className="flex justify-between"><span className="text-gray-500">Teléfono:</span> <span>{order.customer.phone}</span></div>
                                                    <div className="flex justify-between"><span className="text-gray-500">Método:</span> <span className="font-medium">{order.shipping.method === 'delivery' ? 'Delivery' : 'Recojo'}</span></div>
                                                    {order.shipping.method === 'delivery' && (
                                                        <>
                                                            <div className="flex justify-between"><span className="text-gray-500">Dirección:</span> <span>{order.shipping.address}</span></div>
                                                            <div className="flex justify-between"><span className="text-gray-500">Distrito:</span> <span>{order.shipping.district}</span></div>
                                                            {order.shipping.reference && <div className="flex justify-between"><span className="text-gray-500">Ref:</span> <span>{order.shipping.reference}</span></div>}
                                                        </>
                                                    )}
                                                    <div className="border-t pt-2 mt-2 flex justify-between"><span className="text-gray-500">Pago:</span> <span className="capitalize">{order.payment.method}</span></div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                      ))
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminOrdersPage;
