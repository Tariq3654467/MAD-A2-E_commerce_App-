const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce_App';

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
    name: 'Building Blocks Set',
    description: 'Creative building blocks set with 500+ pieces. Develops creativity and motor skills.',
    price: 49.99,
    image_url: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=500',
    category: 'Toys',
    stock: 65,
    rating: 4.9,
    reviews: [
      { user: 'Lisa Anderson', comment: 'Kids love it!', rating: 5, date: new Date() }
    ]
  },
  {
    name: 'Skincare Set',
    description: 'Complete skincare routine set with cleanser, toner, and moisturizer. Natural ingredients.',
    price: 79.99,
    image_url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500',
    category: 'Beauty',
    stock: 40,
    rating: 4.6,
    reviews: []
  },
  {
    name: 'Bluetooth Speaker',
    description: 'Portable waterproof Bluetooth speaker with 360° sound. 12-hour battery life.',
    price: 89.99,
    image_url: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500',
    category: 'Electronics',
    stock: 70,
    rating: 4.7,
    reviews: [
      { user: 'Tom Harris', comment: 'Amazing sound quality!', rating: 5, date: new Date() }
    ]
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
  },
  // Additional Electronics
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
    name: 'iPad Pro 12.9"',
    description: 'Professional tablet with M2 chip, Liquid Retina XDR display, and Apple Pencil support.',
    price: 1099.99,
    image_url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500',
    category: 'Electronics',
    stock: 20,
    rating: 4.8,
    reviews: []
  },
  {
    name: 'Gaming Headset',
    description: 'Professional gaming headset with 7.1 surround sound and noise-cancelling microphone.',
    price: 149.99,
    image_url: 'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=500',
    category: 'Electronics',
    stock: 60,
    rating: 4.6,
    reviews: [
      { user: 'Gamer Pro', comment: 'Perfect for gaming!', rating: 5, date: new Date() }
    ]
  },
  // Additional Clothing
  {
    name: 'Winter Jacket',
    description: 'Warm winter jacket with down insulation and water-resistant outer shell.',
    price: 129.99,
    image_url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500',
    category: 'Clothing',
    stock: 50,
    rating: 4.5,
    reviews: []
  },
  {
    name: 'Dress Shirt',
    description: 'Classic cotton dress shirt with button-down collar. Perfect for business or casual wear.',
    price: 45.99,
    image_url: 'https://images.unsplash.com/photo-1594938298605-c8176d7b4a20?w=500',
    category: 'Clothing',
    stock: 80,
    rating: 4.4,
    reviews: []
  },
  {
    name: 'Sneakers',
    description: 'Comfortable canvas sneakers with rubber sole. Available in multiple colors.',
    price: 69.99,
    image_url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500',
    category: 'Clothing',
    stock: 120,
    rating: 4.6,
    reviews: [
      { user: 'Style Queen', comment: 'Super comfortable!', rating: 5, date: new Date() }
    ]
  },
  {
    name: 'Hoodie',
    description: 'Soft fleece hoodie with kangaroo pocket and adjustable drawstring hood.',
    price: 39.99,
    image_url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a4?w=500',
    category: 'Clothing',
    stock: 90,
    rating: 4.3,
    reviews: []
  },
  {
    name: 'Summer Dress',
    description: 'Lightweight floral summer dress with comfortable fit and breathable fabric.',
    price: 54.99,
    image_url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500',
    category: 'Clothing',
    stock: 65,
    rating: 4.7,
    reviews: []
  },
  // Additional Books
  {
    name: 'React Native Guide',
    description: 'Complete guide to building mobile apps with React Native. From beginner to expert.',
    price: 49.99,
    image_url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500',
    category: 'Books',
    stock: 40,
    rating: 4.8,
    reviews: [
      { user: 'Dev Master', comment: 'Excellent resource!', rating: 5, date: new Date() }
    ]
  },
  {
    name: 'Python Programming',
    description: 'Learn Python programming from scratch with practical examples and exercises.',
    price: 34.99,
    image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500',
    category: 'Books',
    stock: 55,
    rating: 4.6,
    reviews: []
  },
  {
    name: 'Design Patterns',
    description: 'Gang of Four design patterns explained with modern examples and best practices.',
    price: 59.99,
    image_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500',
    category: 'Books',
    stock: 35,
    rating: 4.9,
    reviews: []
  },
  {
    name: 'Machine Learning Basics',
    description: 'Introduction to machine learning concepts with hands-on projects and examples.',
    price: 44.99,
    image_url: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=500',
    category: 'Books',
    stock: 45,
    rating: 4.7,
    reviews: []
  },
  // Additional Home & Garden
  {
    name: 'Smart Thermostat',
    description: 'WiFi-enabled smart thermostat with energy-saving features and mobile app control.',
    price: 199.99,
    image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
    category: 'Home & Garden',
    stock: 25,
    rating: 4.6,
    reviews: []
  },
  {
    name: 'Air Purifier',
    description: 'HEPA air purifier with smart sensors and quiet operation. Perfect for allergies.',
    price: 299.99,
    image_url: 'https://images.unsplash.com/photo-1581578731548-c6a0c3f2f6c5?w=500',
    category: 'Home & Garden',
    stock: 30,
    rating: 4.7,
    reviews: [
      { user: 'Clean Air', comment: 'Works great!', rating: 5, date: new Date() }
    ]
  },
  {
    name: 'Robot Vacuum',
    description: 'Smart robot vacuum with mapping technology and smartphone app control.',
    price: 399.99,
    image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
    category: 'Home & Garden',
    stock: 20,
    rating: 4.5,
    reviews: []
  },
  {
    name: 'Smart Doorbell',
    description: 'Video doorbell with HD camera, two-way audio, and motion detection alerts.',
    price: 179.99,
    image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
    category: 'Home & Garden',
    stock: 40,
    rating: 4.4,
    reviews: []
  },
  // Additional Sports
  {
    name: 'Dumbbell Set',
    description: 'Adjustable dumbbell set with weights from 5-50 lbs. Perfect for home workouts.',
    price: 199.99,
    image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500',
    category: 'Sports',
    stock: 35,
    rating: 4.8,
    reviews: []
  },
  {
    name: 'Basketball',
    description: 'Official size basketball with premium leather construction and excellent grip.',
    price: 29.99,
    image_url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500',
    category: 'Sports',
    stock: 70,
    rating: 4.6,
    reviews: []
  },
  {
    name: 'Tennis Racket',
    description: 'Professional tennis racket with carbon fiber construction and optimal balance.',
    price: 149.99,
    image_url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500',
    category: 'Sports',
    stock: 25,
    rating: 4.7,
    reviews: []
  },
  {
    name: 'Cycling Helmet',
    description: 'Lightweight cycling helmet with MIPS protection and adjustable ventilation.',
    price: 79.99,
    image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
    category: 'Sports',
    stock: 50,
    rating: 4.5,
    reviews: []
  },
  // Additional Toys
  {
    name: 'Remote Control Car',
    description: 'High-speed remote control car with 2.4GHz radio control and LED lights.',
    price: 89.99,
    image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
    category: 'Toys',
    stock: 40,
    rating: 4.6,
    reviews: [
      { user: 'Toy Lover', comment: 'Kids absolutely love it!', rating: 5, date: new Date() }
    ]
  },
  {
    name: 'Puzzle Set',
    description: '1000-piece jigsaw puzzle featuring beautiful landscape artwork.',
    price: 19.99,
    image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
    category: 'Toys',
    stock: 60,
    rating: 4.4,
    reviews: []
  },
  {
    name: 'Drone',
    description: 'Mini drone with HD camera, altitude hold, and headless mode for easy flying.',
    price: 199.99,
    image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
    category: 'Toys',
    stock: 15,
    rating: 4.7,
    reviews: []
  },
  // Additional Beauty
  {
    name: 'Makeup Brush Set',
    description: 'Professional makeup brush set with synthetic bristles and ergonomic handles.',
    price: 39.99,
    image_url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500',
    category: 'Beauty',
    stock: 55,
    rating: 4.5,
    reviews: []
  },
  {
    name: 'Hair Dryer',
    description: 'Professional hair dryer with ionic technology and multiple heat settings.',
    price: 89.99,
    image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
    category: 'Beauty',
    stock: 30,
    rating: 4.6,
    reviews: []
  },
  {
    name: 'Perfume Set',
    description: 'Luxury perfume set with 3 different scents in elegant packaging.',
    price: 129.99,
    image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
    category: 'Beauty',
    stock: 25,
    rating: 4.8,
    reviews: []
  },
  // Food Category
  {
    name: 'Organic Coffee Beans',
    description: 'Premium organic coffee beans from Colombia. Medium roast with rich flavor.',
    price: 24.99,
    image_url: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500',
    category: 'Food',
    stock: 100,
    rating: 4.7,
    reviews: [
      { user: 'Coffee Lover', comment: 'Best coffee ever!', rating: 5, date: new Date() }
    ]
  },
  {
    name: 'Protein Powder',
    description: 'Whey protein powder with 25g protein per serving. Chocolate flavor.',
    price: 49.99,
    image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
    category: 'Food',
    stock: 80,
    rating: 4.6,
    reviews: []
  },
  {
    name: 'Green Tea',
    description: 'Premium green tea leaves with antioxidant benefits and delicate flavor.',
    price: 19.99,
    image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
    category: 'Food',
    stock: 120,
    rating: 4.5,
    reviews: []
  },
  {
    name: 'Dark Chocolate',
    description: 'Artisan dark chocolate with 70% cocoa content. Made with organic ingredients.',
    price: 14.99,
    image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
    category: 'Food',
    stock: 90,
    rating: 4.8,
    reviews: []
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');

    // Insert sample products
    await Product.insertMany(sampleProducts);
    console.log(`✅ Successfully added ${sampleProducts.length} sample products`);

    console.log('\n📦 Sample Products:');
    sampleProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - $${product.price} (${product.category})`);
    });

    mongoose.connection.close();
    console.log('\n✅ Database seeding completed!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();

