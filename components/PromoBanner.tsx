
import React from 'react';
import { Link } from 'react-router-dom';

const PromoBanner: React.FC = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="bg-gradient-to-br from-navy-dark to-blue-electric text-white rounded-3xl p-10 md:p-20 flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-3/5 text-center md:text-left mb-8 md:mb-0">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Arma tu PC Gamer Ideal
            </h2>
            <p className="mt-4 text-lg text-white/80 max-w-lg">
              Nuestra herramienta de configuración valida la compatibilidad de cada componente para que construyas tu equipo perfecto sin preocupaciones.
            </p>
            <Link
              to="/search?q=Componentes"
              className="mt-8 inline-block bg-white text-navy-dark font-semibold px-8 py-4 rounded-full shadow-lg hover:bg-lavender-light transform hover:-translate-y-1 transition-all duration-300"
            >
              Comenzar Ahora
            </Link>
          </div>
          <div className="md:w-2/5 flex justify-center">
            <img 
              src="https://res.cloudinary.com/dkoshgzxo/image/upload/v1763615928/PC_Armado_m0brs0.jpg" 
              alt="PC Builder" 
              className="w-64 h-64 md:w-80 md:h-80 object-cover rounded-2xl shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
