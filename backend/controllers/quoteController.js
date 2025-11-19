const Quote = require('../models/Quote');

// @desc    Obtener todas las cotizaciones
// @route   GET /api/quotes
// @access  Private/Admin
exports.getQuotes = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    
    const quotes = await Quote.find(filter)
      .sort({ createdAt: -1 })
      .populate('userId', 'name email')
      .populate('assignedTo', 'name email')
      .populate('response.sentBy', 'name email');
    res.json(quotes);
  } catch (error) {
    console.error('Error en getQuotes:', error);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Obtener una cotización por ID
// @route   GET /api/quotes/:id
// @access  Private/Admin
exports.getQuoteById = async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('assignedTo', 'name email')
      .populate('response.sentBy', 'name email');
    if (!quote) {
      return res.status(404).json({ error: 'Cotización no encontrada' });
    }
    res.json(quote);
  } catch (error) {
    console.error('Error en getQuoteById:', error);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Crear nueva cotización (requiere login)
// @route   POST /api/quotes
// @access  Private (user)
exports.createQuote = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      userId: req.user?._id || undefined,
    };

    // Autocompletar nombre/email desde el usuario autenticado si no vienen y es user logueado
    if (req.user) {
      if (!payload.name) payload.name = req.user.name;
      if (!payload.email) payload.email = req.user.email;
    }

    const quote = await Quote.create(payload);
    res.status(201).json(quote);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Actualizar cotización (cambiar estado, asignar, etc)
// @route   PUT /api/quotes/:id
// @access  Private/Admin
exports.updateQuote = async (req, res) => {
  try {
    const quote = await Quote.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!quote) {
      return res.status(404).json({ error: 'Cotización no encontrada' });
    }
    res.json(quote);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Responder cotización
// @route   POST /api/quotes/:id/respond
// @access  Private/Admin
exports.respondQuote = async (req, res) => {
  try {
    const { message } = req.body;
    const quote = await Quote.findByIdAndUpdate(
      req.params.id,
      {
        status: 'responded',
        response: {
          message,
          sentAt: new Date(),
          sentBy: req.user._id
        }
      },
      { new: true }
    ).populate('response.sentBy', 'name email');
    
    if (!quote) {
      return res.status(404).json({ error: 'Cotización no encontrada' });
    }
    res.json(quote);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Eliminar cotización
// @route   DELETE /api/quotes/:id
// @access  Private/Admin
exports.deleteQuote = async (req, res) => {
  try {
    const quote = await Quote.findByIdAndDelete(req.params.id);
    if (!quote) {
      return res.status(404).json({ error: 'Cotización no encontrada' });
    }
    res.json({ message: 'Cotización eliminada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
