var express = require('express');
var router = express.Router();

const apiKeyMiddleware = require('../../Middleware/ApiKey'); 

const RegModel  = require('../../model/user');
const Order = require('../../model/Order');
const Product = require('../../model/product');

router.get('/report/monthly/user', apiKeyMiddleware  , async (req, res) => {
    try {
      const { month, year } = req.query;
  
      if (!month || !year) {
        return res.status(400).json({ message: 'Month and year are required!' });
      }
  
      // Parse start and end dates in UTC
      const startDate = new Date(Date.UTC(year, month - 1, 1));
      const endDate = new Date(Date.UTC(year, month, 1));
  
      // Query MongoDB
      const users = await RegModel.find({
        createdAt: {
          $gte: startDate,
          $lt: endDate,
        },
      });
  
      return res.status(200).json({
        success: true,
        count: users.length,
        users,
      });
    } catch (error) {
      console.error('Error in /report/monthly:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  });
  
  //order report
  router.get('/report/monthly/order', apiKeyMiddleware  , async (req, res) => {
    try {
      const { month, year } = req.query;
  
      if (!month || !year) {
        return res.status(400).json({ message: 'Month and year are required!' });
      }
  
      // Parse start and end dates in UTC
      const startDate = new Date(Date.UTC(year, month - 1, 1));
      const endDate = new Date(Date.UTC(year, month, 1));
  
      // Query MongoDB
      const orders = await Order.find({ 
        "paymentDetails.paymentStatus": "Success",
        createdAt: {
          $gte: startDate,
          $lt: endDate,
        },
      });
  
      return res.status(200).json({
        success: true,
        count: orders.length,
        orders,
      });
    } catch (error) {
      console.error('Error in /report/monthly:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  });
  
  //product report
  router.get('/report/monthly/product', apiKeyMiddleware  , async (req, res) => {
    try {
      const { month, year } = req.query;
  
      if (!month || !year) {
        return res.status(400).json({ message: 'Month and year are required!' });
      }
  
      // Parse start and end dates in UTC
      const startDate = new Date(Date.UTC(year, month - 1, 1));
      const endDate = new Date(Date.UTC(year, month, 1));
  
      // Query MongoDB
      const products = await Product.find({ 
        createdAt: {
          $gte: startDate,
          $lt: endDate,
        },
      }).populate('Product_category'); 
  
      return res.status(200).json({
        success: true,
        count: products.length,
        products,
      });
    } catch (error) {
      console.error('Error in /report/monthly:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  });


  module.exports = router;