const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "user-Data", required: false },
  UserName: { type: String, required: false },
  Name: { type: String, required: false },
  email: { type: String, required: false },
  address: { type: String, required: false },
  city: { type: String, required: false },
  state: { type: String, required: false },
  zipcode: { type: String, required: false },
  contactnumber: { type: String, required: false },
  note: { type: String },
  products: [{
    product_id: { type: String, required: false },
    product_name: { type: String, required: false },
    quantity: { type: Number, required: false },
    selectedSize: { type: String },
    price: { type: Number, required: false },
    Product_img: { type: [String] },
  }],
  totalAmount: { type: Number, required: false },
  paymentMethod: { type: String, required: false },
  order_status: { type: String, default: 'Pending' },
  order_status_time: { type: Date, default: null},
  razorpay_order_id: { type: String },
  paymentDetails: [{
    paymentDate: { type: Date, required: false },
    paymentStatus: { type: String, required: false },
    payment_id: { type: String, default: null },
    order_id: { type: String, default: null },
    signature: { type: String, default: null },
    status: { type: String, default: null },
    method: { type: String, default: null },
    bank: { type: String, default: null },
    wallet: { type: String, default: null },
    vpa: { type: String, default: null },
    fee: { type: Number, default: null},
  }],
  order_date: {
    type: String,
    default: () => {
      const today = new Date();
      const day = String(today.getDate()).padStart(2, '0');
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const year = today.getFullYear();
      return `${day}/${month}/${year}`;
    },
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);
