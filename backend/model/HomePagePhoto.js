const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HomePagedataSchema = new Schema({
  Gallery_name: { type: String, required: true }, 
  Gallery_Product_ID: { type: mongoose.Schema.Types.ObjectId, ref: 'product'},
  Gallery_img: { type: [String], required: true }, 
  Gallery_des: { type: String },
  Gallery_price: { type: Number },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('homepagephoto', HomePagedataSchema);
