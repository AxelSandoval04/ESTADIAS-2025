// Script para poblar la base de datos con datos de ejemplo
// Ejecutar: node seed.js

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Service = require('./models/Service');
const Project = require('./models/Project');
const Quote = require('./models/Quote');
const Testimonial = require('./models/Testimonial');
const Review = require('./models/Review');

const MONGODB_URI = process.env.MONGODB_URI;

async function seedDatabase() {
  try {
    console.log('🌱 Conectando a MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado');

    // Limpiar colecciones existentes
    console.log('🗑️  Limpiando datos anteriores...');
    await User.deleteMany({});
    await Service.deleteMany({});
    await Project.deleteMany({});
  await Quote.deleteMany({});
  await Testimonial.deleteMany({});
  await Review.deleteMany({});

    // 1. Crear usuarios
    console.log('👤 Creando usuarios...');

    const admin = await User.create({
      name: 'Admin Principal',
      email: 'admin@instalacioneselectricas.com',
      password: 'admin123',
      role: 'admin'
    });

    const admin2 = await User.create({
      name: 'María González',
      email: 'maria@instalacioneselectricas.com',
      password: 'admin123',
      role: 'admin'
    });

    const adminMoreno = await User.create({
      name: 'Ing Jesus Moreno',
      email: 'isielect@gmail.com',
      password: 'admin123',
      role: 'admin'
    });

    const userCustomer = await User.create({
      name: 'Cliente Demo',
      email: 'cliente@demo.com',
      password: 'demo123',
      role: 'user'
    });

    console.log('✅ Usuarios creados');

    // 2. Crear servicios
    console.log('🔧 Creando servicios...');
    const services = await Service.insertMany([
      {
        title: 'Instalación Eléctrica Residencial',
        description: 'Instalación completa de sistemas eléctricos para hogares. Incluye cableado, tableros, iluminación y tomas de corriente.',
        shortDescription: 'Instalación eléctrica completa para tu hogar',
        icon: 'Home',
        category: 'instalacion',
        features: [
          'Cableado certificado',
          'Tableros de distribución',
          'Iluminación LED',
          'Tomas de corriente',
          'Garantía de 2 años'
        ],
        price: { min: 500, max: 5000, currency: 'USD' },
        isActive: true,
        order: 1,
        createdBy: admin._id
      },
      {
        title: 'Instalación Eléctrica Industrial',
        description: 'Instalaciones eléctricas para industrias, fábricas y plantas de producción. Sistemas de alta potencia y automatización.',
        shortDescription: 'Instalaciones eléctricas industriales de alta potencia',
        icon: 'Factory',
        category: 'instalacion',
        features: [
          'Sistemas de alta tensión',
          'Automatización industrial',
          'Transformadores',
          'Sistemas de respaldo',
          'Certificación industrial'
        ],
        price: { min: 10000, max: 100000, currency: 'USD' },
        isActive: true,
        order: 2,
        createdBy: admin._id
      },
      {
        title: 'Mantenimiento Preventivo',
        description: 'Servicio de mantenimiento preventivo para sistemas eléctricos. Inspecciones periódicas y ajustes necesarios.',
        shortDescription: 'Mantén tu sistema eléctrico en óptimas condiciones',
        icon: 'Wrench',
        category: 'mantenimiento',
        features: [
          'Inspección completa',
          'Termografía infrarroja',
          'Ajuste de conexiones',
          'Reporte técnico',
          'Recomendaciones'
        ],
        price: { min: 200, max: 1000, currency: 'USD' },
        isActive: true,
        order: 3,
        createdBy: admin._id
      },
      {
        title: 'Reparación de Emergencia 24/7',
        description: 'Servicio de reparación eléctrica de emergencia disponible las 24 horas del día, los 7 días de la semana.',
        shortDescription: 'Atención inmediata a emergencias eléctricas',
        icon: 'AlertCircle',
        category: 'emergencia',
        features: [
          'Disponibilidad 24/7',
          'Tiempo de respuesta < 1 hora',
          'Técnicos certificados',
          'Equipos de diagnóstico',
          'Reparaciones inmediatas'
        ],
        price: { min: 150, max: 2000, currency: 'USD' },
        isActive: true,
        order: 4,
        createdBy: admin._id
      },
      {
        title: 'Paneles Solares e Instalación Fotovoltaica',
        description: 'Instalación de sistemas de energía solar fotovoltaica para reducir costos eléctricos y ser más sostenible.',
        shortDescription: 'Energía solar para tu hogar o negocio',
        icon: 'Sun',
        category: 'instalacion',
        features: [
          'Paneles de alta eficiencia',
          'Inversores de calidad',
          'Conexión a red eléctrica',
          'Monitoreo en tiempo real',
          'ROI en 3-5 años'
        ],
        price: { min: 5000, max: 50000, currency: 'USD' },
        isActive: true,
        order: 5,
        createdBy: admin._id
      }
    ]);

    console.log('✅ Servicios creados');

    // 3. Crear proyectos
    console.log('🏗️  Creando proyectos...');
    const projects = await Project.insertMany([
      {
        title: 'Centro Comercial Plaza Central',
        description: 'Instalación eléctrica completa de centro comercial de 3 pisos con 120 locales comerciales.',
        client: 'Desarrollos Comerciales S.A.',
        location: 'Ciudad de México',
        mainImage: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a',
        services: [services[0]._id, services[1]._id],
        status: 'completed',
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-06-30'),
        features: [
          '500 kW de potencia instalada',
          'Sistema de iluminación LED',
          'Planta de emergencia',
          'Sistema de seguridad integrado'
        ],
        metrics: {
          power: '500 kW',
          area: '15,000 m²',
          duration: '5.5 meses'
        },
        isActive: true,
        isFeatured: true,
        order: 1,
        createdBy: admin._id
      },
      {
        title: 'Complejo Residencial Los Pinos',
        description: 'Instalación eléctrica de 50 unidades residenciales con áreas comunes y sistemas de seguridad.',
        client: 'Inmobiliaria Habitat',
        location: 'Monterrey',
        mainImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00',
        services: [services[0]._id, services[4]._id],
        status: 'completed',
        startDate: new Date('2024-03-01'),
        endDate: new Date('2024-08-15'),
        features: [
          '50 departamentos',
          'Paneles solares comunitarios',
          'Iluminación exterior LED',
          'Sistema de respaldo'
        ],
        metrics: {
          power: '300 kW',
          area: '8,000 m²',
          duration: '5.5 meses'
        },
        isActive: true,
        isFeatured: true,
        order: 2,
        createdBy: admin._id
      },
      {
        title: 'Planta Industrial AutoParts',
        description: 'Modernización completa del sistema eléctrico de planta industrial automotriz.',
        client: 'AutoParts Manufacturing',
        location: 'Guadalajara',
        mainImage: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12',
        services: [services[1]._id, services[2]._id],
        status: 'completed',
        startDate: new Date('2023-10-01'),
        endDate: new Date('2024-02-28'),
        features: [
          'Sistemas de alta tensión',
          'Automatización de procesos',
          'Transformadores de 1000 kVA',
          'Sistema de respaldo dual'
        ],
        metrics: {
          power: '2 MW',
          area: '25,000 m²',
          duration: '5 meses'
        },
        isActive: true,
        isFeatured: true,
        order: 3,
        createdBy: admin._id
      }
    ]);

    console.log('✅ Proyectos creados');

    // 4. Crear cotizaciones
    console.log('💬 Creando cotizaciones...');
    await Quote.insertMany([
      {
        user: userCustomer._id,
        name: 'Juan Pérez',
        email: 'juan.perez@email.com',
        phone: '+52 555 123 4567',
        company: 'Constructora ABC',
        message: 'Necesito cotización para instalación eléctrica en edificio de oficinas de 5 pisos.',
        serviceRequested: services[0]._id,
        projectType: 'comercial',
        urgency: 'media',
        status: 'pending'
      },
      {
        user: userCustomer._id,
        name: 'María López',
        email: 'maria.lopez@email.com',
        phone: '+52 555 987 6543',
        message: 'Requiero mantenimiento preventivo para mi casa. Sistema eléctrico de 10 años.',
        serviceRequested: services[2]._id,
        projectType: 'residencial',
        urgency: 'baja',
        status: 'reviewed',
        assignedTo: admin2._id
      },
      {
        user: userCustomer._id,
        name: 'Carlos Rodríguez',
        email: 'carlos.r@email.com',
        phone: '+52 555 456 7890',
        company: 'Fábrica XYZ',
        message: 'Emergencia: problema con transformador principal. Requiero atención urgente.',
        serviceRequested: services[3]._id,
        projectType: 'industrial',
        urgency: 'urgente',
        status: 'responded',
        assignedTo: admin._id,
        response: {
          message: 'Técnico en camino. ETA: 30 minutos.',
          sentAt: new Date(),
          sentBy: admin._id
        }
      }
    ]);

    console.log('✅ Cotizaciones creadas');

    // 5. Crear testimonios
    console.log('⭐ Creando testimonios...');
    await Testimonial.insertMany([
      {
        clientName: 'Roberto Sánchez',
        clientCompany: 'Desarrollos Comerciales S.A.',
        clientRole: 'Director de Proyectos',
        content: 'Excelente trabajo en el Centro Comercial Plaza Central. Cumplieron tiempos y presupuesto. Muy profesionales.',
        rating: 5,
        project: projects[0]._id,
        isActive: true,
        isFeatured: true,
        order: 1,
        createdBy: admin._id
      },
      {
        clientName: 'Ana Martínez',
        clientCompany: 'Inmobiliaria Habitat',
        clientRole: 'Gerente de Construcción',
        content: 'La instalación de paneles solares superó nuestras expectativas. Ahora nuestros residentes disfrutan de tarifas eléctricas reducidas.',
        rating: 5,
        project: projects[1]._id,
        isActive: true,
        isFeatured: true,
        order: 2,
        createdBy: admin._id
      },
      {
        clientName: 'Luis Hernández',
        clientCompany: 'AutoParts Manufacturing',
        clientRole: 'Gerente de Planta',
        content: 'Modernizaron nuestra planta con tecnología de punta. El sistema de automatización ha mejorado nuestra eficiencia en 30%.',
        rating: 5,
        project: projects[2]._id,
        isActive: true,
        isFeatured: true,
        order: 3,
        createdBy: admin._id
      },
      {
        clientName: 'Patricia Gómez',
        clientRole: 'Propietaria',
        content: 'Contraté el servicio de emergencia y llegaron en menos de 40 minutos. Solucionaron el problema rápidamente. Totalmente recomendados.',
        rating: 5,
        isActive: true,
        isFeatured: false,
        order: 4,
        createdBy: admin._id
      }
    ]);

    console.log('✅ Testimonios creados');

    // 6. Crear reseñas (reviews)
    console.log('📝 Creando reseñas...');
    await Review.insertMany([
      {
        createdBy: userCustomer._id,
        comment: 'Excelente servicio residencial, muy profesionales.',
        rating: 5,
        service: services[0]._id,
        status: 'approved'
      },
      {
        createdBy: userCustomer._id,
        comment: 'La instalación industrial fue rápida y de calidad.',
        rating: 5,
        service: services[1]._id,
        project: projects[2]._id,
        status: 'approved'
      },
      {
        createdBy: userCustomer._id,
        comment: 'Atención de emergencia en menos de una hora, gracias!',
        rating: 4,
        service: services[3]._id,
        status: 'pending'
      }
    ]);
    console.log('✅ Reseñas creadas');

    console.log('\n🎉 ¡Base de datos poblada exitosamente!');
    console.log('\n📊 Resumen:');
    console.log(`   - 2 usuarios (admins)`);
    console.log(`   - 5 servicios`);
    console.log(`   - 3 proyectos`);
  console.log(`   - 3 cotizaciones`);
  console.log(`   - 4 testimonios`);
  console.log(`   - 3 reseñas`);
    console.log('\n🔑 Credenciales de login:');
    console.log(`   Email: admin@instalacioneselectricas.com`);
    console.log(`   Password: admin123`);
  console.log(`   Usuario cliente: cliente@demo.com / demo123`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

seedDatabase();
