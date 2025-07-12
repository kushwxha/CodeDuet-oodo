const mongoose = require('mongoose');

const swapRequestSchema = new mongoose.Schema({
  fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  toUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  skill: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  },
  feedback: {
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('SwapRequest', swapRequestSchema);
