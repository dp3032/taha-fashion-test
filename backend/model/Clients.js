const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClientsdataSchema = new Schema({
    Clients_name: { type: String },
    Clients_img: [{ type: String }],
    createdAt: { type: Date, default: Date.now } 
  });

module.exports = mongoose.model('clients', ClientsdataSchema);
