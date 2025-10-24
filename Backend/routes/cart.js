const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

// Get User's Cart
router.get('/', auth, async (req, res) => {
  try {
    const cartItems = await Cart.find({ user_id: req.userId })
      .populate('product_id')
      .sort({ addedAt: -1 });

    res.json(cartItems);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ error: 'Error fetching cart' });
  }
});

// Add Item to Cart
router.post('/add', auth, async (req, res) => {
  try {
    const { product_id, quantity = 1 } = req.body;

    // Check if product exists
    const product = await Product.findById(product_id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if item already in cart
    let cartItem = await Cart.findOne({ 
      user_id: req.userId, 
      product_id 
    });

    if (cartItem) {
      // Update quantity
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      // Create new cart item
      cartItem = new Cart({
        user_id: req.userId,
        product_id,
        quantity
      });
      await cartItem.save();
    }

    const populatedCart = await Cart.findById(cartItem._id).populate('product_id');
    res.status(201).json(populatedCart);
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ error: 'Error adding to cart' });
  }
});

// Update Cart Item Quantity
router.put('/:id', auth, async (req, res) => {
  try {
    const { quantity } = req.body;

    const cartItem = await Cart.findOne({
      _id: req.params.id,
      user_id: req.userId
    });

    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    const populatedCart = await Cart.findById(cartItem._id).populate('product_id');
    res.json(populatedCart);
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ error: 'Error updating cart' });
  }
});

// Remove Item from Cart
router.delete('/:id', auth, async (req, res) => {
  try {
    const cartItem = await Cart.findOneAndDelete({
      _id: req.params.id,
      user_id: req.userId
    });

    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ error: 'Error removing from cart' });
  }
});

// Clear Cart
router.delete('/clear/all', auth, async (req, res) => {
  try {
    await Cart.deleteMany({ user_id: req.userId });
    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ error: 'Error clearing cart' });
  }
});

module.exports = router;

