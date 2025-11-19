# 📊 RESUMEN: Base de Datos MongoDB - Backend Completo

## ✅ 5 TABLAS (COLECCIONES) CREADAS

### 1️⃣ **USERS** (Usuarios/Administradores)
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed con bcrypt),
  role: String ('admin' | 'user'),
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```
**Propósito**: Gestión de autenticación y panel de administración

---

### 2️⃣ **SERVICES** (Servicios ofrecidos)
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  shortDescription: String,
  icon: String,
  images: [String],
  features: [String],
  price: { min: Number, max: Number, currency: String },
  category: String ('instalacion' | 'mantenimiento' | 'reparacion' | 'emergencia' | 'otros'),
  isActive: Boolean,
  order: Number,
  createdBy: ObjectId → User,      // ⚡ RELACIÓN
  updatedBy: ObjectId → User,      // ⚡ RELACIÓN
  createdAt: Date,
  updatedAt: Date
}
```
**Propósito**: Catálogo de servicios que ofrece la empresa

---

### 3️⃣ **PROJECTS** (Proyectos realizados)
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  client: String,
  location: String,
  images: [String],
  mainImage: String,
  services: [ObjectId → Service],  // ⚡ RELACIÓN (many-to-many)
  status: String ('completed' | 'in-progress' | 'planned'),
  startDate: Date,
  endDate: Date,
  features: [String],
  metrics: { power: String, area: String, duration: String },
  isActive: Boolean,
  isFeatured: Boolean,
  order: Number,
  createdBy: ObjectId → User,      // ⚡ RELACIÓN
  updatedBy: ObjectId → User,      // ⚡ RELACIÓN
  createdAt: Date,
  updatedAt: Date
}
```
**Propósito**: Portfolio de proyectos completados para mostrar en la web

---

### 4️⃣ **QUOTES** (Cotizaciones/Solicitudes)
```javascript
{
  _id: ObjectId,
  user: ObjectId → User,         // ⚡ RELACIÓN (usuario autenticado que la crea)
  // Datos del cliente
  name: String,
  email: String,
  phone: String,
  company: String,
  
  // Detalles
  message: String,
  serviceRequested: ObjectId → Service,  // ⚡ RELACIÓN
  projectType: String ('residencial' | 'comercial' | 'industrial' | 'otro'),
  urgency: String ('baja' | 'media' | 'alta' | 'urgente'),
  budget: { min: Number, max: Number },
  
  // Gestión admin
  status: String ('pending' | 'reviewed' | 'responded' | 'closed'),
  adminNotes: String,
  response: {
    message: String,
    sentAt: Date,
    sentBy: ObjectId → User          // ⚡ RELACIÓN
  },
  assignedTo: ObjectId → User,       // ⚡ RELACIÓN
  createdAt: Date,
  updatedAt: Date
}
```
**Propósito**: Gestionar solicitudes de cotización desde el formulario web

---
### 5️⃣ **REVIEWS** (Reseñas/Comentarios de clientes)
```javascript
{
  _id: ObjectId,
  createdBy: ObjectId → User,        // ⚡ RELACIÓN (usuario que crea la reseña)
  comment: String,
  rating: Number (1-5),
  service: ObjectId → Service,       // ⚡ RELACIÓN (opcional)
  project: ObjectId → Project,       // ⚡ RELACIÓN (opcional)
  status: 'pending'|'approved'|'rejected',
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```
**Propósito**: Permitir a clientes dejar comentarios y calificaciones moderadas por admin

---

## 🔗 RELACIONES ENTRE TABLAS

### ✅ Relación 1: **SERVICE → USER** (createdBy/updatedBy)
- Cada servicio tiene un admin que lo creó y otro que lo modificó
- **Tipo**: Many-to-One (muchos servicios → un usuario)

### ✅ Relación 2: **PROJECT → SERVICE** (services array)
- Un proyecto puede usar múltiples servicios
- **Tipo**: Many-to-Many (un proyecto puede tener varios servicios, un servicio puede estar en varios proyectos)

### ✅ Relación 3: **PROJECT → USER** (createdBy/updatedBy)
- Cada proyecto tiene un admin que lo creó y otro que lo modificó
- **Tipo**: Many-to-One

### ✅ Relación 4: **QUOTE → SERVICE** (serviceRequested)
- Una cotización puede referenciar un servicio específico solicitado
- **Tipo**: Many-to-One (muchas cotizaciones → un servicio)

### ✅ Relación 5: **QUOTE → USER** (assignedTo, response.sentBy)
- Cotizaciones asignadas a admins para gestión
- Respuestas enviadas por admins específicos
- **Tipo**: Many-to-One

### ✅ Relación 6: **REVIEW → SERVICE/PROJECT** (service/project)
- Una reseña puede estar vinculada a un servicio o proyecto específico (opcional)
- **Tipo**: Many-to-One

### ✅ Relación 7: **REVIEW → USER** (createdBy)
- Cada reseña tiene un usuario que la creó; su visibilidad es moderada por admin
- **Tipo**: Many-to-One

---

## 📊 DIAGRAMA DE RELACIONES SIMPLIFICADO

```
┌─────────┐
│  USER   │ ◄─────────┐
└────┬────┘           │
     │                │
     │ createdBy      │ createdBy
     │ updatedBy      │ updatedBy
     ▼                │
┌─────────┐           │
│ SERVICE │           │
└────┬────┘           │
     │                │
     │ serviceRequested│
     │                │
     ▼                ▼
┌─────────┐      ┌─────────┐
│  QUOTE  │      │ PROJECT │
└─────────┘      └────┬────┘
                      │
                      │ project (optional)
                      ▼
                 ┌──────────────┐
                 │   REVIEW     │
                 └──────────────┘

PROJECT.services[] ──many-to-many──► SERVICE
```

---

## 🎯 CASOS DE USO PRINCIPALES

### Para el Frontend Público:
1. **Listar servicios**: `GET /api/services`
2. **Listar proyectos**: `GET /api/projects?featured=true`
3. **Listar testimonios**: `GET /api/testimonials?featured=true`
4. **Enviar cotización**: `POST /api/quotes`

### Para el Panel Admin:
1. **Login**: `POST /api/auth/login`
2. **Crear/editar servicio**: `POST/PUT /api/services`
3. **Crear/editar proyecto**: `POST/PUT /api/projects`
4. **Gestionar cotizaciones**: `GET /api/quotes`, `POST /api/quotes/:id/respond`
5. **Aprobar testimonios**: `POST /api/testimonials`

---

## 🚀 COMANDOS PARA ARRANCAR

```powershell
# 1. Instalar dependencias
cd backend
npm install

# 2. Configurar .env
copy .env.example .env
notepad .env
# Pegar MONGODB_URI y JWT_SECRET

# 3. Arrancar servidor
npm run dev

# 4. Crear primer admin (en otra terminal)
$body = @{
  name = "Admin"
  email = "admin@empresa.com"
  password = "admin123"
  role = "admin"
} | ConvertTo-Json

Invoke-RestMethod -Uri http://localhost:4000/api/auth/register -Method POST -Body $body -ContentType 'application/json'
```

---

## 📦 DEPENDENCIAS INSTALADAS

- **express**: Framework web
- **mongoose**: ODM para MongoDB
- **bcryptjs**: Hash de contraseñas
- **jsonwebtoken**: Autenticación JWT
- **dotenv**: Variables de entorno
- **cors**: CORS para frontend
- **nodemon**: Auto-reload en desarrollo

---

✅ **BACKEND COMPLETO Y LISTO PARA USAR**
