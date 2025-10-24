# E-Commerce Mobile Application

A full-stack E-Commerce mobile application built with React Native Expo (frontend), Express.js (backend), and MongoDB (database).

## 📱 Features

### Frontend Screens (7 Screens)
1. **Login/Register Screen** - User authentication
2. **Home Screen** - Product grid with search and category filters
3. **Product Details Screen** - Detailed product view with reviews
4. **Cart Screen** - Shopping cart management
5. **Checkout Screen** - Order placement with shipping details
6. **Order Confirmation Screen** - Order summary and tracking
7. **Profile Screen** - User profile and order history
8. **Category/Filter Screen** - Advanced filtering options

### Backend Features
- RESTful API with Express.js
- User authentication with JWT
- Product management
- Shopping cart operations
- Order processing and tracking
- User profile management

### Database Schema
- **Products Collection** - Product details, pricing, stock, reviews
- **Users Collection** - User credentials and profile information
- **Orders Collection** - Order history and tracking
- **Cart Collection** - Shopping cart items

## 🛠️ Technology Stack

### Frontend
- React Native with Expo
- React Navigation (Stack & Bottom Tabs)
- React Native Paper (UI Components)
- Axios (HTTP Client)
- AsyncStorage (Local Storage)
- React Native Animatable (Animations)

### Backend
- Node.js with Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs (Password Hashing)
- CORS enabled

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or MongoDB Atlas account)
- Expo CLI (`npm install -g expo-cli`)
- Git

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd A2/ecommerce-app
```

### 2. Backend Setup

#### Step 1: Install Dependencies
```bash
cd Backend
npm install
```

#### Step 2: MongoDB Setup

**Option A: Local MongoDB**
1. Install MongoDB from [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
2. Start MongoDB service:
   - Windows: MongoDB runs as a service automatically
   - macOS: `brew services start mongodb-community`
   - Linux: `sudo systemctl start mongod`
3. MongoDB will be available at `mongodb://localhost:27017`

**Option B: MongoDB Atlas (Cloud)**
1. Create account at [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier available)
3. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/ecommerce`)
4. Whitelist your IP address in Atlas security settings

#### Step 3: Configure Environment Variables
Create a `.env` file in the `Backend` directory (or update existing one):

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/ecommerce
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce
JWT_SECRET=your_secret_key_here_change_in_production
```

#### Step 4: Seed Database with Sample Data
```bash
npm run seed
```

This will populate your database with 15 sample products across different categories.

#### Step 5: Start Backend Server
```bash
npm start
# or for development with auto-reload:
npm run dev
```

The server will start at `http://localhost:3000`

You should see:
```
✅ MongoDB Connected Successfully
🚀 Server running on port 3000
📍 Server URL: http://localhost:3000
```

### 3. Frontend Setup

#### Step 1: Install Dependencies
```bash
cd ../frontend
npm install
```

#### Step 2: Configure API URL
Edit `frontend/src/services/api.js` and update the `API_URL`:

```javascript
// For Android Emulator:
const API_URL = 'http://10.0.2.2:3000/api';

// For iOS Simulator:
const API_URL = 'http://localhost:3000/api';

// For Physical Device (replace with your computer's IP):
const API_URL = 'http://YOUR_IP_ADDRESS:3000/api';
```

To find your IP address:
- Windows: `ipconfig` (look for IPv4 Address)
- macOS/Linux: `ifconfig` or `ip addr show`

#### Step 3: Start Expo Development Server
```bash
npm start
```

#### Step 4: Run the App

**Option A: Using Expo Go App (Easiest)**
1. Install "Expo Go" app on your phone:
   - Android: [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)
2. Scan the QR code shown in terminal/browser
3. Make sure your phone and computer are on the same WiFi network

**Option B: Android Emulator**
```bash
npm run android
```
Requires Android Studio and Android emulator setup.

**Option C: iOS Simulator (macOS only)**
```bash
npm run ios
```
Requires Xcode installed.

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Products
- `GET /api/products` - Get all products (with optional filters)
- `GET /api/products/:id` - Get single product
- `GET /api/products/categories/list` - Get all categories
- `POST /api/products/:id/reviews` - Add product review

### Cart (Requires Authentication)
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/:id` - Update cart item quantity
- `DELETE /api/cart/:id` - Remove item from cart
- `DELETE /api/cart/clear/all` - Clear entire cart

### Orders (Requires Authentication)
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get single order
- `POST /api/orders/create` - Create new order
- `PUT /api/orders/:id/status` - Update order status

### User Profile (Requires Authentication)
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

## 🔐 Authentication Flow

1. User registers or logs in
2. Backend returns JWT token
3. Token is stored in AsyncStorage
4. Token is automatically added to all subsequent API requests
5. User can access protected routes (cart, orders, profile)

## 📊 Database Schema Details

### Products Collection
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  price: Number,
  image_url: String,
  category: String (Electronics, Clothing, Books, etc.),
  stock: Number,
  rating: Number,
  reviews: [{
    user: String,
    comment: String,
    rating: Number,
    date: Date
  }],
  createdAt: Date
}
```

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  address: String,
  phone: String,
  createdAt: Date
}
```

### Orders Collection
```javascript
{
  _id: ObjectId,
  user_id: ObjectId (ref: User),
  items: [{
    product_id: ObjectId (ref: Product),
    name: String,
    quantity: Number,
    price: Number,
    image_url: String
  }],
  total_amount: Number,
  status: String (Pending, Processing, Shipped, Delivered, Cancelled),
  shippingAddress: String,
  paymentMethod: String,
  order_date: Date,
  estimatedDelivery: Date
}
```

### Cart Collection
```javascript
{
  _id: ObjectId,
  user_id: ObjectId (ref: User),
  product_id: ObjectId (ref: Product),
  quantity: Number,
  addedAt: Date
}
```

## 🎨 App Features Breakdown

### Home Screen
- Grid view of products with images
- Search functionality
- Category filter chips
- Pull-to-refresh
- Quick category selection
- Product rating display
- Floating action button for advanced filters

### Product Details Screen
- High-quality product images
- Detailed description
- Price and availability
- Star ratings and reviews
- Quantity selector
- Add to cart functionality
- Stock status indicator

### Cart Screen
- List of cart items with images
- Quantity adjustment (+/-)
- Item removal
- Price calculation (subtotal, shipping, tax)
- Total amount display
- Checkout button

### Checkout Screen
- Shipping address input
- Payment method selection (Credit Card, Debit Card, PayPal, Cash on Delivery)
- Order summary
- Estimated delivery date
- Place order button

### Order Confirmation Screen
- Success animation
- Order ID and details
- Order status
- Itemized list
- Shipping information
- Estimated delivery date
- Navigation to order history

### Profile Screen
- User information display
- Order history list
- Order status tracking
- Settings options
- Logout functionality

### Category/Filter Screen
- Category selection (multiple)
- Price range slider
- Minimum rating filter
- Apply/Reset filters
- Real-time filter preview

## 🎯 Frontend-Backend Communication Flow

### Example: Adding Item to Cart

1. **Frontend (React Native)**
   ```javascript
   // User clicks "Add to Cart"
   const result = await cartAPI.addToCart(productId, quantity);
   ```

2. **API Service**
   ```javascript
   // Sends HTTP POST request with auth token
   POST http://localhost:3000/api/cart/add
   Headers: { Authorization: "Bearer <token>" }
   Body: { product_id: "...", quantity: 1 }
   ```

3. **Backend (Express.js)**
   ```javascript
   // Receives request, validates token
   // Queries/Updates MongoDB database
   // Returns response
   ```

4. **Frontend Response**
   ```javascript
   // Updates cart state
   // Shows success message
   // Updates cart badge count
   ```

## 📸 Screenshots

### Authentication
- Login Screen: User-friendly login with email and password
- Register Screen: Sign up form with validation

### Shopping Flow
- Home Screen: Product grid with search and filters
- Product Details: Full product information with reviews
- Cart Screen: Shopping cart with quantity management
- Checkout: Shipping and payment details

### User Management
- Profile Screen: User info and order history
- Order Confirmation: Success screen with order details

### Filters
- Category Filter: Advanced filtering by category, price, and rating

## 🐛 Troubleshooting

### Backend Issues

**MongoDB Connection Error**
- Ensure MongoDB is running
- Check connection string in `.env`
- For Atlas, verify IP whitelist and credentials

**Port Already in Use**
- Change PORT in `.env` to different number
- Or kill process using port 3000:
  - Windows: `netstat -ano | findstr :3000` then `taskkill /PID <PID> /F`
  - macOS/Linux: `lsof -ti:3000 | xargs kill`

### Frontend Issues

**Cannot Connect to Server**
- Verify backend is running
- Check API_URL matches your setup
- For physical device, ensure same WiFi network
- Disable firewall temporarily to test

**Expo Won't Start**
- Clear cache: `expo start -c`
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`

**App Crashes on Start**
- Check for JavaScript errors in Metro bundler
- Ensure all dependencies are installed
- Try: `expo doctor` to diagnose issues

## 🔒 Security Notes

- JWT tokens expire after 7 days
- Passwords are hashed with bcrypt (10 salt rounds)
- CORS is enabled for development
- For production, update JWT_SECRET and enable HTTPS
- Validate all user inputs on backend
- Use environment variables for sensitive data

## 📦 Project Structure

```
ecommerce-app/
├── Backend/
│   ├── models/           # Mongoose schemas
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Cart.js
│   │   └── Order.js
│   ├── routes/           # API routes
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── cart.js
│   │   ├── orders.js
│   │   └── user.js
│   ├── middleware/       # Custom middleware
│   │   └── auth.js
│   ├── server.js         # Express server
│   ├── seedData.js       # Database seeding script
│   ├── package.json
│   └── .env
│
└── frontend/
    ├── src/
    │   ├── screens/      # All screen components
    │   │   ├── LoginScreen.js
    │   │   ├── RegisterScreen.js
    │   │   ├── HomeScreen.js
    │   │   ├── ProductDetailsScreen.js
    │   │   ├── CartScreen.js
    │   │   ├── CheckoutScreen.js
    │   │   ├── OrderConfirmationScreen.js
    │   │   ├── ProfileScreen.js
    │   │   └── CategoryFilterScreen.js
    │   ├── navigation/   # Navigation setup
    │   │   └── AppNavigator.js
    │   ├── context/      # React Context
    │   │   ├── AuthContext.js
    │   │   └── CartContext.js
    │   └── services/     # API services
    │       └── api.js
    ├── App.js            # Root component
    ├── package.json
    └── app.json
```

## 🎓 Learning Outcomes

This project demonstrates:
- Full-stack mobile app development
- RESTful API design and implementation
- Database schema design with MongoDB
- User authentication with JWT
- State management with React Context
- Navigation in React Native
- Form validation and error handling
- Responsive UI design
- API integration
- Async operations and data fetching

## 📝 Development Notes

- The app uses React Native Paper for consistent Material Design UI
- All images are loaded from Unsplash URLs (free stock photos)
- Cart and authentication state persist across app restarts
- Pull-to-refresh updates product and order data
- Animated transitions enhance user experience
- Real-time cart badge updates

## 🚢 Future Enhancements

Potential features to add:
- Payment gateway integration (Stripe, PayPal)
- Push notifications for order updates
- Product image upload
- Advanced search with autocomplete
- Wishlist functionality
- Product ratings and detailed reviews
- Order tracking with map
- Social login (Google, Facebook)
- Multi-language support
- Dark mode theme

## 📄 License

This project is created for educational purposes.

## 👨‍💻 Author

Assignment A2 - E-Commerce Application

## 🙏 Acknowledgments

- Expo for the amazing development platform
- React Native Paper for beautiful UI components
- MongoDB for flexible database solution
- Unsplash for product images
- React Navigation for routing solution

---

**Note:** This is a demo application for learning purposes. For production use, additional security measures, error handling, and optimizations would be required.

