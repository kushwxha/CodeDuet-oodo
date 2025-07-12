const express = require('express');
const {
  getProfile,
  updateProfile,
  listUsers,
  searchUsersBySkill,
} = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/me', protect, getProfile);
router.put('/me', protect, updateProfile);
router.get('/', protect, listUsers); // list public profiles
router.get('/search', protect, searchUsersBySkill); // ?skill=Photoshop

module.exports = router;
