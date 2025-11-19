
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../components/Hero';
import CategoryGrid from '../components/CategoryGrid';
import PromoBanner from '../components/PromoBanner';
import Bestsellers from '../components/Bestsellers';
import LifestyleBanner from '../components/LifestyleBanner';
import FeaturedProducts from '../components/FeaturedProducts';
import TrustBadges from '../components/TrustBadges';
import Newsletter from '../components/Newsletter';
import Articles from '../components/Articles';
import SEO from '../components/SEO';

const HomePage: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.substring(1); // Eliminar el '#'
      // Usar un timeout para asegurar que el elemento esté renderizado antes de desplazarse
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 0);
    }
  }, [location]);

  return (
    <>
      <SEO 
        title="TechStore - Componentes y Periféricos Gaming de Alta Calidad"
        description="Arma tu setup ideal con los mejores componentes y periféricos del mercado. Rendimiento, diseño y durabilidad para llevar tu experiencia de juego al siguiente nivel."
      />
      <section id="inicio">
        <Hero />
      </section>
      <section id="categoria">
        <CategoryGrid />
      </section>
      <section id="oferta">
        <PromoBanner />
      </section>
      <Bestsellers />
      <LifestyleBanner />
      <section id="productos">
        <FeaturedProducts />
      </section>
      <TrustBadges />
      <Newsletter />
      <section id="guias">
        <Articles />
      </section>
    </>
  );
};

export default HomePage;
