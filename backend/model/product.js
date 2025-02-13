const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductdataSchema = new Schema({
  Product_name: { type: String },
  Product_des: { type: String },
  Product_price: { type: Number },
  Product_category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  Product_img: [String],
  Product_sizes: { type: [String], default: [] },
  Size_images: [String],
  Best_seller: { type: Boolean, default: false }, 
  Product_quantity: { type: Number, required: true, default: 0 },
  Product_stock_status: { type: String, required: true },
  tags: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now }
});

// Middleware for `findOneAndUpdate`
ProductdataSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate();

  
  if (update.Product_quantity !== undefined) {
    if (update.Product_quantity === 0) {
      update.Product_stock_status = 'out-of-stock';
    } else {
      
      if (!update.hasOwnProperty('Product_stock_status')) {
        update.Product_stock_status = 'stock';
      }
    }
  }

  next();
});

module.exports = mongoose.model('product', ProductdataSchema);
