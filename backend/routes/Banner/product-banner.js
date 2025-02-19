var express = require('express');
var router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require("fs");

const apiKeyMiddleware = require('../../Middleware/ApiKey'); 

const HomePagePhoto = require('../../model/HomePagePhoto'); // Product Gallery DataBase Table
const Notification = require('../../model/Notification'); 


const galleryStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = 'gallery-image/';
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true }); 
      }
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
      cb(null, uniqueName);
    }
  })
  
const galleryUpload = multer({ storage: galleryStorage });
  
  // Route to handle file uploads
  router.post('/add-gallery-homepage-admin', galleryUpload.array('galleryImages'), async (req, res) => {
    try {
      const { galleryName, galleryDes, galleryPrice, ProductIdRef } = req.body;
  
      if (!galleryName || !galleryDes || !galleryPrice || !ProductIdRef) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
  
      const existingGallery = await HomePagePhoto.findOne({ Gallery_name: galleryName });
      if (existingGallery) {
        return res.status(400).json({ message: `Gallery with the name ${galleryName} already exists.` });
      }
  
      // Validate Product ID
      const productExists = await Product.findById(ProductIdRef);
      if (!productExists) {
        return res.status(400).json({ message: 'Invalid Product ID Reference.' });
      }
  
      const imagePaths = req.files.map(file => `${process.env.BACKAPI}/gallery-image/` + file.filename);
  
      const newGallery = new HomePagePhoto({
        Gallery_name: galleryName,
        Gallery_Product_ID: ProductIdRef, // Store Product ID Reference
        Gallery_img: imagePaths,
        Gallery_des: galleryDes,
        Gallery_price: galleryPrice,
      });
  
      await newGallery.save();
  
      await Notification.create({
        type: 'gallery-img-add',
        message: `Gallery Image Was Added Successfully`,
        username: 'Admin',
      });
  
      res.status(201).json({ message: 'Gallery uploaded successfully', data: newGallery });
    } catch (error) {
      console.error('Error details:', error);
      res.status(500).json({ message: 'Error uploading gallery', error: error.message });
    }
  });
  
  //Admin Side Gallery With Image Delete API
  router.delete("/gallery-homepage-admin/:id", async (req, res) => {
    const { id } = req.params;
  
    try {
      // Find and delete the product
      const galleryphoto = await HomePagePhoto.findByIdAndDelete(id);
  
      if (!galleryphoto) {
        return res.status(404).json({ message: "Gallery Photo not found" });
      }
  
      // Delete associated images from the filesystem
      if (galleryphoto.Gallery_img && galleryphoto.Gallery_img.length > 0) {
        galleryphoto.Gallery_img.forEach((imagePath) => {
          // Get the file path from the URL
          const filename = path.basename(imagePath);
          const fullPath = path.join(__dirname, "../../gallery-image", filename); 
  
          // Delete the file
          fs.unlink(fullPath, (err) => {
            if (err) {
              console.error(`Error deleting file ${filename}:`, err);
            }
          });
        });
      }
      // Respond to the client
      const notificationMessage = `Gallery Image Was Deleted Successfully`;
      await Notification.create({
        type: 'gallery-img-delete',
        message: notificationMessage,
        username: 'admin',
      });
      res
        .status(200)
        .json({ message: "Gallery Photo and all associated data deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });
  
  //display by id
  router.get('/gallery-homepage-admin/:id', apiKeyMiddleware , async (req, res) => {
    const { id } = req.params;
  
    try {
      const gallery = await HomePagePhoto.findById(id);
      if (!gallery) {
        return res.status(404).json({ message: "Gallery Photo not found" });
      }
      res.status(200).json(gallery);
    } catch (error) {
      console.error('Error fetching client:', error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });
  
  // Display Gallery 
  router.get('/display-gallery-homepage-admin', async (req, res) => {
    try {
      const galleries = await HomePagePhoto.find().populate('Gallery_Product_ID', 'name price'); // Adjust fields as needed
      res.status(200).json(galleries);
    } catch (error) {
      console.error('Error fetching galleries:', error);
      res.status(500).json({ message: 'Error fetching galleries' });
    }
  });
  
  //Edit Gallery Img
  router.put('/edit-gallery-homepage-admin/:id', galleryUpload.array('galleryImages'), async (req, res) => {
    try {
      const { id } = req.params; // Extract gallery ID from route parameters
      const { galleryName, galleryDes, galleryPrice, ProductIdRef, existingImages } = req.body; // Extract fields from request body
  
      // Initialize the data to update
      const updateData = {
        Gallery_name: galleryName,
        Gallery_des: galleryDes,
        Gallery_price: galleryPrice,
      };
  
      // Handle Product ID Reference
      if (ProductIdRef) {
        // Optionally, you can validate the Product ID Reference to ensure it's valid
        const productExists = await Product.findById(ProductIdRef);
        if (!productExists) {
          return res.status(400).json({ message: 'Invalid Product ID Reference.' });
        }
        updateData.Gallery_Product_ID = ProductIdRef; // Update the Product ID Reference
      }
  
      // Parse and handle existing images
      if (existingImages) {
        updateData.Gallery_img = JSON.parse(existingImages); // Ensure existing images are maintained
      }
  
      // Handle new image uploads
      if (req.files && req.files.length > 0) {
        const uploadedImages = req.files.map(file => `${process.env.BACKAPI}/gallery-image/` + file.filename);
        updateData.Gallery_img = (updateData.Gallery_img || []).concat(uploadedImages); // Combine existing and new images
      }
  
      // Find and update the gallery by ID
      const updatedGallery = await HomePagePhoto.findByIdAndUpdate(id, updateData, { new: true });
      if (!updatedGallery) {
        return res.status(404).json({ message: 'Gallery not found' });
      }
  
      // Log the notification of update
      const notificationMessage = `Gallery "${galleryName}" was updated successfully`;
      await Notification.create({
        type: 'gallery-img-edit',
        message: notificationMessage,
        username: 'Admin',
      });
  
      res.status(200).json({
        message: 'Gallery updated successfully',
        data: updatedGallery,
      });
    } catch (err) {
      console.error('Error updating gallery:', err); // Log error for debugging
      res.status(500).json({
        message: 'Failed to update gallery',
        error: err.message,
      });
    }
  });


module.exports = router;