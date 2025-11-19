# Backend - API REST para Instalaciones Eléctricas

Backend completo con Node.js + Express + MongoDB para gestionar servicios, proyectos, cotizaciones y reseñas (reviews) de una empresa de instalaciones eléctricas, con panel de administración.

## 🗄️ Modelos de Base de Datos (5 Tablas)

### 1. **Users** (Usuarios/Administradores)
- `name`, `email`, `password` (hashed), `role` (admin/user), `isActive`
- Para autenticación y gestión del panel admin

### 2. **Services** (Servicios)
- `title`, `description`, `icon`, `images`, `features`, `price`, `category`, `isActive`, `order`
- **RELACIÓN 1**: `createdBy` → referencia a `User` (quién creó)
- **RELACIÓN 2**: `updatedBy` → referencia a `User` (quién modificó)

### 3. **Projects** (Proyectos realizados)
- `title`, `description`, `client`, `location`, `images`, `status`, `startDate`, `endDate`, `metrics`
- **RELACIÓN 3**: `services[]` → array de referencias a `Service` (servicios usados en el proyecto)
- **RELACIÓN 4**: `createdBy` → referencia a `User`
- **RELACIÓN 5**: `updatedBy` → referencia a `User`

### 4. **Quotes** (Cotizaciones/Solicitudes)
- `user` (ref User), `name`, `email`, `phone`, `message`, `projectType`, `urgency`, `status`, `adminNotes`, `response`
- **RELACIÓN 6**: `serviceRequested` → referencia a `Service` (servicio solicitado)
- **RELACIÓN 7**: `assignedTo` → referencia a `User` (admin asignado)
- **RELACIÓN 8**: `response.sentBy` → referencia a `User` (admin que respondió)

### 5. **Reviews** (Reseñas/Comentarios de clientes)
- `createdBy` (ref User), `comment`, `rating (1-5)`, `service?`, `project?`, `status ('pending'|'approved'|'rejected')`, `isActive`
- **RELACIÓN 9**: `service` → referencia a `Service` (opcional)
- **RELACIÓN 10**: `project` → referencia a `Project` (opcional)

Nota: Se mantiene la colección `Testimonials` como opción legacy, pero la recomendada es `Reviews` por su flujo de moderación y rating.

## 📊 Resumen de Relaciones

1. **Service → User**: Cada servicio registra quién lo creó y quién lo modificó
2. **Project → Service**: Cada proyecto puede estar asociado a múltiples servicios (Many-to-Many mediante array)
3. **Project → User**: Cada proyecto registra quién lo creó y quién lo modificó
4. **Quote → Service**: Cada cotización puede referenciar un servicio específico solicitado
5. **Quote → User**: Cotizaciones asignadas a admins y respuestas enviadas por admins
6. **Review → Service/Project**: Reseñas pueden referenciar un servicio o proyecto específicos
7. **Review → User**: Cada reseña registra qué usuario la creó; estado moderado por admin

## 🚀 Instalación y Configuración

```powershell
cd backend
npm install
```

Crea el archivo `.env` copiando `.env.example`:
```powershell
copy .env.example .env
notepad .env
```

Completa las variables:
- `MONGODB_URI`: Tu URI de MongoDB Atlas o local
- `JWT_SECRET`: Un string secreto para firmar tokens (genera uno seguro)

## ▶️ Ejecutar

```powershell
# Desarrollo (con auto-reload)
npm run dev

# Producción
npm start
```

El servidor arrancará en `http://localhost:4000`

## 📡 Endpoints de la API

### 🔐 Autenticación (`/api/auth`)
- `POST /api/auth/register` - Registrar usuario (público para users, protegido para admins)
- `POST /api/auth/login` - Login (devuelve token JWT)
- `GET /api/auth/me` - Obtener perfil actual (requiere token)
- `GET /api/auth/users` - Listar usuarios (admin)
- `PUT /api/auth/users/:id` - Actualizar usuario (admin)
- `DELETE /api/auth/users/:id` - Desactivar usuario (admin)

### 🔧 Servicios (`/api/services`)
- `GET /api/services` - Listar servicios activos (público)
- `GET /api/services/:id` - Ver servicio (público)
- `POST /api/services` - Crear servicio (admin)
- `PUT /api/services/:id` - Actualizar servicio (admin)
- `DELETE /api/services/:id` - Eliminar servicio (admin - soft delete)

### 🏗️ Proyectos (`/api/projects`)
- `GET /api/projects` - Listar proyectos activos (público, query: `?featured=true`)
- `GET /api/projects/:id` - Ver proyecto (público)
- `POST /api/projects` - Crear proyecto (admin)
- `PUT /api/projects/:id` - Actualizar proyecto (admin)
- `DELETE /api/projects/:id` - Eliminar proyecto (admin - soft delete)

### 💬 Cotizaciones (`/api/quotes`)
- `POST /api/quotes` - Crear cotización (requiere login, autocompleta name/email desde el usuario)
- `GET /api/quotes` - Listar cotizaciones (admin, query: `?status=pending`)
- `GET /api/quotes/:id` - Ver cotización (admin)
- `PUT /api/quotes/:id` - Actualizar cotización (admin)
- `POST /api/quotes/:id/respond` - Responder cotización (admin)
- `DELETE /api/quotes/:id` - Eliminar cotización (admin)

### ⭐ Reseñas (`/api/reviews`)
- `GET /api/reviews` - Listar reseñas aprobadas (público, filtros `?service=` o `?project=`)
- `POST /api/reviews` - Crear reseña (requiere login, queda en `pending` hasta que un admin la apruebe)
- `POST /api/reviews/:id/moderate` - Aprobar/Rechazar reseña (admin)
- `DELETE /api/reviews/:id` - Eliminar reseña (admin)

### 🏥 Health Check
- `GET /api/health` - Estado de conexión a MongoDB
- `GET /` - Documentación básica de endpoints

## 🔑 Autenticación

Rutas protegidas requieren header:
```
Authorization: Bearer <token_jwt>
```

El token se obtiene al hacer login en `/api/auth/login`

## 📝 Ejemplos de Uso (PowerShell)

### Crear primer admin:
```powershell
$body = @{
  name = "Admin"
  email = "admin@ejemplo.com"
  password = "admin123"
  role = "admin"
} | ConvertTo-Json

Invoke-RestMethod -Uri http://localhost:4000/api/auth/register -Method POST -Body $body -ContentType 'application/json'
```

### Login:
```powershell
$body = @{
  email = "admin@ejemplo.com"
  password = "admin123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri http://localhost:4000/api/auth/login -Method POST -Body $body -ContentType 'application/json'
$token = $response.token
```

### Crear servicio (con token):
```powershell
$headers = @{
  "Authorization" = "Bearer $token"
}

$body = @{
  title = "Instalación Eléctrica Residencial"
  description = "Instalación completa de sistema eléctrico"
  category = "instalacion"
  icon = "Zap"
  features = @("Cableado", "Tableros", "Iluminación")
} | ConvertTo-Json

Invoke-RestMethod -Uri http://localhost:4000/api/services -Method POST -Body $body -ContentType 'application/json' -Headers $headers
```

### Crear cotización (requiere login):
```powershell
$headers = @{ "Authorization" = "Bearer $token" }
$body = @{
  phone = "+1234567890"
  message = "Necesito cotización para instalación eléctrica en casa nueva"
  projectType = "residencial"
  urgency = "media"
} | ConvertTo-Json

Invoke-RestMethod -Uri http://localhost:4000/api/quotes -Method POST -Body $body -ContentType 'application/json' -Headers $headers
```

## 🗂️ Estructura de Archivos

```
backend/
├── index.js                 # Archivo principal del servidor
├── package.json             # Dependencias
├── .env.example            # Template de variables de entorno
├── models/                 # Modelos de Mongoose
│   ├── User.js
│   ├── Service.js
│   ├── Project.js
│   ├── Quote.js
│   ├── Review.js
│   └── Testimonial.js (legacy)
├── controllers/            # Lógica de negocio
│   ├── authController.js
│   ├── serviceController.js
│   ├── projectController.js
│   ├── quoteController.js
│   ├── reviewController.js
│   └── testimonialController.js (legacy)
├── routes/                 # Definición de rutas
│   ├── authRoutes.js
│   ├── serviceRoutes.js
│   ├── projectRoutes.js
│   ├── quoteRoutes.js
│   ├── reviewRoutes.js
│   └── testimonialRoutes.js (legacy)
└── middleware/             # Middleware personalizado
    └── auth.js            # Verificación JWT y roles
```

## 🔒 Seguridad

- Contraseñas hasheadas con bcrypt
- Autenticación JWT con expiración de 30 días
- Middleware de autorización por roles (admin/user)
- Validación de tokens en rutas protegidas
- Soft delete para mantener integridad de datos

## 🎯 Próximos pasos

1. Añadir validación de datos con express-validator
2. Implementar rate limiting
3. Añadir subida de imágenes (multer + cloudinary/S3)
4. Implementar paginación en endpoints GET
5. Añadir filtros y búsqueda avanzada
6. Documentación con Swagger/OpenAPI
7. Tests unitarios y de integración
