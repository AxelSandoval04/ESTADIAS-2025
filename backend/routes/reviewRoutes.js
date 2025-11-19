const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const { getReviews, getAllReviews, createReview, moderateReview, deleteReview } = require('../controllers/reviewController');

// Público: listar reseñas aprobadas (con filtros opcionales)
router.get('/', getReviews);
router.get('/approved', getReviews);

// Admin: listar TODAS las reseñas (incluyendo pendientes y rechazadas)
router.get('/all', protect, admin, getAllReviews);

// Usuarios autenticados: crear reseña
router.post('/', protect, createReview);

// Admin: moderar y eliminar
router.post('/:id/moderate', protect, admin, moderateReview);
router.delete('/:id', protect, admin, deleteReview);

module.exports = router;
