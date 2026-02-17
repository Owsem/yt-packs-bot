const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user_id: { type: Number, required: true },
  pack_id: { type: String, required: true },
  price: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  status: { type: String, default: 'paid' }
});

module.exports = mongoose.model('Order', orderSchema);

