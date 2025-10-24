import React, { useContext } from 'react';
import { View, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { Text, Button, IconButton, Card, Divider } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { colors, spacing, borderRadius, typography } from '../theme/colors';

const CartScreen = ({ navigation }) => {
  const { cartItems, updateCartItem, removeFromCart, getCartTotal } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  if (!user) {
    return (
      <View style={styles.emptyContainer}>
        <Animatable.View animation="bounceIn" style={styles.emptyContent}>
          <Text style={styles.emptyIcon}>🔒</Text>
          <Text style={styles.emptyTitle}>Login Required</Text>
          <Text style={styles.emptyText}>Please login to view your cart</Text>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('Auth', { screen: 'Login' })}
            style={styles.actionButton}
            contentStyle={styles.actionButtonContent}
            labelStyle={styles.actionButtonLabel}
            icon="login"
          >
            Login Now
          </Button>
        </Animatable.View>
      </View>
    );
  }

  if (cartItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Animatable.View animation="bounceIn" style={styles.emptyContent}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptyText}>Add some products to get started</Text>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('Home')}
            style={styles.actionButton}
            contentStyle={styles.actionButtonContent}
            labelStyle={styles.actionButtonLabel}
            icon="shopping"
          >
            Start Shopping
          </Button>
        </Animatable.View>
      </View>
    );
  }

  const renderCartItem = ({ item, index }) => {
    const product = item.product_id;
    if (!product) return null;

    return (
      <Animatable.View animation="fadeInUp" delay={index * 100}>
        <Card style={styles.cartCard}>
          <View style={styles.cartItemContainer}>
            <Image source={{ uri: product.image_url }} style={styles.productImage} />
            
            <View style={styles.productInfo}>
              <Text style={styles.productCategory}>{product.category}</Text>
              <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
              <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
              
              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  style={[styles.quantityButton, item.quantity <= 1 && styles.quantityButtonDisabled]}
                  onPress={() => {
                    if (item.quantity > 1) {
                      updateCartItem(item._id, item.quantity - 1);
                    }
                  }}
                  disabled={item.quantity <= 1}
                  activeOpacity={0.7}
                >
                  <Text style={styles.quantityButtonText}>−</Text>
                </TouchableOpacity>
                <View style={styles.quantityDisplay}>
                  <Text style={styles.quantityText}>{item.quantity}</Text>
                </View>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => updateCartItem(item._id, item.quantity + 1)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.actionContainer}>
              <IconButton
                icon="delete-outline"
                iconColor={colors.error}
                size={24}
                onPress={() => removeFromCart(item._id)}
                style={styles.deleteButton}
              />
              <View style={styles.totalPriceContainer}>
                <Text style={styles.itemTotal}>
                  ${(product.price * item.quantity).toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
        </Card>
      </Animatable.View>
    );
  };

  const subtotal = getCartTotal();
  const shipping = subtotal > 0 ? 5.99 : 0;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  return (
    <View style={styles.container}>
      <FlatList
        data={cartItems}
        renderItem={renderCartItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>Shopping Cart</Text>
            <Text style={styles.headerSubtitle}>{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}</Text>
          </View>
        }
        ListFooterComponent={
          <Animatable.View animation="fadeInUp" delay={300}>
            <Card style={styles.summaryCard}>
              <Card.Content style={styles.summaryContent}>
                <Text style={styles.summaryTitle}>Order Summary</Text>
                
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Subtotal</Text>
                  <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Shipping</Text>
                  <Text style={styles.summaryValue}>${shipping.toFixed(2)}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Tax (10%)</Text>
                  <Text style={styles.summaryValue}>${tax.toFixed(2)}</Text>
                </View>
                
                <Divider style={styles.summaryDivider} />
                
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Total</Text>
                  <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
                </View>
              </Card.Content>
            </Card>
          </Animatable.View>
        }
      />

      <View style={styles.footer}>
        <View style={styles.footerContent}>
          <View style={styles.footerTotal}>
            <Text style={styles.footerLabel}>Total Amount</Text>
            <Text style={styles.footerPrice}>${total.toFixed(2)}</Text>
          </View>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('Checkout', { total })}
            style={styles.checkoutButton}
            contentStyle={styles.checkoutButtonContent}
            labelStyle={styles.checkoutButtonLabel}
            icon="credit-card"
          >
            Checkout
          </Button>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacing.xl,
  },
  emptyContent: {
    alignItems: 'center',
    maxWidth: 300,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  actionButton: {
    borderRadius: borderRadius.md,
  },
  actionButtonContent: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  actionButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  listContent: {
    padding: spacing.md,
  },
  headerContainer: {
    marginBottom: spacing.lg,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  cartCard: {
    marginBottom: spacing.md,
    borderRadius: borderRadius.lg,
    ...colors.shadow,
    elevation: 2,
  },
  cartItemContainer: {
    flexDirection: 'row',
    padding: spacing.md,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background,
  },
  productInfo: {
    flex: 1,
    marginLeft: spacing.md,
    justifyContent: 'space-between',
  },
  productCategory: {
    ...typography.small,
    color: colors.primary,
    textTransform: 'uppercase',
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  productName: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  productPrice: {
    fontSize: 18,
    color: colors.primary,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonDisabled: {
    backgroundColor: colors.border,
  },
  quantityButtonText: {
    color: colors.surface,
    fontSize: 20,
    fontWeight: 'bold',
  },
  quantityDisplay: {
    minWidth: 40,
    alignItems: 'center',
  },
  quantityText: {
    ...typography.body,
    fontWeight: 'bold',
    color: colors.text,
  },
  actionContainer: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginLeft: spacing.sm,
  },
  deleteButton: {
    margin: 0,
  },
  totalPriceContainer: {
    backgroundColor: colors.primary + '15',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  itemTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  summaryCard: {
    marginTop: spacing.md,
    borderRadius: borderRadius.lg,
    ...colors.shadow,
    elevation: 2,
  },
  summaryContent: {
    padding: spacing.lg,
  },
  summaryTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  summaryLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  summaryValue: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text,
  },
  summaryDivider: {
    marginVertical: spacing.md,
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
  totalValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
  },
  footer: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    padding: spacing.lg,
    ...colors.shadow,
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerTotal: {
    flex: 1,
  },
  footerLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  footerPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
  },
  checkoutButton: {
    borderRadius: borderRadius.md,
    marginLeft: spacing.md,
  },
  checkoutButtonContent: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  checkoutButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CartScreen;
