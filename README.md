## 🌐 Demo en vivo

- **Panel Web**: 
[https://tu-dominio-real.vercel.app](https://proyecto-bodega-control-pro-five.vercel.app/)


- **API Backend**: 
https://proyecto-bodegacontrol-pro.onrender.com


- **APK MOBILE**: 
https://github.com/Ronnyvilla3021/Proyecto-BodegaControl-Pro/releases/tag/v1.0.0

- ## 🔑 Credenciales de prueba

- **Email**: `admin@bodega.com`
- **Contraseña**: `123456`

> Nota: el backend usa el plan gratuito de Render, así que la primera petición después de inactividad puede tardar unos 30-50 segundos en "despertar" el servidor.

# 📦 Bodega Control Pro

Sistema integral de gestión de inventario, pedidos y entregas con panel web administrativo, API REST en tiempo real y aplicación móvil para repartidores.

![Estado](https://img.shields.io/badge/estado-en%20desarrollo-blue)
![Licencia](https://img.shields.io/badge/licencia-MIT-green)

---

## 🎯 Sobre el proyecto

**Bodega Control Pro** resuelve un problema real de pequeños y medianos negocios de logística: inventario desorganizado y entregas sin evidencia verificable. El sistema conecta tres piezas en un solo flujo:

- Un **backend** que centraliza inventario, pedidos y usuarios con trazabilidad completa.
- Un **panel web** para administradores, bodegueros y supervisores.
- Una **app móvil** para que los repartidores confirmen entregas con foto, firma digital y ubicación GPS.

Todo el stock se audita con un **Kardex transaccional**: cada movimiento de inventario queda registrado con quién lo hizo, cuándo, y el estado antes/después — nada se pierde ni se puede manipular desde el frontend.

---

## ✨ Funcionalidades destacadas

- 🔐 **Autenticación JWT con roles** (Administrador, Bodeguero, Repartidor, Supervisor) y guards que protegen cada endpoint según permisos reales.
- 📊 **Dashboard en tiempo real vía Server-Sent Events (SSE)** — los widgets se actualizan solos cada 5 segundos, sin polling ni recargar la página.
- 🔄 **Kardex transaccional**: todo movimiento de stock (entrada/salida) queda auditado con `stockAntes`/`stockDespues`, usuario responsable y motivo, dentro de una transacción atómica de base de datos.
- 📦 **Máquina de estados en Pedidos**: `Pendiente → Empacado → En ruta → Entregado`, con validación de transiciones y descuento automático de inventario al empacar.
- 🚚 **App móvil de Entregas (Flutter)**: el repartidor ve solo sus pedidos asignados, y confirma la entrega capturando foto real de cámara, firma táctil del cliente y coordenadas GPS.
- ⏰ **Automatización programada (cron jobs)**: avisos automáticos de stock bajo, productos por vencer y resumen semanal, con notificaciones internas y envío de correo.
- 📄 **Exportación de reportes** en CSV, Excel (.xlsx) y PDF, generados en el servidor.
- 🌗 **Modo claro/oscuro** persistente en el panel web.

---

## 🏗️ Arquitectura

Proyecto Bodega Control Pro/
├── backend/ → API REST (NestJS + PostgreSQL + Prisma)
├── frontend-web/ → Panel administrativo (React + TypeScript + Tailwind)
├── frontend-mobile/ → App de repartidor (Flutter)
└── docs/ → Documentación y diagramas


**Flujo general:** el panel web y la app móvil consumen la misma API REST. El panel web usa el token JWT vía header `Authorization`; la conexión SSE del dashboard y las descargas de reportes lo pasan por query param, ya que esos casos no permiten headers personalizados.

---

## 🛠️ Stack técnico

| Capa | Tecnología |
|---|---|
| Backend | NestJS, TypeScript, Prisma ORM, PostgreSQL |
| Autenticación | JWT (Passport), bcrypt, Guards por rol |
| Tiempo real | Server-Sent Events (SSE) |
| Automatización | `@nestjs/schedule` (cron), Nodemailer |
| Reportes | PDFKit, ExcelJS |
| Frontend Web | React 18, TypeScript, Vite, Tailwind CSS v4 |
| Estado / Data fetching | Zustand, TanStack Query (React Query) |
| Ruteo | React Router v6 |
| App Móvil | Flutter (Dart), Geolocator, Image Picker, Signature |

---

## 📐 Módulos del backend

| Módulo | Responsabilidad |
|---|---|
| Usuarios | Registro, login JWT, activar/desactivar cuentas, roles |
| Inventario | CRUD de productos y categorías, Kardex, control de stock bajo |
| Pedidos | Creación con múltiples ítems, cálculo de totales, máquina de estados |
| Entregas | Asignación de repartidor, confirmación con foto/firma/GPS |
| Dashboard | Resumen agregado + stream SSE en tiempo real |
| Automatización | Cron jobs de avisos, notificaciones internas, correo |
| Reportes | Exportación CSV / Excel / PDF |

---

## 🖼️ Capturas

> _Agrega aquí capturas del Dashboard, Inventario, Pedidos y la app móvil confirmando una entrega. Recomendado: 3-4 imágenes representativas, en modo claro y oscuro._

| Dashboard | Inventario | App móvil |
|---|---|---|
| ![dashboard](docs/dashboard.png) | ![inventario](docs/inventario.png) | ![mobile](docs/mobile.png) |

---

## 🚀 Cómo correr el proyecto localmente

### Requisitos previos
- Node.js 18+
- PostgreSQL corriendo localmente
- Flutter SDK (solo para la app móvil)

### 1. Backend

```bash
cd backend
npm install

# Configura tu .env (ver .env.example)
npx prisma migrate dev
npm run start:dev
```

El servidor queda disponible en `http://localhost:3000`.

### 2. Frontend Web

```bash
cd frontend-web
npm install

# Configura VITE_API_URL en .env apuntando a tu backend
npm run dev
```

Disponible en `http://localhost:5173`.

### 3. App Móvil (Flutter)

```bash
cd frontend-mobile
flutter pub get

# Ajusta la IP del backend en lib/services/api_service.dart
flutter run
```

> ⚠️ Para probar en un dispositivo físico, tu backend y tu teléfono deben estar en la misma red WiFi, y el firewall debe permitir conexiones entrantes al puerto 3000.

---

## 🔑 Variables de entorno (backend)

```env
DATABASE_URL="postgresql://usuario:password@localhost:5432/bodega_control_pro"
JWT_SECRET="tu_clave_secreta"
JWT_EXPIRES_IN="8h"
PORT=3000
EMAIL_USER="tu_correo@gmail.com"
EMAIL_PASSWORD="tu_contraseña_de_aplicacion"
```

---

## 👤 Roles del sistema

| Rol | Permisos |
|---|---|
| **Administrador** | Acceso total: usuarios, reportes, todo el CRUD |
| **Supervisor** | Inventario, pedidos, clientes, reportes |
| **Bodeguero** | Inventario, pedidos, clientes |
| **Repartidor** | Solo la app móvil: ver y confirmar sus entregas asignadas |

---

## 📄 Licencia

MIT — libre de usar como referencia o base para tus propios proyectos.

---

## 👨‍💻 Autor

**Ronny Villa**
Proyecto desarrollado como parte de portafolio profesional — full-stack (NestJS · React · Flutter · PostgreSQL).
