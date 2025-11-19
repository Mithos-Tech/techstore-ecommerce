
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import SEO from '../components/SEO';
import { ArrowRightIcon, HomeIcon } from '../components/icons/Icons';

const AdminLoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      navigate('/admin');
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Este correo electrónico ya está en uso.');
      } else if (err.code === 'auth/weak-password') {
        setError('La contraseña debe tener al menos 6 caracteres.');
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
         setError('Credenciales incorrectas.');
      } else {
        setError('Ocurrió un error. Inténtalo de nuevo.');
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="Acceso Administrativo | TechStore" description="Panel de gestión para TechStore." />
      
      <div className="min-h-screen flex w-full bg-white">
        
        {/* Sección Visual (Izquierda) - Visible solo en Desktop */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-navy-dark overflow-hidden items-center justify-center text-white">
            {/* Fondo con gradiente y efectos */}
            <div className="absolute inset-0 bg-gradient-to-br from-navy-dark via-[#000380] to-blue-electric opacity-90 z-0"></div>
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-electric rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-accent rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
            
            {/* Contenido Visual */}
            <div className="relative z-10 p-12 max-w-lg text-center">
                <div className="mb-8 flex justify-center">
                   <img src="https://res.cloudinary.com/dkoshgzxo/image/upload/v1763264025/logo-main_cfhexg.svg" alt="TechStore Logo" className="h-20 w-auto brightness-0 invert drop-shadow-lg" />
                </div>
                <h2 className="text-4xl font-bold mb-4 tracking-tight">Panel de Control</h2>
                <p className="text-lg text-blue-100 leading-relaxed">
                    Gestiona tu inventario, supervisa pedidos y analiza el rendimiento de tu tienda en tiempo real.
                </p>
                
                {/* Tarjeta decorativa flotante */}
                <div className="mt-12 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl transform rotate-3 hover:rotate-0 transition-all duration-500 shadow-2xl">
                    <div className="flex items-center gap-4 mb-3">
                        <div className="w-10 h-10 rounded-full bg-green-400/20 flex items-center justify-center text-green-400">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                        </div>
                        <div className="text-left">
                            <p className="text-xs text-blue-200 uppercase tracking-wider">Ventas Hoy</p>
                            <p className="text-xl font-bold">+24% vs ayer</p>
                        </div>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-green-400 to-blue-400 w-3/4"></div>
                    </div>
                </div>
            </div>
        </div>

        {/* Sección Formulario (Derecha) */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 sm:p-12 relative">
            {/* Botón volver al inicio */}
            <Link to="/" className="absolute top-8 left-8 flex items-center text-gray-500 hover:text-blue-electric transition-colors text-sm font-medium group">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-2 group-hover:bg-blue-50 transition-colors">
                    <HomeIcon className="w-4 h-4" />
                </div>
                Volver a la tienda
            </Link>

            <div className="w-full max-w-md space-y-8">
                <div className="text-center lg:text-left">
                     <div className="lg:hidden flex justify-center mb-6">
                        <img src="https://res.cloudinary.com/dkoshgzxo/image/upload/v1763264025/logo-main_cfhexg.svg" alt="TechStore Logo" className="h-12 w-auto" />
                     </div>
                    <h1 className="text-3xl font-bold text-navy-dark tracking-tight">
                        {isLogin ? 'Bienvenido de nuevo' : 'Crear cuenta admin'}
                    </h1>
                    <p className="mt-2 text-gray-500">
                        {isLogin ? 'Ingresa tus credenciales para acceder.' : 'Registra un nuevo administrador para el sistema.'}
                    </p>
                </div>

                {/* Toggle Login/Register */}
                <div className="bg-gray-100 p-1.5 rounded-2xl flex relative">
                    <button
                        onClick={() => { setIsLogin(true); setError(null); }}
                        className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 relative z-10 ${
                            isLogin ? 'text-navy-dark shadow-sm' : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Iniciar Sesión
                    </button>
                    <button
                        onClick={() => { setIsLogin(false); setError(null); }}
                        className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 relative z-10 ${
                            !isLogin ? 'text-navy-dark shadow-sm' : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Registrarse
                    </button>
                    {/* Fondo blanco animado */}
                    <div className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white rounded-xl shadow-sm transition-transform duration-300 ease-out ${isLogin ? 'translate-x-0' : 'translate-x-full ml-1.5'}`}></div>
                </div>

                <form className="space-y-6 mt-8" onSubmit={handleSubmit}>
                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Email</label>
                            <input
                                type="email"
                                required
                                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-electric/20 focus:border-blue-electric focus:bg-white transition-all duration-200"
                                placeholder="admin@techstore.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Contraseña</label>
                            <input
                                type="password"
                                required
                                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-electric/20 focus:border-blue-electric focus:bg-white transition-all duration-200"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm animate-fade-in">
                             <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                             {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full group relative flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-2xl text-white bg-blue-electric hover:bg-navy-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 shadow-lg shadow-blue-electric/30 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                             <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        ) : (
                            <span className="flex items-center">
                                {isLogin ? 'Ingresar al Panel' : 'Registrar Administrador'}
                                <ArrowRightIcon className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </span>
                        )}
                    </button>
                </form>
                
                <div className="mt-6 text-center text-xs text-gray-400">
                    &copy; 2025 TechStore Admin Panel. Secured by Firebase.
                </div>
            </div>
        </div>
      </div>
    </>
  );
};

export default AdminLoginPage;
