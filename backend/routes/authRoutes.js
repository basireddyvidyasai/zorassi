const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUsers, updateUserRole, deleteUser, getMe } = require('../controllers/authController');
const { protect, restrictTo } = require('../middleware/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.get('/', protect, restrictTo('Admin'), getUsers);
router.route('/:id')
  .put(protect, restrictTo('Admin'), updateUserRole)
  .delete(protect, restrictTo('Admin'), deleteUser);

module.exports = router;
