import React, { createContext, useState, useEffect, useContext } from 'react';
import { cartAPI } from '../services/api';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCartItems([]);
      setCartCount(0);
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const items = await cartAPI.getCart();
      setCartItems(items);
      setCartCount(items.reduce((sum, item) => sum + item.quantity, 0));
    } catch (error) {
      // If user is not authenticated, don't show error
      if (error.response?.status !== 401) {
        console.error('Error fetching cart:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      return { success: false, error: 'Please login to add items to cart' };
    }
    
    try {
      await cartAPI.addToCart(productId, quantity);
      await fetchCart();
      return { success: true };
    } catch (error) {
      console.error('Error adding to cart:', error);
      return { success: false, error: error.message };
    }
  };

  const updateCartItem = async (cartItemId, quantity) => {
    try {
      await cartAPI.updateCart(cartItemId, quantity);
      await fetchCart();
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      await cartAPI.removeFromCart(cartItemId);
      await fetchCart();
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const clearCart = async () => {
    try {
      await cartAPI.clearCart();
      setCartItems([]);
      setCartCount(0);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.product_id?.price || 0) * item.quantity;
    }, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        loading,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        fetchCart,
        getCartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

