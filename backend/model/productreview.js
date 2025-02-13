const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    message: { type: String, required: true },
    name: { type: String, required: true },
    rating_date: { 
        type: String, 
        default: () => {
            const today = new Date();
            const day = String(today.getDate()).padStart(2, '0'); 
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const year = today.getFullYear();
            return `${day}/${month}/${year}`;
        }
    },
    createdAt: { type: Date, default: Date.now }, 
});

module.exports = mongoose.model('review', ReviewSchema);
