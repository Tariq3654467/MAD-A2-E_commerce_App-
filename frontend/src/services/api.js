import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ⚠️ IMPORTANT: Backend API URL
// Production: Vercel deployment
// For local development, uncomment and use localhost URLs below

// Automatically detect platform
import { Platform } from 'react-native';

const getApiUrl = () => {
  // Production Vercel URL
  const VERCEL_URL = 'https://commerce-app-ashy.vercel.app/api';
  
  // 🔥 For local development, set USE_LOCAL to true
  const USE_LOCAL = false; // Set to true for local development, false for production
  
  if (USE_LOCAL) {
    if (Platform.OS === 'web') {
      return 'http://localhost:3000/api';
    }
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:3000/api'; // Android emulator
    }
    if (Platform.OS === 'ios') {
      return 'http://localhost:3000/api'; // iOS simulator
    }
    // For physical device, replace with your computer's IP address
    // Find IP: Windows (ipconfig) or Mac/Linux (ifconfig)
    return 'http://localhost:3000/api'; // Default fallback
  }
  
  // Use Vercel URL for all platforms (production)
  return VERCEL_URL;
};

const API_URL = getApiUrl();

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true', // Skip ngrok warning page
  },
  timeout: 10000, // 10 second timeout
});

// Add token to requests if available
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new Error('Request timeout - please check your connection'));
    }
    if (error.message === 'Network Error') {
      return Promise.reject(new Error('Cannot connect to server - please check if backend is running'));
    }
    if (error.response) {
      // Server responded with error
      return Promise.reject(error);
    }
    return Promise.reject(new Error('Something went wrong'));
  }
);

// Authentication APIs
export const authAPI = {
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// Product APIs
export const productAPI = {
  getAll: async (filters = {}) => {
    try {
      const response = await api.get('/products', { params: filters });
      console.log('Products API Response:', response.data);
      // Ensure we return an array
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Products API Error:', error.response?.data || error.message);
      throw error;
    }
  },
  getById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },
  getCategories: async () => {
    const response = await api.get('/products/categories/list');
    return response.data;
  },
  addReview: async (productId, reviewData) => {
    const response = await api.post(`/products/${productId}/reviews`, reviewData);
    return response.data;
  },
};

// Cart APIs
export const cartAPI = {
  getCart: async () => {
    const response = await api.get('/cart');
    return response.data;
  },
  addToCart: async (productId, quantity = 1) => {
    const response = await api.post('/cart/add', { product_id: productId, quantity });
    return response.data;
  },
  updateCart: async (cartItemId, quantity) => {
    const response = await api.put(`/cart/${cartItemId}`, { quantity });
    return response.data;
  },
  removeFromCart: async (cartItemId) => {
    const response = await api.delete(`/cart/${cartItemId}`);
    return response.data;
  },
  clearCart: async () => {
    const response = await api.delete('/cart/clear/all');
    return response.data;
  },
};

// Order APIs
export const orderAPI = {
  getOrders: async () => {
    const response = await api.get('/orders');
    return response.data;
  },
  getOrderById: async (orderId) => {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  },
  createOrder: async (orderData) => {
    const response = await api.post('/orders/create', orderData);
    return response.data;
  },
  updateOrderStatus: async (orderId, status) => {
    const response = await api.put(`/orders/${orderId}/status`, { status });
    return response.data;
  },
};

// User APIs
export const userAPI = {
  getProfile: async () => {
    const response = await api.get('/user/profile');
    return response.data;
  },
  updateProfile: async (userData) => {
    const response = await api.put('/user/profile', userData);
    return response.data;
  },
};

// Chatbot APIs
export const chatbotAPI = {
  sendMessage: async (message) => {
    try {
      const response = await api.post('/chatbot/chat', { message });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getSuggestions: async () => {
    try {
      const response = await api.get('/chatbot/suggestions');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// Test connection
export const testConnection = async () => {
  try {
    // Test the root endpoint (without /api)
    const baseUrl = API_URL.replace('/api', '');
    const response = await axios.get(baseUrl, { timeout: 10000 });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export default api;
