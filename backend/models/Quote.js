const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
  // Usuario autenticado que crea la cotización (OPCIONAL para cotizaciones anónimas)
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  // Datos del cliente (requeridos solo si no hay userId)
  name: {
    type: String,
    required: function() { return !this.userId; },
    trim: true
  },
  email: {
    type: String,
    required: function() { return !this.userId; },
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: function() { return !this.userId; },
    trim: true
  },
  // Detalles de la cotización
  message: {
    type: String,
    required: true
  },
  projectType: {
    type: String,
    enum: ['residencial', 'comercial', 'industrial', 'otro'],
    default: 'residencial'
  },
  urgency: {
    type: String,
    enum: ['baja', 'media', 'alta', 'urgente'],
    default: 'media'
  },
  budget: {
    min: Number,
    max: Number
  },
  // Estado y gestión
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'responded', 'closed'],
    default: 'pending'
  },
  adminNotes: {
    type: String
  },
  response: {
    message: String,
    sentAt: Date,
    sentBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  // RELACIÓN: admin que gestionó
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Quote', quoteSchema);
