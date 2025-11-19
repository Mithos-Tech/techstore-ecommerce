
# TechStore - E-commerce de Componentes Gaming

TechStore es una moderna y minimalista tienda de comercio electrónico especializada en componentes y periféricos de gaming de alta calidad. El proyecto está construido con React, TypeScript y Tailwind CSS, y utiliza Firebase para la autenticación, base de datos en tiempo real y almacenamiento.

## ✨ Características Principales

- **Diseño Moderno y Responsivo:** Interfaz de usuario limpia y totalmente adaptable a cualquier dispositivo (móvil, tablet, escritorio).
- **Catálogo de Productos Dinámico:** Página de productos con filtros por categoría, búsqueda en tiempo real y datos provenientes de Firestore.
- **Carrito de Compras Inteligente:** Persistencia en almacenamiento local, validación de stock y animaciones fluidas.
- **Panel de Administración Protegido:** Ruta `/admin` para gestionar productos (CRUD completo), con autenticación segura de Firebase y dashboard de ventas.
- **Optimizado:** Carga perezosa (Lazy loading) de rutas, optimización de imágenes (LCP mejorado) y SEO dinámico.

## 🚀 Tecnologías Utilizadas

- **Frontend:**
  - [React](https://reactjs.org/) (v18+) con Hooks & Context API
  - [TypeScript](https://www.typescriptlang.org/)
  - [Tailwind CSS](https://tailwindcss.com/) para el estilizado avanzado
  - [React Router](https://reactrouter.com/) para la navegación SPA
- **Backend & Servicios:**
  - [Firebase](https://firebase.google.com/)
    - **Firestore:** Base de datos NoSQL para productos y órdenes.
    - **Authentication:** Gestión de usuarios administradores.
    - **Storage:** Alojamiento de imágenes de productos.

## 🛠️ Configuración del Entorno (Backend)

Para que la aplicación se conecte correctamente a Firebase, necesitas crear un archivo de variables de entorno.

1.  Crea un archivo `.env` en la raíz del proyecto (al mismo nivel que `package.json`).
2.  Agrega tus credenciales de Firebase. Puedes obtenerlas en la Consola de Firebase > Configuración del Proyecto > General.

```env
VITE_FIREBASE_API_KEY=tu_api_key_aqui
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_proyecto_id
VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
```

> **Importante:** Este proyecto usa **Vite**, por lo que las variables de entorno **deben** comenzar con el prefijo `VITE_`. Si usas las variables por defecto de Firebase sin este prefijo, la aplicación no podrá leerlas.

## 📦 Instalación y Ejecución

1.  **Clona el repositorio e instala dependencias:**
    ```bash
    npm install
    ```

2.  **Ejecuta el servidor de desarrollo:**
    ```bash
    npm run dev
    ```
    Abre la URL que aparece en la terminal (usualmente `http://localhost:5173` o `http://localhost:3000`).

## 🔐 Panel de Administración

Para acceder al panel de administración:
1. Navega a `/admin/login`.
2. Regístrate con un correo y contraseña (la primera vez) o inicia sesión.
3. Desde el dashboard podrás ver estadísticas y en la sección de Productos podrás agregar o editar el inventario en tiempo real.
