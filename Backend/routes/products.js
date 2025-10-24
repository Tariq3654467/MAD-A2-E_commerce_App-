const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Get All Products
router.get('/', async (req, res) => {
  try {
    const { category, minPrice, maxPrice, minRating, search } = req.query;
    
    let query = {};

    // Filter by category
    if (category && category !== 'All') {
      query.category = category;
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    // Filter by rating
    if (minRating) {
      query.rating = { $gte: parseFloat(minRating) };
    }

    // Search by name
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Error fetching products' });
  }
});

// Get Single Product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Error fetching product' });
  }
});

// Get All Categories
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Error fetching categories' });
  }
});

// Add Review to Product
router.post('/:id/reviews', async (req, res) => {
  try {
    const { user, comment, rating } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    product.reviews.push({ user, comment, rating });
    
    // Update average rating
    const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
    product.rating = totalRating / product.reviews.length;

    await product.save();
    res.json(product);
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ error: 'Error adding review' });
  }
});

module.exports = router;

