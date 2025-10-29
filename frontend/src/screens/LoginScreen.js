import React, { useState, useContext } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { TextInput, Button, Text, Snackbar, Surface } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import { AuthContext } from '../context/AuthContext';
import { colors, spacing, borderRadius, typography } from '../theme/colors';

const { width } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const result = await login(email.toLowerCase().trim(), password);
      
      if (!result.success) {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      setError('Cannot connect to server. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollView}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Animatable.View animation="fadeIn" style={styles.content}>
          {/* Logo Area */}
          <Animatable.View animation="fadeInDown" delay={100} style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>🛍️</Text>
            </View>
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>Sign in to continue shopping</Text>
          </Animatable.View>

          {/* Form */}
          <Animatable.View animation="fadeInUp" delay={200}>
            <Surface style={styles.formContainer} elevation={0}>
              <View style={styles.form}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Email</Text>
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    mode="outlined"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={styles.input}
                    outlineColor={colors.border}
                    activeOutlineColor={colors.primary}
                    placeholder="you@example.com"
                    placeholderTextColor={colors.textLight}
                    theme={{ roundness: borderRadius.md, colors: { onSurface: colors.text, text: colors.text } }}
                    contentStyle={{ color: colors.text }}
                    left={<TextInput.Icon icon="email" color={colors.textLight} />}
                    error={!!error && error.toLowerCase().includes('email')}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Password</Text>
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    mode="outlined"
                    secureTextEntry={!showPassword}
                    style={styles.input}
                    outlineColor={colors.border}
                    activeOutlineColor={colors.primary}
                    placeholder="Enter your password"
                    placeholderTextColor={colors.textLight}
                    theme={{ roundness: borderRadius.md, colors: { onSurface: colors.text, text: colors.text } }}
                    contentStyle={{ color: colors.text }}
                    left={<TextInput.Icon icon="lock" color={colors.textLight} />}
                    right={<TextInput.Icon 
                      icon={showPassword ? "eye-off" : "eye"} 
                      onPress={() => setShowPassword(!showPassword)}
                      color={colors.textLight}
                    />}
                  />
                </View>

                <Button
                  mode="contained"
                  onPress={handleLogin}
                  loading={loading}
                  disabled={loading}
                  style={styles.button}
                  contentStyle={styles.buttonContent}
                  labelStyle={styles.buttonLabel}
                  buttonColor={colors.primary}
                  textColor={colors.surface}
                  icon="login"
                >
                  Sign in
                </Button>

                <View style={styles.registerContainer}>
                  <Text style={styles.registerText}>Don't have an account? </Text>
                  <Button
                    mode="text"
                    onPress={() => navigation.navigate('Register')}
                    labelStyle={styles.registerLink}
                    compact
                    textColor={colors.primary}
                  >
                    Sign up
                  </Button>
                </View>
              </View>
            </Surface>
          </Animatable.View>
        </Animatable.View>
      </ScrollView>

      <Snackbar
        visible={!!error}
        onDismiss={() => setError('')}
        duration={4000}
        style={styles.snackbar}
        action={{
          label: 'Dismiss',
          onPress: () => setError(''),
        }}
      >
        {error}
      </Snackbar>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: spacing.md,
  },
  content: {
    padding: spacing.md,
    paddingTop: spacing.lg,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  logoCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
    ...colors.shadowMedium,
  },
  logoText: {
    fontSize: 36,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.xs / 2,
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 24,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    fontSize: 14,
  },
  formContainer: {
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface,
    padding: spacing.md,
    ...colors.shadowMedium,
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: spacing.sm,
  },
  label: {
    ...typography.bodyMedium,
    color: colors.text,
    marginBottom: spacing.xs,
    fontWeight: '600',
    fontSize: 14,
  },
  input: {
    backgroundColor: colors.surface,
    fontSize: 15,
    marginBottom: 0,
    color: colors.text,
  },
  button: {
    marginTop: spacing.md,
    borderRadius: borderRadius.md,
    ...colors.shadowMedium,
    elevation: 4,
    alignSelf: 'stretch',
  },
  buttonContent: {
    paddingVertical: spacing.sm,
  },
  buttonLabel: {
    ...typography.bodyMedium,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  registerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.sm,
  },
  registerText: {
    ...typography.body,
    color: colors.textSecondary,
    fontSize: 13,
  },
  registerLink: {
    ...typography.bodyMedium,
    color: colors.primary,
    fontWeight: '600',
    fontSize: 13,
  },
  snackbar: {
    backgroundColor: colors.error,
    marginBottom: spacing.xl,
  },
});

export default LoginScreen;
