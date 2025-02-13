var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');

const apiKeyMiddleware = require('../../Middleware/ApiKey'); 

const Review = require('../../model/productreview'); 

//submit a new review for a product
router.post('/products/:id/reviews', apiKeyMiddleware ,(req, res) => {
    const productId = req.params.id;
    const { rating, message, name } = req.body;
  
    // Validate the input
    if (!rating || !message || !name) {
      return res.status(400).json({ error: "Rating, message, and name are required" });
  }
  
    // Create a new review document
    const newReview = new Review({ productId, rating, message, name });
  
    newReview.save()
      .then(review => {
        res.status(201).json(review); // Send the created review to the frontend
      })
      .catch(err => {
        console.error("Error saving review:", err);
        res.status(500).send("Failed to submit review");
      });
  });
  
  //get reviews for a specific product
router.get('/products/:id/reviews', apiKeyMiddleware , (req, res) => {
    const productId = req.params.id;
  
    // Check if the productId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).send("Invalid product ID");
    }
  
    Review.find({ productId })
      .then(reviews => {
        res.status(200).json(reviews); // Send reviews to the frontend
      })
      .catch(err => {
        console.error("Error fetching reviews:", err);
        res.status(500).send("Failed to fetch reviews");
      });
  });
  
  // Route to get all reviews with product images
router.get('/admin/reviews' , apiKeyMiddleware , async (req, res) => {
    try {
      
      const reviews = await Review.find()
        .populate('productId', 'Product_img Product_name') 
        .sort({ createdAt: -1 })
        .exec();
  
      // Format the data as needed
      const reviewsWithProductImages = reviews.map(review => ({
        reviewId: review._id,
        name: review.name,
        message: review.message,
        rating: review.rating,
        rating_date: review.rating_date,
        productName: review.productId.Product_name,
        productImages: review.productId.Product_img, // List of product images
      }));
  
      // Send the response with reviews and product images
      res.status(200).json({ reviews: reviewsWithProductImages });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server Error' });
    }
  });
  
  //Delete Review In Admin Side
router.delete('/admin/reviews/:id', apiKeyMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
  
        // Find and delete the review by its ID
        const deletedReview = await Review.findByIdAndDelete(id);
  
        if (!deletedReview) {
            return res.status(404).json({ error: 'Review not found' });
        }
  
        res.status(200).json({ message: 'Review deleted successfully', reviewId: id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
  });

module.exports = router;