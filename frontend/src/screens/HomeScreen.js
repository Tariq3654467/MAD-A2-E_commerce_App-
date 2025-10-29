import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, FlatList, Image, TouchableOpacity, RefreshControl } from 'react-native';
import { Searchbar, Card, Text, Chip, ActivityIndicator, FAB } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import { productAPI } from '../services/api';
import { CartContext } from '../context/CartContext';
import { colors, spacing, borderRadius, typography } from '../theme/colors';

const HomeScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState(['All']);
  
  const { cartCount } = useContext(CartContext);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchQuery, selectedCategory, products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productAPI.getAll();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await productAPI.getCategories();
      setCategories(['All', ...data]);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  const renderProduct = ({ item, index }) => (
    <Animatable.View 
      animation="fadeInUp" 
      delay={index * 50} 
      duration={400}
      style={styles.productWrapper}
    >
      <TouchableOpacity 
        onPress={() => navigation.navigate('ProductDetails', { productId: item._id })}
        activeOpacity={0.9}
      >
        <Card style={styles.productCard}>
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: item.image_url }} 
              style={styles.productImage}
              resizeMode="cover"
            />
            {item.stock < 10 && item.stock > 0 && (
              <View style={styles.lowStockBadge}>
                <Text style={styles.lowStockText}>Only {item.stock} left</Text>
              </View>
            )}
            {item.stock === 0 && (
              <View style={styles.outOfStockBadge}>
                <Text style={styles.outOfStockText}>Out of Stock</Text>
              </View>
            )}
          </View>
          <Card.Content style={styles.productContent}>
            <Text style={styles.productCategory} numberOfLines={1}>{item.category}</Text>
            <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
            <View style={styles.productFooter}>
              <View style={styles.priceContainer}>
                <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
              </View>
              <View style={styles.ratingContainer}>
                <Text style={styles.ratingIcon}>⭐</Text>
                <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    </Animatable.View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading products...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Searchbar
          placeholder="Search products..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          iconColor={colors.primary}
          inputStyle={styles.searchInput}
        />
        
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          keyExtractor={(item) => item}
          style={styles.categoryList}
          contentContainerStyle={styles.categoryListContent}
          renderItem={({ item }) => (
            <Chip
              mode={selectedCategory === item ? 'flat' : 'outlined'}
              selected={selectedCategory === item}
              onPress={() => setSelectedCategory(item)}
              style={[
                styles.categoryChip,
                selectedCategory === item && styles.categoryChipSelected
              ]}
              textStyle={[
                styles.categoryChipText,
                selectedCategory === item && styles.categoryChipTextSelected
              ]}
              selectedColor={colors.surface}
            >
              {item}
            </Chip>
          )}
        />
      </View>

      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item._id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.productList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyText}>No products found</Text>
            <Text style={styles.emptySubtext}>Try adjusting your search or filters</Text>
          </View>
        }
      />

      <FAB
        icon="filter-variant"
        style={styles.fab}
        onPress={() => navigation.navigate('CategoryFilter')}
        color={colors.surface}
        label="Filters"
      />
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
  loadingText: {
    ...typography.body,
    marginTop: spacing.md,
    color: colors.textSecondary,
  },
  header: {
    backgroundColor: colors.surface,
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    ...colors.shadowMedium,
    elevation: 3,
  },
  searchBar: {
    marginBottom: spacing.md,
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    elevation: 0,
    ...colors.shadow,
  },
  searchInput: {
    ...typography.body,
  },
  categoryList: {
    marginBottom: spacing.sm,
  },
  categoryListContent: {
    paddingRight: spacing.md,
  },
  categoryChip: {
    marginRight: spacing.sm,
    marginVertical: spacing.xs,
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  categoryChipSelected: {
    backgroundColor: colors.primary,
  },
  categoryChipText: {
    ...typography.caption,
    color: colors.text,
  },
  categoryChipTextSelected: {
    color: colors.surface,
    fontWeight: '600',
  },
  productList: {
    padding: spacing.sm,
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xs,
  },
  productWrapper: {
    flex: 1,
    maxWidth: '50%',
    padding: spacing.xs,
  },
  productCard: {
    borderRadius: borderRadius.lg,
    ...colors.shadowMedium,
    elevation: 4,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 1,
    backgroundColor: colors.background,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  lowStockBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.warning,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  lowStockText: {
    ...typography.small,
    color: colors.surface,
    fontWeight: '600',
  },
  outOfStockBadge: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  outOfStockText: {
    ...typography.body,
    color: colors.surface,
    fontWeight: 'bold',
  },
  productContent: {
    padding: spacing.md,
  },
  productCategory: {
    ...typography.small,
    color: colors.primary,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  productName: {
    ...typography.body,
    fontWeight: '600',
    marginBottom: spacing.sm,
    height: 44,
    color: colors.text,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flex: 1,
  },
  productPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  ratingIcon: {
    fontSize: 14,
    marginRight: spacing.xs,
  },
  ratingText: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.text,
  },
  emptyContainer: {
    padding: spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  emptyText: {
    ...typography.h3,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  emptySubtext: {
    ...typography.body,
    color: colors.textLight,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    margin: spacing.lg,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
  },
});

export default HomeScreen;
