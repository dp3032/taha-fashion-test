
const sendRefundEmail = require("../../Emailsent/sendRefundEmail");


router.get('/refund', apiKeyMiddleware, (req, res) => {
    const { order_id } = req.query;
  
    let query = {};
    if (order_id) {
      query.order_id = order_id;  // If an order_id is provided, filter by it
    }
  
    Refund.find(query)
      .then(refunddata => {
        res.status(200).json(refunddata); // Send filtered product data to the frontend
      })
      .catch(err => {
        res.status(500).send();
      });
  });
  
  //API to update the status of an refund
  router.put('/refund/:id', (req, res) => {
    const { id } = req.params; // Get the refund ID from the URL
    const { Refund_status } = req.body; // Get the new status from the request body
  
    // Find the refund by ID and update its status
    Refund.findByIdAndUpdate(id, { Refund_status }, { new: true })
      .then((updatedRefund) => {
        if (!updatedRefund) {
          return res.status(404).json({ message: 'Refund not found' });
        }
        res.json(updatedRefund); // Send the updated refund as response
      })
      .catch((error) => {
        console.error("Error updating status:", error);
        res.status(500).json({ message: 'Error updating status' });
      });
  });
  
  //Display Refund By ID in Session Storage
  router.get('/refundid/:id', apiKeyMiddleware , async (req, res) => {
    try {
      const displayrefundId = req.params.id;
  
      // Validate the ID format if using MongoDB
      if (!displayrefundId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).send("Invalid Refund ID format");
      }
  
      // Fetch the order
      const refunddisplay = await Refund.findById(displayrefundId);
      if (!refunddisplay) {
        return res.status(404).send("Refund not found");
      }
  
      // Respond with the product
      res.json(refunddisplay);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).send("Internal server error");
    }
  });
  
  //fetch Refund for a specific user
  router.get('/get-user-refund', apiKeyMiddleware , async (req, res) => {
    try {
      const { user_id } = req.query;
  
      if (!user_id) {
        return res.status(400).json({ success: false, message: 'User ID is required' });
      }
  
      const refundes = await Refund.find({ user_id }).sort({ createdAt: -1 });
  
      if (!refundes || refundes.length === 0) {
        return res.status(404).json({ success: false, refundes: [] }); // Ensure refundes is always an array
      }
  
      res.json({ success: true, refundes });
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ success: false, message: 'Network Problem' });
    }
  });

  router.post("/send-refund-email", (req, res) => {
    const { orderDetails, userEmail } = req.body;
    
    sendRefundEmail(orderDetails, userEmail)
      .then(() => {
        res.status(200).send({ success: true, message: "Refund details email sent successfully" });
      })
      .catch((error) => {
        res.status(500).send({ success: false, message: error.message });
      });
  });