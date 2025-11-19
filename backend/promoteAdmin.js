require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const MONGODB_URI = process.env.MONGODB_URI;

async function promoteToAdmin(email) {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    const user = await User.findOne({ email });
    
    if (!user) {
      console.log(`❌ No se encontró un usuario con email: ${email}`);
      process.exit(1);
    }

    console.log(`Usuario encontrado: ${user.name} (${user.email})`);
    console.log(`Rol actual: ${user.role}`);

    user.role = 'admin';
    await user.save();

    console.log(`✅ Usuario ${user.name} promovido a ADMIN exitosamente`);
    
    await mongoose.disconnect();
    console.log('✅ Desconectado de MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Obtener email de argumentos de línea de comandos
const email = process.argv[2];

if (!email) {
  console.log('❌ Uso: node promoteAdmin.js <email>');
  console.log('Ejemplo: node promoteAdmin.js usuario@ejemplo.com');
  process.exit(1);
}

promoteToAdmin(email);
