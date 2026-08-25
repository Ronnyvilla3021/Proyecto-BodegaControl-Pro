# ⚙️ Bodega Control Pro — Backend

API REST construida con NestJS que centraliza usuarios, inventario, pedidos, entregas, automatización y reportes del sistema Bodega Control Pro.

---

## 🛠️ Stack

- **NestJS** (TypeScript) — framework backend modular
- **PostgreSQL** — base de datos relacional
- **Prisma ORM** — acceso a datos, migraciones y tipado
- **Passport + JWT** — autenticación
- **bcrypt** — hash de contraseñas
- **class-validator / class-transformer** — validación de DTOs
- **@nestjs/schedule** — tareas programadas (cron jobs)
- **Nodemailer** — envío de correos
- **PDFKit** / **ExcelJS** — generación de reportes

---

## 📂 Estructura de módulos

src/
├── auth/ → Login, JWT strategy, guards, decorador de roles
├── usuarios/ → CRUD de usuarios, activar/desactivar
├── categorias/ → CRUD de categorías de producto
├── productos/ → CRUD de productos, Kardex, control de stock
├── clientes/ → CRUD de clientes
├── pedidos/ → Creación de pedidos, máquina de estados
├── entregas/ → Confirmación de entregas (foto/firma/GPS)
├── dashboard/ → Resumen agregado + stream SSE
├── automatizacion/ → Scheduler, notificaciones, envío de correo
├── reportes/ → Exportación CSV / Excel / PDF
└── prisma/ → PrismaService (conexión global a la base de datos)


---

## 🔐 Autenticación y roles

El sistema usa JWT con 4 roles: `ADMINISTRADOR`, `BODEGUERO`, `REPARTIDOR`, `SUPERVISOR`.

- `JwtAuthGuard` valida que el token exista y sea válido, y **revalida en cada petición que el usuario siga activo** en base de datos (no solo que el token no haya expirado) — así, si un administrador desactiva a alguien, pierde acceso al instante, no cuando el token expire.
- `RolesGuard` + el decorador `@Roles(...)` restringen endpoints por rol.
- El token se acepta tanto por header `Authorization: Bearer <token>` como por query param `?token=<token>` — esto último es necesario para el stream SSE del dashboard y las descargas de reportes, que no pueden mandar headers personalizados.

---

## 🗃️ Modelo de datos (resumen)

| Modelo | Descripción |
|---|---|
| `Usuario` | Con rol, estado activo/inactivo |
| `Categoria` / `Producto` | Relación 1:N, producto con precio (`Decimal`), stock, vencimiento opcional |
| `MovimientoInventario` | Kardex — registra cada entrada/salida con `stockAntes`/`stockDespues`, usuario y motivo |
| `Cliente` | Datos de contacto, relación 1:N con Pedido |
| `Pedido` / `DetallePedido` | Pedido con múltiples ítems, estado, repartidor asignado |
| `Entrega` | 1:1 con Pedido — foto, firma, ubicación, fecha |
| `Notificacion` | Generadas por el scheduler (stock bajo, vencimientos, resumen semanal) |

---

## 📡 Endpoints principales

### Auth
| Método | Ruta | Descripción |
|---|---|---|
| POST | `/auth/login` | Login, devuelve JWT + datos de usuario |

### Usuarios
| Método | Ruta | Rol requerido |
|---|---|---|
| POST | `/usuarios` | — |
| GET | `/usuarios` | Administrador |
| PATCH | `/usuarios/:id/estado` | Administrador (no puede auto-desactivarse) |

### Productos / Inventario
| Método | Ruta | Descripción |
|---|---|---|
| POST | `/productos` | Crear producto |
| GET | `/productos` | Listar todos |
| GET | `/productos/stock-bajo?umbral=10` | Productos por debajo del umbral |
| GET | `/productos/:id/kardex` | Historial de movimientos del producto |
| POST | `/productos/:id/movimiento` | Registrar entrada/salida (transaccional) |

### Pedidos
| Método | Ruta | Descripción |
|---|---|---|
| POST | `/pedidos` | Crear con múltiples ítems, calcula total en servidor |
| GET | `/pedidos` | Listar todos |
| GET | `/pedidos/mis-pedidos` | Pedidos `EN_RUTA` asignados al repartidor logueado |
| PATCH | `/pedidos/:id/estado` | Avanza estado (valida la transición) |
| PATCH | `/pedidos/:id/repartidor` | Asigna repartidor |

### Entregas
| Método | Ruta | Descripción |
|---|---|---|
| POST | `/entregas` | Confirma entrega — solo el repartidor asignado, y solo si el pedido está `EN_RUTA` |
| GET | `/entregas/pedido/:pedidoId` | Consulta la entrega de un pedido |

### Dashboard
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/dashboard/resumen` | Snapshot único |
| GET (SSE) | `/dashboard/stream` | Push cada 5s con el resumen actualizado |

### Automatización
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/automatizacion/notificaciones` | Lista de notificaciones generadas |
| PATCH | `/automatizacion/notificaciones/:id/leida` | Marca como leída |
| POST | `/automatizacion/probar/stock-bajo` | Dispara manualmente la revisión de stock bajo |

### Reportes
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/reportes/productos/csv` | Exporta inventario en CSV |
| GET | `/reportes/productos/excel` | Exporta en `.xlsx` |
| GET | `/reportes/productos/pdf` | Exporta en PDF |

---

## ⏰ Tareas programadas (cron)

| Job | Frecuencia | Acción |
|---|---|---|
| Revisión de stock bajo | Diario, 8:00 AM | Crea notificación + correo si hay productos ≤ umbral |
| Productos por vencer | Diario, 8:15 AM | Avisa productos que vencen en los próximos 7 días |
| Resumen semanal | Lunes, 7:00 AM | Envía totales de pedidos/entregas de la semana |

---

## 🚀 Instalación

```bash
npm install

# Configura tu .env (ver .env.example)
npx prisma migrate dev
npm run start:dev
```

Servidor disponible en `http://localhost:3000`.

---

## 🔑 Variables de entorno

```env
DATABASE_URL="postgresql://usuario:password@localhost:5432/bodega_control_pro"
JWT_SECRET="clave_secreta_larga_y_dificil_de_adivinar"
JWT_EXPIRES_IN="8h"
PORT=3000
EMAIL_USER="correo@gmail.com"
EMAIL_PASSWORD="contraseña_de_aplicacion_de_gmail"
```

---

## 🧠 Decisiones técnicas destacadas

- **Transacciones atómicas (`$transaction`)** en todo movimiento de stock: el registro del Kardex y la actualización de stock ocurren juntos o no ocurre ninguno.
- **Cálculo de precios en el servidor, nunca en el cliente**: al crear un pedido, el precio unitario y el total se calculan con el valor real en base de datos, no con lo que mande el frontend.
- **Ownership checks en Entregas**: un repartidor solo puede confirmar entregas de pedidos que le fueron asignados a él — se verifica contra el `id` extraído del JWT, nunca contra un dato que venga en el body.
- **Prisma 6** en vez de la última versión mayor disponible al momento del desarrollo, por estabilidad del driver adapter — decisión documentada tras evaluar bugs conocidos en la release más nueva.