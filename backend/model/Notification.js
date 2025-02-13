const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  type: String,  // 'user-register', 'order-placed', 'product-added', etc.
  message: String,
  createdAt: { type: Date, default: Date.now },
  status: { type: Boolean, default: false }, // false = not read, true = read
  username: { type: String, required: true },  // Store the username with the notification
});

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
