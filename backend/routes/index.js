var express = require('express');
var router = express.Router();
const cron = require('node-cron');

const dotenv = require("dotenv");
dotenv.config({ path: './config.env' });

const { checkStock } = require('../controllers/productController');

//Notification DataBase
const Notification = require('../model/Notification');  

// Middleware Start
const apiKeyMiddleware = require('../Middleware/ApiKey'); 

//Controller Start
router.get('/product/:productId/stock', checkStock);

//User Login API 
const UserData = require('./Login-Register/login-reg');
router.use("/user-log-reg", UserData);

//Product API 
const ProductData = require('./Product-data/productfile');
router.use("/product-api", ProductData);

//Catgory API
const CatgoryData = require('./category-data/categoryfile');
router.use("/catgory-api", CatgoryData);

//Product Review API
const ProReview = require('./product-review/pro-review');
router.use("/proreview-api", ProReview);

//Order API
const OrderUser = require('./order-payment/order-pay');
router.use("/order-api", OrderUser);

//Banner API
const mainbanner = require('./Banner/main-banner');
router.use("/main-banner-api", mainbanner);

const productbanner = require('./Banner/product-banner');
router.use("/product-banner-api", productbanner);

// Contact Form API
const contactform = require('./contact-data/contact-form');
router.use("/contact-form-api", contactform);

const contactinfomation = require('./contact-data/contact-info');
router.use("/contact-info-api", contactinfomation);

//All Chart API
const ChartAll = require('./Chart/all-chart');
router.use("/chart-api", ChartAll);

//Report API
const ReportAll = require('./Admin-Report/reportadminside');
router.use("/all-report", ReportAll);


//Notification Start
// Create a new notification 
router.post('/create-notification', async (req, res) => {
  const { type, message } = req.body;
  try {
    const notification = new Notification({ type, message });
    await notification.save();

    res.status(201).json({ message: 'Notification created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cron job to delete notifications older than 5 minutes
cron.schedule('* * * * *', async () => { 
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000); // 5 minutes ago
  try {
    const result = await Notification.deleteMany({ createdAt: { $lt: fiveMinutesAgo } });
    if (result.deletedCount > 0) {
  
    }
  } catch (error) {
    console.error('Error during cron job deletion:', error);
  }
});

// Get the latest notification
router.get('/get-notifications', apiKeyMiddleware, async (req, res) => {
  try {
    // Fetch the most recent unread notification
    const notification = await Notification.findOne({ status: false }).sort({ createdAt: -1 });

    if (!notification) {
      return res.status(404)
    }

    res.json([notification]); 
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.patch('/mark-notification-read/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Notification.findByIdAndUpdate(id, { status: true });
    res.status(200)
  } catch (error) {
    res.status(500)
  }
});
//Notification End

module.exports = router;