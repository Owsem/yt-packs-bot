const mongoose = require('mongoose');

const packSchema = new mongoose.Schema({
  pack_id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  sample_url: { type: String },
  file_url: { type: String }
});

module.exports = mongoose.model('Pack', packSchema);

