const express = require('express');
const router = express.Router();

// Simple chatbot responses
const chatbotResponses = {
  greeting: [
    "Hello! Welcome to our store! How can I help you today?",
    "Hi there! I'm here to help you find the perfect products. What are you looking for?",
    "Welcome! I can help you with product recommendations, order status, or any questions you have.",
  ],
  products: [
    "We have amazing products in Electronics, Clothing, Books, Home & Garden, Sports, Toys, Beauty, and Food categories!",
    "What type of product are you interested in? I can help you find the best options.",
    "Our store has over 40 products across 8 different categories. What catches your interest?",
  ],
  electronics: [
    "We have great electronics! Check out our iPhone 15 Pro, MacBook Air M3, Samsung Galaxy S24, iPad Pro, Gaming Headset, and more!",
    "Our electronics section includes smartphones, laptops, tablets, headphones, and smart devices. What specific device are you looking for?",
  ],
  clothing: [
    "Our clothing collection includes Cotton T-Shirts, Denim Jeans, Winter Jackets, Dress Shirts, Sneakers, Hoodies, and Summer Dresses!",
    "We have stylish and comfortable clothing for all occasions. What style are you looking for?",
  ],
  books: [
    "We have excellent books including JavaScript Guide, React Native Guide, Python Programming, Design Patterns, and Machine Learning Basics!",
    "Our book collection covers programming, technology, and learning resources. What subject interests you?",
  ],
  cart: [
    "You can add items to your cart by clicking the 'Add to Cart' button on any product page.",
    "To view your cart, tap the cart icon in the bottom navigation bar.",
    "Your cart will show all selected items with quantities and total price.",
  ],
  order: [
    "To place an order, add items to your cart and proceed to checkout.",
    "You can track your orders in the Profile section under Order History.",
    "Orders typically ship within 1-2 business days.",
  ],
  help: [
    "I can help you with:\n• Product recommendations\n• Order status\n• Cart assistance\n• General questions\n\nWhat would you like to know?",
  ],
  default: [
    "I'm not sure I understand. Could you rephrase that?",
    "I can help you with product information, orders, or general questions. What do you need?",
    "Let me know if you need help finding products, checking orders, or have any other questions!",
  ],
};

// Get chatbot response
router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const userMessage = message.toLowerCase();
    let response;

    if (userMessage.includes('hello') || userMessage.includes('hi') || userMessage.includes('hey')) {
      response = chatbotResponses.greeting[Math.floor(Math.random() * chatbotResponses.greeting.length)];
    } else if (userMessage.includes('product') || userMessage.includes('item') || userMessage.includes('buy')) {
      response = chatbotResponses.products[Math.floor(Math.random() * chatbotResponses.products.length)];
    } else if (userMessage.includes('electronic') || userMessage.includes('phone') || userMessage.includes('laptop') || userMessage.includes('computer')) {
      response = chatbotResponses.electronics[Math.floor(Math.random() * chatbotResponses.electronics.length)];
    } else if (userMessage.includes('cloth') || userMessage.includes('shirt') || userMessage.includes('dress') || userMessage.includes('jeans')) {
      response = chatbotResponses.clothing[Math.floor(Math.random() * chatbotResponses.clothing.length)];
    } else if (userMessage.includes('book') || userMessage.includes('read') || userMessage.includes('programming')) {
      response = chatbotResponses.books[Math.floor(Math.random() * chatbotResponses.books.length)];
    } else if (userMessage.includes('cart') || userMessage.includes('add to cart')) {
      response = chatbotResponses.cart[Math.floor(Math.random() * chatbotResponses.cart.length)];
    } else if (userMessage.includes('order') || userMessage.includes('purchase') || userMessage.includes('buy')) {
      response = chatbotResponses.order[Math.floor(Math.random() * chatbotResponses.order.length)];
    } else if (userMessage.includes('help') || userMessage.includes('support')) {
      response = chatbotResponses.help[Math.floor(Math.random() * chatbotResponses.help.length)];
    } else {
      response = chatbotResponses.default[Math.floor(Math.random() * chatbotResponses.default.length)];
    }

    // Simulate response delay
    setTimeout(() => {
      res.json({
        success: true,
        response: response,
        timestamp: new Date().toISOString(),
      });
    }, 500 + Math.random() * 1000); // Random delay between 0.5-1.5 seconds

  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({ error: 'Error processing chat message' });
  }
});

// Get chatbot suggestions
router.get('/suggestions', async (req, res) => {
  try {
    const suggestions = [
      "What products do you have?",
      "Help me find electronics",
      "How do I add items to cart?",
      "What's my order status?",
      "Tell me about your clothing",
      "Show me books",
      "How can I track my order?",
    ];

    res.json({
      success: true,
      suggestions: suggestions,
    });
  } catch (error) {
    console.error('Suggestions error:', error);
    res.status(500).json({ error: 'Error fetching suggestions' });
  }
});

module.exports = router;
