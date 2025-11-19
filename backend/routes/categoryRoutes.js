const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { protect, admin } = require('../middleware/auth');

// Rutas públicas
router.get('/', categoryController.getAll);
router.get('/:id', categoryController.getById);

// Rutas protegidas (solo admin)
router.post('/', protect, admin, categoryController.create);
router.put('/:id', protect, admin, categoryController.update);
router.delete('/:id', protect, admin, categoryController.delete);
router.patch('/:id/deactivate', protect, admin, categoryController.deactivate);

module.exports = router;
