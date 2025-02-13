const mongoose = require('mongoose');
const viewSchema = new mongoose.Schema({
    date: { type: String, required: true },
    viewCount: { type: Number, default: 1 },
  });
  
  module.exports = mongoose.model("View", viewSchema);