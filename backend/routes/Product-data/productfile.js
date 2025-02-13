var express = require('express');
var router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require("fs");

const apiKeyMiddleware = require('../../Middleware/ApiKey'); 

const Product = require('../../model/product');
const Notification = require('../../model/Notification');  
const Review = require('../../model/productreview'); 

// Ensure directories exist
const ensureDirExists = (dir) => {
  if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
  }
};

// Storage for Product Images
const productStorage = multer.diskStorage({
destination: (req, file, cb) => {
  const dir = 'uploads/products/';
  ensureDirExists(dir);  // Create folder if it doesn't exist
  cb(null, dir);
},
filename: (req, file, cb) => {
  const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
  cb(null, uniqueName);
}
});

// Storage for Size Images
const sizeStorage = multer.diskStorage({
destination: (req, file, cb) => {
  const dir = 'uploads/sizes/';
  ensureDirExists(dir);
  cb(null, dir);
},
filename: (req, file, cb) => {
  const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
  cb(null, uniqueName);
}
});

const upload = multer({
storage: multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = '';
    if (file.fieldname === 'productimage') folder = 'uploads/products/';
    else if (file.fieldname === 'sizeimage') folder = 'uploads/sizes/';
    ensureDirExists(folder);
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
})
});

// Middleware to handle multiple file uploads
const uploadMiddleware = upload.fields([
{ name: 'productimage', maxCount: 5 },
{ name: 'sizeimage', maxCount: 5 }
]);

router.post('/add-product', uploadMiddleware, async (req, res) => {
  try {

    if (!req.files) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const productImages = req.files['productimage'] 
      ? req.files['productimage'].map(file => `${process.env.BACKAPI}/uploads/products/${file.filename}`)
      : [];

    const sizeImages = req.files['sizeimage'] 
      ? req.files['sizeimage'].map(file => `${process.env.BACKAPI}/uploads/sizes/${file.filename}`)
      : [];

    const newProduct = new Product({
      Product_name: req.body['product-name'],
      Product_des: req.body['product-description'],
      Product_price: req.body['product-price'],
      Product_category: req.body['product-category'],
      Product_sizes: req.body['product-sizes'], 
      Product_img: productImages,
      Size_images: sizeImages,
      Product_quantity: req.body['product-quantity'], 
      Product_stock_status: req.body['product-stock-status'], 
      Best_seller: req.body['Best_seller'] === 'true' ,
      tags: req.body['tags'].split(',').map(tag => tag.trim())
    });

    await newProduct.save();

    const notificationMessage = `A new product "${newProduct.Product_name}" has been added to the inventory.`;
    await Notification.create({
      type: 'product-added',
      message: notificationMessage,
      username: 'Admin',
    });

    res.status(201).json(newProduct);
  } catch (err) {
    console.error('Error adding product:', err);
    res.status(500).json();
  }
});

//Admin Side Update-Edit API
router.put('/update-product/:id', uploadMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Find the existing product
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const updateData = {
      Product_name: req.body['product-name'],
      Product_des: req.body['product-description'],
      Product_price: req.body['product-price'],
      Product_category: req.body['product-category'],
      Product_sizes: req.body['product-sizes'],
      Product_stock_status: req.body['product-stock-status'],
      Best_seller: req.body['Best_seller'] === 'true',
      tags: req.body['product-tags'] ? req.body['product-tags'].split(',') : [],
    };

    // Handle Product Quantity explicitly
    if (req.body['product-quantity'] !== undefined) {
      updateData.Product_quantity = parseInt(req.body['product-quantity'], 10);
    }

    // Function to delete old images
    const deleteOldImages = (imageArray, folderName) => {
      if (imageArray && imageArray.length > 0) {
        imageArray.forEach((imagePath) => {
          const filename = path.basename(imagePath);
          const fullPath = path.join(__dirname, `../../uploads/${folderName}/`, filename);

          fs.unlink(fullPath, (err) => {
            if (err && err.code !== 'ENOENT') {
              console.error(`Error deleting old image ${filename}:`, err);
            }
          });
        });
      }
    };

    // **Handle Product Images**
    if (req.files && req.files['productimage']) {
      // Delete old product images when new images are uploaded
      deleteOldImages(existingProduct.Product_img, 'products');

      // Save new product images
      updateData.Product_img = req.files['productimage'].map(file => `${process.env.BACKAPI}/uploads/products/${file.filename}`);
    } else {
      // Keep existing images if no new images are uploaded
      updateData.Product_img = existingProduct.Product_img;
    }

    // **Handle Size Images**
    if (req.files && req.files['sizeimage']) {
      // Delete old size images when new images are uploaded
      deleteOldImages(existingProduct.Size_images, 'sizes');

      // Save new size images
      updateData.Size_images = req.files['sizeimage'].map(file => `${process.env.BACKAPI}/uploads/sizes/${file.filename}`);
    } else {
      // Keep existing images if no new images are uploaded
      updateData.Size_images = existingProduct.Size_images;
    }

    // Update the product in the database
    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Create a notification for the update
    const notificationMessage = `Product "${updateData.Product_name}" has been updated.`;
    await Notification.create({
      type: 'product-updated',
      message: notificationMessage,
      username: 'Admin',
    });

    res.status(200).json(updatedProduct);
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ message: 'Failed to update product' });
  }
});

//Admin Side Product With Image Delete API
router.delete("/products/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Find the product by ID
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Function to delete images from filesystem
    const deleteImages = (imageArray, folderName) => {
      if (imageArray && imageArray.length > 0) {
        imageArray.forEach((imagePath) => {
          const filename = path.basename(imagePath); // Extract filename
          const fullPath = path.join(__dirname, `../../uploads/${folderName}`, filename); // Correct path

          // Delete the file
          fs.unlink(fullPath, (err) => {
            if (err && err.code !== "ENOENT") {
              console.error(`Error deleting file ${filename}:`, err);
            }
          });
        });
      }
    };

    // Delete product images from 'uploads/products' folder
    deleteImages(product.Product_img, "products");

    // Delete size images from 'uploads/sizes' folder
    deleteImages(product.Size_images, "sizes");

    // Delete the product from the database
    await Product.findByIdAndDelete(id);

    // Delete associated reviews
    await Review.deleteMany({ productId: id });

    // Create a notification for the deletion
    const notificationMessage = `A product "${product.Product_name}" has been deleted from the inventory.`;
    await Notification.create({
      type: "product-delete",
      message: notificationMessage,
      username: "Admin",
    });

    // Respond to client
    res.status(200).json({ message: "Product and associated data deleted successfully" });

  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

//Display all Product And  API Product Search and category filter and stock status
router.get('/products', apiKeyMiddleware , async (req, res) => {
  const { search, category, size, stockStatus, bestSeller } = req.query;

  const filter = {};

  // Apply filter for stock status if provided
  if (stockStatus) {
    if (stockStatus === "stock") {
      filter.Product_stock_status = "stock";
    } else if (stockStatus === "out-of-stock") {
      filter.Product_stock_status = "out-of-stock";
    }
  }

  // Apply filter for best seller status if provided
  if (bestSeller) {
    filter.Best_seller = bestSeller === "true";
  }

  // Apply filter for category if provided
  if (category) {
    filter.Product_category = category;
  }

  // Apply filter for search if provided (case-insensitive search for product name)
  if (search) {
    const searchRegex = new RegExp(search, 'i'); // Create a case-insensitive regex
    filter.$or = [
      { Product_name: { $regex: searchRegex } },
      { tags: { $regex: searchRegex } },
    ];
  }

  // If size is provided, add it to the filter
  if (size) {
    filter.Product_sizes = size;
  }

  try {
    // Query products with the accumulated filter
    const products = await Product.find(filter)
      .populate('Product_category')  // Populate category field with related data
      .sort({ createdAt: -1 });  // Sort products by creation date (newest first)

    // Return the filtered products
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

//Limited Product Display Frontend API
router.get('/productlimit', apiKeyMiddleware , (req, res) => {
  // Fetch all products from the database (or return a static array for now)
  Product.find()
  .sort({ createdAt: -1 })
  .limit(8)
    .then(products => {
      
      res.status(200).json(products); // Send product data to the frontend
    })
    .catch(err => {
      res.status(500).send();
    });
});

router.get('/products/best-sellers', apiKeyMiddleware , async (req, res) => {
  try {
    const bestSellers = await Product.find({ Best_seller: true }).sort({ createdAt: -1 });;
    res.status(200).json(bestSellers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch best-seller products' });
  }
});

//Display Product By ID In Session Storage Frontend Side
router.get('/products/:id', apiKeyMiddleware , async (req, res) => {
  try {
    const productId = req.params.id;

    // Validate the ID format if using MongoDB
    if (!productId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).send("Invalid product ID format");
    }

    // Fetch the product
    const product = await Product.findById(productId).populate('Product_category');
    if (!product) {
      return res.status(404).send("Product not found");
    }

    // Respond with the product
    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).send("Internal server error");
  }
});

router.get('/products/:id/related', apiKeyMiddleware, async (req, res) => {
  const productId = req.params.id;  // Use params for path variables

  if (!productId) {
    return res.status(400).json({ message: 'Product ID is required' });
  }

  try {
    // Fetch the product by ID
    const product = await Product.findById(productId).populate('Product_category');

    // If product is not found, return an error
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Extract category from the product
    const categoryId = product.Product_category._id;

    // Find other products in the same category, excluding the current product
    const relatedProducts = await Product.find({
      Product_category: categoryId,
      _id: { $ne: productId } // Exclude the current product
    })
      .populate('Product_category')  // Populate category field with related data
      .sort({ createdAt: -1 })  // Optionally, sort by creation date (newest first)

    // Return related products
    res.json(relatedProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;