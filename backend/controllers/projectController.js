const Project = require('../models/Project');

// @desc    Obtener todos los proyectos activos
// @route   GET /api/projects
// @access  Public
exports.getProjects = async (req, res) => {
  try {
    const { featured } = req.query;
    const filter = { isActive: true };
    if (featured === 'true') {
      filter.isFeatured = true;
    }
    
    const projects = await Project.find(filter)
      .sort({ order: 1, createdAt: -1 })
      .populate('categoryId', 'name icon')
      .populate('clientId', 'name email')
      .populate('createdBy', 'name email');
    res.json(projects);
  } catch (error) {
    console.error('Error en getProjects:', error);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Obtener un proyecto por ID
// @route   GET /api/projects/:id
// @access  Public
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('categoryId', 'name icon')
      .populate('clientId', 'name email')
      .populate('createdBy', 'name email');
    if (!project) {
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }
    res.json(project);
  } catch (error) {
    console.error('Error en getProjectById:', error);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Crear nuevo proyecto
// @route   POST /api/projects
// @access  Private/Admin
exports.createProject = async (req, res) => {
  try {
    const body = req.body;
    // Soportar imagen por archivo o por URL
    let mainImage = body.mainImage;
    if (req.file) {
      mainImage = `/uploads/${req.file.filename}`;
    } else if (body.imageUrl) {
      mainImage = body.imageUrl;
    }

    const payload = {
      title: body.title,
      description: body.description,
      categoryId: body.categoryId,
      clientId: body.clientId || req.user._id, // fallback simple
      images: body.images ? (Array.isArray(body.images) ? body.images : [body.images]) : [],
      mainImage,
      status: body.status || 'completed',
      isFeatured: body.isFeatured || false,
      order: body.order || 0,
      createdBy: req.user._id,
    };

    const project = await Project.create(payload);
    res.status(201).json(project);
  } catch (error) {
    console.error('Error en createProject:', error);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Actualizar proyecto
// @route   PUT /api/projects/:id
// @access  Private/Admin
exports.updateProject = async (req, res) => {
  try {
    const body = req.body;
    const update = { ...body, updatedBy: req.user._id };
    if (req.file) {
      update.mainImage = `/uploads/${req.file.filename}`;
    } else if (body.imageUrl) {
      update.mainImage = body.imageUrl;
    }

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true, runValidators: true }
    );
    if (!project) {
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }
    res.json(project);
  } catch (error) {
    console.error('Error en updateProject:', error);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Eliminar proyecto (soft delete)
// @route   DELETE /api/projects/:id
// @access  Private/Admin
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!project) {
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }
    res.json({ message: 'Proyecto eliminado' });
  } catch (error) {
    console.error('Error en deleteProject:', error);
    res.status(500).json({ error: error.message });
  }
};
