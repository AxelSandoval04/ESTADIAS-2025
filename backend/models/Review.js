const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  // Usuario que crea la reseña (requerido)
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // Texto de la reseña/comentario
  comment: {
    type: String,
    required: true,
    trim: true,
  },
  // Calificación de 1 a 5
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  // Enlace opcional a Project
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
  },
  // Estado para moderación por admin
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  // Visibilidad
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
