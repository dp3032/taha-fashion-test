//Phone Pe Payment Start

// Payment Key
const salt_key = "96434309-7796-489d-8924-ab56988a6076";
const merchant_id = "PGTESTPAYUAT86";


// Order Create Endpoint
router.post('/ordertest', async (req, res) => {
    try {
        // Extract data from the request
        const { user_id, UserName, Name, amount, contactnumber, transactionId, email, address, city, state, zipcode, products, note, paymentMethod } = req.body;
  
        // 1. Save the order in the database first (without payment confirmation)
        const newOrder = new Order({
          user_id,
          UserName,
          Name,
          email,
          address,
          city,
          state,
          zipcode,
          contactnumber,
          products,
          note,
          totalAmount: amount,
          paymentMethod,
          status: 'Pending', // Initial status is Pending
          paymentDetails: {
            paymentDate: null, // Will be updated after successful payment
            paymentStatus: 'Pending', // Initially pending
            transactionId, // Transaction ID will be null initially
            MID: null, // MID will be null initially
          },
          order_date: new Date().toLocaleDateString(),
      });
  
        // Save the order to the database
        await newOrder.save();
  
        // 2. Payment data for PhonePe
        const data = {
            merchantId: merchant_id,
            merchantTransactionId: transactionId,
            amount: amount * 100, // Convert to smallest currency unit
            redirectUrl: `${process.env.BACKAPI}/statuss?id=${transactionId}`,
            redirectMode: "POST",
            mobileNumber: contactnumber,
            paymentInstrument: {
                type: "PAY_PAGE",
            },
        };
  
        // Create payload and checksum
        const payload = JSON.stringify(data);
        const payloadBase64 = Buffer.from(payload).toString('base64');
        const keyIndex = 1;
        const stringToHash = payloadBase64 + '/pg/v1/pay' + salt_key;
        const sha256 = crypto.createHash('sha256').update(stringToHash).digest('hex');
        const checksum = sha256 + '###' + keyIndex;
  
        // API request options
        const options = {
            method: 'POST',
            url: "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay",
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                'X-VERIFY': checksum,
            },
            data: {
                request: payloadBase64,
            },
        };
  
        // Make the API request to PhonePe
        const response = await axios(options);
  
        // Log the entire response data for debugging
        if (response.data.success) {
            const redirectUrl = response.data.data?.instrumentResponse?.redirectInfo?.url;
  
            // 3. Return the redirect URL to the frontend for user to complete the payment
            if (redirectUrl) {
                res.json({
                    success: true,
                    redirectUrl, // Return the correct redirect URL to the frontend
                });
            } else {
                res.status(400).json({
                    success: false,
                    message: "Redirect URL not found in the response.",
                });
            }
        } else {
            res.status(400).json({
                success: false,
                message: "Failed to initiate payment",
                error: response.data,
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
  });
  
  // Payment Status Check API
  router.post('/statuss', async (req, res) => {
    try {
        const merchantTransactionId = req.query.id; // Get transaction ID from query params
  
        if (!merchantTransactionId) {
            return res.status(400).json({ success: false, message: 'Transaction ID is missing.' });
        }
  
        // Generate checksum for validation
        const keyIndex = 1;
        const string = `/pg/v1/status/${merchant_id}/${merchantTransactionId}` + salt_key;
        const sha256 = crypto.createHash('sha256').update(string).digest('hex');
        const checksum = sha256 + '###' + keyIndex;
  
        // Send request to PhonePe for payment status
        const options = {
            method: 'GET',
            url: `https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/${merchant_id}/${merchantTransactionId}`,
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                'X-VERIFY': checksum,
                'X-MERCHANT-ID': merchant_id,
            },
        };
  
        const response = await axios.request(options);
  
        // Log the response for debugging purposes
        console.log("PhonePe Response Data:", response.data);
  
        if (response.data && response.data.data) {
            const responseCode = response.data.data.responseCode;  // Check for responseCode
            const state = response.data.data.state;  // Check for state (e.g., COMPLETED, PENDING, etc.)
            const errorCode = response.data.data.errorCode;  // Error code if any
            const errorMessage = response.data.data.errorMessage;  // Error message if any
  
            // If payment is successful (responseCode 'SUCCESS' and state 'COMPLETED')
            if (responseCode === 'SUCCESS' && state === 'COMPLETED') {
                // Additional check for errorCode or payment details validation
                if (errorCode) {
                    // If there is an error code, treat the payment as failed
                    const failureMessage = errorMessage || "Payment failed due to invalid details.";
                    const paymentData = {
                        paymentStatus: 'Failed',
                        paymentDate: new Date(),
                        transactionId: null,
                        MID: null,
                    };
  
                    // Update the order status to "Failed"
                    await Order.findOneAndUpdate(
                        { 'paymentDetails.transactionId': merchantTransactionId },
                        {
                            $set: {
                                'paymentDetails': paymentData,
                                status: 'Failed', // Mark as failed
                            },
                        },
                        { new: true }
                    );
  
                    // Log the failure message for debugging
                    console.log("Payment Failed due to invalid details: ", failureMessage);
  
                    return res.redirect(`${process.env.FROAPI}/paymentfailure?message=${encodeURIComponent(failureMessage)}`);
                }
  
                // If no error, the payment is successfully completed
                const paymentData = {
                    paymentStatus: 'Success',
                    paymentDate: new Date(),
                    transactionId: merchantTransactionId,
                    MID: merchant_id,
                };
  
                // Update the order status to "Confirmed"
                const updatedOrder = await Order.findOneAndUpdate(
                    { 'paymentDetails.transactionId': merchantTransactionId },
                    {
                        $set: {
                            'paymentDetails': paymentData,
                            status: 'Confirmed', // Mark as confirmed
                        },
                    },
                    { new: true }
                );
  
                if (!updatedOrder) {
                    return res.status(404).json({ success: false, message: 'Order not found.' });
                }
  
                return res.redirect(`${process.env.FROAPI}/paymentsuccess`);
            } else {
                // Payment failed due to wrong details or other issues
                const failureMessage = errorMessage || "Payment failed or invalid payment details.";
                const paymentData = {
                    paymentStatus: 'Failed',
                    paymentDate: new Date(),
                    transactionId: null,
                    MID: null,
                };
  
                // Update the order status to "Failed"
                await Order.findOneAndUpdate(
                    { 'paymentDetails.transactionId': merchantTransactionId },
                    {
                        $set: {
                            'paymentDetails': paymentData,
                            status: 'Failed', // Mark as failed
                        },
                    },
                    { new: true }
                );
  
                // Log the failure message for debugging
                console.log("Payment Failed: ", failureMessage);
  
                return res.redirect(`${process.env.FROAPI}/paymentfailure?message=${encodeURIComponent(failureMessage)}`);
            }
        } else {
            // If PhonePe response is incomplete or unexpected
            const errorMsg = 'Payment status response is invalid or incomplete.';
            console.error(errorMsg);
  
            return res.status(500).send(`
                <h1>Payment Error</h1>
                <p>We encountered an issue while processing your payment. Please try again.</p>
            `);
        }
    } catch (error) {
        console.error("Error in /statuss:", error.message);
  
        return res.status(500).send(`
            <h1>Payment Error</h1>
            <p>We encountered an issue while processing your payment. Please try again.</p>
        `);
    }
  });

// Dynamic storage configuration
// const productStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       if (file.fieldname === 'productimage') {
//         cb(null, 'uploads/products/'); 
//       } else if (file.fieldname === 'productsizeguide') {
//         cb(null, 'uploads/size-guide/'); 
//       } else {
//         cb(null, 'uploads/');
//       }
//     },
//     filename: (req, file, cb) => {
//       const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
//       cb(null, uniqueName);
//     }
//   });
  
//   const productUpload = multer({ storage: productStorage });
  
//   router.post('/add-product', productUpload.fields([
//     { name: 'productimage' }, 
//     { name: 'productsizeguide', maxCount: 1 } 
//   ]), async (req, res) => {
  
//     if (!req.body['product-name'] || !req.body['product-price'] || !req.body['product-category']) {
//       return res.status(400).json({ error: 'Missing required fields' });
//     }
  
//     try {
//       const imagePaths = req.files['productimage'] 
//         ? req.files['productimage'].map(file => `${process.env.BACKAPI}/uploads/products/` + file.filename)
//         : [];
        
//       const imagesizeguidePaths = req.files['productsizeguide'] 
//         ? req.files['productsizeguide'].map(file => `${process.env.BACKAPI}/uploads/size-guide/` + file.filename)
//         : [];
  
//       const newProduct = new Product({
//         Product_name: req.body['product-name'],
//         Product_des: req.body['product-description'],
//         Product_price: req.body['product-price'],
//         Product_category: req.body['product-category'],
//         Product_sizes: req.body['product-sizes'], 
//         Product_size_img: imagesizeguidePaths,
//         Product_img: imagePaths,
//         Product_quantity: req.body['product-quantity'], 
//         Product_stock_status: req.body['product-stock-status'], 
//         Best_seller: req.body['Best_seller'] === 'true',
//         tags: req.body['tags'].split(',').map(tag => tag.trim())
//       });
  
//       await newProduct.save();
  
//       const notificationMessage = `A new product "${newProduct.Product_name}" has been added to the inventory.`;
//       await Notification.create({
//         type: 'product-added',
//         message: notificationMessage,
//         username: 'Admin',
//       });
  
//       res.status(201).json(newProduct);
//     } catch (err) {
//       console.error('Error adding product:', err);
//       res.status(500).json({ error: "Internal Server Error" });
//     }
//   });



// router.post('/ordertest', async (req, res) => {
//   try {
//     // Extract data from the request body
//     const { user_id, UserName, Name, amount, contactnumber, transactionId, email, address, city, state, zipcode, products, note, paymentMethod } = req.body;

//     // 1. Save the order in the database (without payment confirmation)
//     const newOrder = new Order({
//       user_id,
//       UserName,
//       Name,
//       email,
//       address,
//       city,
//       state,
//       zipcode,
//       contactnumber,
//       products,
//       note,
//       totalAmount: amount,
//       paymentMethod,
//       status: 'Pending', // Initially pending
//       paymentDetails: {
//         paymentDate: null,
//         paymentStatus: 'Pending', // Initially pending
//         transactionId: transactionId, // Transaction ID
//         MID: null, // Merchant ID
//       },
//       order_date: new Date().toLocaleDateString(),
//     });

//     // Save the order in the database
//     await newOrder.save();

//     // 2. Prepare data for the payment gateway (PhonePe)
//     const data = {
//       merchantId: merchant_id,
//       merchantTransactionId: transactionId,
//       amount: amount * 100, // Amount in smallest currency unit (e.g., paise for INR)
//       redirectUrl: `${process.env.BACKAPI}/statuss?id=${transactionId}`,
//       redirectMode: "POST",
//       mobileNumber: contactnumber,
//       paymentInstrument: {
//         type: "PAY_PAGE",
//       },
//     };

//     // Create the payload and checksum
//     const payload = JSON.stringify(data);
//     const payloadBase64 = Buffer.from(payload).toString('base64');
//     const keyIndex = 1;
//     const stringToHash = payloadBase64 + '/pg/v1/pay' + salt_key;
//     const sha256 = crypto.createHash('sha256').update(stringToHash).digest('hex');
//     const checksum = sha256 + '###' + keyIndex;

//     // API request options to PhonePe
//     const options = {
//       method: 'POST',
//       url: "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay",
//       headers: {
//         accept: 'application/json',
//         'Content-Type': 'application/json',
//         'X-VERIFY': checksum,
//       },
//       data: {
//         request: payloadBase64,
//       },
//     };

//     // Make the API request to PhonePe
//     const response = await axios(options);

//     // Log the response for debugging
//     console.log("PhonePe Response Data:", response.data);

//     if (response.data.success) {
//       const redirectUrl = response.data.data?.instrumentResponse?.redirectInfo?.url;

//       // Return the redirect URL for the user to complete the payment
//       if (redirectUrl) {
//         res.json({
//           success: true,
//           redirectUrl,
//         });
//       } else {
//         res.status(400).json({
//           success: false,
//           message: "Redirect URL not found in the response.",
//         });
//       }
//     } else {
//       console.log("PhonePe Error Data:", response.data);
//       res.status(400).json({
//         success: false,
//         message: "Failed to initiate payment",
//         error: response.data,
//       });
//     }
//   } catch (error) {
//     console.error("Error in /ordertest:", error.message);
//     console.error("Stack Trace:", error.stack);
//     console.error("Axios Error Response:", error.response?.data);  // Log the response body from PhonePe error

//     res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//       error: error.message,
//     });
//   }
// });
// // Function to validate the payment instrument
// function isValidPaymentInstrument(paymentInstrument) {
//   if (paymentInstrument && paymentInstrument.type) {
//     // For Card type
//     if (paymentInstrument.type === 'CARD') {
//       return validateCardDetails(paymentInstrument);
//     } 
//     // For UPI type
//     else if (paymentInstrument.type === 'UPI') {
//       return validateUPI(paymentInstrument);
//     } 
//     else {
//       return false; // Invalid payment type
//     }
//   }
//   return false; // Invalid payment instrument
// }
// // Function to validate card details
// function validateCardDetails(paymentInstrument) {
//   // Check if the ARN and PG Transaction ID are available and correct
//   if (paymentInstrument.arn && paymentInstrument.arn.length > 0 && 
//       paymentInstrument.pgTransactionId && paymentInstrument.pgTransactionId.length > 0) {
//     return true;
//   }
//   console.log("Invalid card details: ARN or PG Transaction ID is missing.");
//   return false;
// }
// // Function to validate UPI details
// function validateUPI(paymentInstrument) {
//   if (paymentInstrument.upiId && paymentInstrument.upiId.includes('@')) {
//     return true;
//   }
//   console.log("Invalid UPI details: UPI ID is not valid.");
//   return false;
// }

// // Endpoint to handle payment status
// router.post('/statuss', async (req, res) => {
//   try {
//     const merchantTransactionId = req.query.id;

//     if (!merchantTransactionId) {
//       return res.status(400).json({ success: false, message: 'Transaction ID is missing.' });
//     }

//     // Generate checksum for validation
//     const keyIndex = 1;
//     const string = `/pg/v1/status/${merchant_id}/${merchantTransactionId}` + salt_key;
//     const sha256 = crypto.createHash('sha256').update(string).digest('hex');
//     const checksum = sha256 + '###' + keyIndex;

//     // Send request to PhonePe for payment status
//     const options = {
//       method: 'GET',
//       url: `https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/${merchant_id}/${merchantTransactionId}`,
//       headers: {
//         accept: 'application/json',
//         'Content-Type': 'application/json',
//         'X-VERIFY': checksum,
//         'X-MERCHANT-ID': merchant_id,
//       },
//     };

//     const response = await axios.request(options);

//     // Log the response for debugging purposes
//     console.log("PhonePe Response Data:", response.data);

//     if (response.data && response.data.data) {
//       const responseCode = response.data.data.responseCode;
//       const state = response.data.data.state; // Check the state (e.g., COMPLETED, PENDING)
//       const paymentInstrument = response.data.data.paymentInstrument;  // Check payment details

//       // Check for payment success
//       if (responseCode === 'SUCCESS' && state === 'COMPLETED') {
//         // Check payment instrument and verify thoroughly
//         if (paymentInstrument && isValidPaymentInstrument(paymentInstrument)) {
//           // Proceed to update the order as successful
//           const paymentData = {
//             paymentStatus: 'Success',
//             paymentDate: new Date(),
//             transactionId: merchantTransactionId,
//             MID: merchant_id,
//           };

//           // Update order status to "Confirmed"
//           const updatedOrder = await Order.findOneAndUpdate(
//             { 'paymentDetails.transactionId': merchantTransactionId },
//             {
//               $set: {
//                 'paymentDetails': paymentData,
//                 status: 'Confirmed', // Mark as confirmed
//               },
//             },
//             { new: true }
//           );

//           if (!updatedOrder) {
//             return res.status(404).json({ success: false, message: 'Order not found.' });
//           }

//           // Redirect to success page
//           return res.redirect(`${process.env.FROAPI}/paymentsuccess`);
//         } else {
//           // If payment instrument is invalid or missing critical details
//           const failureMessage = "Payment failed due to invalid payment details or fraud detection.";

//           const paymentData = {
//             paymentStatus: 'Failed',
//             paymentDate: new Date(),
//             transactionId: null,
//             MID: null,
//           };

//           // Update order status to "Failed"
//           await Order.findOneAndUpdate(
//             { 'paymentDetails.transactionId': merchantTransactionId },
//             {
//               $set: {
//                 'paymentDetails': paymentData,
//                 status: 'Failed', // Mark as failed
//               },
//             },
//             { new: true }
//           );

//           console.log("Payment Failed: ", failureMessage);

//           // Redirect to failure page
//           return res.redirect(`${process.env.FROAPI}/paymentfailure?message=${encodeURIComponent(failureMessage)}`);
//         }
//       } else {
//         const failureMessage = "Payment failed due to invalid state or incomplete response.";

//         const paymentData = {
//           paymentStatus: 'Failed',
//           paymentDate: new Date(),
//           transactionId: null,
//           MID: null,
//         };

//         // Update order status to "Failed"
//         await Order.findOneAndUpdate(
//           { 'paymentDetails.transactionId': merchantTransactionId },
//           {
//             $set: {
//               'paymentDetails': paymentData,
//               status: 'Failed', // Mark as failed
//             },
//           },
//           { new: true }
//         );

//         console.log("Payment Failed: ", failureMessage);

//         return res.redirect(`${process.env.FROAPI}/paymentfailure?message=${encodeURIComponent(failureMessage)}`);
//       }
//     } else {
//       const errorMsg = 'Payment status response is invalid or incomplete.';
//       return res.status(500).send(`
//           <h1>Payment Error</h1>
//           <p>We encountered an issue while processing your payment. Please try again.</p>
//       `);
//     }
//   } catch (error) {
//     console.error("Error in /statuss:", error.message);
//     return res.status(500).send(`
//         <h1>Payment Error</h1>
//         <p>We encountered an issue while processing your payment. Please try again.</p>
//     `);
//   }
// });

// About Us Clients Images Start
// const Clients = require('../model/Clients');  // Client DataBase Table
//add Cilent
// const clientStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'client/'); 
//   },
//   filename: (req, file, cb) => {
//     const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
//     cb(null, uniqueName);
//   }
// });
// const clientUpload = multer({ storage: clientStorage });

// router.post('/add-clients' , clientUpload.array('cilentsimage') , async (req, res) => {
//   try {
    
//     // Map the uploaded images to their paths
//     const imagePaths = req.files.map(file => `${process.env.BACKAPI}/client/` + file.filename);

//     // Create a new product from the request body and uploaded images
//     const newClient = new Clients({
//       Clients_name: req.body['cilents-name'],
//       Clients_img: imagePaths 
//     });

//     // Save product to database
//     await newClient.save();

//     const notificationMessage = "A new Clients has been added to the inventory.";
//     await Notification.create({
//       type: 'client-img-add',
//       message: notificationMessage,
//       username: 'Admin', 
//     });

//     // Send a success response
//     res.status(201).json(newClient);
//   } catch (err) {
//     console.error('Error adding Client:', err);
//     res.status(500).json();
//   }
// });

// //Admin Side Cilent With Image Delete API
// router.delete("/displayclient/:id", async (req, res) => {
//   const { id } = req.params;

//   try {
//     // Find and delete the product
//     const client = await Clients.findByIdAndDelete(id);

//     if (!client) {
//       return res.status(404).json({ message: "Cilents not found" });
//     }

//     // Delete associated images from the filesystem
//     if (client.Clients_img && client.Clients_img.length > 0) {
//       client.Clients_img.forEach((imagePath) => {
//         // Get the file path from the URL
//         const filename = path.basename(imagePath); // Extract filename from URL
//         const fullPath = path.join(__dirname, "../client", filename); // Adjust path as needed

//         // Delete the file
//         fs.unlink(fullPath, (err) => {
//           if (err) {
//             console.error(`Error deleting file ${filename}:`, err);
//           }
//         });
//       });
//     }
//     // Respond to the client
//     const notificationMessage = "Clients has been Deleted to the inventory.";
//     await Notification.create({
//       type: 'client-img-delete',
//       message: notificationMessage,
//       username: 'Admin', 
//     });
//     res
//       .status(200)
//       .json({ message: "Cilents and all associated data deleted successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// });

// //display by id
// router.get('/displayclient/:id', apiKeyMiddleware , async (req, res) => {
//   const { id } = req.params;

//   try {
//     const client = await Clients.findById(id);
//     if (!client) {
//       return res.status(404).json({ message: "Client not found" });
//     }
//     res.status(200).json(client);
//   } catch (error) {
//     console.error('Error fetching client:', error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// });

// // Display Client 
// router.get("/displayclient", apiKeyMiddleware , async (req, res) => {
//   try {
//     const client = await Clients.find().sort({ createdAt: -1 }); // Sort by newest
//     res.status(200).json(client);
//   } catch (err) {
//     res.status(500).json({ error: "Internal server error", details: err.message });
//   }
// });

// //Admin Side Cilent Update-Edit API
// router.put('/editclient/:id', clientUpload.array('cilentsimage'), async (req, res) => {
//   const { id } = req.params;

//   try {
//     const existingClient = await Clients.findById(id);

//     if (!existingClient) {
//       return res.status(404).json({ message: "Client not found" });
//     }

//     // Update fields
//     const updatedData = {
//       Clients_name: req.body['cilents-name'] || existingClient.Clients_name,
//     };

//     // Handle new images if uploaded
//     if (req.files && req.files.length > 0) {
//       const imagePaths = req.files.map(file => `${process.env.BACKAPI}/client/` + file.filename);
//       updatedData.Clients_img = imagePaths;
//     }

//     // Update client in the database
//     const updatedClient = await Clients.findByIdAndUpdate(id, updatedData, { new: true });

//     const notificationMessage = "Clients has been Updated to the inventory.";
//     await Notification.create({
//       type: 'client-img-edit',
//       message: notificationMessage,
//       username: 'Admin', 
//     });

//     res.status(200).json(updatedClient);
//   } catch (err) {
//     console.error('Error updating client:', err);
//     res.status(500).json({ message: 'Failed to update client', error: err.message });
//   }
// });
// About Us Clients Images End

// Phone Pe Payment
// Payment Key
// const salt_key = "96434309-7796-489d-8924-ab56988a6076";
// const merchant_id = "PGTESTPAYUAT86";


// // Order Create Endpoint
// router.post('/ordertest', async (req, res) => {
//     try {
//         // Extract data from the request
//         const { user_id, UserName, Name, amount, contactnumber, transactionId, email, address, city, state, zipcode, products, note, paymentMethod } = req.body;
  
//         // 1. Save the order in the database first (without payment confirmation)
//         const newOrder = new Order({
//           user_id,
//           UserName,
//           Name,
//           email,
//           address,
//           city,
//           state,
//           zipcode,
//           contactnumber,
//           products,
//           note,
//           totalAmount: amount,
//           paymentMethod,
//           status: 'Pending', // Initial status is Pending
//           paymentDetails: {
//             paymentDate: null, // Will be updated after successful payment
//             paymentStatus: 'Pending', // Initially pending
//             transactionId, // Transaction ID will be null initially
//             MID: null, // MID will be null initially
//           },
//           order_date: new Date().toLocaleDateString(),
//       });
  
//         // Save the order to the database
//         await newOrder.save();
  
//         // 2. Payment data for PhonePe
//         const data = {
//             merchantId: merchant_id,
//             merchantTransactionId: transactionId,
//             amount: amount * 100, // Convert to smallest currency unit
//             redirectUrl: `${process.env.BACKAPI}/statuss?id=${transactionId}`,
//             redirectMode: "POST",
//             mobileNumber: contactnumber,
//             paymentInstrument: {
//                 type: "PAY_PAGE",
//             },
//         };
  
//         // Create payload and checksum
//         const payload = JSON.stringify(data);
//         const payloadBase64 = Buffer.from(payload).toString('base64');
//         const keyIndex = 1;
//         const stringToHash = payloadBase64 + '/pg/v1/pay' + salt_key;
//         const sha256 = crypto.createHash('sha256').update(stringToHash).digest('hex');
//         const checksum = sha256 + '###' + keyIndex;
  
//         // API request options
//         const options = {
//             method: 'POST',
//             url: "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay",
//             headers: {
//                 accept: 'application/json',
//                 'Content-Type': 'application/json',
//                 'X-VERIFY': checksum,
//             },
//             data: {
//                 request: payloadBase64,
//             },
//         };
  
//         // Make the API request to PhonePe
//         const response = await axios(options);
  
//         // Log the entire response data for debugging
//         if (response.data.success) {
//             const redirectUrl = response.data.data?.instrumentResponse?.redirectInfo?.url;
  
//             // 3. Return the redirect URL to the frontend for user to complete the payment
//             if (redirectUrl) {
//                 res.json({
//                     success: true,
//                     redirectUrl, // Return the correct redirect URL to the frontend
//                 });
//             } else {
//                 res.status(400).json({
//                     success: false,
//                     message: "Redirect URL not found in the response.",
//                 });
//             }
//         } else {
//             res.status(400).json({
//                 success: false,
//                 message: "Failed to initiate payment",
//                 error: response.data,
//             });
//         }
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: "Internal Server Error",
//             error: error.message,
//         });
//     }
//   });
  
// // Payment Status Check API
// router.post('/statuss', async (req, res) => {
//   try {
//       const merchantTransactionId = req.query.id; // Get transaction ID from query params

//       if (!merchantTransactionId) {
//           return res.status(400).json({ success: false, message: 'Transaction ID is missing.' });
//       }

//       // Generate checksum for validation
//       const keyIndex = 1;
//       const string = `/pg/v1/status/${merchant_id}/${merchantTransactionId}` + salt_key;
//       const sha256 = crypto.createHash('sha256').update(string).digest('hex');
//       const checksum = sha256 + '###' + keyIndex;

//       // Send request to PhonePe for payment status
//       const options = {
//           method: 'GET',
//           url: `https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/${merchant_id}/${merchantTransactionId}`,
//           headers: {
//               accept: 'application/json',
//               'Content-Type': 'application/json',
//               'X-VERIFY': checksum,
//               'X-MERCHANT-ID': merchant_id,
//           },
//       };

//       const response = await axios.request(options);

//       // Log the response for debugging purposes
//       console.log("PhonePe Response Data:", response.data);

//       if (response.data && response.data.data) {
//           const responseCode = response.data.data.responseCode;  
//           const state = response.data.data.state;  
//           const errorCode = response.data.data.errorCode;  
//           const errorMessage = response.data.data.errorMessage;

//           // If payment is successful (responseCode 'SUCCESS' and state 'COMPLETED')
//           if (responseCode === 'SUCCESS' && state === 'COMPLETED') {
//               // Additional check for errorCode or payment details validation
//               if (errorCode) {
//                   // If there is an error code, treat the payment as failed
//                   const failureMessage = errorMessage || "Payment failed due to invalid details.";
//                   const paymentData = {
//                       paymentStatus: 'Failed',
//                       paymentDate: new Date(),
//                       transactionId: null,
//                       MID: null,
//                   };

//                   // Update the order status to "Failed"
//                   await Order.findOneAndUpdate(
//                       { 'paymentDetails.transactionId': merchantTransactionId },
//                       {
//                           $set: {
//                               'paymentDetails': paymentData,
//                               status: 'Failed', // Mark as failed
//                           },
//                       },
//                       { new: true }
//                   );

//                   // Log the failure message for debugging
//                   console.log("Payment Failed due to invalid details: ", failureMessage);

//                   return res.redirect(`${process.env.FROAPI}/paymentfailure?message=${encodeURIComponent(failureMessage)}`);
//               }

//               // If no error, the payment is successfully completed
//               const paymentData = {
//                   paymentStatus: 'Success',
//                   paymentDate: new Date(),
//                   transactionId: merchantTransactionId,
//                   MID: merchant_id,
//               };

//               // Update the order status to "Confirmed"
//               const updatedOrder = await Order.findOneAndUpdate(
//                   { 'paymentDetails.transactionId': merchantTransactionId },
//                   {
//                       $set: {
//                           'paymentDetails': paymentData,
//                           status: 'Confirmed', // Mark as confirmed
//                       },
//                   },
//                   { new: true }
//               );

//               if (!updatedOrder) {
//                   return res.status(404).json({ success: false, message: 'Order not found.' });
//               }

//               return res.redirect(`${process.env.FROAPI}/paymentsuccess`);
//           } else {
//               // Payment failed due to wrong details or other issues
//               const failureMessage = errorMessage || "Payment failed or invalid payment details.";
//               const paymentData = {
//                   paymentStatus: 'Failed',
//                   paymentDate: new Date(),
//                   transactionId: null,
//                   MID: null,
//               };

//               // Update the order status to "Failed"
//               await Order.findOneAndUpdate(
//                   { 'paymentDetails.transactionId': merchantTransactionId },
//                   {
//                       $set: {
//                           'paymentDetails': paymentData,
//                           status: 'Failed', // Mark as failed
//                       },
//                   },
//                   { new: true }
//               );

//               // Log the failure message for debugging
//               console.log("Payment Failed: ", failureMessage);

//               return res.redirect(`${process.env.FROAPI}/paymentfailure?message=${encodeURIComponent(failureMessage)}`);
//           }
//       } else {
//           // If PhonePe response is incomplete or unexpected
//           const errorMsg = 'Payment status response is invalid or incomplete.';
//           console.error(errorMsg);

//           return res.status(500).send(`
//               <h1>Payment Error</h1>
//               <p>We encountered an issue while processing your payment. Please try again.</p>
//           `);
//       }
//   } catch (error) {
//       console.error("Error in /statuss:", error.message);

//       return res.status(500).send(`
//           <h1>Payment Error</h1>
//           <p>We encountered an issue while processing your payment. Please try again.</p>
//       `);
//   }
// });

//refund report
// router.get('/report/monthly/refund', apiKeyMiddleware  , async (req, res) => {
//   try {
//     const { month, year } = req.query;

//     if (!month || !year) {
//       return res.status(400).json({ message: 'Month and year are required!' });
//     }

//     // Parse start and end dates in UTC
//     const startDate = new Date(Date.UTC(year, month - 1, 1));
//     const endDate = new Date(Date.UTC(year, month, 1));

//     // Query MongoDB
//     const refunds = await Refund.find({
//       createdAt: {
//         $gte: startDate,
//         $lt: endDate,
//       },
//     });

//     return res.status(200).json({
//       success: true,
//       count: refunds.length,
//       refunds,
//     });
//   } catch (error) {
//     console.error('Error in /report/monthly:', error);
//     return res.status(500).json({ message: 'Server error' });
//   }
// });

// //return order report
// router.get('/report/monthly/returnorder', apiKeyMiddleware  , async (req, res) => {
//   try {
//     const { month, year } = req.query;

//     if (!month || !year) {
//       return res.status(400).json({ message: 'Month and year are required!' });
//     }

//     // Parse start and end dates in UTC
//     const startDate = new Date(Date.UTC(year, month - 1, 1));
//     const endDate = new Date(Date.UTC(year, month, 1));

//     // Query MongoDB
//     const returns = await RetunOrder.find({
//       createdAt: {
//         $gte: startDate,
//         $lt: endDate,
//       },
//     });

//     return res.status(200).json({
//       success: true,
//       count: returns.length,
//       returns,
//     });
//   } catch (error) {
//     console.error('Error in /report/monthly:', error);
//     return res.status(500).json({ message: 'Server error' });
//   }
// });