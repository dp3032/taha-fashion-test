const mongoose = require('mongoose');

const refundSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'user-Data', required: true },
  order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  UserName : { type: String, required: true },
  Name : { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipcode: { type: String, required: true },
  contactnumber: { type: String, required: true },
  note: { type: String, required: false },
  products: [{ 
    product_name: String,
    quantity: Number,
    price: Number,
    selectedSize: String,
    Product_img: [String],
  }],
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  order_date: { type: String},
  Refund_status: { type: String, default: 'Pending' },  
  razorpay_order_id: { type: String },
  paymentDetails: [{
    paymentDate: Date,
    paymentStatus: String,
    payment_id: String,
    order_id: String,
    signature: String,
    status: { type: String, default: null },
    method: { type: String, default: null },
    bank: { type: String, default: null },
    wallet: { type: String, default: null },
    vpa: { type: String, default: null },
    fee: { type: Number, default: null},
  }],
  refund_date: { type: String, 
    default: () => {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0'); 
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = today.getFullYear();
        return `${day}/${month}/${year}`;
    } },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Refund', refundSchema);
