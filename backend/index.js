require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || '';

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const quoteRoutes = require('./routes/quoteRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
// Uploads route will be added for standalone image upload if needed

// Endpoint de salud
app.get('/api/health', (req, res) => {
  const status = mongoose.connection.readyState;
  // 0 disconnected, 1 connected, 2 connecting, 3 disconnecting
  res.json({ 
    mongoState: status,
    message: status === 1 ? 'Conectado a MongoDB' : 'No conectado'
  });
});

// Rutas principales
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/reviews', reviewRoutes);
// Servir imágenes estáticas subidas
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ruta raíz
app.get('/', (req, res) => {
  res.json({ 
    message: 'API Backend - Instalaciones Eléctricas',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      projects: '/api/projects',
      quotes: '/api/quotes',
      categories: '/api/categories',
      reviews: '/api/reviews',
      health: '/api/health'
    }
  });
});

// Manejador de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal!' });
});

// Conectar a MongoDB y arrancar servidor
async function start() {
  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI no configurada. Copia .env.example a .env y coloca tu URI');
    process.exit(1);
  }

  if (!process.env.JWT_SECRET) {
    console.error('❌ JWT_SECRET no configurada. Agrégala en el archivo .env');
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    app.listen(PORT, () => {
      console.log(`🚀 Backend escuchando en http://localhost:${PORT}`);
      console.log(`📚 Documentación de endpoints disponible en http://localhost:${PORT}/`);
    });
  } catch (err) {
    console.error('❌ Error conectando a MongoDB:', err.message);
    process.exit(1);
  }
}

start();
