var express = require('express');
var router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require("fs");

const apiKeyMiddleware = require('../../Middleware/ApiKey'); 

const MainBannerAdmin = require('../../model/MainAdminBanner'); 
const Notification = require('../../model/Notification');  

const mainBannerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = 'main-banner-admin/';
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

const mainBannerUpload = multer({ storage: mainBannerStorage });

// Main Banner Admin Upload
router.post('/add-admin-main-banner', mainBannerUpload.array('mainBannerImg'), async (req, res) => {
    try {
      const { mainBannerName } = req.body;
  
      const imagePaths = req.files.map(file => `${process.env.BACKAPI}/main-banner-admin/` + file.filename);
  
      const newMainBanner = new MainBannerAdmin({
        MainBanner_name: mainBannerName,
        MainBanner_img: imagePaths,
      });
  
      await newMainBanner.save();
  
      await Notification.create({
        type: 'gallery-img-add',
        message: `Main Banner Was Added Successfully`,
        username: 'Admin',
      });
  
      res.status(201).json({ message: 'Main Banner uploaded successfully', data: newMainBanner });
    } catch (error) {
      console.error('Error details:', error);
      res.status(500).json({ message: 'Error uploading Main Banner', error: error.message });
    }
});
  
//Display Main Banner
router.get('/display-admin-main-banner', apiKeyMiddleware , async (req, res) => {
    try {
      const mainAdminBanner = await MainBannerAdmin.find().sort({ createdAt: -1});
      res.status(200).json(mainAdminBanner);
    } catch (error) {
      console.error('Error fetching mainAdminBanner:', error);
      res.status(500).json({ message: 'Error fetching mainAdminBanner' });
    }
});
  
//Edit Main Banner Admin
router.put('/edit-admin-main-banner/:id', mainBannerUpload.array('mainBannerImg'), async (req, res) => {
    try {
      const { id } = req.params; 
      const { mainBannerName, existingImages } = req.body; 
  
      // Initialize the data to update
      const updateData = {
        MainBanner_name: mainBannerName,
      };
  
      // Parse and handle existing images
      if (existingImages) {
        updateData.MainBanner_img = JSON.parse(existingImages); 
      }
  
      // Handle new image uploads
      if (req.files && req.files.length > 0) {
        const mainBannerUpload = req.files.map(file => `${process.env.BACKAPI}/main-banner-admin/` + file.filename);
        updateData.MainBanner_img = (updateData.MainBanner_img || []).concat(mainBannerUpload);
      }
  
      // Find and update the gallery by ID
      const updatedGallery = await MainBannerAdmin.findByIdAndUpdate(id, updateData, { new: true });
      if (!updatedGallery) {
        return res.status(404).json({ message: 'Main Banner not found' });
      }
  
      // Log the notification of update
      const notificationMessage = "Main Banner was updated successfully";
      await Notification.create({
        type: 'gallery-img-edit',
        message: notificationMessage,
        username: 'Admin',
      });
  
      res.status(200).json({
        message: 'Main Banner updated successfully',
        data: updatedGallery,
      });
    } catch (err) {
      console.error('Error updating Main Banner:', err); 
      res.status(500).json({
        message: 'Failed to update Main Banner',
        error: err.message,
      });
    }
});
  
//Admin Side Gallery With Image Delete API
router.delete("/delete-main-banner/:id", async (req, res) => {
    const { id } = req.params;
  
    try {
      // Find and delete the product
      const galleryphoto = await MainBannerAdmin.findByIdAndDelete(id);
  
      if (!galleryphoto) {
        return res.status(404).json({ message: "Main Banner Photo not found" });
      }
  
      // Delete associated images from the filesystem
      if (galleryphoto.MainBanner_img && galleryphoto.MainBanner_img.length > 0) {
        galleryphoto.MainBanner_img.forEach((imagePath) => {
          // Get the file path from the URL
          const filename = path.basename(imagePath);
          const fullPath = path.join(__dirname, "../../main-banner-admin", filename); 
  
          // Delete the file
          fs.unlink(fullPath, (err) => {
            if (err) {
              console.error(`Error deleting file ${filename}:`, err);
            }
          });
        });
      }
      // Respond to the client
      const notificationMessage = `Main Banner Image Was Deleted Successfully`;
      await Notification.create({
        type: 'gallery-img-delete',
        message: notificationMessage,
        username: 'admin',
      });
      res
        .status(200)
        .json({ message: "Main Banner Photo and all associated data deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;