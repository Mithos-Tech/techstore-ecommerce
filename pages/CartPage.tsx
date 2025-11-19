
import React, { useContext, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { ToastContext } from '../context/ToastContext';
import { PlusIcon, MinusIcon, TrashIcon, CheckIcon, EmptyCartIcon } from '../components/icons/Icons';
import SEO from '../components/SEO';

const FREE_SHIPPING_THRESHOLD = 199;

const CartPage: React.FC = () => {
    const { cart, removeFromCart, updateQuantity, clearCart } = useContext(CartContext);
    const { showToast } = useContext(ToastContext);
    const navigate = useNavigate();
    const [removingItemId, setRemovingItemId] = useState<string | null>(null);
    const [bouncingItemId, setBouncingItemId] = useState<string | null>(null);

    const subtotal = useMemo(() => cart.reduce((total, item) => total + item.price * item.quantity, 0), [cart]);
    const shippingProgress = useMemo(() => Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100), [subtotal]);
    const remainingForFreeShipping = useMemo(() => FREE_SHIPPING_THRESHOLD - subtotal, [subtotal]);

    const handleCheckout = () => {
        if (cart.length > 0) {
            navigate('/checkout');
        }
    };
    
    const handleClearCart = () => {
        if (window.confirm('¿Estás seguro de que quieres vaciar todo el carrito?')) {
            clearCart();
            showToast('Carrito vaciado exitosamente');
        }
    };

    const handleRemove = (id: string) => {
        setRemovingItemId(id);
        setTimeout(() => {
            removeFromCart(id);
            setRemovingItemId(null);
        }, 500); // Match animation duration
    };

    const handleUpdateQuantity = (id: string, newQuantity: number) => {
        const item = cart.find(p => p.id === id);
        if (item && newQuantity > (item.stock ?? 99)) {
            showToast('Stock máximo alcanzado', 'error');
            return;
        }
        updateQuantity(id, newQuantity);
        if (item && newQuantity > item.quantity) {
             setBouncingItemId(id);
             setTimeout(() => setBouncingItemId(null), 300); // Match animation duration
        }
    };

    if (cart.length === 0) {
        return (
            <>
                <SEO title="Tu Carrito está Vacío | TechStore" description="Añade productos a tu carrito para continuar con la compra." />
                <div className="container mx-auto max-w-4xl px-6 py-24 text-center flex flex-col items-center">
                    <EmptyCartIcon className="w-40 h-40 text-gray-300" />
                    <h1 className="mt-8 text-3xl font-bold text-navy-dark">Tu carrito está vacío</h1>
                    <p className="mt-4 text-gray-600">Parece que aún no has añadido ningún producto.</p>
                    <Link to="/search" className="btn-transition mt-8 inline-block bg-blue-electric text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:bg-navy-dark">
                        Explorar Productos
                    </Link>
                </div>
            </>
        );
    }

    return (
        <>
            <SEO title="Tu Carrito de Compras | TechStore" description="Revisa y finaliza tu pedido en TechStore." />
            <div className="bg-gray-50">
                <div className="container mx-auto max-w-7xl px-6 py-16 md:py-24">
                    <div className="flex justify-between items-center mb-12">
                        <h1 className="text-3xl md:text-4xl font-bold text-navy-dark">Tu Carrito</h1>
                        <button 
                            type="button"
                            onClick={handleClearCart}
                            className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 font-semibold transition-colors duration-300"
                        >
                            <TrashIcon className="w-5 h-5 pointer-events-none" />
                            Vaciar Carrito
                        </button>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                        <div className="lg:col-span-2 bg-white rounded-3xl shadow-lg p-6 lg:p-8">
                            <div className="space-y-8">
                                {cart.map(item => (
                                    <div key={item.id} className={`grid grid-cols-12 gap-4 items-center transition-all duration-500 ${removingItemId === item.id ? 'animate-fade-out-right' : 'animate-slide-in-down'}`}>
                                        <div className="col-span-3 sm:col-span-2">
                                            <Link to={`/producto/${item.id}`}><img src={item.imageUrl} alt={item.name} className="w-full h-auto object-cover rounded-2xl aspect-square" loading="lazy" decoding="async"/></Link>
                                        </div>
                                        <div className="col-span-9 sm:col-span-5">
                                            <Link to={`/producto/${item.id}`} className="hover:underline"><h3 className="font-semibold text-lg text-navy-dark">{item.name}</h3></Link>
                                            <p className="text-gray-500 text-sm">{item.category}</p>
                                        </div>
                                        <div className="col-span-6 sm:col-span-3 flex items-center justify-start sm:justify-center">
                                            <div className="flex items-center border border-gray-200 rounded-full">
                                                <button onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)} className="p-2 text-gray-500 hover:text-navy-dark transition-colors disabled:opacity-50" aria-label="Disminuir cantidad" disabled={item.quantity <= 1}><MinusIcon className="w-4 h-4" /></button>
                                                <span className={`px-3 text-lg font-medium w-12 text-center ${bouncingItemId === item.id ? 'animate-subtle-bounce' : ''}`}>{item.quantity}</span>
                                                <button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)} className="p-2 text-gray-500 hover:text-navy-dark transition-colors disabled:opacity-50" aria-label="Aumentar cantidad" disabled={item.quantity >= (item.stock ?? 99)}><PlusIcon className="w-4 h-4" /></button>
                                            </div>
                                        </div>
                                        <div className="col-span-6 sm:col-span-2 flex items-center justify-end space-x-2">
                                            <p className="text-lg font-bold text-navy-dark">S/{(item.price * item.quantity).toFixed(2)}</p>
                                            <button onClick={() => handleRemove(item.id)} className="p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors" aria-label="Eliminar producto"><TrashIcon className="w-5 h-5"/></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-3xl shadow-lg p-8 sticky top-28">
                                <h2 className="text-2xl font-bold text-navy-dark">Resumen del Pedido</h2>
                                <div className="mt-6 space-y-4">
                                    <div className="flex justify-between items-center text-gray-600"><span>Subtotal</span><span>S/{subtotal.toFixed(2)}</span></div>
                                    <div className="flex justify-between items-center text-gray-600"><span>Envío</span><span className="font-semibold text-green-600">Gratis</span></div>
                                    <div className="mt-4 border-t pt-4">
                                      {remainingForFreeShipping > 0 ? (
                                        <div className="text-center text-sm text-gray-600">
                                          <p>¡Te faltan <span className="font-bold text-navy-dark">S/{remainingForFreeShipping.toFixed(2)}</span> para el envío gratis!</p>
                                          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2 overflow-hidden"><div className="bg-green-500 h-2.5 rounded-full transition-all duration-500" style={{width: `${shippingProgress}%`}}></div></div>
                                        </div>
                                      ) : (
                                        <div className="flex items-center justify-center gap-2 bg-green-100 text-green-800 font-semibold p-2 rounded-lg">
                                          <CheckIcon className="w-5 h-5" /><span>¡Tienes envío gratis!</span>
                                        </div>
                                      )}
                                    </div>
                                </div>
                                <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200">
                                    <span className="text-lg font-semibold text-navy-dark">Total</span>
                                    <span className="text-xl font-bold text-navy-dark">S/{subtotal.toFixed(2)}</span>
                                </div>
                                <button onClick={handleCheckout} className="btn-transition mt-8 w-full h-14 bg-gradient-to-br from-blue-electric to-indigo-600 text-white font-semibold rounded-full text-lg shadow-lg hover:shadow-xl shadow-blue-electric/30 disabled:opacity-50 disabled:cursor-not-allowed" disabled={cart.length === 0}>
                                    Proceder al Pago
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CartPage;
