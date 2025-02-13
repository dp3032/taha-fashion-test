const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Function to get current date and time in India (IST) in 12-hour AM/PM format
const getIndiaDateTime = () => {
  const options = {
    timeZone: 'Asia/Kolkata',  // India Standard Time (IST)
    weekday: 'long',           // Full weekday name (e.g., "Monday")
    year: 'numeric',           // Full year (e.g., 2024)
    month: 'long',             // Full month name (e.g., "December")
    day: 'numeric',            // Day of the month (e.g., 9)
    hour: '2-digit',           // 2-digit hour (12-hour format)
    minute: '2-digit',         // 2-digit minute
    second: '2-digit',         // 2-digit second
    hour12: true,              // 12-hour format with AM/PM
  };

  const formatter = new Intl.DateTimeFormat('en-IN', options);
  const date = new Date();
  return formatter.format(date);  // Returns formatted date and time in 12-hour format with AM/PM
};

const ContactdataSchema = new Schema({
  Contact_name: { type: String },
  Contact_email: { type: String },
  Contact_number: { type: String },
  Contact_msg: { type: String },
  contact_time: { type: String },  // Will be set automatically in pre-save middleware
});

// Pre-save middleware to automatically set contact_time to current date and time in 12-hour format
ContactdataSchema.pre('save', function(next) {
  if (!this.contact_time) {  // Only set contact_time if it's not already provided
    this.contact_time = getIndiaDateTime();  // Set the date and time to India Time (12-hour format)
  }
  next();
});

module.exports = mongoose.model('contact', ContactdataSchema);
