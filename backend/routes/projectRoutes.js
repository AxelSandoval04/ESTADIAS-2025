const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
} = require('../controllers/projectController');

router.get('/', getProjects);
router.get('/:id', getProjectById);
// Crear y actualizar aceptan multipart/form-data opcional con campo 'image'
router.post('/', protect, admin, upload.single('image'), createProject);
router.put('/:id', protect, admin, upload.single('image'), updateProject);
router.delete('/:id', protect, admin, deleteProject);

module.exports = router;
