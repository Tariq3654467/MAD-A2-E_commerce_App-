const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

// Get User's Orders
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user_id: req.userId })
      .sort({ order_date: -1 });

    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Error fetching orders' });
  }
});

// Get Single Order
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user_id: req.userId
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Error fetching order' });
  }
});

// Create Order from Cart
router.post('/create', auth, async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;

    // Get cart items
    const cartItems = await Cart.find({ user_id: req.userId }).populate('product_id');

    if (cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Prepare order items
    const orderItems = cartItems.map(item => ({
      product_id: item.product_id._id,
      name: item.product_id.name,
      quantity: item.quantity,
      price: item.product_id.price,
      image_url: item.product_id.image_url
    }));

    // Calculate total amount
    const totalAmount = orderItems.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);

    // Create order
    const order = new Order({
      user_id: req.userId,
      items: orderItems,
      total_amount: totalAmount,
      shippingAddress,
      paymentMethod
    });

    await order.save();

    // Update product stock
    for (const item of cartItems) {
      await Product.findByIdAndUpdate(
        item.product_id._id,
        { $inc: { stock: -item.quantity } }
      );
    }

    // Clear cart
    await Cart.deleteMany({ user_id: req.userId });

    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Error creating order' });
  }
});

// Update Order Status
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, user_id: req.userId },
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Error updating order' });
  }
});

module.exports = router;

