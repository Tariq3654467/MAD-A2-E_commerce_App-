import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ⚠️ IMPORTANT: Update this to your actual backend URL
// For Android emulator: http://10.0.2.2:3000/api
// For iOS simulator: http://localhost:3000/api
// For Web browser: http://localhost:3000/api
// For physical device: http://YOUR_IP_ADDRESS:3000/api (find IP with: ipconfig or ifconfig)
// For Snack Expo: Use ngrok URL (e.g., https://abc123.ngrok.io/api)

// Automatically detect platform
import { Platform } from 'react-native';

const getApiUrl = () => {
  // 🔥 FOR SNACK EXPO: Replace with your ngrok URL
  // Get this from: ngrok terminal output OR http://127.0.0.1:4040
  // Should look like: 'https://1a2b-3c4d.ngrok-free.app/api'
  const NGROK_URL = 'https://unballoted-bernard-extracellular.ngrok-free.dev/api'; // ⬅️ Paste your ngrok HTTPS URL here + '/api'
  
  // If running on Snack Expo, use ngrok URL
  if (NGROK_URL && NGROK_URL.startsWith('https://')) {
    return NGROK_URL;
  }
  
  // Local development URLs
  if (Platform.OS === 'web') {
    return 'http://localhost:3000/api';
  } else if (Platform.OS === 'android') {
    return 'http://192.168.1.104:3000/api ';
  } else if (Platform.OS === 'ios') {
    return 'http://localhost:3000/api';
  }
  return 'http://localhost:3000/api';
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
    const response = await api.get('/products', { params: filters });
    return response.data;
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
    const response = await axios.get(API_URL.replace('/api', ''), { timeout: 5000 });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export default api;
