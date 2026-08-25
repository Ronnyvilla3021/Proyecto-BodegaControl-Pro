# 📱 Bodega Control Pro — App de Repartidor

Aplicación móvil en Flutter para que los repartidores gestionen sus entregas: ver pedidos asignados y confirmar la entrega con foto, firma digital y ubicación GPS.

---

## 🛠️ Stack

- **Flutter** (Dart)
- **http** — conexión a la API REST
- **shared_preferences** — persistencia del token de sesión en el dispositivo
- **geolocator** — captura de ubicación GPS real
- **image_picker** — acceso a la cámara del dispositivo
- **signature** — captura de firma táctil como imagen
- **intl** — formateo de fechas y datos

---

## 📂 Estructura

lib/
├── main.dart → punto de entrada, tema de la app
├── models/ → clases de datos (Usuario, Pedido, Cliente, DetallePedido)
├── services/ → conexión con la API (ApiService, AuthService, PedidosService, EntregasService)
└── screens/ → pantallas completas
├── login_screen.dart
├── mis_pedidos_screen.dart
└── confirmar_entrega_screen.dart


---

## 🖼️ Flujo de la app

1. **Login** — autenticación contra `/auth/login`. Solo permite el acceso a usuarios con rol `REPARTIDOR`; cualquier otro rol es rechazado en el cliente.
2. **Mis Entregas** — lista los pedidos en estado `EN_RUTA` asignados al repartidor logueado (`GET /pedidos/mis-pedidos`), con soporte de "pull to refresh".
3. **Confirmar entrega** — pantalla con 3 pasos secuenciales:
   - Captura de **foto** real vía cámara del dispositivo (comprimida antes de enviar).
   - **Firma** táctil del cliente, capturada como imagen PNG.
   - **Ubicación GPS** actual, con manejo explícito de permisos.
   
   Al confirmar, todo se envía codificado en base64 a `POST /entregas`, que marca el pedido como `ENTREGADO`.

---

## 🔐 Autenticación

El token JWT se guarda localmente con `shared_preferences` tras el login, y se adjunta automáticamente en cada petición vía `ApiService`. El cierre de sesión limpia el token guardado.

---

## 🌐 Configuración de conexión al backend

Como el backend corre en la misma red local durante desarrollo, la URL debe apuntar a la **IP local de la máquina** que corre el servidor (no `localhost`, que en un dispositivo físico apuntaría al propio teléfono):

```dart
// lib/services/api_service.dart
static const String baseUrl = 'http://TU_IP_LOCAL:3000';
```

Para obtener tu IP local: `ipconfig` (Windows) o `ifconfig` (macOS/Linux), buscando la interfaz de red WiFi.

> ⚠️ El teléfono y la máquina que corre el backend deben estar en la **misma red WiFi**. Además, el firewall del sistema debe permitir conexiones entrantes al puerto del backend (3000).

---

## 📷 Permisos requeridos (Android)

Declarados en `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.INTERNET"/>
<uses-permission android:name="android.permission.CAMERA"/>
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION"/>
<uses-permission android:name="android.permission.READ_MEDIA_IMAGES"/>
```

---

## 🚀 Instalación

```bash
flutter pub get
flutter run
```

Para correr en un dispositivo Android físico: activar **Opciones de desarrollador** → **Depuración USB**, conectar por cable, y confirmar con `flutter devices` que el dispositivo aparece listado.

---

## 🧠 Decisiones técnicas destacadas

- **Validación de rol en el cliente**: aunque el backend ya protege cada endpoint por rol, la app bloquea el login de cualquier usuario que no sea `REPARTIDOR` — evita que alguien entre "por error" a una app que no le corresponde.
- **Evidencia en base64 dentro del JSON**: en vez de subir archivos multipart, la foto y la firma se codifican como texto y se envían junto al resto de los datos — simplifica el backend a costa de un payload más pesado (mitigado comprimiendo la foto antes de enviarla).
- **`RefreshIndicator`** para recargar la lista de pedidos con el gesto nativo de "pull to refresh", en vez de un botón de recarga manual.