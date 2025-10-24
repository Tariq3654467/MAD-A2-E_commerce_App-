import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Button, Checkbox, Chip, Card } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import { productAPI } from '../services/api';
import { colors, spacing, borderRadius, typography } from '../theme/colors';

const CategoryFilterScreen = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 500 });
  const [minRating, setMinRating] = useState(0);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await productAPI.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const toggleCategory = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleApplyFilters = () => {
    const filters = {
      category: selectedCategories.length > 0 ? selectedCategories[0] : null,
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
      minRating: minRating,
    };
    
    navigation.navigate('Home', { filters });
  };

  const handleResetFilters = () => {
    setSelectedCategories([]);
    setPriceRange({ min: 0, max: 500 });
    setMinRating(0);
  };

  const priceRanges = [
    { label: 'Under $50', min: 0, max: 50 },
    { label: '$50 - $100', min: 50, max: 100 },
    { label: '$100 - $200', min: 100, max: 200 },
    { label: '$200 - $500', min: 200, max: 500 },
    { label: 'Over $500', min: 500, max: 10000 },
  ];

  const ratings = [
    { value: 5, label: '5 Stars', icon: '⭐⭐⭐⭐⭐' },
    { value: 4, label: '4+ Stars', icon: '⭐⭐⭐⭐' },
    { value: 3, label: '3+ Stars', icon: '⭐⭐⭐' },
    { value: 2, label: '2+ Stars', icon: '⭐⭐' },
    { value: 1, label: '1+ Star', icon: '⭐' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Animatable.View animation="fadeInDown" style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Filters</Text>
          <Text style={styles.headerSubtitle}>Find exactly what you're looking for</Text>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" delay={100}>
          <Card style={styles.card}>
            <Card.Content style={styles.cardContent}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionIcon}>🏷️</Text>
                <Text style={styles.sectionTitle}>Categories</Text>
              </View>
              
              <View style={styles.categoriesGrid}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryItem,
                      selectedCategories.includes(category) && styles.categoryItemSelected
                    ]}
                    onPress={() => toggleCategory(category)}
                    activeOpacity={0.7}
                  >
                    <Checkbox
                      status={selectedCategories.includes(category) ? 'checked' : 'unchecked'}
                      onPress={() => toggleCategory(category)}
                      color={colors.primary}
                    />
                    <Text style={[
                      styles.categoryLabel,
                      selectedCategories.includes(category) && styles.categoryLabelSelected
                    ]}>
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Card.Content>
          </Card>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" delay={200}>
          <Card style={styles.card}>
            <Card.Content style={styles.cardContent}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionIcon}>💰</Text>
                <Text style={styles.sectionTitle}>Price Range</Text>
              </View>
              
              <View style={styles.currentRange}>
                <Text style={styles.rangeText}>
                  ${priceRange.min} - ${priceRange.max}
                </Text>
              </View>

              <View style={styles.priceRangesContainer}>
                {priceRanges.map((range) => (
                  <TouchableOpacity
                    key={range.label}
                    style={[
                      styles.priceRangeItem,
                      priceRange.min === range.min && priceRange.max === range.max && styles.priceRangeItemSelected
                    ]}
                    onPress={() => setPriceRange({ min: range.min, max: range.max })}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      styles.priceRangeLabel,
                      priceRange.min === range.min && priceRange.max === range.max && styles.priceRangeLabelSelected
                    ]}>
                      {range.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Card.Content>
          </Card>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" delay={300}>
          <Card style={styles.card}>
            <Card.Content style={styles.cardContent}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionIcon}>⭐</Text>
                <Text style={styles.sectionTitle}>Minimum Rating</Text>
              </View>

              <View style={styles.ratingsContainer}>
                {ratings.map((rating) => (
                  <TouchableOpacity
                    key={rating.value}
                    style={[
                      styles.ratingItem,
                      minRating === rating.value && styles.ratingItemSelected
                    ]}
                    onPress={() => setMinRating(rating.value)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.ratingIcon}>{rating.icon}</Text>
                    <Text style={[
                      styles.ratingLabel,
                      minRating === rating.value && styles.ratingLabelSelected
                    ]}>
                      {rating.label}
                    </Text>
                  </TouchableOpacity>
                ))}
                {minRating > 0 && (
                  <TouchableOpacity
                    style={styles.clearRatingButton}
                    onPress={() => setMinRating(0)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.clearRatingText}>Clear Rating Filter</Text>
                  </TouchableOpacity>
                )}
              </View>
            </Card.Content>
          </Card>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" delay={400} style={styles.buttonContainer}>
          <Button
            mode="outlined"
            onPress={handleResetFilters}
            style={styles.resetButton}
            contentStyle={styles.buttonContent}
            labelStyle={styles.resetButtonLabel}
            icon="refresh"
          >
            Reset Filters
          </Button>
          <Button
            mode="contained"
            onPress={handleApplyFilters}
            style={styles.applyButton}
            contentStyle={styles.buttonContent}
            labelStyle={styles.applyButtonLabel}
            icon="check"
          >
            Apply Filters
          </Button>
        </Animatable.View>
      </View>
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
  categoriesGrid: {
    gap: spacing.sm,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryItemSelected: {
    backgroundColor: colors.primary + '15',
    borderColor: colors.primary,
  },
  categoryLabel: {
    ...typography.body,
    color: colors.text,
    marginLeft: spacing.sm,
  },
  categoryLabelSelected: {
    fontWeight: '600',
    color: colors.primary,
  },
  currentRange: {
    backgroundColor: colors.primary + '15',
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  rangeText: {
    ...typography.h3,
    color: colors.primary,
    fontWeight: 'bold',
  },
  priceRangesContainer: {
    gap: spacing.sm,
  },
  priceRangeItem: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  priceRangeItemSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  priceRangeLabel: {
    ...typography.body,
    color: colors.text,
  },
  priceRangeLabelSelected: {
    color: colors.surface,
    fontWeight: '600',
  },
  ratingsContainer: {
    gap: spacing.sm,
  },
  ratingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  ratingItemSelected: {
    backgroundColor: colors.warning + '20',
    borderColor: colors.warning,
  },
  ratingIcon: {
    fontSize: 18,
    marginRight: spacing.md,
  },
  ratingLabel: {
    ...typography.body,
    color: colors.text,
  },
  ratingLabelSelected: {
    fontWeight: '600',
    color: colors.warning,
  },
  clearRatingButton: {
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  clearRatingText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  resetButton: {
    flex: 1,
    borderRadius: borderRadius.md,
    borderColor: colors.primary,
    borderWidth: 1.5,
  },
  applyButton: {
    flex: 1,
    borderRadius: borderRadius.md,
  },
  buttonContent: {
    paddingVertical: spacing.sm,
  },
  resetButtonLabel: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  applyButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CategoryFilterScreen;
