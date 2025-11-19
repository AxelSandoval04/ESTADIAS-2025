const Review = require('../models/Review');

// @desc    Listar reseñas aprobadas (público)
// @route   GET /api/reviews
// @access  Public
exports.getReviews = async (req, res) => {
  try {
    const { project } = req.query;
    const filter = { status: 'approved', isActive: true };
    if (project) filter.project = project;

    const reviews = await Review.find(filter)
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name')
      .populate('project', 'title');
    res.json(reviews);
  } catch (error) {
    console.error('Error en getReviews:', error);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Listar TODAS las reseñas (admin)
// @route   GET /api/reviews/all
// @access  Private/Admin
exports.getAllReviews = async (req, res) => {
  try {
    const { project, status } = req.query;
    const filter = {};
    if (project) filter.project = project;
    if (status) filter.status = status;

    const reviews = await Review.find(filter)
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name email')
      .populate('project', 'title');
    res.json(reviews);
  } catch (error) {
    console.error('Error en getAllReviews:', error);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Crear reseña (requiere login)
// @route   POST /api/reviews
// @access  Private (user)
exports.createReview = async (req, res) => {
  try {
    const { comment, rating, project } = req.body;
    const review = await Review.create({
      comment,
      rating,
      project: project || undefined,
      createdBy: req.user._id,
      status: 'pending', // queda pendiente para moderación
    });
    res.status(201).json(review);
  } catch (error) {
    console.error('Error en createReview:', error);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Moderar reseña (aprobar/rechazar)
// @route   POST /api/reviews/:id/moderate
// @access  Private/Admin
exports.moderateReview = async (req, res) => {
  try {
    const { status } = req.body; // 'approved' | 'rejected'
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Estado inválido' });
    }
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!review) return res.status(404).json({ error: 'Reseña no encontrada' });
    res.json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Eliminar reseña (admin)
// @route   DELETE /api/reviews/:id
// @access  Private/Admin
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!review) return res.status(404).json({ error: 'Reseña no encontrada' });
    res.json({ message: 'Reseña eliminada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
