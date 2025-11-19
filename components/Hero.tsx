
import React from 'react';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {

  const handleScrollToOffers = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const offersSection = document.getElementById('oferta');
    if (offersSection) {
      offersSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero-bg relative py-24 md:py-32 overflow-hidden">
      <div className="container mx-auto max-w-7xl px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 bg-white text-navy-dark font-medium px-4 py-1.5 rounded-full border border-blue-electric/10 mb-6 shadow-sm relative overflow-hidden">
              <div className="shimmer-badge absolute inset-0"></div>
              <span className="relative z-10">✨ Nuevo Lanzamiento 2025</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-navy-dark leading-tight tracking-tighter">
              Domina el juego con <span className="text-gradient">Tecnología Pro</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Encuentra los componentes más avanzados para tu setup. Desde procesadores de última generación hasta periféricos de precisión milimétrica.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link to="/search" className="btn-primary-shine w-full sm:w-auto px-8 py-4 bg-blue-electric text-white font-semibold rounded-full hover:bg-navy-dark transform hover:-translate-y-1 transition-all duration-300 shadow-lg shadow-blue-electric/30 text-center">
                Explorar Catálogo
              </Link>
              <a 
                href="/#oferta" 
                onClick={handleScrollToOffers}
                className="w-full sm:w-auto px-8 py-4 text-navy-dark font-semibold rounded-full bg-white/80 backdrop-blur-sm border border-gray-200 hover:bg-gray-50 transform hover:-translate-y-1 transition-all duration-300 text-center">
                Ver Ofertas
              </a>
            </div>
          </div>

          {/* Image Display */}
          <div className="relative order-1 lg:order-2 flex items-center justify-center min-h-[300px] lg:min-h-[450px]">
             {/* Added width/height to prevent layout shift */}
             <img 
                src="https://res.cloudinary.com/dkoshgzxo/image/upload/v1763270090/hero_ikmpu8.png" 
                alt="Setup Gaming PC con periféricos RGB" 
                className="product-float w-full max-w-lg lg:max-w-2xl mx-auto h-auto object-contain z-10 relative"
                width="600"
                height="450"
                loading="eager" 
                decoding="async" 
                fetchPriority="high" 
              />
              {/* Decorative blob behind image */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-electric/5 rounded-full blur-3xl -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
