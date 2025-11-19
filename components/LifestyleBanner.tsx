
import React from 'react';
import { Link } from 'react-router-dom';

const LifestyleBanner: React.FC = () => {
    return (
        <section className="py-16 md:py-24 bg-gray-50">
            <div className="container mx-auto max-w-7xl px-6">
                <div className="flex flex-col md:flex-row items-center bg-white rounded-3xl overflow-hidden shadow-sm">
                    <div className="w-full md:w-1/2">
                        <img src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80" alt="Lifestyle Gaming Setup" className="w-full h-full object-cover min-h-[300px] md:min-h-[500px]" loading="lazy" decoding="async" />
                    </div>
                    <div className="w-full md:w-1/2 p-10 md:p-16 text-center md:text-left">
                        <h2 className="text-3xl md:text-4xl font-bold text-navy-dark">
                            Componentes de Calidad Premium
                        </h2>
                        <p className="mt-4 text-gray-600">
                            Trabajamos con las mejores marcas y materiales para garantizar un rendimiento excepcional y una durabilidad que soporte las sesiones de juego más intensas.
                        </p>
                        <Link to="/search" className="mt-8 inline-block bg-blue-electric text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:bg-navy-dark transform hover:-translate-y-1 transition-all duration-300">
                            Ver Marcas
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LifestyleBanner;
