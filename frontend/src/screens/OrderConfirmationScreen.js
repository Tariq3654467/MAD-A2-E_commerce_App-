import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Card, Divider } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import { colors, spacing, borderRadius, typography } from '../theme/colors';

const OrderConfirmationScreen = ({ route, navigation }) => {
  const { order } = route.params;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Animatable.View animation="bounceIn" style={styles.successContainer}>
        <View style={styles.successIcon}>
          <Text style={styles.checkmark}>✓</Text>
        </View>
        <Text style={styles.successTitle}>Order Confirmed!</Text>
        <Text style={styles.successMessage}>Thank you for your purchase</Text>
        <View style={styles.orderIdContainer}>
          <Text style={styles.orderIdLabel}>Order ID</Text>
          <Text style={styles.orderId}>#{order._id.substring(0, 8).toUpperCase()}</Text>
        </View>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" delay={300}>
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>📋</Text>
              <Text style={styles.sectionTitle}>Order Details</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Order Date</Text>
              <Text style={styles.detailValue}>{formatDate(order.order_date)}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Status</Text>
              <View style={[styles.statusBadge, styles.statusPending]}>
                <Text style={styles.statusText}>{order.status}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Payment Method</Text>
              <Text style={styles.detailValue}>{order.paymentMethod}</Text>
            </View>
          </Card.Content>
        </Card>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" delay={400}>
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>🚚</Text>
              <Text style={styles.sectionTitle}>Delivery Information</Text>
            </View>
            
            <View style={styles.deliveryContainer}>
              <Text style={styles.deliveryLabel}>Estimated Delivery</Text>
              <Text style={styles.deliveryDate}>{formatDate(order.estimatedDelivery)}</Text>
              <Text style={styles.deliveryNote}>We'll send you updates via email</Text>
            </View>
          </Card.Content>
        </Card>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" delay={500}>
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>📦</Text>
              <Text style={styles.sectionTitle}>Items ({order.items.length})</Text>
            </View>
            
            {order.items.map((item, index) => (
              <View key={index} style={styles.itemRow}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
                </View>
                <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
              </View>
            ))}

            <Divider style={styles.divider} />

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalAmount}>${order.total_amount.toFixed(2)}</Text>
            </View>
          </Card.Content>
        </Card>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" delay={600}>
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>📍</Text>
              <Text style={styles.sectionTitle}>Shipping Address</Text>
            </View>
            <Text style={styles.addressText}>{order.shippingAddress}</Text>
          </Card.Content>
        </Card>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" delay={700} style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('Main', { screen: 'Profile' })}
          style={styles.button}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}
          icon="history"
        >
          View Order History
        </Button>

        <Button
          mode="outlined"
          onPress={() => navigation.navigate('Main', { screen: 'Home' })}
          style={styles.outlineButton}
          contentStyle={styles.buttonContent}
          labelStyle={styles.outlineButtonLabel}
          icon="shopping"
        >
          Continue Shopping
        </Button>
      </Animatable.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
  },
  successContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    paddingVertical: spacing.xl,
  },
  successIcon: {
    width: 120,
    height: 120,
    borderRadius: borderRadius.full,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
    ...colors.shadow,
    elevation: 8,
  },
  checkmark: {
    fontSize: 70,
    color: colors.surface,
    fontWeight: 'bold',
  },
  successTitle: {
    ...typography.h1,
    color: colors.success,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  successMessage: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  orderIdContainer: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
    ...colors.shadow,
    elevation: 2,
  },
  orderIdLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  orderId: {
    ...typography.h3,
    color: colors.primary,
    fontWeight: 'bold',
    textAlign: 'center',
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
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  detailLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  detailValue: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text,
  },
  statusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },
  statusPending: {
    backgroundColor: colors.warning + '20',
  },
  statusText: {
    ...typography.caption,
    color: colors.warning,
    fontWeight: 'bold',
  },
  deliveryContainer: {
    backgroundColor: colors.background,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
  },
  deliveryLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  deliveryDate: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  deliveryNote: {
    ...typography.caption,
    color: colors.textLight,
    fontStyle: 'italic',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  itemInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  itemName: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  itemQuantity: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  itemPrice: {
    ...typography.body,
    fontWeight: 'bold',
    color: colors.primary,
  },
  divider: {
    marginVertical: spacing.lg,
    backgroundColor: colors.divider,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    ...typography.h3,
    color: colors.text,
  },
  totalAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
  },
  addressText: {
    ...typography.body,
    lineHeight: 24,
    color: colors.textSecondary,
  },
  buttonContainer: {
    marginBottom: spacing.xl,
  },
  button: {
    marginBottom: spacing.md,
    borderRadius: borderRadius.md,
  },
  buttonContent: {
    paddingVertical: spacing.sm,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  outlineButton: {
    borderRadius: borderRadius.md,
    borderColor: colors.primary,
    borderWidth: 1.5,
  },
  outlineButtonLabel: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OrderConfirmationScreen;
