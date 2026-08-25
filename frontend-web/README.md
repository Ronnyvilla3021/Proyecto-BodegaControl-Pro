# 🖥️ Bodega Control Pro — Panel Web

Panel administrativo para gestión de inventario, pedidos, clientes y usuarios, con dashboard en tiempo real.

---

## 🛠️ Stack

- **React 18** + **TypeScript**
- **Vite** — build tool
- **Tailwind CSS v4** — estilos, con tokens de diseño personalizados (`@theme`)
- **React Router v6** — ruteo con rutas anidadas y protegidas
- **TanStack Query (React Query)** — manejo de estado remoto, cache e invalidación
- **Zustand** (+ `persist`) — estado global (sesión, tema)
- **Axios** — cliente HTTP con interceptores

---

## 📂 Estructura

src/
├── api/ → funciones de conexión a cada módulo del backend
├── components/ → piezas reutilizables (Sidebar, Card, Badge, Avatar, ThemeToggle, modales)
├── pages/ → pantallas completas
├── store/ → Zustand: authStore, themeStore
└── types/ → interfaces TypeScript por dominio


---

## 🖼️ Pantallas

| Ruta | Descripción | Acceso |
|---|---|---|
| `/login` | Autenticación | Público |
| `/dashboard` | Resumen en tiempo real vía SSE (pedidos hoy, entregas, stock bajo, más vendidos) | Todos los roles |
| `/inventario` | CRUD de productos + registro de movimientos de Kardex | Admin, Bodeguero, Supervisor |
| `/pedidos` | Creación de pedidos (formulario con ítems dinámicos), cambio de estado | Admin, Bodeguero, Supervisor |
| `/clientes` | CRUD de clientes | Admin, Bodeguero, Supervisor |
| `/usuarios` | Gestión de cuentas, activar/desactivar | Solo Administrador |
| `/reportes` | Descarga de CSV / Excel / PDF | Admin, Supervisor |

El **Sidebar filtra dinámicamente** qué enlaces mostrar según el rol del usuario logueado — la protección real vive en el backend (Guards), pero la UI evita mostrar rutas que igual serían rechazadas.

---

## 🎨 Sistema de diseño

- Tokens de color centralizados en `src/index.css` vía `@theme` (Tailwind v4), con variantes para modo claro y oscuro.
- Toggle de tema persistente (`localStorage`, vía `themeStore` + Zustand).
- Componentes base reutilizables: `.card`, `.btn-primary`, además de `Badge` y `Avatar` para consistencia visual entre pantallas.
- Fondo con efecto "aurora" (mancha de gradiente sutil) inspirado en el lenguaje visual de dashboards modernos (Linear, Stripe, Vercel).

---

## 🔌 Conexión con el backend

El cliente Axios (`src/api/cliente.ts`) centraliza la conexión:

- **Interceptor de request**: agrega el token JWT automáticamente en cada petición desde `authStore`.
- **Interceptor de response**: si el backend responde `401`, cierra la sesión automáticamente.

La URL del backend se configura vía variable de entorno:

```env
VITE_API_URL=http://localhost:3000
```

> En Vite, cualquier variable expuesta al navegador debe empezar con el prefijo `VITE_`.

### Dashboard en tiempo real

`useDashboardStream` (hook personalizado) abre una conexión `EventSource` nativa hacia `/dashboard/stream`, pasando el token por query param (los `EventSource` no permiten headers custom). Se cierra automáticamente al desmontar el componente para no dejar conexiones abiertas.

---

## 🚀 Instalación

```bash
npm install
npm run dev
```

Disponible en `http://localhost:5173`.

Requiere el backend corriendo en paralelo (ver `backend/README.md`).

---

## 🧠 Decisiones técnicas destacadas

- **React Query en vez de `useEffect` + `useState` manual**: cache, invalidación (`invalidateQueries`) y estados de carga/error manejados de forma declarativa en cada mutación.
- **Formularios de arrays dinámicos** (creación de pedidos con múltiples productos): estado inmutable con spread, sin librerías externas de formularios.
- **Descargas de archivos vía `<a href>` simple**: en vez de manejar blobs con JavaScript, se aprovecha que el backend ya define `Content-Disposition: attachment`, dejando que el navegador maneje la descarga nativamente.