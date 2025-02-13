const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReguserdataSchema = new Schema({
    user_name: { type: String },
    user_lastname: { type: String },
    user_email: { type: String },
    user_password: { type: String},
    user_salt: { type: String },
    resetToken: { type: String },
    resetTokenExpiry: { type: Date },
    otp: { type: String },
    otpExpiry: { type: Date },
    isVerified: { type: Boolean, default: false },
    registration_date: { 
        type: String, 
        default: () => {
            const today = new Date();
            const day = String(today.getDate()).padStart(2, '0');  
            const month = String(today.getMonth() + 1).padStart(2, '0'); 
            const year = today.getFullYear();
            return `${day}/${month}/${year}`;  
        }
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('user-Data', ReguserdataSchema);
