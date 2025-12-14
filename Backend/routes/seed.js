const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const mongoose = require('mongoose');

// Sample products data
const sampleProducts = [
  {
    name: 'Wireless Headphones',
    description: 'Premium noise-cancelling wireless headphones with 30-hour battery life. Experience crystal-clear audio quality.',
    price: 199.99,
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    category: 'Electronics',
    stock: 50,
    rating: 4.5,
    reviews: [
      { user: 'John Doe', comment: 'Great sound quality!', rating: 5, date: new Date() }
    ]
  },
  {
    name: 'Smart Watch Pro',
    description: 'Advanced fitness tracking smartwatch with heart rate monitor and GPS. Stay connected on the go.',
    price: 299.99,
    image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
    category: 'Electronics',
    stock: 35,
    rating: 4.7,
    reviews: [
      { user: 'Jane Smith', comment: 'Love the fitness features!', rating: 5, date: new Date() }
    ]
  },
  {
    name: 'Cotton T-Shirt',
    description: 'Comfortable 100% organic cotton t-shirt. Perfect for everyday wear with a modern fit.',
    price: 29.99,
    image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
    category: 'Clothing',
    stock: 100,
    rating: 4.3,
    reviews: []
  },
  {
    name: 'Denim Jeans',
    description: 'Classic fit denim jeans with stretch comfort. Durable and stylish for any occasion.',
    price: 59.99,
    image_url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500',
    category: 'Clothing',
    stock: 75,
    rating: 4.6,
    reviews: [
      { user: 'Mike Johnson', comment: 'Perfect fit!', rating: 5, date: new Date() }
    ]
  },
  {
    name: 'JavaScript: The Complete Guide',
    description: 'Comprehensive guide to modern JavaScript programming. From basics to advanced concepts.',
    price: 39.99,
    image_url: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500',
    category: 'Books',
    stock: 60,
    rating: 4.8,
    reviews: [
      { user: 'Sarah Lee', comment: 'Best JS book ever!', rating: 5, date: new Date() }
    ]
  },
  {
    name: 'Laptop Stand',
    description: 'Ergonomic aluminum laptop stand with adjustable height. Improve your posture while working.',
    price: 49.99,
    image_url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500',
    category: 'Electronics',
    stock: 45,
    rating: 4.4,
    reviews: []
  },
  {
    name: 'Yoga Mat Premium',
    description: 'Non-slip premium yoga mat with extra cushioning. Perfect for yoga, pilates, and floor exercises.',
    price: 34.99,
    image_url: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500',
    category: 'Sports',
    stock: 80,
    rating: 4.7,
    reviews: [
      { user: 'Emma Wilson', comment: 'Great quality mat!', rating: 5, date: new Date() }
    ]
  },
  {
    name: 'Water Bottle',
    description: 'Insulated stainless steel water bottle keeps drinks cold for 24 hours. BPA-free and eco-friendly.',
    price: 24.99,
    image_url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500',
    category: 'Sports',
    stock: 120,
    rating: 4.5,
    reviews: []
  },
  {
    name: 'LED Desk Lamp',
    description: 'Modern LED desk lamp with adjustable brightness and color temperature. Energy efficient.',
    price: 44.99,
    image_url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500',
    category: 'Home & Garden',
    stock: 55,
    rating: 4.6,
    reviews: []
  },
  {
    name: 'Plant Pot Set',
    description: 'Set of 3 ceramic plant pots with drainage holes. Modern design for indoor plants.',
    price: 32.99,
    image_url: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500',
    category: 'Home & Garden',
    stock: 90,
    rating: 4.4,
    reviews: [
      { user: 'David Brown', comment: 'Beautiful pots!', rating: 4, date: new Date() }
    ]
  },
  {
    name: 'iPhone 15 Pro',
    description: 'Latest iPhone with titanium design, A17 Pro chip, and advanced camera system.',
    price: 999.99,
    image_url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500',
    category: 'Electronics',
    stock: 25,
    rating: 4.9,
    reviews: [
      { user: 'Alex Chen', comment: 'Amazing camera quality!', rating: 5, date: new Date() }
    ]
  },
  {
    name: 'MacBook Air M3',
    description: 'Ultra-thin laptop with M3 chip, 13-inch Retina display, and all-day battery life.',
    price: 1299.99,
    image_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500',
    category: 'Electronics',
    stock: 15,
    rating: 4.8,
    reviews: [
      { user: 'Maria Garcia', comment: 'Lightning fast performance!', rating: 5, date: new Date() }
    ]
  },
  {
    name: 'Samsung Galaxy S24',
    description: 'Premium Android smartphone with AI-powered camera and long-lasting battery.',
    price: 799.99,
    image_url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500',
    category: 'Electronics',
    stock: 30,
    rating: 4.7,
    reviews: []
  },
  {
    name: 'Running Shoes',
    description: 'Lightweight running shoes with responsive cushioning. Perfect for daily runs and training.',
    price: 119.99,
    image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
    category: 'Sports',
    stock: 85,
    rating: 4.8,
    reviews: [
      { user: 'Rachel Green', comment: 'Super comfortable!', rating: 5, date: new Date() }
    ]
  },
  {
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with thermal carafe. Brews up to 12 cups of perfect coffee.',
    price: 89.99,
    image_url: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500',
    category: 'Home & Garden',
    stock: 42,
    rating: 4.5,
    reviews: []
  }
];

// Secure seed endpoint - protected by secret key
router.post('/seed', async (req, res) => {
  try {
    // Check for secret key in environment variable or request header
    const secretKey = process.env.SEED_SECRET_KEY || 'default-seed-key-change-in-production';
    const providedKey = req.headers['x-seed-key'] || req.body.secretKey;

    if (providedKey !== secretKey) {
      return res.status(401).json({ 
        error: 'Unauthorized. Invalid seed key.' 
      });
    }

    // Ensure MongoDB connection
    if (mongoose.connection.readyState === 0 || mongoose.connection.readyState === 3) {
      const MONGODB_URI = process.env.MONGODB_URI;
      if (!MONGODB_URI) {
        return res.status(500).json({ error: 'MongoDB URI not configured' });
      }
      await mongoose.connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 10000,
      });
    }

    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');

    // Insert sample products
    const insertedProducts = await Product.insertMany(sampleProducts);
    console.log(`✅ Successfully added ${insertedProducts.length} sample products`);

    res.json({
      success: true,
      message: `Successfully seeded ${insertedProducts.length} products`,
      count: insertedProducts.length
    });
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    res.status(500).json({ 
      error: 'Error seeding database',
      details: error.message 
    });
  }
});

module.exports = router;

