
import React from 'react';

const Newsletter: React.FC = () => {

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    const emailInput = e.currentTarget.querySelector('input[type="email"]') as HTMLInputElement;
    if (emailInput && emailInput.value) {
        alert(`¡Gracias por suscribirte! Se ha enviado una confirmación a ${emailInput.value}.`);
        emailInput.value = '';
    } else {
        alert('Por favor, introduce un correo electrónico válido.');
    }
  };

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="bg-lavender-light rounded-3xl p-10 md:p-20 text-center relative overflow-hidden">
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-purple-accent/20 rounded-full"></div>
          <div className="absolute -bottom-16 -right-5 w-48 h-48 bg-blue-electric/10 rounded-full"></div>
          <h2 className="text-3xl md:text-4xl font-bold text-navy-dark">Recibe ofertas exclusivas</h2>
          <p className="mt-4 text-gray-600 max-w-lg mx-auto">
            Suscríbete a nuestro boletín y sé el primero en conocer nuestros nuevos productos, descuentos y guías de hardware.
          </p>
          <form className="mt-8 max-w-lg mx-auto flex flex-col sm:flex-row gap-4" onSubmit={handleSubscribe}>
            <input 
              type="email" 
              placeholder="tu@email.com" 
              className="w-full px-6 py-4 rounded-full border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-blue-electric"
              aria-label="Dirección de Email"
            />
            <button 
              type="submit" 
              className="px-8 py-4 bg-blue-electric text-white font-semibold rounded-full shadow-lg hover:bg-navy-dark transform hover:-translate-y-1 transition-all duration-300"
            >
              Suscribirse
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;