import React, { useState, useContext } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { TextInput, Button, Text, Snackbar, HelperText } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import { AuthContext } from '../context/AuthContext';
import { colors, spacing, borderRadius, typography } from '../theme/colors';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  
  const { register } = useContext(AuthContext);

  const validateFields = () => {
    const errors = {};

    if (!name.trim()) {
      errors.name = 'Name is required';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
      errors.email = 'Please enter a valid email';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateFields()) {
      setError('Please fix the errors below');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const userData = {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password,
        phone: phone.trim(),
        address: address.trim(),
      };

      const result = await register(userData);
      
      if (!result.success) {
        setError(result.error || 'Registration failed');
        
        // Show specific error guidance
        if (result.error?.includes('connect')) {
          Alert.alert(
            'Connection Error',
            'Cannot connect to server. Please ensure:\n\n1. Backend server is running (npm start in Backend folder)\n2. MongoDB is connected\n3. API URL is correct in src/services/api.js',
            [{ text: 'OK' }]
          );
        } else if (result.error?.includes('already registered')) {
          setFieldErrors({ email: 'This email is already registered' });
        }
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('Cannot connect to server');
      
      Alert.alert(
        'Server Connection Failed',
        'Please check:\n\n✓ Backend server is running\n✓ MongoDB is connected\n✓ Check API URL in src/services/api.js\n\nCurrent URL: http://10.0.2.2:3000/api\n\nFor physical device, use your computer IP address.',
        [{ text: 'OK' }]
      );
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
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Create your account</Text>
            <Text style={styles.subtitle}>Start your shopping journey today</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Text style={styles.label}>Full name <Text style={styles.required}>*</Text></Text>
            <TextInput
              value={name}
              onChangeText={(text) => {
                setName(text);
                setFieldErrors({ ...fieldErrors, name: null });
              }}
              mode="outlined"
              style={styles.input}
              outlineColor={fieldErrors.name ? colors.error : colors.border}
              activeOutlineColor={colors.primary}
              placeholder="John Doe"
              theme={{ roundness: borderRadius.md }}
              error={!!fieldErrors.name}
            />
            {fieldErrors.name && (
              <HelperText type="error" visible={!!fieldErrors.name}>
                {fieldErrors.name}
              </HelperText>
            )}

            <Text style={styles.label}>Email <Text style={styles.required}>*</Text></Text>
            <TextInput
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setFieldErrors({ ...fieldErrors, email: null });
              }}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.input}
              outlineColor={fieldErrors.email ? colors.error : colors.border}
              activeOutlineColor={colors.primary}
              placeholder="you@example.com"
              theme={{ roundness: borderRadius.md }}
              error={!!fieldErrors.email}
            />
            {fieldErrors.email && (
              <HelperText type="error" visible={!!fieldErrors.email}>
                {fieldErrors.email}
              </HelperText>
            )}

            <Text style={styles.label}>Password <Text style={styles.required}>*</Text></Text>
            <TextInput
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setFieldErrors({ ...fieldErrors, password: null });
              }}
              mode="outlined"
              secureTextEntry={!showPassword}
              style={styles.input}
              outlineColor={fieldErrors.password ? colors.error : colors.border}
              activeOutlineColor={colors.primary}
              placeholder="At least 6 characters"
              theme={{ roundness: borderRadius.md }}
              error={!!fieldErrors.password}
              right={<TextInput.Icon 
                icon={showPassword ? "eye-off" : "eye"} 
                onPress={() => setShowPassword(!showPassword)}
                color={colors.textLight}
              />}
            />
            {fieldErrors.password && (
              <HelperText type="error" visible={!!fieldErrors.password}>
                {fieldErrors.password}
              </HelperText>
            )}

            <Text style={styles.label}>Phone number</Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              mode="outlined"
              keyboardType="phone-pad"
              style={styles.input}
              outlineColor={colors.border}
              activeOutlineColor={colors.primary}
              placeholder="(555) 123-4567"
              theme={{ roundness: borderRadius.md }}
            />

            <Text style={styles.label}>Address</Text>
            <TextInput
              value={address}
              onChangeText={setAddress}
              mode="outlined"
              multiline
              numberOfLines={2}
              style={[styles.input, styles.textArea]}
              outlineColor={colors.border}
              activeOutlineColor={colors.primary}
              placeholder="Your shipping address"
              theme={{ roundness: borderRadius.md }}
            />

            <Text style={styles.requiredNote}>* Required fields</Text>

            <Button
              mode="contained"
              onPress={handleRegister}
              loading={loading}
              disabled={loading}
              style={styles.button}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
              buttonColor={colors.primary}
            >
              Create account
            </Button>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <Button
                mode="text"
                onPress={() => navigation.goBack()}
                labelStyle={styles.loginLink}
                compact
              >
                Sign in
              </Button>
            </View>
          </View>
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
    backgroundColor: colors.surface,
  },
  scrollView: {
    flexGrow: 1,
  },
  content: {
    padding: spacing.xl,
    paddingTop: spacing.lg,
  },
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  form: {
    width: '100%',
  },
  label: {
    ...typography.bodyMedium,
    color: colors.text,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  required: {
    color: colors.error,
  },
  input: {
    backgroundColor: colors.surface,
  },
  textArea: {
    minHeight: 80,
  },
  requiredNote: {
    ...typography.caption,
    color: colors.textLight,
    marginTop: spacing.md,
    fontStyle: 'italic',
  },
  button: {
    marginTop: spacing.xl,
    borderRadius: borderRadius.md,
    ...colors.shadowMedium,
  },
  buttonContent: {
    paddingVertical: spacing.sm,
  },
  buttonLabel: {
    ...typography.bodyMedium,
    fontSize: 16,
  },
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  loginText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  loginLink: {
    ...typography.bodyMedium,
    color: colors.primary,
  },
  snackbar: {
    backgroundColor: colors.error,
  },
});

export default RegisterScreen;
