import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import SEO from '../components/SEO';
import { OrderSuccessIcon } from '../components/icons/Icons';
import { getOrderById } from '../firebase';
import type { Order, OrderProduct } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';

const OrderConfirmationPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      setError('No se proporcionó un ID de orden válido.');
      return;
    }

    const fetchOrder = async () => {
      try {
        const fetchedOrder = await getOrderById(orderId);
        if (fetchedOrder) {
          setOrder(fetchedOrder);
        } else {
          setError('La orden no fue encontrada. Puede que el enlace sea incorrecto o la orden haya sido eliminada.');
        }
      } catch (err) {
        setError('Ocurrió un error al cargar los detalles de la orden.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <>
        <SEO title="Error en la Orden | TechStore" description="No se pudo encontrar la orden solicitada." />
        <div className="container mx-auto max-w-2xl px-6 py-24 text-center">
            <h1 className="text-3xl font-bold text-red-600">Error</h1>
            <p className="mt-4 text-gray-600">{error}</p>
            <Link to="/" className="btn-transition mt-8 inline-block bg-blue-electric text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:bg-navy-dark">
                Volver al Inicio
            </Link>
        </div>
      </>
    );
  }

  if (!order) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <SEO title={`Orden #${order.orderId} Confirmada | TechStore`} description="Tu pedido ha sido confirmado con éxito." />
      <div className="bg-gray-50/50">
        <div className="container mx-auto max-w-4xl px-6 py-16 md:py-24">
          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl text-center">
            <div className="flex justify-center mb-6">
                <OrderSuccessIcon className="w-20 h-20 text-green-500" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-navy-dark">¡Gracias por tu compra!</h1>
            <p className="mt-4 text-lg text-gray-600">Tu pedido ha sido confirmado con éxito.</p>
            <div className="mt-8 bg-lavender-light text-navy-dark font-bold text-xl md:text-2xl tracking-widest py-4 px-6 rounded-2xl inline-block">
                <span>N° DE ORDEN:</span>
                <span className="ml-2">{order.orderId}</span>
            </div>
            <p className="mt-6 text-gray-500">Recibirás un email de confirmación en <span className="font-semibold text-navy-dark">{order.customer.email}</span> con los detalles.</p>

            <div className="mt-12 text-left border-t pt-8 space-y-8">
                {/* Order Summary */}
                <div>
                    <h2 className="text-xl font-bold text-navy-dark mb-4">Resumen del Pedido</h2>
                    <div className="space-y-4">
                        {order.products.map((item: OrderProduct) => (
                            <div key={item.id} className="flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <img src={item.imageUrl} alt={item.name} className="w-14 h-14 rounded-lg object-cover" />
                                    <div>
                                        <p className="font-semibold">{item.name}</p>
                                        <p className="text-sm text-gray-500">S/{item.price.toFixed(2)} x {item.quantity}</p>
                                    </div>
                                </div>
                                <p className="font-semibold">S/{(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between font-bold text-lg mt-6 pt-4 border-t">
                        <span>Total Pagado:</span>
                        <span>S/{order.total.toFixed(2)}</span>
                    </div>
                </div>

                {/* Shipping Details */}
                <div>
                    <h2 className="text-xl font-bold text-navy-dark mb-4">Detalles de Entrega</h2>
                    <div className="bg-gray-50 p-6 rounded-2xl text-gray-700 space-y-2">
                        <p><span className="font-semibold">Cliente:</span> {order.customer.name}</p>
                        <p><span className="font-semibold">Método:</span> {order.shipping.method === 'delivery' ? 'Delivery a Domicilio' : 'Retiro en Tienda'}</p>
                        {order.shipping.method === 'delivery' && (
                            <p><span className="font-semibold">Dirección:</span> {order.shipping.address}, {order.shipping.district}</p>
                        )}
                        <p><span className="font-semibold">Pago:</span> {order.payment.method === 'contra-entrega' ? 'Contra Entrega' : 'Transferencia Bancaria'}</p>
                    </div>
                </div>
            </div>

            <div className="mt-12">
                <Link to="/search" className="btn-transition inline-block bg-blue-electric text-white font-semibold px-10 py-4 rounded-full text-lg shadow-lg hover:bg-navy-dark">
                    Seguir Comprando
                </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderConfirmationPage;
