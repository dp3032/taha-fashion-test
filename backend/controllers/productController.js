const Product = require('../model/product');

// Check stock for a product
const checkStock = async (req, res) => {
    const { productId } = req.params;

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json({ stock: product.Product_quantity });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { checkStock };
