const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  user_id: { type: Number, required: true },
  type: { type: String, enum: ['text'], default: 'text' },
  content: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Feedback', feedbackSchema);
