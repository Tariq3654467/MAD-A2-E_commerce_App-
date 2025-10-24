import React, { useState, useContext } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, RadioButton, Card, Snackbar } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import { orderAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { colors, spacing, borderRadius, typography } from '../theme/colors';

const CheckoutScreen = ({ route, navigation }) => {
  const { total } = route.params;
  const { user } = useContext(AuthContext);
  const { clearCart } = useContext(CartContext);

  const [shippingAddress, setShippingAddress] = useState(user?.address || '');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const paymentMethods = [
    { value: 'Credit Card', icon: '💳', label: 'Credit Card' },
    { value: 'Debit Card', icon: '💳', label: 'Debit Card' },
    { value: 'PayPal', icon: '💰', label: 'PayPal' },
    { value: 'Cash on Delivery', icon: '💵', label: 'Cash on Delivery' },
  ];

  const handlePlaceOrder = async () => {
    if (!shippingAddress.trim()) {
      setError('Please enter shipping address');
      return;
    }

    setLoading(true);
    try {
      const order = await orderAPI.createOrder({
        shippingAddress,
        paymentMethod,
      });

      await clearCart();
      navigation.replace('OrderConfirmation', { order });
    } catch (err) {
      console.error('Error placing order:', err);
      setError('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const estimatedDelivery = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animatable.View animation="fadeInDown" style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Complete Your Order</Text>
          <Text style={styles.headerSubtitle}>Just a few more steps</Text>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" delay={100}>
          <Card style={styles.card}>
            <Card.Content style={styles.cardContent}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionIcon}>📍</Text>
                <Text style={styles.sectionTitle}>Shipping Address</Text>
              </View>
              <TextInput
                label="Full Address"
                value={shippingAddress}
                onChangeText={setShippingAddress}
                mode="outlined"
                multiline
                numberOfLines={4}
                style={styles.input}
                outlineColor={colors.border}
                activeOutlineColor={colors.primary}
                placeholder="Enter your complete shipping address"
              />
            </Card.Content>
          </Card>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" delay={200}>
          <Card style={styles.card}>
            <Card.Content style={styles.cardContent}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionIcon}>💳</Text>
                <Text style={styles.sectionTitle}>Payment Method</Text>
              </View>
              <RadioButton.Group onValueChange={setPaymentMethod} value={paymentMethod}>
                {paymentMethods.map((method) => (
                  <TouchableOpacity
                    key={method.value}
                    style={[
                      styles.paymentOption,
                      paymentMethod === method.value && styles.paymentOptionSelected
                    ]}
                    onPress={() => setPaymentMethod(method.value)}
                    activeOpacity={0.7}
                  >
                    <RadioButton value={method.value} color={colors.primary} />
                    <Text style={styles.paymentIcon}>{method.icon}</Text>
                    <Text style={[
                      styles.paymentLabel,
                      paymentMethod === method.value && styles.paymentLabelSelected
                    ]}>
                      {method.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </RadioButton.Group>
            </Card.Content>
          </Card>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" delay={300}>
          <Card style={styles.summaryCard}>
            <Card.Content style={styles.cardContent}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionIcon}>📦</Text>
                <Text style={styles.sectionTitle}>Order Summary</Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Amount</Text>
                <Text style={styles.totalAmount}>${total.toFixed(2)}</Text>
              </View>
              
              <View style={styles.deliveryInfo}>
                <Text style={styles.deliveryIcon}>🚚</Text>
                <View style={styles.deliveryText}>
                  <Text style={styles.deliveryLabel}>Estimated Delivery</Text>
                  <Text style={styles.deliveryDate}>{estimatedDelivery}</Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" delay={400}>
          <Button
            mode="contained"
            onPress={handlePlaceOrder}
            loading={loading}
            disabled={loading}
            style={styles.placeOrderButton}
            contentStyle={styles.placeOrderButtonContent}
            labelStyle={styles.placeOrderButtonLabel}
            icon="check-circle"
          >
            Place Order
          </Button>
        </Animatable.View>
      </ScrollView>

      <Snackbar
        visible={!!error}
        onDismiss={() => setError('')}
        duration={3000}
        style={styles.snackbar}
        action={{
          label: 'Close',
          onPress: () => setError(''),
        }}
      >
        {error}
      </Snackbar>
    </KeyboardAvoidingView>
  );
};

import { TouchableOpacity } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  headerContainer: {
    marginBottom: spacing.xl,
  },
  headerTitle: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  card: {
    marginBottom: spacing.lg,
    borderRadius: borderRadius.lg,
    ...colors.shadow,
    elevation: 2,
  },
  cardContent: {
    padding: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  sectionIcon: {
    fontSize: 24,
    marginRight: spacing.sm,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
  },
  input: {
    backgroundColor: colors.surface,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  paymentOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  paymentIcon: {
    fontSize: 24,
    marginLeft: spacing.sm,
    marginRight: spacing.md,
  },
  paymentLabel: {
    ...typography.body,
    color: colors.text,
    flex: 1,
  },
  paymentLabelSelected: {
    fontWeight: '600',
    color: colors.primary,
  },
  summaryCard: {
    marginBottom: spacing.lg,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primary + '08',
    ...colors.shadow,
    elevation: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  summaryLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  totalAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  deliveryIcon: {
    fontSize: 28,
    marginRight: spacing.md,
  },
  deliveryText: {
    flex: 1,
  },
  deliveryLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  deliveryDate: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text,
  },
  placeOrderButton: {
    borderRadius: borderRadius.md,
    marginBottom: spacing.xl,
  },
  placeOrderButtonContent: {
    paddingVertical: spacing.md,
  },
  placeOrderButtonLabel: {
    fontSize: 18,
    fontWeight: '600',
  },
  snackbar: {
    backgroundColor: colors.error,
  },
});

export default CheckoutScreen;
