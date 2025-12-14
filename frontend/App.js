import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { CartProvider } from './src/context/CartContext';
import AppNavigator from './src/navigation/AppNavigator';
import SplashScreen from './src/screens/SplashScreen';

const AppContent = () => {
  const { loading } = useAuth();
  const [showSplash, setShowSplash] = useState(true);
  const [minSplashDone, setMinSplashDone] = useState(false);

  useEffect(() => {
    // Minimum splash screen display time (2.5 seconds)
    const timer = setTimeout(() => {
      setMinSplashDone(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  // Show splash until minimum time AND auth loading is complete
  useEffect(() => {
    if (minSplashDone && !loading) {
      // Small delay for smooth transition
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [minSplashDone, loading]);

  if (showSplash) {
    return (
      <View style={styles.splashContainer}>
        <SplashScreen onFinish={() => setShowSplash(false)} />
        <StatusBar style="light" />
      </View>
    );
  }

  return (
    <>
      <AppNavigator />
      <StatusBar style="light" />
    </>
  );
};

export default function App() {
  return (
    <PaperProvider>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
  },
});
