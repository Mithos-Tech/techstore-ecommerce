import React from 'react';
import { Link } from 'react-router-dom';

const FooterLink: React.FC<{href: string; children: React.ReactNode}> = ({ href, children }) => {
    return (
        <li>
            <Link to={href} className="text-white/90 hover:text-white hover:underline">{children}</Link>
        </li>
    );
}

const FooterLinkColumn: React.FC<{title: string, links: {name: string, href: string}[]}> = ({ title, links }) => (
    <div>
        <h4 className="font-semibold tracking-wider uppercase text-white/70">{title}</h4>
        <ul className="mt-4 space-y-3">
            {links.map(link => (
                <FooterLink key={link.name} href={link.href}>{link.name}</FooterLink>
            ))}
        </ul>
    </div>
);


const Footer: React.FC = () => {
  const shopLinks = [
      { name: 'Teclados', href: '/search?category=Teclados' },
      { name: 'Mouses', href: '/search?category=Mouses' },
      { name: 'Monitores', href: '/search?category=Monitores' },
      { name: 'Componentes', href: '/search?category=Componentes' },
  ];
  const companyLinks = [
      { name: 'Catálogo Completo', href: '/search' },
      { name: 'Ofertas', href: '/#oferta' },
      { name: 'Guías de Hardware', href: '/#guias' },
  ];
  const adminLinks = [
      { name: 'Panel de Control', href: '/admin' },
      { name: 'Términos y Condiciones', href: '/' },
      { name: 'Política de Privacidad', href: '/' },
  ];

  return (
    <footer id="contacto" className="bg-navy-dark text-white rounded-t-3xl">
      <div className="container mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          <div className="md:col-span-2 lg:col-span-2">
             <Link to="/" className="flex items-center space-x-3">
                <img src="https://res.cloudinary.com/dkoshgzxo/image/upload/v1763264025/logo-main_cfhexg.svg" alt="TechStore Logo" className="h-9 w-auto" />
                <span className="text-2xl font-bold text-white tracking-tighter">TechStore</span>
             </Link>
             <p className="mt-4 text-white/70">
                Vendiendo productos premium, diseñados para elevar tu experiencia de juego y productividad.
             </p>
          </div>
          <FooterLinkColumn title="Comprar" links={shopLinks} />
          <FooterLinkColumn title="Empresa" links={companyLinks} />
          <FooterLinkColumn title="Legal & Admin" links={adminLinks} />
        </div>
        <div className="mt-16 pt-8 border-t border-white/20 text-center text-white/60">
            <p>&copy; 2025 TechStore by <span className="font-semibold text-purple-accent">Inspyrio</span>. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;