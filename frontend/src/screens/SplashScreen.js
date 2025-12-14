import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { Text } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import { colors, typography, spacing } from '../theme/colors';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ onFinish }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        })
      ),
    ]).start();

    // Auto finish after 2.5 seconds
    const timer = setTimeout(() => {
      if (onFinish) {
        onFinish();
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      {/* Animated Background Gradient */}
      <Animated.View
        style={[
          styles.backgroundGradient,
          {
            opacity: fadeAnim,
          },
        ]}
      />

      {/* Main Content */}
      <View style={styles.content}>
        {/* Logo/Icon Container */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.logoCircle}>
            <Animated.View
              style={[
                styles.rotatingRing,
                {
                  transform: [{ rotate }],
                },
              ]}
            />
            <View style={styles.logoInner}>
              <Text style={styles.logoIcon}>🛍️</Text>
            </View>
          </View>
        </Animated.View>

        {/* App Name */}
        <Animatable.View
          animation="fadeInUp"
          delay={400}
          duration={800}
          style={styles.titleContainer}
        >
          <Text style={styles.appName}>ShopEasy</Text>
          <Text style={styles.tagline}>Your Shopping Companion</Text>
        </Animatable.View>

        {/* Loading Indicator */}
        <Animatable.View
          animation="fadeIn"
          delay={800}
          duration={600}
          style={styles.loadingContainer}
        >
          <View style={styles.loadingDots}>
            <Animatable.View
              animation="pulse"
              iterationCount="infinite"
              duration={1000}
              delay={0}
              style={[styles.dot, styles.dot1]}
            />
            <Animatable.View
              animation="pulse"
              iterationCount="infinite"
              duration={1000}
              delay={200}
              style={[styles.dot, styles.dot2]}
            />
            <Animatable.View
              animation="pulse"
              iterationCount="infinite"
              duration={1000}
              delay={400}
              style={[styles.dot, styles.dot3]}
            />
          </View>
        </Animatable.View>
      </View>

      {/* Footer */}
      <Animatable.View
        animation="fadeIn"
        delay={1000}
        duration={600}
        style={styles.footer}
      >
        <Text style={styles.footerText}>Made with ❤️ for shoppers</Text>
      </Animatable.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundGradient: {
    position: 'absolute',
    width: width * 2,
    height: height * 2,
    backgroundColor: colors.primary,
    borderRadius: width,
    top: -height * 0.5,
    left: -width * 0.5,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  logoContainer: {
    marginBottom: spacing.xl,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...colors.shadowLarge,
    elevation: 8,
    position: 'relative',
  },
  rotatingRing: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 3,
    borderColor: colors.surface,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
  },
  logoInner: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoIcon: {
    fontSize: 50,
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  appName: {
    ...typography.h1,
    fontSize: 42,
    fontWeight: '800',
    color: colors.surface,
    marginBottom: spacing.sm,
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  tagline: {
    ...typography.body,
    fontSize: 16,
    color: colors.surface,
    opacity: 0.9,
    letterSpacing: 1,
  },
  loadingContainer: {
    marginTop: spacing.xl,
  },
  loadingDots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.surface,
    marginHorizontal: spacing.xs,
    ...colors.shadow,
  },
  dot1: {
    opacity: 0.6,
  },
  dot2: {
    opacity: 0.8,
  },
  dot3: {
    opacity: 1,
  },
  footer: {
    position: 'absolute',
    bottom: spacing.xl,
    alignItems: 'center',
  },
  footerText: {
    ...typography.caption,
    color: colors.surface,
    opacity: 0.7,
    fontSize: 12,
  },
});

export default SplashScreen;

