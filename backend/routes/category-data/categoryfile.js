var express = require('express');
var router = express.Router();

const apiKeyMiddleware = require('../../Middleware/ApiKey'); 

const Category = require('../../model/category'); 
const Notification = require('../../model/Notification');  
const Product = require('../../model/product');

// Add a new category
router.post("/addcategory", async (req, res) => {
const { name } = req.body;
try {
    if (!name) return res.status(400).json({ error: "Name is required" });

    const existingCategory = await Category.findOne({ name: name.trim() });
    if (existingCategory) return res.status(400).json({ error: "Category already exists" });

    const category = new Category({ name: name.trim() });
    await category.save();

    const notificationMessage = "New Category Added";
    await Notification.create({
    type: 'catgory-add',
    message: notificationMessage,
    username: 'Admin', 
    });

    res.status(201).json({ message: "Category added successfully", category });
} catch (err) {
    res.status(500).json({ error: "Internal server error", details: err.message });
}
});

// Get all categories
router.get("/displaycategory", apiKeyMiddleware , async (req, res) => {
try {
    const categories = await Category.find().sort({ createdAt: -1 }); // Sort by newest
    res.status(200).json(categories);
} catch (err) {
    res.status(500).json({ error: "Internal server error", details: err.message });
}
});

// Update category name
router.put("/editcategory/:id", async (req, res) => {
const { id } = req.params;
const { name } = req.body;

try {
    if (!name) return res.status(400).json({ error: "Name is required" });

    // Check if category exists
    const category = await Category.findById(id);
    if (!category) return res.status(404).json({ error: "Category not found" });

    // Check if the new name is already taken by another category
    const existingCategory = await Category.findOne({ name: name.trim() });
    if (existingCategory && existingCategory._id.toString() !== id)
    return res.status(400).json({ error: "Category with this name already exists" });

    category.name = name.trim();
    await category.save();

    const notificationMessage = "Category Was Updated";
    await Notification.create({
    type: 'catgory-edit',
    message: notificationMessage,
    username: 'Admin', 
    });

    // Update all products with the old category ID
    await Product.updateMany(
    { Product_category: category._id },
    { $set: { Product_category: category._id } }
    );

    res.status(200).json({ message: "Category updated successfully", category });
} catch (err) {
    res.status(500).json({ error: "Internal server error", details: err.message });
}
});

// Delete category and associated products
router.delete("/deletecategory/:id", async (req, res) => {
const { id } = req.params;

try {
    const category = await Category.findById(id);
    if (!category) {
    return res.status(404).json({ error: "Category not found" });
    }
    await Product.deleteMany({ Product_category: category._id });
    // Correct way to delete the category
    await Category.deleteOne({ _id: category._id });
    
    const notificationMessage = "Category Was Deleted";
    await Notification.create({
    type: 'catgory-delete',
    message: notificationMessage,
    username: 'Admin', 
    });

    res.status(200).json({ message: "Category and associated products deleted successfully" });
} catch (err) {
    console.error("Error deleting category:", err);
    res.status(500).json({ error: "Internal server error", details: err.message });
}
});

module.exports = router;