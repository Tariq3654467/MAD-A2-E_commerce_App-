import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { IconButton } from 'react-native-paper';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { colors } from '../theme/colors';

// Auth Screens
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

// Main Screens
import HomeScreen from '../screens/HomeScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import CartScreen from '../screens/CartScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import OrderConfirmationScreen from '../screens/OrderConfirmationScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CategoryFilterScreen from '../screens/CategoryFilterScreen';
import FloatingChatbot from '../components/FloatingChatbot';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const screenOptions = {
  headerStyle: {
    backgroundColor: colors.primary,
    elevation: 4,
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowColor: '#000',
    shadowOffset: { height: 2, width: 0 },
  },
  headerTintColor: colors.surface,
  headerTitleStyle: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  headerBackTitleVisible: false,
};

// Auth Stack Navigator
const AuthStack = () => (
  <Stack.Navigator
    screenOptions={{
      ...screenOptions,
      headerShown: false,
    }}
  >
    <Stack.Screen 
      name="Login" 
      component={LoginScreen}
    />
    <Stack.Screen 
      name="Register" 
      component={RegisterScreen}
      options={{ 
        headerShown: true,
        title: 'Create Account',
      }}
    />
  </Stack.Navigator>
);

// Home Stack Navigator
const HomeStack = () => (
  <Stack.Navigator screenOptions={screenOptions}>
    <Stack.Screen 
      name="HomeMain" 
      component={HomeScreen}
      options={{ title: '🛍️ Shop' }}
    />
    <Stack.Screen 
      name="ProductDetails" 
      component={ProductDetailsScreen}
      options={{ title: 'Product Details' }}
    />
    <Stack.Screen 
      name="CategoryFilter" 
      component={CategoryFilterScreen}
      options={{ title: 'Filters & Categories' }}
    />
  </Stack.Navigator>
);

// Cart Stack Navigator
const CartStack = () => (
  <Stack.Navigator screenOptions={screenOptions}>
    <Stack.Screen 
      name="CartMain" 
      component={CartScreen}
      options={{ title: '🛒 My Cart' }}
    />
    <Stack.Screen 
      name="Checkout" 
      component={CheckoutScreen}
      options={{ title: '💳 Checkout' }}
    />
    <Stack.Screen 
      name="OrderConfirmation" 
      component={OrderConfirmationScreen}
      options={{ 
        title: '✓ Order Confirmed',
        headerLeft: null,
        gestureEnabled: false,
      }}
    />
  </Stack.Navigator>
);

// Profile Stack Navigator
const ProfileStack = () => (
  <Stack.Navigator screenOptions={screenOptions}>
    <Stack.Screen 
      name="ProfileMain" 
      component={ProfileScreen}
      options={{ title: '👤 My Profile' }}
    />
  </Stack.Navigator>
);

// Main Tab Navigator
const MainTabs = () => {
  const { cartCount } = useContext(CartContext);

  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            // Shop/Shopping bag icon
            iconName = focused ? 'shopping' : 'shopping-outline';
          } else if (route.name === 'Categories') {
            // Categories/Tune icon for filters
            iconName = focused ? 'tune' : 'tune-variant';
          } else if (route.name === 'Cart') {
            // Shopping cart icon
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'Profile') {
            // User/Person icon
            iconName = focused ? 'account-circle' : 'account-circle-outline';
          }

          // Try Expo Vector Icons first, fallback to React Native Paper
          try {
            return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
          } catch (error) {
            // Fallback to React Native Paper icons
            return <IconButton icon={iconName} size={size} iconColor={color} />;
          }
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        headerShown: false,
        tabBarStyle: {
          paddingBottom: 8,
          paddingTop: 8,
          height: 65,
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: colors.divider,
          elevation: 8,
          shadowOpacity: 0.1,
          shadowRadius: 4,
          shadowColor: '#000',
          shadowOffset: { height: -2, width: 0 },
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeStack}
        options={{ title: 'Shop' }}
      />
      <Tab.Screen 
        name="Categories" 
        component={CategoryFilterScreen}
        options={{
          title: 'Filters',
          headerShown: true,
          headerStyle: {
            backgroundColor: colors.primary,
            elevation: 4,
          },
          headerTintColor: colors.surface,
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
          },
        }}
      />
      <Tab.Screen 
        name="Cart" 
        component={CartStack}
        options={{
          title: 'Cart',
          tabBarBadge: cartCount > 0 ? cartCount : null,
          tabBarBadgeStyle: {
            backgroundColor: colors.error,
            color: colors.surface,
            fontSize: 10,
            fontWeight: 'bold',
            minWidth: 18,
            height: 18,
            borderRadius: 9,
            lineHeight: 18,
          },
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileStack}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
    <FloatingChatbot />
  </>
  );
};

// Root Navigator
const RootNavigator = () => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: colors.background
      }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Screen name="Main" component={MainTabs} />
      ) : (
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
};

export default AppNavigator;
