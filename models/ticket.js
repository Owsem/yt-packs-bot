const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  user_id: { type: Number, required: true },
  username: { type: String },
  message: { type: String, required: true },
  status: { type: String, enum: ['open', 'answered', 'closed'], default: 'open' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  replies: [
    {
      from_admin: { type: Boolean, default: true },
      message: { type: String, required: true },
      date: { type: Date, default: Date.now }
    }
  ]
});

module.exports = mongoose.model('Ticket', ticketSchema);
