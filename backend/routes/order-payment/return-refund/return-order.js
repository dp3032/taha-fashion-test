

const sendReturnOrderEmail = require("../../Emailsent/sendReturnOrderEmail");

//return order
router.get('/returnorder', apiKeyMiddleware, (req, res) => {
    const { order_id } = req.query;
  
    let query = {};
    if (order_id) {
      query.order_id = order_id; 
    }
  
    RetunOrder.find(query)
      .then(refunddata => {
        res.status(200).json(refunddata); 
      })
      .catch(err => {
        res.status(500).send();
      });
  });
  
  //API to update the status of an Return Order
  router.put('/return-order/:id', (req, res) => {
    const { id } = req.params; // Get the refund ID from the URL
    const { Retunorder_status } = req.body; // Get the new status from the request body
  
    // Find the refund by ID and update its status
    RetunOrder.findByIdAndUpdate(id, { Retunorder_status }, { new: true })
      .then((updatedRefund) => {
        if (!updatedRefund) {
          return res.status(404).json({ message: 'Return Order not found' });
        }
        res.json(updatedRefund); // Send the updated refund as response
      })
      .catch((error) => {
        console.error("Error updating status:", error);
        res.status(500).json({ message: 'Error updating status' });
      });
  });
  
  //Display Refund By ID in Session Storage
  router.get('/returnorderid/:id', apiKeyMiddleware , async (req, res) => {
    try {
      const retundisplay = await RetunOrder.findById(req.params.id);
      if (!retundisplay) {
        return res.status(404).send("Return Order not found");
      }
      res.json(retundisplay);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).send("Internal server error");
    }
  })
  
  //fetch Return for a specific user
  router.get('/get-user-return', apiKeyMiddleware, async (req, res) => {
    try {
      const { user_id } = req.query;
  
      if (!user_id) {
        return res.status(400).json({ success: false, message: 'User ID is required' });
      }
  
      const returnord = await RetunOrder.find({ user_id }).sort({ createdAt: -1 });
  
      if (!returnord || returnord.length === 0) {
        return res.status(404).json({ success: false, returnord: [] });
      }
  
      res.json({ success: true, returnord }); // Send the fetched orders
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ success: false, message: 'Network Problem' });
    }
  });

  router.post("/send-return-email", (req, res) => {
    const { orderDetails, userEmail } = req.body;
    
    sendReturnOrderEmail(orderDetails, userEmail)
      .then(() => {
        res.status(200).send({ success: true, message: "Return details email sent successfully" });
      })
      .catch((error) => {
        res.status(500).send({ success: false, message: error.message });
      });
  });