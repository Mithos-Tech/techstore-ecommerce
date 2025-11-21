# TechStore - E-commerce de Gaming 🎮

Una moderna plataforma de e-commerce especializada en componentes y periféricos de gaming de alta calidad. Desarrollada como proyecto full-stack con React, TypeScript y Firebase, diseñada para demostrar mejores prácticas en desarrollo web.

**[🌐 Ver Demo en Vivo](https://techstore-shop.vercel.app)**  
**[💻 Repositorio GitHub](https://github.com/Mithos-Tech/techstore-ecommerce)**

---

## ✨ Características Principales

### 🛍️ Tienda Pública

- **Catálogo Dinámico:** 10+ productos con filtros por categoría y búsqueda en tiempo real
- **Carrito Inteligente:** Persistencia en localStorage, validación de stock y actualización en vivo
- **Checkout Completo:** Formulario de datos, selección de envío y método de pago
- **Confirmación de Pedidos:** Generación automática de números de orden únicos
- **Imágenes Optimizadas:** Almacenadas en Cloudinary para máximo rendimiento
- **Diseño Responsivo:** 100% adaptable a móvil, tablet y escritorio

### 🔐 Panel Administrativo Protegido

- **Dashboard:** Visualización de ingresos, órdenes y estadísticas en tiempo real
- **Gestión de Pedidos:** Ver detalles completos, cambiar estados y eliminar órdenes
- **Búsqueda Avanzada:** Filtrar órdenes por ID, cliente o email
- **Autenticación Segura:** Solo usuarios con email `@techstore.com` acceden al admin
- **Estadísticas de Ventas:** Gráficos de últimos 7 días

### ⚡ Rendimiento y Optimización

- **Lazy Loading:** Carga perezosa de rutas y componentes
- **Code Splitting:** Reducción del tamaño inicial del bundle
- **SEO Dinámico:** Metaetiquetas por página
- **Optimización de Imágenes:** URLs cortas y optimizadas desde Cloudinary

---

## 🏗️ Arquitectura y Stack Tecnológico

### Frontend

```
React 19.2.0 + TypeScript
├── React Router v6 (Navegación SPA)
├── Tailwind CSS (Estilos avanzados)
├── Context API (Estado global)
└── Lazy Loading (Optimización)
```

### Backend & Base de Datos

```
Firebase (Ecosistema completo)
├── Firestore (NoSQL - Productos, Órdenes)
├── Authentication (Email/Password - Admins)
├── Reglas de Seguridad (Protección de datos)
└── Cloudinary (Almacenamiento de imágenes)
```

### DevOps & Deployment

```
Git + GitHub (Control de versiones)
└── Vercel (CI/CD automático)
```

---

## 📁 Estructura del Proyecto

```
techstore/
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── ProductCard.tsx
│   │   ├── Header.tsx
│   │   └── admin/           # Componentes del panel admin
│   ├── pages/               # Páginas completas
│   │   ├── HomePage.tsx
│   │   ├── CheckoutPage.tsx
│   │   ├── AdminOrdersPage.tsx
│   │   └── OrderConfirmationPage.tsx
│   ├── context/             # Context API
│   │   ├── CartContext.tsx
│   │   └── WishlistContext.tsx
│   ├── firebase.ts          # Configuración y funciones Firebase
│   ├── constants.ts         # Datos hardcodeados de fallback
│   ├── types.ts             # Tipos TypeScript
│   └── App.tsx              # Componente principal
├── public/                  # Archivos estáticos
├── .env.local              # Variables de entorno (NO commitear)
├── firebase.ts             # Configuración de Firebase
└── vite.config.ts          # Configuración de Vite
```

---

## 🚀 Instalación y Configuración

### Requisitos Previos

- Node.js 18+ y npm
- Cuenta de Firebase
- Cuenta de Cloudinary (para imágenes)

### Paso 1: Clonar y Instalar

```bash
# Clonar el repositorio
git clone https://github.com/Mithos-Tech/techstore-ecommerce.git
cd techstore-ecommerce

# Instalar dependencias
npm install
```

### Paso 2: Configurar Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Crea un nuevo proyecto o selecciona uno existente
3. Ve a Configuración → General
4. Copia tus credenciales

5. Crea archivo `.env.local` en la raíz:

```env
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=proyecto-id
VITE_FIREBASE_STORAGE_BUCKET=proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

### Paso 3: Configurar Firestore

En Firebase Console:

1. **Firestore Database** → Crear base de datos
2. Modo de prueba → Región cercana
3. **Authentication** → Métodos de acceso:
   - ✅ Email/Password
   - ✅ Anónimo

### Paso 4: Configurar Reglas de Seguridad

En **Firestore** → **Reglas**, agrega:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAdmin() {
      return request.auth.token.email != null &&
             request.auth.token.email.matches('.*@techstore\\.com$');
    }

    match /productos/{productId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /ordenes/{orderId} {
      allow read: if isAdmin() || true;
      allow create: if true;
      allow update, delete: if isAdmin();
    }
  }
}
```

### Paso 5: Ejecutar Localmente

```bash
npm run dev
```

Abre `http://localhost:5173`

---

## 🔐 Panel Administrativo

### Acceso

- URL: `/admin/login`
- Email: cualquiera con terminación `@techstore.com`
- Contraseña: mínimo 6 caracteres

### Funcionalidades

- **Dashboard:** Estadísticas de ventas en tiempo real
- **Gestión de Pedidos:** Ver, cambiar estado, eliminar órdenes
- **Búsqueda:** Filtrar por ID de orden, nombre o email del cliente

---

## 📊 Flujo de Datos

```
Usuario Público
    ↓
Navega tienda → Selecciona productos
    ↓
Agrega al carrito (localStorage)
    ↓
Checkout: Completa formulario
    ↓
Sistema crea orden en Firestore + actualiza stock
    ↓
Muestra confirmación con número de orden

─────────────────────────────────

Admin
    ↓
Login con @techstore.com
    ↓
Accede a panel protegido
    ↓
Ver todas las órdenes en tiempo real
    ↓
Cambiar estado o eliminar
```

---

## 🔒 Seguridad Implementada

✅ **Reglas de Firestore:** Solo admins pueden modificar productos  
✅ **Autenticación Firebase:** Email/Password para administradores  
✅ **Protección de Rutas:** `/admin` requiere login con `@techstore.com`  
✅ **Variables de Entorno:** Credenciales no expuestas en código  
✅ **HTTPS:** Vercel proporciona SSL automáticamente

---

## 📈 Métricas de Rendimiento

- **Lighthouse:** 90+ en Performance
- **FCP:** < 2s
- **LCP:** < 3s
- **Bundle Size:** ~250KB minificado

---

## 🚢 Deployment

La aplicación está automatizada con **Vercel CI/CD**:

```
Git Push → GitHub → Vercel Build → Deploy Automático
```

**URL en Producción:** [https://techstore-shop.vercel.app](https://techstore-shop.vercel.app)

Para desplegar tu propia versión:

1. Haz fork del repositorio
2. Conecta con Vercel
3. Agrega variables de entorno en Vercel
4. Vercel hará deploy automático en cada push

---

## 🎯 Funcionalidades Futuras (En Roadmap)

- [ ] Sistema de usuarios con historial de compras
- [ ] Método de pago integrado (Stripe/PayPal)
- [ ] Calificaciones y reseñas de productos
- [ ] Notificaciones por email
- [ ] Panel de gestión de productos (CRUD completo)
- [ ] Reportes avanzados de ventas

---

## 📝 Variables de Entorno (Referencia)

| Variable                            | Descripción                  |
| ----------------------------------- | ---------------------------- |
| `VITE_FIREBASE_API_KEY`             | API Key de Firebase          |
| `VITE_FIREBASE_AUTH_DOMAIN`         | Dominio de autenticación     |
| `VITE_FIREBASE_PROJECT_ID`          | ID del proyecto Firebase     |
| `VITE_FIREBASE_STORAGE_BUCKET`      | Bucket de almacenamiento     |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | ID del remitente de mensajes |
| `VITE_FIREBASE_APP_ID`              | ID de la aplicación          |

---

## 🐛 Troubleshooting

### Las imágenes no cargan

- Verifica que Cloudinary esté accesible
- Comprueba las URLs en Firestore
- Limpiar caché del navegador: `Ctrl + Shift + Delete`

### Error en Firebase

- Verifica las credenciales en `.env.local`
- Comprueba que Firestore esté iniciado
- Verifica que Authentication esté habilitado

### Panel Admin no accesible

- Asegúrate que el email termine en `@techstore.com`
- Verifica las reglas de Firestore
- Comprueba que estés autenticado

---

## 📚 Recursos

- [Documentación de React](https://react.dev)
- [Firebase Docs](https://firebase.google.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs)
- [Vercel Docs](https://vercel.com/docs)

---

## 👨‍💻 Autor

**Inspyrio Studio**  
[GitHub](https://github.com/Mithos-Tech) | [Portafolio](#)

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver archivo `LICENSE` para más detalles.

---

## 🙌 Agradecimientos

- Diseño y componentes inspirados en mejores prácticas modernas
- Imágenes de [Cloudinary](https://cloudinary.com) y [Unsplash](https://unsplash.com)
- Iconos de [Lucide React](https://lucide.dev)

---

**Última actualización:** Noviembre 2025  
**Estado:** ✅ Listo para Portafolio
