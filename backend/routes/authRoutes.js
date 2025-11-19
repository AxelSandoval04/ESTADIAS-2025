const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
  register,
  login,
  getMe,
  getUsers,
  updateUser,
  deleteUser
} = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
// Actualizar perfil propio
router.put('/profile', protect, require('../controllers/authController').updateProfile);
router.get('/users', protect, admin, getUsers);
router.put('/users/:id', protect, admin, updateUser);
router.delete('/users/:id', protect, admin, deleteUser);

module.exports = router;
