import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  Card,
  Avatar,
  ActivityIndicator,
  FAB,
} from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { chatbotAPI } from '../services/api';

const { width } = Dimensions.get('window');

const ChatbotScreen = ({ onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your shopping assistant. How can I help you today?",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef(null);

  const botResponses = {
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

  const getBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return botResponses.greeting[Math.floor(Math.random() * botResponses.greeting.length)];
    } else if (message.includes('product') || message.includes('item') || message.includes('buy')) {
      return botResponses.products[Math.floor(Math.random() * botResponses.products.length)];
    } else if (message.includes('electronic') || message.includes('phone') || message.includes('laptop') || message.includes('computer')) {
      return botResponses.electronics[Math.floor(Math.random() * botResponses.electronics.length)];
    } else if (message.includes('cloth') || message.includes('shirt') || message.includes('dress') || message.includes('jeans')) {
      return botResponses.clothing[Math.floor(Math.random() * botResponses.clothing.length)];
    } else if (message.includes('book') || message.includes('read') || message.includes('programming')) {
      return botResponses.books[Math.floor(Math.random() * botResponses.books.length)];
    } else if (message.includes('cart') || message.includes('add to cart')) {
      return botResponses.cart[Math.floor(Math.random() * botResponses.cart.length)];
    } else if (message.includes('order') || message.includes('purchase') || message.includes('buy')) {
      return botResponses.order[Math.floor(Math.random() * botResponses.order.length)];
    } else if (message.includes('help') || message.includes('support')) {
      return botResponses.help[Math.floor(Math.random() * botResponses.help.length)];
    } else {
      return botResponses.default[Math.floor(Math.random() * botResponses.default.length)];
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputText.trim(),
      isBot: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const messageText = inputText.trim();
    setInputText('');
    setIsLoading(true);

    try {
      // Try to use API first, fallback to local responses
      const response = await chatbotAPI.sendMessage(messageText);
      
      const botResponse = {
        id: Date.now() + 1,
        text: response.response,
        isBot: true,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.log('API failed, using local response:', error.message);
      
      // Fallback to local response
      const botResponse = {
        id: Date.now() + 1,
        text: getBotResponse(messageText),
        isBot: true,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const renderMessage = (message) => (
    <Animatable.View
      key={message.id}
      animation="fadeInUp"
      duration={500}
      style={[
        styles.messageContainer,
        message.isBot ? styles.botMessage : styles.userMessage,
      ]}
    >
      <View style={styles.messageContent}>
        {message.isBot && (
          <Avatar.Icon
            size={32}
            icon="robot"
            style={styles.botAvatar}
          />
        )}
        <Card
          style={[
            styles.messageCard,
            message.isBot ? styles.botCard : styles.userCard,
          ]}
        >
          <Card.Content style={styles.messageTextContainer}>
            <Text style={[
              styles.messageText,
              message.isBot ? styles.botText : styles.userText,
            ]}>
              {message.text}
            </Text>
            <Text style={styles.timestamp}>
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </Card.Content>
        </Card>
        {!message.isBot && (
          <Avatar.Icon
            size={32}
            icon="account"
            style={styles.userAvatar}
          />
        )}
      </View>
    </Animatable.View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Shopping Assistant</Text>
            <Text style={styles.headerSubtitle}>I'm here to help you shop!</Text>
          </View>
          {onClose && (
            <FAB
              style={styles.closeButton}
              icon="close"
              size="small"
              onPress={onClose}
              color={colors.surface}
              backgroundColor="rgba(255,255,255,0.2)"
            />
          )}
        </View>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map(renderMessage)}
        
        {isLoading && (
          <Animatable.View
            animation="fadeIn"
            style={styles.loadingContainer}
          >
            <Avatar.Icon
              size={32}
              icon="robot"
              style={styles.botAvatar}
            />
            <Card style={[styles.messageCard, styles.botCard]}>
              <Card.Content style={styles.loadingContent}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Text style={styles.loadingText}>Typing...</Text>
              </Card.Content>
            </Card>
          </Animatable.View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Ask me anything about our products..."
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={500}
          right={
            <TextInput.Icon
              icon="send"
              onPress={sendMessage}
              disabled={!inputText.trim() || isLoading}
            />
          }
        />
      </View>

      <FAB
        style={styles.fab}
        icon="help"
        label="Quick Help"
        onPress={() => {
          setInputText("What can you help me with?");
        }}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    padding: 20,
    paddingTop: 60,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerText: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.surface,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.surface,
    opacity: 0.8,
  },
  closeButton: {
    elevation: 0,
    shadowOpacity: 0,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messagesContent: {
    paddingVertical: 16,
  },
  messageContainer: {
    marginVertical: 4,
  },
  botMessage: {
    alignItems: 'flex-start',
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  messageContent: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    maxWidth: width * 0.8,
  },
  messageCard: {
    marginHorizontal: 8,
    elevation: 2,
  },
  botCard: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 4,
  },
  userCard: {
    backgroundColor: colors.primary,
    borderTopRightRadius: 4,
  },
  messageTextContainer: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  botText: {
    color: colors.text,
  },
  userText: {
    color: colors.surface,
  },
  timestamp: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 4,
    textAlign: 'right',
  },
  botAvatar: {
    backgroundColor: colors.secondary,
  },
  userAvatar: {
    backgroundColor: colors.primary,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: 4,
  },
  loadingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  loadingText: {
    marginLeft: 8,
    color: colors.textLight,
    fontSize: 14,
  },
  inputContainer: {
    padding: 16,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  textInput: {
    backgroundColor: colors.background,
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 16,
    maxHeight: 100,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 80,
    backgroundColor: colors.secondary,
  },
});

export default ChatbotScreen;
