# Sistema Web para Empresa de Instalaciones Eléctricas

Proyecto completo con frontend (React + TypeScript + Vite) y backend (Node.js + Express + MongoDB) para la gestión de servicios, proyectos, cotizaciones y testimonios.

## Estructura

```
Proyecto/
├── src/           # Frontend (React + Vite)
│   └── components/ # Componentes principales
├── backend/       # API REST (Node.js + Express)
│   ├── models/    # Modelos de datos
│   ├── controllers/ # Lógica de negocio
│   ├── routes/    # Endpoints
│   └── middleware/ # Autenticación JWT
└── README.md      # Este archivo
```

## Instalación

### Backend
```powershell
cd backend
npm install
copy .env.example .env
notepad .env # Completa tus variables
npm run seed # Opcional: poblar datos de ejemplo
npm run dev
```
Backend: http://localhost:4000

### Frontend
```powershell
cd ..
npm install
npm run dev
```
Frontend: http://localhost:3000

## Endpoints principales
- `GET /api/services` - Servicios
- `GET /api/projects` - Proyectos
- `POST /api/quotes` - Cotización
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro

## Stack
- React 18, TypeScript, Vite, Tailwind CSS, Radix UI
- Node.js, Express, MongoDB, JWT, bcryptjs

## Notas
- MongoDB Atlas: autoriza tu IP
- JWT_SECRET: usa un valor seguro
- CORS: ajusta para producción
- Soft Delete: isActive: false

## Estado
- Backend y frontend funcionales
- CRUD completo
- Panel admin y formularios activos
- Documentación y scripts de ejemplo

## Soporte
Si tienes problemas, revisa la conexión a MongoDB, los logs del backend y la configuración de variables de entorno.
