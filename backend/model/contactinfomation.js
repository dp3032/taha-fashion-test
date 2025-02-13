const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ContactInfodataSchema = new Schema({
  Info_contact: {
    type: String,
    required: [true, 'Contact number is required'],
    match: [/^\d{10}$/, 'Please enter a valid contact number'], 
  },
  Info_email: {
    type: String,
    required: [true, 'Email is required'],
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'], 
  },
  Info_address: {
    type: String,
    required: [true, 'Address is required'],
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('contact-infomation', ContactInfodataSchema);
