const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
  getQuotes,
  getQuoteById,
  createQuote,
  updateQuote,
  respondQuote,
  deleteQuote
} = require('../controllers/quoteController');

// Crear cotización: requiere login (usuario)
router.post('/', protect, createQuote);
router.get('/', protect, admin, getQuotes);
router.get('/:id', protect, admin, getQuoteById);
router.put('/:id', protect, admin, updateQuote);
router.post('/:id/respond', protect, admin, respondQuote);
router.delete('/:id', protect, admin, deleteQuote);

module.exports = router;
