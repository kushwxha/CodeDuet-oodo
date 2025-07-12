const SwapRequest = require('../models/SwapRequest');
const User = require('../models/User');

// POST /api/swaps/
const createSwap = async (req, res) => {
  const { toUserId, skill } = req.body;

  if (!toUserId || !skill) {
    return res.status(400).json({ message: 'Missing data' });
  }

  if (toUserId === req.user._id.toString()) {
    return res.status(400).json({ message: 'Cannot request yourself' });
  }

  const toUser = await User.findById(toUserId);
  if (!toUser || !toUser.isPublic) {
    return res.status(404).json({ message: 'User not found or not public' });
  }

  const swap = await SwapRequest.create({
    fromUser: req.user._id,
    toUser: toUserId,
    skill,
  });

  res.status(201).json(swap);
};

// GET /api/swaps/
const getMySwaps = async (req, res) => {
  const sent = await SwapRequest.find({ fromUser: req.user._id })
    .populate('toUser', 'name email')
    .sort('-createdAt');

  const received = await SwapRequest.find({ toUser: req.user._id })
    .populate('fromUser', 'name email')
    .sort('-createdAt');

  res.json({ sent, received });
};

// PUT /api/swaps/:id/respond
const respondToSwap = async (req, res) => {
  const { id } = req.params;
  const { action } = req.body;

  const swap = await SwapRequest.findById(id);
  if (!swap) return res.status(404).json({ message: 'Swap not found' });

  if (swap.toUser.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  if (swap.status !== 'pending') {
    return res.status(400).json({ message: 'Swap already responded' });
  }

  if (!['accepted', 'rejected'].includes(action)) {
    return res.status(400).json({ message: 'Invalid action' });
  }

  swap.status = action;
  await swap.save();

  res.json({ message: `Swap ${action}` });
};

// DELETE /api/swaps/:id
const deleteSwap = async (req, res) => {
  const swap = await SwapRequest.findById(req.params.id);
  if (!swap) return res.status(404).json({ message: 'Swap not found' });

  if (swap.fromUser.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  if (swap.status !== 'pending') {
    return res.status(400).json({ message: 'Cannot delete accepted/rejected swap' });
  }

  await swap.remove();
  res.json({ message: 'Swap deleted' });
};

const addFeedback = async (req, res) => {
  const { rating, comment } = req.body;
  const { id } = req.params;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }

  const swap = await SwapRequest.findById(id);
  if (!swap) return res.status(404).json({ message: 'Swap not found' });

  if (swap.status !== 'accepted') {
    return res.status(400).json({ message: 'Can only rate accepted swaps' });
  }

  if (swap.fromUser.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized to give feedback on this swap' });
  }

  if (swap.feedback && swap.feedback.rating) {
    return res.status(400).json({ message: 'Feedback already submitted' });
  }

  swap.feedback = { rating, comment };
  await swap.save();

  res.json({ message: 'Feedback submitted successfully' });
};


module.exports = { createSwap, getMySwaps, respondToSwap, deleteSwap , addFeedback};