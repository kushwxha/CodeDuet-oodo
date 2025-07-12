const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
  createSwap,
  getMySwaps,
  respondToSwap,
  deleteSwap,
  addFeedback
} = require('../controllers/swapController');

router.post('/', protect, createSwap);
router.get('/', protect, getMySwaps);
router.put('/:id/respond', protect, respondToSwap);
router.delete('/:id', protect, deleteSwap);
router.put('/:id/feedback', protect, addFeedback);


module.exports = router;
