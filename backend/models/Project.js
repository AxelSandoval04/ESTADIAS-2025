const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  // RELACIÓN: Cliente que solicitó el proyecto (User con rol 'user')
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // RELACIÓN: Categoría del proyecto
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  client: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  images: [{
    type: String // URLs de imágenes
  }],
  mainImage: {
    type: String // URL imagen principal
  },
  status: {
    type: String,
    enum: ['completed', 'in-progress', 'planned'],
    default: 'completed'
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  features: [{
    type: String
  }],
  metrics: {
    power: String, // ej: "500 kW"
    area: String,  // ej: "1000 m²"
    duration: String // ej: "3 meses"
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  },
  // RELACIÓN: usuario que creó/modificó el proyecto
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);
