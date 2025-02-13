const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MainAdminBannerSchema = new Schema({
  MainBanner_name: { type: String, required: true },
  MainBanner_img: { type: [String], required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('main-admin-banner', MainAdminBannerSchema);
