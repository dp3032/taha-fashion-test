var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const Razorpay = require('razorpay');

const apiKeyMiddleware = require('../../Middleware/ApiKey'); 

const sendEmail = require("../Emailsent/sendOrderEmail");

const Order = require('../../model/Order');
const Product = require('../../model/product');
const Notification = require('../../model/Notification');  

router.post('/save-order', apiKeyMiddleware, async (req, res) => {
  const { user_id, UserName, Name, email, address, city, state, zipcode, 
          paymentMethod, contactnumber, note, products, amount } = req.body;

  try {
      // Create a Razorpay order first
      const razorpay = new (require('razorpay'))({
          key_id: process.env.RAZORPAY_KEY_ID,
          key_secret: process.env.RAZORPAY_KEY_SECRET,
      });

      const razorpayOrder = await razorpay.orders.create({
          amount: amount * 100, // Convert amount to paise
          currency: 'INR',
          receipt: `receipt_${Date.now()}`,
      });

      // Send Razorpay order ID to frontend (Do NOT save order in DB yet)
      res.json({ success: true, id: razorpayOrder.id, amount });
  } catch (error) {
      console.error('Error creating payment order:', error);
      res.status(500).json({ success: false, message: 'Error creating payment order' });
  }
});

router.post('/verify-payment', apiKeyMiddleware, async (req, res) => {
  try {
      const { payment_id, order_id, signature, orderDetails } = req.body;

      if (!payment_id || !order_id || !signature || !orderDetails) {
          console.error("Missing fields in verification request", req.body);
          return res.status(400).json({ success: false, message: 'Missing required fields' });
      }

      const secret = process.env.RAZORPAY_KEY_SECRET;
      const generatedSignature = crypto
          .createHmac('sha256', secret)
          .update(order_id + '|' + payment_id)
          .digest('hex');

      if (generatedSignature !== signature) {
          console.error("Signature mismatch! Expected:", generatedSignature, "Received:", signature);
          return res.status(400).json({ success: false, message: 'Invalid signature' });
      }

      // Fetch payment details from Razorpay
      const razorpay = new (require('razorpay'))({
          key_id: process.env.RAZORPAY_KEY_ID,
          key_secret: process.env.RAZORPAY_KEY_SECRET,
      });

      const payment = await razorpay.payments.fetch(payment_id);

      if (!payment || payment.status !== 'captured') {
          console.error("Payment fetch failed or status not captured", payment);
          return res.status(400).json({ success: false, message: 'Payment failed' });
      }

      // Payment is successful, now save the order in the database
      const order = new Order({
          user_id: orderDetails.user_id,
          UserName: orderDetails.UserName,
          Name: orderDetails.Name,
          email: orderDetails.email,
          address: orderDetails.address,
          city: orderDetails.city,
          state: orderDetails.state,
          zipcode: orderDetails.zipcode,
          paymentMethod: orderDetails.paymentMethod,
          contactnumber: orderDetails.contactnumber,
          note: orderDetails.note,
          products: orderDetails.products,
          totalAmount: orderDetails.amount,
          order_status: 'Pending', 
          razorpay_order_id: order_id,
          paymentDetails: [{
              paymentDate: new Date(),
              paymentStatus: 'Success',
              payment_id,
              order_id,
              signature,
              status: payment.status,
              method: payment.method,
              bank: payment.bank,
              wallet: payment.wallet,
              vpa: payment.vpa,
              fee: payment.fee ? (payment.fee / 100).toFixed(2) : null,
          }],
      });

      await order.save();

      res.json({ success: true, message: 'Payment verified successfully, order saved' });

  } catch (error) {
      console.error('Error verifying payment:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
  }
});

  //Display to get all transactions of Razore Pay
  router.get('/transactions' , async (req, res) => {
    try {
      const razorpay = new (require('razorpay'))({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET
      });
  
      let transactions = [];
      let page = 1;
      let hasMore = true;
  
      while (hasMore) {
        const response = await razorpay.payments.all({
          count: 50, 
          page: page,
        });
  
        // Add the order_id for each transaction
        const transactionsWithOrderId = response.items.map(transaction => ({
          ...transaction,
          order_id: transaction.order_id,
        }));
  
        transactions = transactions.concat(transactionsWithOrderId);
        page += 1;
        hasMore = response.items.length > 0; 
      }
  
      res.json({ transactions });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching transactions', error: error.message });
    }
  });
  
  //All Order Display
  router.get('/ordersonly', apiKeyMiddleware, async (req, res) => {
    try {
        // Fetch orders and sort by paymentDate in descending order
        const orders = await Order.find()
        .sort({ "paymentDetails.paymentDate": -1 }); // Sort by paymentDate in descending order
  
        // Log the orders data
        res.json({
            success: true,
            orders: orders
        });
    } catch (error) {
        console.error(error); // Log any error
        res.status(500).json({ success: false, message: 'Error fetching orders' });
    }
  });
  
  //Limited Order Display But only Success
  router.get('/ordersonlysuccesslimted', apiKeyMiddleware , async (req, res) => {
    try {
        // Fetch orders where paymentStatus is 'Success'
        const orders = await Order.find({ "paymentDetails.paymentStatus": "Success" }).limit(10)
        .sort({ "paymentDetails.paymentDate": -1 }); // Sort by order_date in descending order
  
        // Log the orders data
        res.json({
            success: true,
            orders: orders
        });
    } catch (error) {
        console.error(error); // Log any error
        res.status(500).json({ success: false, message: 'Error fetching orders' });
    }
  });
  
  //order only success display
  router.get('/ordersonlysuccess',apiKeyMiddleware, async (req, res) => {
    try {
        // Fetch orders where paymentStatus is 'Success'
        const orders = await Order.find({ "paymentDetails.paymentStatus": "Success" })
        .sort({ "paymentDetails.paymentDate": -1 }); // Sort by order_date in descending order
  
        // Log the orders data
        res.json({
            success: true,
            orders: orders
        });
    } catch (error) {
        console.error(error); // Log any error
        res.status(500).json({ success: false, message: 'Error fetching orders' });
    }
  });
  
  //order only failed display
  router.get('/ordersonlyfailed',apiKeyMiddleware , async (req, res) => {
    try {
        // Fetch orders where paymentStatus is 'Success'
        const orders = await Order.find({ "paymentDetails.paymentStatus": "Failed" })
        .sort({ "paymentDetails.paymentDate": -1 }); // Sort by order_date in descending order
  
        // Log the orders data
        res.json({
            success: true,
            orders: orders
        });
    } catch (error) {
        console.error(error); // Log any error
        res.status(500).json({ success: false, message: 'Error fetching orders' });
    }
  });
  
  //Display Order Detils By Id In Session Storage
  router.get('/orders/:id',apiKeyMiddleware, async (req, res) => {
    try {
      const displayorderId = req.params.id;
  
      // Validate the ID format if using MongoDB
      if (!displayorderId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).send("Invalid order ID format");
      }
  
      // Fetch the order
      const orderdisplay = await Order.findById(displayorderId);
      if (!orderdisplay) {
        return res.status(404).send("Order not found");
      }
  
      // Respond with the product
      res.json(orderdisplay);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).send("Internal server error");
    }
  });
  
  //Update order status
  router.put('/update-order-status/:orderId', async (req, res) => {
    const { orderId } = req.params;
    const { order_status } = req.body;
  
    try {
        const order = await Order.findById(orderId);
  
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
  
        // Update the status
        order.order_status = order_status;
        order.order_status_time = new Date(); // Store the current time when the status is updated
        await order.save();
  
        res.json({ success: true, message: 'Order status updated successfully' });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ success: false, message: 'Error updating order status' });
    }
  });
  
  //fetch orders for a specific user
  router.get('/get-user-orders',apiKeyMiddleware, async (req, res) => {
    try {
      const { user_id } = req.query;  // Get user_id from query parameters
  
      if (!user_id) {
        return res.status(400).json({ success: false, message: 'User ID is required' });
      }
  
      // Find all orders where the user_id matches
      const orders = await Order.find({ user_id, "paymentDetails.paymentStatus": "Success" })
    .sort({ createdAt: -1 });
      
      if (!orders || orders.length === 0) {
        return res.status(404).json({ success: false, message: 'No orders found for this user' });
      }
  
      res.json({ success: true, orders });
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ success: false, message: 'NetWork Problem' });
    }
  });

  router.post("/send-order-email", (req, res) => {
    const { orderDetails, userEmail } = req.body;
  
    sendEmail(orderDetails, userEmail)
      .then(() => {
        res.status(200).send({ success: true });
      })
      .catch((error) => {
        res.status(500).send({ success: false, message: error.message });
      });
  });

module.exports = router;
