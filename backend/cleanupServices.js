require('dotenv').config();
const mongoose = require('mongoose');
const Quote = require('./models/Quote');
const Review = require('./models/Review');

const MONGODB_URI = process.env.MONGODB_URI;

async function cleanupServiceReferences() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    // Limpiar serviceRequested de todas las cotizaciones
    const quotesResult = await Quote.updateMany(
      { serviceRequested: { $exists: true } },
      { $unset: { serviceRequested: "" } }
    );
    console.log(`✅ Limpiadas ${quotesResult.modifiedCount} cotizaciones con referencias a Service`);

    // Limpiar service de todas las reseñas
    const reviewsResult = await Review.updateMany(
      { service: { $exists: true } },
      { $unset: { service: "" } }
    );
    console.log(`✅ Limpiadas ${reviewsResult.modifiedCount} reseñas con referencias a Service`);

    await mongoose.disconnect();
    console.log('✅ Desconectado de MongoDB');
    console.log('\n🎉 Referencias a Service eliminadas exitosamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

cleanupServiceReferences();
