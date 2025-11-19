# 🏢 Sistema Completo - Empresa de Instalaciones Eléctricas

Sistema web completo con frontend (Vite + React + TypeScript) y backend (Node.js + Express + MongoDB) para empresa de instalaciones eléctricas con panel de administración.

## 📁 Estructura del Proyecto

```
Proyecto/
├── src/                    # Frontend principal (Vite + React + TypeScript)
│   ├── components/         # Componentes de la app
│   └── ...
├── backend/               # API REST (Node.js + Express + MongoDB)
│   ├── models/           # 5 modelos de Mongoose
│   ├── controllers/      # Lógica de negocio
│   ├── routes/          # Endpoints API
│   └── middleware/      # Auth JWT
└── README.md            # Este archivo
```

## 🗄️ Base de Datos (5 Tablas + Relaciones)

### Tablas:
1. **Users** - Usuarios y administradores
2. **Services** - Servicios ofrecidos
3. **Projects** - Proyectos realizados
4. **Quotes** - Cotizaciones/solicitudes
5. **Testimonials** - Testimonios de clientes

### Relaciones:
- Service → User (createdBy, updatedBy)
- Project → Service (many-to-many via array)
- Project → User (createdBy, updatedBy)
- Quote → Service (serviceRequested)
- Quote → User (assignedTo, response.sentBy)
- Testimonial → Project (optional)
- Testimonial → User (createdBy)

Ver detalles completos en: `backend/TABLAS_Y_RELACIONES.md`

## 🚀 Instalación y Configuración

### 1️⃣ Backend (API)

```powershell
# Navegar a backend
cd backend

# Instalar dependencias
npm install

# Configurar variables de entorno
copy .env.example .env
notepad .env
```

Completa el archivo `.env`:
```env
MONGODB_URI=mongodb+srv://usuario:password@cluster.xxxxx.mongodb.net/instalaciones?retryWrites=true&w=majority
PORT=4000
JWT_SECRET=tu_secret_super_seguro_12345
```

```powershell
# Poblar base de datos con datos de ejemplo (opcional pero recomendado)
npm run seed

# Arrancar servidor en modo desarrollo
npm run dev
```

Backend disponible en: `http://localhost:4000`

### 2️⃣ Frontend (App Web)

```powershell
# En otra terminal PowerShell, desde la raíz del proyecto
cd c:\Users\ajavi\OneDrive\Desktop\Proyecto

# Instalar dependencias
npm install

# Arrancar servidor de desarrollo
npm run dev
```

Frontend disponible en: `http://localhost:3000` (configurado en vite.config.ts)

## 📡 Endpoints de la API

### Públicos (sin autenticación):
- `GET /api/services` - Listar servicios
- `GET /api/projects` - Listar proyectos
- `GET /api/testimonials` - Listar testimonios
- `POST /api/quotes` - Enviar cotización
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro

### Protegidos (requieren token JWT):
- `POST /api/services` - Crear servicio (admin)
- `PUT /api/services/:id` - Actualizar servicio (admin)
- `DELETE /api/services/:id` - Eliminar servicio (admin)
- `POST /api/projects` - Crear proyecto (admin)
- `PUT /api/projects/:id` - Actualizar proyecto (admin)
- `GET /api/quotes` - Listar cotizaciones (admin)
- `POST /api/quotes/:id/respond` - Responder cotización (admin)
- ... (ver backend/README.md para lista completa)

## 🔑 Credenciales de Prueba (después de seed)

Si ejecutaste `npm run seed` en el backend:

```
Email: admin@instalacioneselectricas.com
Password: admin123
```

## 🧪 Probar la API (PowerShell)

### Login:
```powershell
$body = @{
  email = "admin@instalacioneselectricas.com"
  password = "admin123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri http://localhost:4000/api/auth/login -Method POST -Body $body -ContentType 'application/json'
$token = $response.token
echo $token
```

### Listar servicios:
```powershell
Invoke-RestMethod -Uri http://localhost:4000/api/services -Method GET
```

### Crear servicio (con token):
```powershell
$headers = @{ "Authorization" = "Bearer $token" }
$body = @{
  title = "Nuevo Servicio"
  description = "Descripción del servicio"
  category = "instalacion"
} | ConvertTo-Json

Invoke-RestMethod -Uri http://localhost:4000/api/services -Method POST -Body $body -ContentType 'application/json' -Headers $headers
```

## 📚 Documentación Adicional

- **Backend completo**: Ver `backend/README.md`
- **Tablas y relaciones**: Ver `backend/TABLAS_Y_RELACIONES.md`
- **Modelos**: Ver archivos en `backend/models/`

## 🛠️ Stack Tecnológico

### Frontend:
- React 18
- TypeScript
- Vite 6
- Tailwind CSS
- Radix UI (componentes)
- Lucide Icons
- React Hook Form

### Backend:
- Node.js
- Express
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- CORS

## 📝 Notas Importantes

1. **MongoDB Atlas**: Asegúrate de tener tu IP autorizada en Network Access
2. **JWT_SECRET**: Usa un secret fuerte en producción
3. **CORS**: Configurado para desarrollo, ajustar en producción
4. **Soft Delete**: Las eliminaciones son "soft" (isActive: false)
5. **Autenticación**: Tokens JWT válidos por 30 días

## 🎯 Estado Actual del Proyecto

- ✅ Backend API completo con autenticación JWT
- ✅ 5 modelos de base de datos con 7 relaciones
- ✅ CRUD completo para todas las entidades
- ✅ Script seed con datos de ejemplo
- ✅ Documentación completa
- ✅ Frontend Vite+React+TypeScript base
- ⏳ Integración frontend-backend (próximo paso)
- ⏳ Panel de administración en frontend
- ⏳ Formulario de cotizaciones funcional
- ⏳ Subida de imágenes (Cloudinary/S3)

## 🆘 Soporte

Si tienes problemas:
1. Verifica que MongoDB esté conectado: `GET http://localhost:4000/api/health`
2. Revisa logs del backend en la terminal
3. Verifica que las variables de entorno estén configuradas
4. Asegúrate de que los puertos 3000 y 4000 estén disponibles

---

**Original Design**: Este proyecto está basado en el diseño de Figma: https://www.figma.com/design/HHBvVEUJE1wNaDEvybC2df/Company-Website-Design
