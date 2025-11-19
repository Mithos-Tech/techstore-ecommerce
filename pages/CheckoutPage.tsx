
import React, { useState, useContext, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import SEO from '../components/SEO';
import { saveOrder } from '../firebase';
import type { Order } from '../types';
import { ChevronLeftIcon } from '../components/icons/Icons';

const CheckoutPage: React.FC = () => {
  const { cart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [deliveryMethod, setDeliveryMethod] = useState('delivery');
  const [paymentMethod, setPaymentMethod] = useState('contra-entrega');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    district: '',
    reference: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = useMemo(() => cart.reduce((total, item) => total + item.price * item.quantity, 0), [cart]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = 'El nombre completo es requerido.';
    
    if (!formData.email.trim()) {
        newErrors.email = 'El correo electrónico es requerido.';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
        newErrors.email = 'El formato del correo es inválido.';
    }
    
    if (!formData.phone.trim()) {
        newErrors.phone = 'El teléfono es requerido.';
    } else if (!/^\d{9}$/.test(formData.phone.replace(/\s/g, ''))) {
        newErrors.phone = 'El teléfono debe contener 9 dígitos.';
    }

    if (deliveryMethod === 'delivery') {
        if (!formData.address.trim()) newErrors.address = 'La dirección es requerida.';
        if (!formData.district.trim()) newErrors.district = 'El distrito es requerido.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || cart.length === 0 || isSubmitting) return;

    setIsSubmitting(true);

    const orderData: Omit<Order, 'id' | 'date'> = {
        orderId: `ORD-${Date.now()}`,
        products: cart.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            imageUrl: item.imageUrl,
        })),
        customer: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
        },
        shipping: {
            method: deliveryMethod as 'delivery' | 'pickup',
            address: deliveryMethod === 'delivery' ? formData.address : undefined,
            district: deliveryMethod === 'delivery' ? formData.district : undefined,
            reference: deliveryMethod === 'delivery' ? formData.reference : undefined,
        },
        payment: {
            method: paymentMethod as 'contra-entrega' | 'transferencia',
            amount: subtotal,
        },
        status: 'pendiente',
        total: subtotal,
    };

    try {
        const docId = await saveOrder(orderData);
        clearCart();
        navigate(`/order-confirmation/${docId}`);
    } catch (error) {
        console.error("Failed to submit order:", error);
        alert("Hubo un error al procesar tu pedido. Por favor, inténtalo de nuevo.");
        setIsSubmitting(false);
    }
  };
  
  const formInputClass = "w-full px-5 py-3 border bg-white text-gray-900 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-electric/50 transition";

  return (
    <>
      <SEO title="Finalizar Compra | TechStore" description="Completa tus datos para finalizar tu pedido en TechStore." />
      <div className="bg-gray-50/50 min-h-screen">
        <div className="container mx-auto max-w-7xl px-6 py-10 md:py-16">
          
          {/* Back Button */}
          <Link to="/carrito" className="inline-flex items-center text-gray-500 hover:text-navy-dark transition-colors mb-8 group">
            <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center mr-3 shadow-sm group-hover:border-blue-electric group-hover:text-blue-electric transition-all">
                <ChevronLeftIcon className="w-5 h-5" />
            </div>
            <span className="font-medium text-lg">Volver al Carrito</span>
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold text-navy-dark mb-10 text-center lg:text-left">Finalizar Compra</h1>
          
          <form onSubmit={handleSubmit} noValidate>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
              
              {/* Form Section */}
              <div className="lg:col-span-2 bg-white p-8 md:p-10 rounded-[2rem] shadow-xl shadow-gray-100/50 border border-gray-100 space-y-10">
                <div>
                  <h2 className="text-2xl font-bold text-navy-dark mb-6 flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-electric text-white text-sm">1</span>
                    Datos de Contacto
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                        <input type="text" name="name" placeholder="Nombre completo *" required className={`${formInputClass} ${errors.name ? 'border-red-500' : 'border-gray-200'}`} value={formData.name} onChange={handleInputChange} />
                        {errors.name && <p className="text-red-500 text-xs mt-1 ml-4">{errors.name}</p>}
                    </div>
                    <div>
                        <input type="email" name="email" placeholder="Correo electrónico *" required className={`${formInputClass} ${errors.email ? 'border-red-500' : 'border-gray-200'}`} value={formData.email} onChange={handleInputChange} />
                        {errors.email && <p className="text-red-500 text-xs mt-1 ml-4">{errors.email}</p>}
                    </div>
                    <div className="md:col-span-2">
                        <input type="tel" name="phone" placeholder="Teléfono (9 dígitos) *" required className={`${formInputClass} ${errors.phone ? 'border-red-500' : 'border-gray-200'}`} value={formData.phone} onChange={handleInputChange} />
                        {errors.phone && <p className="text-red-500 text-xs mt-1 ml-4">{errors.phone}</p>}
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-8">
                    <h2 className="text-2xl font-bold text-navy-dark mb-6 flex items-center gap-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-electric text-white text-sm">2</span>
                        Método de Entrega
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <label className={`group flex items-center p-5 border-2 rounded-2xl cursor-pointer transition-all duration-300 ${deliveryMethod === 'delivery' ? 'border-blue-electric bg-blue-50/50' : 'border-gray-100 hover:border-blue-electric/30'}`}>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 ${deliveryMethod === 'delivery' ? 'border-blue-electric' : 'border-gray-300'}`}>
                                {deliveryMethod === 'delivery' && <div className="w-2.5 h-2.5 rounded-full bg-blue-electric" />}
                            </div>
                            <input type="radio" name="deliveryMethod" value="delivery" checked={deliveryMethod === 'delivery'} onChange={(e) => setDeliveryMethod(e.target.value)} className="hidden" />
                            <span className={`font-semibold ${deliveryMethod === 'delivery' ? 'text-blue-electric' : 'text-gray-600'}`}>Delivery a Domicilio</span>
                        </label>
                        <label className={`group flex items-center p-5 border-2 rounded-2xl cursor-pointer transition-all duration-300 ${deliveryMethod === 'pickup' ? 'border-blue-electric bg-blue-50/50' : 'border-gray-100 hover:border-blue-electric/30'}`}>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 ${deliveryMethod === 'pickup' ? 'border-blue-electric' : 'border-gray-300'}`}>
                                {deliveryMethod === 'pickup' && <div className="w-2.5 h-2.5 rounded-full bg-blue-electric" />}
                            </div>
                            <input type="radio" name="deliveryMethod" value="pickup" checked={deliveryMethod === 'pickup'} onChange={(e) => setDeliveryMethod(e.target.value)} className="hidden" />
                            <span className={`font-semibold ${deliveryMethod === 'pickup' ? 'text-blue-electric' : 'text-gray-600'}`}>Retiro en Tienda</span>
                        </label>
                    </div>
                </div>

                {deliveryMethod === 'delivery' && (
                    <div className="animate-slide-in-down">
                        <div className="space-y-4 pl-11">
                            <input type="text" name="address" placeholder="Dirección *" required className={`${formInputClass} ${errors.address ? 'border-red-500' : 'border-gray-200'}`} value={formData.address} onChange={handleInputChange} />
                            {errors.address && <p className="text-red-500 text-xs mt-1 ml-4">{errors.address}</p>}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <input type="text" name="district" placeholder="Distrito *" required className={`${formInputClass} ${errors.district ? 'border-red-500' : 'border-gray-200'}`} value={formData.district} onChange={handleInputChange} />
                                    {errors.district && <p className="text-red-500 text-xs mt-1 ml-4">{errors.district}</p>}
                                </div>
                                <input type="text" name="reference" placeholder="Referencia (opcional)" className={`${formInputClass} border-gray-200`} value={formData.reference} onChange={handleInputChange} />
                            </div>
                        </div>
                    </div>
                )}

                 <div className="border-t border-gray-100 pt-8">
                    <h2 className="text-2xl font-bold text-navy-dark mb-6 flex items-center gap-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-electric text-white text-sm">3</span>
                        Método de Pago
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <label className={`group flex items-center p-5 border-2 rounded-2xl cursor-pointer transition-all duration-300 ${paymentMethod === 'contra-entrega' ? 'border-blue-electric bg-blue-50/50' : 'border-gray-100 hover:border-blue-electric/30'}`}>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 ${paymentMethod === 'contra-entrega' ? 'border-blue-electric' : 'border-gray-300'}`}>
                                {paymentMethod === 'contra-entrega' && <div className="w-2.5 h-2.5 rounded-full bg-blue-electric" />}
                            </div>
                            <input type="radio" name="paymentMethod" value="contra-entrega" checked={paymentMethod === 'contra-entrega'} onChange={(e) => setPaymentMethod(e.target.value)} className="hidden" />
                            <span className={`font-semibold ${paymentMethod === 'contra-entrega' ? 'text-blue-electric' : 'text-gray-600'}`}>Contra Entrega</span>
                        </label>
                        <label className={`group flex items-center p-5 border-2 rounded-2xl cursor-pointer transition-all duration-300 ${paymentMethod === 'transferencia' ? 'border-blue-electric bg-blue-50/50' : 'border-gray-100 hover:border-blue-electric/30'}`}>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 ${paymentMethod === 'transferencia' ? 'border-blue-electric' : 'border-gray-300'}`}>
                                {paymentMethod === 'transferencia' && <div className="w-2.5 h-2.5 rounded-full bg-blue-electric" />}
                            </div>
                            <input type="radio" name="paymentMethod" value="transferencia" checked={paymentMethod === 'transferencia'} onChange={(e) => setPaymentMethod(e.target.value)} className="hidden" />
                            <span className={`font-semibold ${paymentMethod === 'transferencia' ? 'text-blue-electric' : 'text-gray-600'}`}>Transferencia</span>
                        </label>
                    </div>
                     {paymentMethod === 'transferencia' && (
                        <div className="mt-4 ml-11 p-6 bg-gray-50 rounded-2xl text-sm text-gray-700 space-y-2 border border-gray-200">
                            <p className="font-bold text-navy-dark text-base mb-2">Datos para la transferencia:</p>
                            <div className="flex justify-between border-b border-gray-200 pb-2">
                                <span className="font-medium">Banco:</span>
                                <span>BCP</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-200 pb-2">
                                <span className="font-medium">Cuenta Corriente:</span>
                                <span className="font-mono">193-4567890-1-23</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-200 pb-2">
                                <span className="font-medium">Titular:</span>
                                <span>TechStore S.A.C.</span>
                            </div>
                            <p className="mt-2 text-xs text-gray-500 italic pt-2">Recuerda enviar tu comprobante a nuestro WhatsApp o correo de ventas una vez realizado el pedido.</p>
                        </div>
                    )}
                </div>
              </div>

              {/* Summary Section */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-100/50 border border-gray-100 p-8 sticky top-28">
                  <h2 className="text-2xl font-bold text-navy-dark mb-6">Resumen</h2>
                  <div className="space-y-4 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                    {cart.map(item => (
                        <div key={item.id} className="flex justify-between items-start group">
                            <div className="flex items-start gap-4">
                                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <p className="font-semibold text-navy-dark leading-tight line-clamp-2 text-sm">{item.name}</p>
                                    <p className="text-xs text-gray-500 mt-1">Cant: {item.quantity}</p>
                                </div>
                            </div>
                            <p className="font-bold text-navy-dark text-sm whitespace-nowrap">S/{(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
                     <div className="flex justify-between text-gray-600">
                        <span>Subtotal</span>
                        <span>S/{subtotal.toFixed(2)}</span>
                     </div>
                     <div className="flex justify-between text-gray-600">
                        <span>Envío</span>
                        <span className="text-green-600 font-semibold">Gratis</span>
                     </div>
                  </div>
                  <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200">
                    <span className="text-lg font-bold text-navy-dark">Total</span>
                    <span className="text-2xl font-extrabold text-blue-electric">S/{subtotal.toFixed(2)}</span>
                  </div>
                  <button type="submit" className="btn-primary-shine mt-8 w-full h-14 bg-blue-electric text-white font-bold rounded-full text-lg shadow-lg shadow-blue-electric/30 hover:bg-navy-dark transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none" disabled={cart.length === 0 || isSubmitting}>
                    {isSubmitting ? (
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Procesando...</span>
                        </div>
                    ) : (
                        'Confirmar Pedido'
                    )}
                  </button>
                  <p className="text-xs text-center text-gray-400 mt-4">Tus datos están protegidos y encriptados.</p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;
