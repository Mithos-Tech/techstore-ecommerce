
import { TrustBadge, Category, Product, Article } from './types';
import { TruckIcon, ShieldCheckIcon, SupportIcon } from './components/icons/Icons';

export const TRUST_BADGES_DATA: TrustBadge[] = [
  {
    icon: TruckIcon,
    title: 'Envío gratis en 24h',
    subtitle: 'En pedidos superiores a S/99',
  },
  {
    icon: ShieldCheckIcon,
    title: '30 días de garantía',
    subtitle: 'Devoluciones sin preguntas',
  },
  {
    icon: SupportIcon,
    title: 'Soporte técnico incluido',
    subtitle: 'Expertos a tu disposición',
  },
];

export const CATEGORIES_DATA: Category[] = [
    { 
        id: '1', 
        name: 'Teclados Mecánicos', 
        description: 'Switches Cherry & Gateron', 
        imageUrl: 'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?auto=format&fit=crop&w=800&q=80' 
    },
    { 
        id: '2', 
        name: 'Mouses Gaming', 
        description: 'Precisión óptica', 
        imageUrl: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80' 
    },
    { 
        id: '3', 
        name: 'Monitores', 
        description: '144Hz - 240Hz', 
        imageUrl: 'https://images.unsplash.com/photo-1616763355548-1b606f439f86?auto=format&fit=crop&w=800&q=80' 
    },
    { 
        id: '5', 
        name: 'Audio Inmersivo', 
        description: 'Headsets 7.1', 
        imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80' 
    },
    { 
        id: '4', 
        name: 'Componentes PC', 
        description: 'GPU, CPU y RAM', 
        imageUrl: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=800&q=80' 
    },
];

export const PRODUCTS_DATA: Product[] = [
    { 
        id: 'p1', 
        name: 'Teclado Mecánico RGB Pro', 
        category: 'Teclados', 
        price: 249.99, 
        originalPrice: 299.99, 
        discount: '-17%', 
        imageUrl: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80', 
        inStock: true, 
        rating: 5, 
        stock: 10, 
        description: 'Un teclado mecánico de alto rendimiento con switches personalizables, iluminación RGB y un diseño de aluminio robusto.' 
    },
    { 
        id: 'p2', 
        name: 'Mouse Gaming Ultraligero', 
        category: 'Mouses', 
        price: 129.50, 
        originalPrice: 149.50, 
        discount: 'S/20 OFF', 
        imageUrl: 'https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=800&q=80', 
        inStock: true, 
        rating: 4.8, 
        stock: 15, 
        description: 'Diseñado para la velocidad y la precisión, este mouse ultraligero cuenta con un sensor óptico de alta precisión y un diseño ergonómico.' 
    },
    { 
        id: 'p3', 
        name: 'Monitor Gamer 27" 165Hz', 
        category: 'Monitores', 
        price: 1299.00, 
        imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80', 
        inStock: false, 
        rating: 4.9, 
        stock: 0, 
        description: 'Sumérgete en la acción con este monitor QHD de 27 pulgadas. Con una tasa de refresco de 165Hz y tecnología IPS para colores vibrantes.' 
    },
    { 
        id: 'p4', 
        name: 'Memoria RAM 32GB RGB', 
        category: 'Componentes', 
        price: 389.90, 
        imageUrl: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=800&q=80', 
        inStock: true, 
        rating: 4.7, 
        stock: 20, 
        description: 'Aumenta el rendimiento de tu PC con 32GB de memoria RAM DDR4 de alta velocidad, perfecta para gaming y multitarea.' 
    },
    { 
        id: 'p5', 
        name: 'SSD 1TB NVMe Gen4', 
        category: 'Componentes', 
        price: 359.00, 
        originalPrice: 399.00, 
        discount: '-10%', 
        imageUrl: 'https://images.unsplash.com/photo-1628557044797-f21a177c37ec?auto=format&fit=crop&w=800&q=80', 
        inStock: true, 
        rating: 5, 
        stock: 8, 
        description: 'Reduce los tiempos de carga a cero con este SSD NVMe de 1TB. Velocidades de lectura y escritura ultrarrápidas para un rendimiento superior.' 
    },
    { 
        id: 'p6', 
        name: 'Headset Wireless 7.1', 
        category: 'Audio', 
        price: 349.99, 
        imageUrl: 'https://images.unsplash.com/photo-1612444530582-fc66183b16f7?auto=format&fit=crop&w=800&q=80', 
        inStock: true, 
        rating: 4.6, 
        stock: 12, 
        description: 'Escucha cada detalle con estos audífonos inalámbricos. Sonido envolvente 7.1 y un micrófono con cancelación de ruido.' 
    },
    { 
        id: 'p7', 
        name: 'Gabinete Crystal Series', 
        category: 'Componentes', 
        price: 250.00, 
        imageUrl: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80', 
        inStock: true, 
        rating: 4.5, 
        stock: 5, 
        description: 'Un gabinete espacioso y con excelente flujo de aire para mantener tus componentes frescos. Panel de vidrio templado y filtros de polvo.' 
    },
    { 
        id: 'p8', 
        name: 'Silla Gamer Ergonómica', 
        category: 'Mobiliario', 
        price: 899.00,
        originalPrice: 1100.00,
        discount: '-20%',
        imageUrl: 'https://images.unsplash.com/photo-1598550476439-c923097980dc?auto=format&fit=crop&w=800&q=80', 
        inStock: true, 
        rating: 4.8, 
        stock: 3, 
        description: 'Comodidad suprema para largas sesiones de juego. Soporte lumbar ajustable y materiales transpirables de alta calidad.' 
    },
    { 
        id: 'p9', 
        name: 'Micrófono Streaming USB', 
        category: 'Audio', 
        price: 220.00, 
        imageUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=800&q=80', 
        inStock: true, 
        rating: 4.7, 
        stock: 8, 
        description: 'Calidad de estudio para tus streams y podcasts. Conexión Plug & Play y patrón polar cardioide para una voz clara.' 
    },
    { 
        id: 'p10', 
        name: 'Laptop Gamer RTX 4060', 
        category: 'Laptops', 
        price: 4599.00, 
        imageUrl: 'https://images.unsplash.com/photo-1593642632823-8f7856677741?auto=format&fit=crop&w=800&q=80', 
        inStock: true, 
        rating: 4.9, 
        stock: 2, 
        description: 'Potencia portátil definitiva. Equipada con la última tarjeta gráfica RTX y procesador de alto rendimiento para jugar donde sea.' 
    },
];

export const ARTICLES_DATA: Article[] = [
    { 
        id: 'a1', 
        title: 'Guía Definitiva para Armar tu Primera PC Gaming en 2025', 
        excerpt: 'Desde la elección de la CPU hasta la gestión de cables, te guiamos paso a paso en el emocionante proceso de construir tu propio equipo.', 
        imageUrl: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=800&q=80', 
        date: 'Julio 24, 2025' 
    },
    { 
        id: 'a2', 
        title: 'Los Mejores Teclados Mecánicos para Programar y Jugar', 
        excerpt: 'Analizamos los diferentes tipos de switches, layouts y características para ayudarte a encontrar el teclado perfecto para tus necesidades.', 
        imageUrl: 'https://images.unsplash.com/photo-1555212697-194d092e3b8f?auto=format&fit=crop&w=800&q=80', 
        date: 'Julio 18, 2025' 
    },
];
