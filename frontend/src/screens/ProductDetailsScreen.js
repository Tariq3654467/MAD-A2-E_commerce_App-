import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Text, Button, ActivityIndicator, Chip, Divider, Snackbar, IconButton } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import { productAPI } from '../services/api';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { colors, spacing, borderRadius, typography } from '../theme/colors';

const { width } = Dimensions.get('window');

const ProductDetailsScreen = ({ route, navigation }) => {
  const { productId } = route.params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const data = await productAPI.getById(productId);
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      navigation.navigate('Auth', { screen: 'Login' });
      return;
    }

    const result = await addToCart(productId, quantity);
    if (result.success) {
      setSnackbarMessage('Added to cart successfully!');
      setSnackbarVisible(true);
    }
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Product not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Animatable.View animation="fadeIn">
          <View style={styles.imageContainer}>
            <Image source={{ uri: product.image_url }} style={styles.productImage} />
            {product.stock < 10 && product.stock > 0 && (
              <View style={styles.lowStockBadge}>
                <Text style={styles.lowStockText}>Only {product.stock} left!</Text>
              </View>
            )}
          </View>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" delay={200} style={styles.content}>
          <View style={styles.headerSection}>
            <Chip 
              mode="flat" 
              style={styles.categoryChip}
              textStyle={styles.categoryChipText}
            >
              {product.category}
            </Chip>
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingIcon}>⭐</Text>
              <Text style={styles.ratingText}>{product.rating.toFixed(1)}</Text>
            </View>
          </View>

          <Text style={styles.productName}>{product.name}</Text>
          
          <View style={styles.priceSection}>
            <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
            <Chip 
              mode="outlined"
              style={[
                styles.stockChip,
                product.stock > 0 ? styles.inStock : styles.outOfStock
              ]}
              textStyle={styles.stockChipText}
            >
              {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
            </Chip>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quantity</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity 
                style={[styles.quantityButton, quantity <= 1 && styles.quantityButtonDisabled]}
                onPress={decrementQuantity}
                disabled={quantity <= 1}
                activeOpacity={0.7}
              >
                <Text style={styles.quantityButtonText}>−</Text>
              </TouchableOpacity>
              <View style={styles.quantityDisplay}>
                <Text style={styles.quantityText}>{quantity}</Text>
              </View>
              <TouchableOpacity 
                style={[styles.quantityButton, quantity >= product.stock && styles.quantityButtonDisabled]}
                onPress={incrementQuantity}
                disabled={quantity >= product.stock}
                activeOpacity={0.7}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.section}>
            <View style={styles.reviewsHeader}>
              <Text style={styles.sectionTitle}>Customer Reviews</Text>
              <Text style={styles.reviewCount}>({product.reviews?.length || 0})</Text>
            </View>
            {product.reviews && product.reviews.length > 0 ? (
              product.reviews.map((review, index) => (
                <Animatable.View 
                  key={index} 
                  animation="fadeInUp" 
                  delay={index * 100}
                  style={styles.reviewCard}
                >
                  <View style={styles.reviewHeader}>
                    <View style={styles.reviewUserContainer}>
                      <View style={styles.reviewAvatar}>
                        <Text style={styles.reviewAvatarText}>
                          {review.user.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                      <Text style={styles.reviewUser}>{review.user}</Text>
                    </View>
                    <View style={styles.reviewRatingContainer}>
                      <Text style={styles.reviewRatingIcon}>⭐</Text>
                      <Text style={styles.reviewRating}>{review.rating}</Text>
                    </View>
                  </View>
                  <Text style={styles.reviewComment}>{review.comment}</Text>
                </Animatable.View>
              ))
            ) : (
              <View style={styles.noReviewsContainer}>
                <Text style={styles.noReviewsIcon}>💬</Text>
                <Text style={styles.noReviews}>No reviews yet</Text>
                <Text style={styles.noReviewsSubtext}>Be the first to review this product</Text>
              </View>
            )}
          </View>
        </Animatable.View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerContent}>
          <View style={styles.totalSection}>
            <Text style={styles.footerLabel}>Total Price</Text>
            <Text style={styles.footerPrice}>${(product.price * quantity).toFixed(2)}</Text>
          </View>
          <Button
            mode="contained"
            onPress={handleAddToCart}
            disabled={product.stock === 0}
            style={styles.addToCartButton}
            contentStyle={styles.addToCartButtonContent}
            labelStyle={styles.addToCartButtonLabel}
            icon="cart-plus"
          >
            Add to Cart
          </Button>
        </View>
      </View>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={2000}
        style={styles.snackbar}
        action={{
          label: 'View Cart',
          onPress: () => navigation.navigate('Main', { screen: 'Cart' }),
          labelStyle: { color: colors.surface },
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  errorText: {
    ...typography.h3,
    color: colors.textSecondary,
  },
  imageContainer: {
    width: width,
    height: width,
    backgroundColor: colors.surface,
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  lowStockBadge: {
    position: 'absolute',
    top: spacing.lg,
    right: spacing.lg,
    backgroundColor: colors.warning,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    ...colors.shadow,
  },
  lowStockText: {
    ...typography.caption,
    color: colors.surface,
    fontWeight: 'bold',
  },
  content: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    marginTop: -spacing.lg,
    padding: spacing.lg,
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  categoryChip: {
    backgroundColor: colors.primary + '15',
  },
  categoryChipText: {
    color: colors.primary,
    fontWeight: '600',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },
  ratingIcon: {
    fontSize: 16,
    marginRight: spacing.xs,
  },
  ratingText: {
    ...typography.body,
    fontWeight: 'bold',
    color: colors.text,
  },
  productName: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.md,
  },
  priceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  productPrice: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
  },
  stockChip: {
    borderRadius: borderRadius.md,
  },
  inStock: {
    backgroundColor: colors.success + '15',
    borderColor: colors.success,
  },
  outOfStock: {
    backgroundColor: colors.error + '15',
    borderColor: colors.error,
  },
  stockChipText: {
    fontWeight: '600',
  },
  divider: {
    marginVertical: spacing.lg,
    backgroundColor: colors.divider,
  },
  section: {
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
  },
  description: {
    ...typography.body,
    lineHeight: 24,
    color: colors.textSecondary,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...colors.shadow,
  },
  quantityButtonDisabled: {
    backgroundColor: colors.border,
  },
  quantityButtonText: {
    color: colors.surface,
    fontSize: 28,
    fontWeight: 'bold',
  },
  quantityDisplay: {
    marginHorizontal: spacing.xl,
    minWidth: 40,
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  reviewsHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  reviewCount: {
    ...typography.body,
    color: colors.textLight,
    marginLeft: spacing.sm,
  },
  reviewCard: {
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  reviewUserContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  reviewAvatar: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  reviewAvatarText: {
    ...typography.body,
    color: colors.surface,
    fontWeight: 'bold',
  },
  reviewUser: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text,
  },
  reviewRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  reviewRatingIcon: {
    fontSize: 14,
    marginRight: spacing.xs,
  },
  reviewRating: {
    ...typography.caption,
    fontWeight: 'bold',
    color: colors.text,
  },
  reviewComment: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  noReviewsContainer: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  noReviewsIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  noReviews: {
    ...typography.body,
    color: colors.textSecondary,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  noReviewsSubtext: {
    ...typography.caption,
    color: colors.textLight,
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
  totalSection: {
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
  addToCartButton: {
    borderRadius: borderRadius.md,
    marginLeft: spacing.md,
  },
  addToCartButtonContent: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  addToCartButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  snackbar: {
    backgroundColor: colors.success,
  },
});

export default ProductDetailsScreen;
