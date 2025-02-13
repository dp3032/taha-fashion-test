var express = require('express');
var router = express.Router();

const apiKeyMiddleware = require('../../Middleware/ApiKey'); 

const View  = require('../../model/views'); 
const Order = require('../../model/Order');

//increment views count User Are Enter Home Page Frontend Side and save it
router.get("/api/home", apiKeyMiddleware, async (req, res) => {
    const today = new Date();
    const dateString = today.toISOString().split("T")[0]; // Get date in YYYY-MM-DD format
  
    let view = await View.findOne({ date: dateString });
  
    if (view) {
      view.viewCount += 1;
    } else {
      view = new View({ date: dateString });
    }
  
    await view.save();
    res.status(200).json({ message: "View count incremented" });
  });
  
  //Display the last 7 days' view counts
  router.get("/api/views", apiKeyMiddleware , async (req, res) => {
    const views = await View.find()
      .sort({ date: -1 })
      .limit(7)
      .lean();
  
    // Ensure the data is in chronological order (oldest first)
    const sortedViews = views.reverse();
    res.json(sortedViews);
  });
  
  //total amount of success order
  router.get('/ordersonlysuccesstotal', apiKeyMiddleware ,async (req, res) => {
    try {
        // Use aggregation to calculate the total amount and fetch orders
        const result = await Order.aggregate([
            // Unwind paymentDetails to filter on paymentStatus
            { $unwind: "$paymentDetails" },
            // Match orders where paymentStatus is 'Success' and order_status is not 'Cancelled'
            { 
                $match: { 
                    "paymentDetails.paymentStatus": "Success",
                    "order_status": { $ne: "Cancelled" } // Exclude orders with order_status 'Cancelled'
                } 
            },
            // Sort orders by paymentDate in descending order
            { $sort: { "paymentDetails.paymentDate": -1 } },
            // Group to calculate total sum and collect matching orders
            {
                $group: {
                    _id: null, // Group everything together
                    totalAmount: { $sum: "$totalAmount" }, // Calculate the sum of totalAmount
                    orders: { $push: "$$ROOT" } // Collect all matching orders
                }
            }
        ]);
  
        if (result.length === 0) {
            return res.json({
                success: true,
                totalAmount: 0,
                orders: []
            });
        }
  
        const { totalAmount, orders } = result[0];
  
        res.json({
            success: true,
            totalAmount,
            orders
        });
    } catch (error) {
        console.error(error); // Log any error
        res.status(500).json({ success: false, message: 'Error fetching orders' });
    }
  });
  
  //chart bar in total amount of last 7 day
  router.get('/totalamountchart', apiKeyMiddleware , async (req, res) => {
    try {
      const currentDate = new Date();
      const sevenDaysAgo = new Date(currentDate);
      sevenDaysAgo.setDate(currentDate.getDate() - 7);
  
      const result = await Order.aggregate([
        { $unwind: "$paymentDetails" },
        {
          $match: {
            "paymentDetails.paymentStatus": "Success",
            "order_status": { $ne: "Cancelled" },
            "paymentDetails.paymentDate": { $gte: sevenDaysAgo },
          },
        },
        {
          $project: {
            totalAmount: 1,
            paymentDate: { $dateToString: { format: "%Y-%m-%d", date: "$paymentDetails.paymentDate" } },
          },
        },
        {
          $group: {
            _id: "$paymentDate",
            totalAmount: { $sum: "$totalAmount" },
          },
        },
      ]);
  
      const orders = result.map((order) => ({
        paymentDate: order._id,
        totalAmount: order.totalAmount,
      }));
  
      res.json({ success: true, orders });
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ success: false, message: 'Error fetching orders' });
    }
  });
  
  //order PI chart
  router.get('/orderchart', apiKeyMiddleware , (req, res) => {
    // Fetch all products from the database (or return a static array for now)
    Order.find()
      .then(products => {
        const totalProducts = products.length;
        res.status(200).json({ products, totalProducts }); // Send product data to the frontend
      })
      .catch(err => {
        res.status(500).send();
      });
  });

  module.exports = router;