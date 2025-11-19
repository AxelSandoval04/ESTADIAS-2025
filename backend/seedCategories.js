require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/Category');

const MONGODB_URI = process.env.MONGODB_URI || '';

const categories = [
  {
    name: 'Residencial',
    description: 'Proyectos de instalaciones eléctricas en viviendas y departamentos',
    icon: 'Home',
    order: 1
  },
  {
    name: 'Comercial',
    description: 'Instalaciones para oficinas, tiendas y locales comerciales',
    icon: 'Store',
    order: 2
  },
  {
    name: 'Industrial',
    description: 'Proyectos eléctricos para fábricas, plantas y naves industriales',
    icon: 'Factory',
    order: 3
  }
];

async function seedCategories() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    // Limpiar categorías existentes
    await Category.deleteMany({});
    console.log('🗑️  Categorías antiguas eliminadas');

    // Insertar categorías iniciales
    await Category.insertMany(categories);
    console.log('✅ Categorías iniciales creadas');

    mongoose.connection.close();
    console.log('👋 Desconectado de MongoDB');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

seedCategories();
