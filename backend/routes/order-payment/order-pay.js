var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const Razorpay = require('razorpay');

const apiKeyMiddleware = require('../../Middleware/ApiKey'); 

const sendEmail = require("../Emailsent/sendOrderEmail");

const Order = require('../../model/Order');
const Product = require('../../model/product');
const Refund = require('../../model/payment-refund'); 
const RetunOrder = require('../../model/retun-order');  
const Notification = require('../../model/Notification');  


// Save Order
router.post('/save-order', apiKeyMiddleware , async (req, res) => {
    const {
      user_id, UserName, Name, email, address, city, state,
      zipcode, paymentMethod, contactnumber, note, products, amount
    } = req.body;
  
    try {
      // Create and save a new order with initial "failed" payment details
      const order = new Order({
        user_id,
        UserName,
        Name,
        email,
        address,
        city,
        state,
        zipcode,
        paymentMethod,
        contactnumber,
        note,
        products,
        totalAmount: amount,
        order_status: 'Cancelled',
        paymentDetails: [{
          paymentDate: new Date(),
          paymentStatus: 'Failed',
          payment_id: null,
          order_id: null,
          signature: null,
        }],
      });
  
      await order.save();
  
      // Schedule a deletion check after 10 minutes
      setTimeout(async () => {
        const existingOrder = await Order.findById(order._id);
        if (existingOrder && existingOrder.paymentDetails.length === 0) {
          await Order.findByIdAndDelete(order._id);
        }
      }, 600000); 
  
      // Create a Razorpay order
      const razorpay = new (require('razorpay'))({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      });
  
      const razorpayOrder = await razorpay.orders.create({
        amount: amount * 100, 
        currency: 'INR',
        receipt: `receipt_${order._id}`,
      });
  
      // Save the Razorpay order ID to the order document
      order.razorpay_order_id = razorpayOrder.id;
      await order.save();
  
      // Send the response with the Razorpay order details
      res.json({ success: true, id: razorpayOrder.id, amount });
    } catch (error) {
      console.error('Error saving order:', error);
      res.status(500).json({ success: false, message: 'Error saving order' });
    }
  });
  // Verify Payment
  router.post('/verify-payment', apiKeyMiddleware , async (req, res) => {
    try {
        const { payment_id, order_id, signature } = req.body;
  
        if (!payment_id || !order_id || !signature) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }
  
        const secret = process.env.RAZORPAY_KEY_SECRET
        const generatedSignature = crypto
            .createHmac('sha256', secret)
            .update(order_id + '|' + payment_id)
            .digest('hex');
  
        // Find the order using the Razorpay order ID
        const order = await Order.findOne({ razorpay_order_id: order_id });
  
        if (!order) {
            console.error(`Order not found with Razorpay Order ID: ${order_id}`);
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
  
        let payment = null;
  
        // If signature matches, verify payment status
        if (generatedSignature === signature) {
            const razorpay = new (require('razorpay'))({
                key_id: process.env.RAZORPAY_KEY_ID,
                key_secret: process.env.RAZORPAY_KEY_SECRET,
            });
  
            try {
                // Fetch the payment details from Razorpay
                payment = await razorpay.payments.fetch(payment_id);
            } catch (error) {
                console.error('Error fetching payment from Razorpay:', error);
                return res.status(500).json({ success: false, message: 'Error verifying payment from Razorpay', error: error.message });
            }
  
            if (payment && payment.status === 'captured') {
                // Remove previous "failed" payment entry
                order.paymentDetails = order.paymentDetails.filter(pd => pd.paymentStatus !== 'Failed');
  
                // Push the updated payment details for a successful payment
                order.paymentDetails.push({
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
                });
                order.order_status = 'Pending';
  
                // Decrement the product quantities
                for (const item of order.products) {
                    const product = await Product.findById(item.product_id);
                    if (product) {
                        product.Product_quantity -= item.quantity;
                        if (product.Product_quantity <= 0) {
                            product.Product_quantity = 0;
                            product.Product_stock_status = 'out-of-stock';
                        }
                        await product.save();
                    }
                }
  
                // Send notification for order placement
                const notificationMessage = `Order placed ${order.UserName} with total amount: ${order.totalAmount}`;
                await Notification.create({
                    type: 'order-placed',
                    message: notificationMessage,
                    username: order.UserName,
                });
  
                await sendEmail(order, order.email);
  
                await order.save();
                return res.json({
                    success: true,
                    message: 'Payment verified successfully and product quantities updated',
                });
            } else {
                // Handle payment failure
                order.paymentDetails.push({
                    paymentDate: new Date(),
                    paymentStatus: 'Failed',
                    payment_id: null,
                    order_id: null,
                    signature: null,
                });
                order.order_status = 'Cancelled';
            }
        } else {
            // Handle invalid signature
            order.paymentDetails.push({
                paymentDate: new Date(),
                paymentStatus: 'Failed',
                payment_id: null,
                order_id: null,
                signature: null,
            });
            order.order_status = 'Cancelled';
        }
  
        // Save the order after adding payment details
        await order.save();
  
        return res.json({
            success: false,
            message: 'Invalid signature or payment failed',
        });
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
  
  //User Delete Order and data Was Store In Refund Database
  router.delete("/delete-order/:id", async (req, res) => {
    const { id } = req.params;  // Use req.params instead of req.query
    try {
      // Fetch the order before deleting
      const order = await Order.findById(id);
  
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
  
      // Store the order in the Refund collection before deletion
      const refund = new Refund({
        user_id: order.user_id,
        order_id: order._id,
        UserName: order.UserName,
        Name: order.Name,
        email: order.email,
        address: order.address,
        city: order.city,
        state: order.state,
        zipcode: order.zipcode,
        contactnumber: order.contactnumber,
        note: order.note,
        products: order.products,
        totalAmount: order.totalAmount,
        paymentMethod: order.paymentMethod,
        razorpay_order_id: order.razorpay_order_id,
        paymentDetails: order.paymentDetails,
        order_date: order.order_date,
        status: order.order_status || 'Pending'  // Or whatever status you need for refunded orders
      });
  
      // Save the refunded order in the Refund collection
      await refund.save();
  
      await sendRefundEmail(refund, order.email);
  
      // Delete the order from the Order collection
      await Order.findByIdAndDelete(id);
  
      // Send notification for refund
      const notificationMessage = `Order ${order.UserName} has been refunded request total amount ${order.totalAmount}`;
      await Notification.create({
        type: 'order-refund',
        message: notificationMessage,
        username: order.UserName,
      });
  
      res.status(200).json({ message: "Order Cancelled and Refund in Processing..." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });
  
  //User Return Order 
  router.delete("/return-order/:id", async (req, res) => {
    const { id } = req.params;
    const { reason } = req.body; 
  
    if (!reason || reason.trim() === "") {
      return res.status(400).json({ message: "Return reason is required." });
    }
  
    try {
      const order = await Order.findById(id);
  
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
  
      const retunorder = new RetunOrder({
        user_id: order.user_id,
        order_id: order._id,
        UserName: order.UserName,
        Name: order.Name,
        email: order.email,
        address: order.address,
        city: order.city,
        state: order.state,
        zipcode: order.zipcode,
        contactnumber: order.contactnumber,
        products: order.products,
        totalAmount: order.totalAmount,
        paymentMethod: order.paymentMethod,
        razorpay_order_id: order.razorpay_order_id,
        paymentDetails: order.paymentDetails,
        order_date: order.order_date,
        reason,
        Retunorder_status: 'Pending',
      });
  
      await retunorder.save();
  
      await sendReturnOrderEmail(retunorder, order.email);
  
      await Order.findByIdAndDelete(id);
  
      const notificationMessage = `Order ${order.UserName} has been returned request total amount : ${order.totalAmount}`;
      await Notification.create({
        type: 'order-return',
        message: notificationMessage,
        username: order.UserName,
      });
  
      res.status(200).json({ message: "Return Order in Processing..." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error: error.message });
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