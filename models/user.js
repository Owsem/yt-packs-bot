const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  user_id: { type: Number, required: true, unique: true },
  username: { type: String },
  first_seen: { type: Date, default: Date.now },
  last_seen: { type: Date, default: Date.now },
  email: { type: String, default: null },
  phone: { type: String, default: null }
});

module.exports = mongoose.model('User', userSchema);
