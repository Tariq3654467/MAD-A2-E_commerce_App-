import React, { useState, useContext, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  RefreshControl, 
  TouchableOpacity, 
  Alert,
  Image,
  Dimensions 
} from 'react-native';
import { 
  Text, 
  Button, 
  Card, 
  List, 
  Divider, 
  Avatar, 
  ActivityIndicator,
  TextInput,
  IconButton,
  Surface,
  Badge
} from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import { AuthContext } from '../context/AuthContext';
import { orderAPI, userAPI } from '../services/api';
import { colors, spacing, borderRadius, typography } from '../theme/colors';

const { width } = Dimensions.get('window');

const ProfileScreen = ({ navigation }) => {
  const { user, logout, updateUser } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    if (user) {
      fetchOrders();
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
      });
      // Profile image removed for simplicity
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderAPI.getOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const handleLogout = async () => {
    try {
      // On web, skip Alert because confirm dialogs may not support multiple buttons
      if (Platform.OS === 'web') {
        await logout();
        if (navigation && navigation.reset) {
          navigation.reset({ index: 0, routes: [{ name: 'Auth', params: { screen: 'Login' } }] });
        } else if (navigation && navigation.navigate) {
          navigation.navigate('Auth', { screen: 'Login' });
        }
        return;
      }

      Alert.alert(
        'Logout',
        'Are you sure you want to logout?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Logout', 
            style: 'destructive', 
            onPress: async () => {
              try {
                await logout();
                if (navigation && navigation.reset) {
                  navigation.reset({ index: 0, routes: [{ name: 'Auth', params: { screen: 'Login' } }] });
                } else if (navigation && navigation.navigate) {
                  navigation.navigate('Auth', { screen: 'Login' });
                }
              } catch (e) {
                console.error('Logout failed:', e);
              }
            }
          }
        ]
      );
    } catch (e) {
      console.error('Logout flow error:', e);
    }
  };

  // Image picker functionality removed for simplicity
  const pickImage = async () => {
    Alert.alert('Feature Disabled', 'Image picker functionality has been disabled for this demo.');
  };

  const takePhoto = async () => {
    Alert.alert('Feature Disabled', 'Camera functionality has been disabled for this demo.');
  };

  const showImagePicker = () => {
    Alert.alert(
      'Select Profile Picture',
      'Choose an option',
      [
        { text: 'Camera', onPress: takePhoto },
        { text: 'Photo Library', onPress: pickImage },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleSave = async () => {
    try {
      // Update profile on backend
      const updatedUserData = await userAPI.updateProfile({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
      });
      
      // Update local context
      updateUser(updatedUserData);
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
      console.error('Error updating profile:', error);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || ''
    });
    setIsEditing(false);
  };

  const getStatusColor = (status) => {
    const statusColors = {
      'Delivered': colors.success,
      'Shipped': colors.info,
      'Processing': colors.warning,
      'Pending': colors.warning,
      'Cancelled': colors.error,
    };
    return statusColors[status] || colors.textSecondary;
  };

  if (!user) {
    return (
      <View style={styles.emptyContainer}>
        <Animatable.View animation="bounceIn" style={styles.emptyContent}>
          <Text style={styles.emptyIcon}>👤</Text>
          <Text style={styles.emptyTitle}>Not Logged In</Text>
          <Text style={styles.emptyText}>Please login to view your profile</Text>
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

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
      showsVerticalScrollIndicator={false}
    >
      {/* Header Section */}
      <Animatable.View animation="fadeInDown">
        <Card style={styles.headerCard} elevation={2}>
          <Card.Content style={styles.headerContent}>
            <View style={styles.profileImageContainer}>
              <TouchableOpacity 
                onPress={showImagePicker}
                style={styles.profileImageWrapper}
              >
                <Avatar.Text 
                  size={120} 
                  label={formData.name.substring(0, 2).toUpperCase()} 
                  style={styles.avatar}
                  labelStyle={styles.avatarLabel}
                />
                <View style={styles.editIconContainer}>
                  <IconButton
                    icon="camera"
                    size={20}
                    iconColor={colors.surface}
                    style={styles.editIcon}
                  />
                </View>
              </TouchableOpacity>
            </View>
            
            <View style={styles.userInfo}>
              {isEditing ? (
                <TextInput
                  value={formData.name}
                  onChangeText={(text) => setFormData({...formData, name: text})}
                  style={styles.nameInput}
                  mode="outlined"
                  dense
                />
              ) : (
                <Text style={styles.userName}>{formData.name}</Text>
              )}
              <Text style={styles.userEmail}>{formData.email}</Text>
              
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{orders.length}</Text>
                  <Text style={styles.statLabel}>Orders</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>
                    {orders.filter(order => order.status === 'Delivered').length}
                  </Text>
                  <Text style={styles.statLabel}>Delivered</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>
                    ${orders.reduce((total, order) => total + order.total_amount, 0).toFixed(0)}
                  </Text>
                  <Text style={styles.statLabel}>Spent</Text>
                </View>
              </View>
            </View>
          </Card.Content>
        </Card>
      </Animatable.View>

      {/* Action Buttons */}
      <Animatable.View animation="fadeInUp" delay={100} style={styles.actionButtonsContainer}>
        <View style={styles.actionButtons}>
          {isEditing ? (
            <>
              <Button
                mode="contained"
                onPress={handleSave}
                style={styles.saveButton}
                contentStyle={styles.buttonContent}
                labelStyle={styles.buttonLabel}
                icon="check"
              >
                Save
              </Button>
              <Button
                mode="outlined"
                onPress={handleCancel}
                style={styles.cancelButton}
                contentStyle={styles.buttonContent}
                labelStyle={styles.buttonLabel}
                icon="close"
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button
              mode="contained"
              onPress={() => setIsEditing(true)}
              style={styles.editButton}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
              icon="pencil"
            >
              Edit Profile
            </Button>
          )}
        </View>
      </Animatable.View>

      {/* Personal Information */}
      <Animatable.View animation="fadeInUp" delay={200}>
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <View style={styles.sectionHeader}>
              <IconButton icon="information" size={20} iconColor={colors.primary} />
              <Text style={styles.sectionTitle}>Personal Information</Text>
            </View>
            
            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <IconButton icon="email" size={20} iconColor={colors.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email</Text>
                {isEditing ? (
                  <TextInput
                    value={formData.email}
                    onChangeText={(text) => setFormData({...formData, email: text})}
                    style={styles.input}
                    mode="outlined"
                    dense
                    keyboardType="email-address"
                  />
                ) : (
                  <Text style={styles.infoValue}>{formData.email}</Text>
                )}
              </View>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <IconButton icon="phone" size={20} iconColor={colors.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Phone</Text>
                {isEditing ? (
                  <TextInput
                    value={formData.phone}
                    onChangeText={(text) => setFormData({...formData, phone: text})}
                    style={styles.input}
                    mode="outlined"
                    dense
                    keyboardType="phone-pad"
                    placeholder="Enter phone number"
                  />
                ) : (
                  <Text style={styles.infoValue}>{formData.phone || 'Not provided'}</Text>
                )}
              </View>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <IconButton icon="map-marker" size={20} iconColor={colors.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Address</Text>
                {isEditing ? (
                  <TextInput
                    value={formData.address}
                    onChangeText={(text) => setFormData({...formData, address: text})}
                    style={styles.input}
                    mode="outlined"
                    dense
                    multiline
                    numberOfLines={2}
                    placeholder="Enter your address"
                  />
                ) : (
                  <Text style={styles.infoValue}>{formData.address || 'Not provided'}</Text>
                )}
              </View>
            </View>
          </Card.Content>
        </Card>
      </Animatable.View>

      {/* Recent Orders */}
      <Animatable.View animation="fadeInUp" delay={300}>
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <View style={styles.sectionHeader}>
              <IconButton icon="package-variant" size={20} iconColor={colors.primary} />
              <Text style={styles.sectionTitle}>Recent Orders</Text>
              <Badge style={styles.orderBadge}>{orders.length}</Badge>
            </View>
            
            {loading && !refreshing ? (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
              </View>
            ) : orders.length > 0 ? (
              orders.slice(0, 5).map((order, index) => (
                <TouchableOpacity 
                  key={order._id}
                  style={styles.orderCard}
                  onPress={() => {}}
                  activeOpacity={0.7}
                >
                  <View style={styles.orderHeader}>
                    <View>
                      <Text style={styles.orderId}>#{order._id.substring(0, 8).toUpperCase()}</Text>
                      <Text style={styles.orderDate}>
                        {new Date(order.order_date).toLocaleDateString()}
                      </Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) + '20' }]}>
                      <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
                        {order.status}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.orderFooter}>
                    <Text style={styles.orderItems}>{order.items.length} items</Text>
                    <Text style={styles.orderTotal}>${order.total_amount.toFixed(2)}</Text>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.noOrdersContainer}>
                <IconButton icon="package-variant-outline" size={60} iconColor={colors.textLight} />
                <Text style={styles.noOrdersText}>No orders yet</Text>
                <Text style={styles.noOrdersSubtext}>Start shopping to place your first order</Text>
              </View>
            )}
          </Card.Content>
        </Card>
      </Animatable.View>

      {/* Logout Button */}
      <Animatable.View animation="fadeInUp" delay={400} style={styles.logoutContainer}>
        <Button
          mode="contained"
          onPress={handleLogout}
          style={styles.logoutButton}
          contentStyle={styles.logoutButtonContent}
          labelStyle={styles.logoutButtonLabel}
          buttonColor={colors.error}
          icon="logout"
        >
          Logout
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
  scrollContent: {
    padding: spacing.lg,
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
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.sm,
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
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
  },
  actionButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  headerCard: {
    marginBottom: spacing.lg,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.surface,
    ...colors.shadowMedium,
  },
  headerContent: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  profileImageContainer: {
    marginBottom: spacing.lg,
    position: 'relative',
  },
  profileImageWrapper: {
    position: 'relative',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: colors.primary,
  },
  avatar: {
    backgroundColor: colors.primary,
    ...colors.shadow,
    elevation: 8,
  },
  avatarLabel: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  uploadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.surface,
  },
  editIcon: {
    margin: 0,
  },
  userInfo: {
    alignItems: 'center',
    width: '100%',
  },
  userName: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  nameInput: {
    width: '100%',
    marginBottom: spacing.xs,
  },
  userEmail: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: spacing.md,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  actionButtonsContainer: {
    marginBottom: spacing.lg,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.md,
  },
  editButton: {
    borderRadius: borderRadius.md,
    flex: 1,
  },
  saveButton: {
    borderRadius: borderRadius.md,
    flex: 1,
  },
  cancelButton: {
    borderRadius: borderRadius.md,
    flex: 1,
  },
  buttonContent: {
    paddingVertical: spacing.sm,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  card: {
    marginBottom: spacing.lg,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface,
    ...colors.shadowMedium,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 2,
  },
  cardContent: {
    padding: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    flex: 1,
    marginLeft: spacing.sm,
  },
  orderBadge: {
    backgroundColor: colors.primary,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  infoContent: {
    flex: 1,
    justifyContent: 'center',
  },
  infoLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  infoValue: {
    ...typography.body,
    color: colors.text,
    fontWeight: '500',
  },
  input: {
    backgroundColor: colors.background,
  },
  divider: {
    marginVertical: spacing.md,
    backgroundColor: colors.divider,
  },
  loaderContainer: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  orderCard: {
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  orderId: {
    ...typography.body,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  orderDate: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },
  statusText: {
    ...typography.caption,
    fontWeight: 'bold',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderItems: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  orderTotal: {
    ...typography.body,
    fontWeight: 'bold',
    color: colors.primary,
  },
  noOrdersContainer: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  noOrdersText: {
    ...typography.body,
    color: colors.textSecondary,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  noOrdersSubtext: {
    ...typography.caption,
    color: colors.textLight,
    textAlign: 'center',
  },
  logoutContainer: {
    marginBottom: spacing.xl,
  },
  logoutButton: {
    borderRadius: borderRadius.md,
  },
  logoutButtonContent: {
    paddingVertical: spacing.sm,
  },
  logoutButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileScreen;