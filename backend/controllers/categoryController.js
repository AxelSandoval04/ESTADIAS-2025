const Category = require('../models/Category');

// GET /api/categories - Obtener todas las categorías (públicas activas o todas si es admin)
exports.getAll = async (req, res) => {
  try {
    const filter = req.user?.role === 'admin' ? {} : { isActive: true };
    const categories = await Category.find(filter).sort({ order: 1, name: 1 });
    res.json(categories);
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({ message: 'Error al obtener categorías', error: error.message });
  }
};

// GET /api/categories/:id - Obtener una categoría por ID
exports.getById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }
    res.json(category);
  } catch (error) {
    console.error('Error al obtener categoría:', error);
    res.status(500).json({ message: 'Error al obtener categoría', error: error.message });
  }
};

// POST /api/categories - Crear una nueva categoría (solo admin)
exports.create = async (req, res) => {
  try {
    const { name, description, icon, order } = req.body;

    const category = new Category({
      name,
      description,
      icon: icon || 'Folder',
      order: order || 0
    });

    await category.save();
    res.status(201).json(category);
  } catch (error) {
    console.error('Error al crear categoría:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Ya existe una categoría con ese nombre' });
    }
    res.status(500).json({ message: 'Error al crear categoría', error: error.message });
  }
};

// PUT /api/categories/:id - Actualizar una categoría (solo admin)
exports.update = async (req, res) => {
  try {
    const { name, description, icon, order, isActive } = req.body;

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, description, icon, order, isActive },
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }

    res.json(category);
  } catch (error) {
    console.error('Error al actualizar categoría:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Ya existe una categoría con ese nombre' });
    }
    res.status(500).json({ message: 'Error al actualizar categoría', error: error.message });
  }
};

// DELETE /api/categories/:id - Eliminar una categoría (solo admin)
exports.delete = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }
    res.json({ message: 'Categoría eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar categoría:', error);
    res.status(500).json({ message: 'Error al eliminar categoría', error: error.message });
  }
};

// PATCH /api/categories/:id/deactivate - Dar de baja (soft-delete) una categoría
exports.deactivate = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }

    res.json({ message: 'Categoría desactivada exitosamente', category });
  } catch (error) {
    console.error('Error al desactivar categoría:', error);
    res.status(500).json({ message: 'Error al desactivar categoría', error: error.message });
  }
};
