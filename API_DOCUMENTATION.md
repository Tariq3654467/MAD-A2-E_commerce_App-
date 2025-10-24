# API Documentation

Complete API reference for the E-Commerce Backend

**Base URL:** `http://localhost:3000/api`

---

## 🔐 Authentication

### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "1234567890",
  "address": "123 Main St, City, Country"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "address": "123 Main St, City, Country",
    "phone": "1234567890"
  }
}
```

### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "address": "123 Main St, City, Country",
    "phone": "1234567890"
  }
}
```

---

## 📦 Products

### Get All Products
```http
GET /api/products
```

**Query Parameters:**
- `category` - Filter by category (e.g., Electronics, Clothing)
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter
- `minRating` - Minimum rating filter
- `search` - Search in product name

**Examples:**
```http
GET /api/products?category=Electronics
GET /api/products?minPrice=50&maxPrice=200
GET /api/products?search=wireless
GET /api/products?minRating=4
```

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Wireless Headphones",
    "description": "Premium noise-cancelling wireless headphones...",
    "price": 199.99,
    "image_url": "https://images.unsplash.com/...",
    "category": "Electronics",
    "stock": 50,
    "rating": 4.5,
    "reviews": [
      {
        "user": "John Doe",
        "comment": "Great sound quality!",
        "rating": 5,
        "date": "2024-01-15T10:30:00.000Z"
      }
    ],
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### Get Single Product
```http
GET /api/products/:id
```

**Example:**
```http
GET /api/products/507f1f77bcf86cd799439011
```

**Response:** Same as single product object above

### Get Categories
```http
GET /api/products/categories/list
```

**Response:**
```json
[
  "Electronics",
  "Clothing",
  "Books",
  "Home & Garden",
  "Sports",
  "Toys",
  "Beauty"
]
```

### Add Product Review
```http
POST /api/products/:id/reviews
Content-Type: application/json

{
  "user": "John Doe",
  "comment": "Excellent product!",
  "rating": 5
}
```

**Response:** Updated product with new review

---

## 🛒 Cart (Requires Authentication)

**Note:** All cart endpoints require authentication. Include JWT token in header:
```http
Authorization: Bearer <token>
```

### Get User Cart
```http
GET /api/cart
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "user_id": "507f1f77bcf86cd799439011",
    "product_id": {
      "_id": "507f1f77bcf86cd799439013",
      "name": "Wireless Headphones",
      "price": 199.99,
      "image_url": "https://...",
      "category": "Electronics"
    },
    "quantity": 2,
    "addedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

### Add to Cart
```http
POST /api/cart/add
Authorization: Bearer <token>
Content-Type: application/json

{
  "product_id": "507f1f77bcf86cd799439013",
  "quantity": 1
}
```

**Response:** Cart item with populated product details

### Update Cart Item
```http
PUT /api/cart/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 3
}
```

**Example:**
```http
PUT /api/cart/507f1f77bcf86cd799439012
```

**Response:** Updated cart item

### Remove from Cart
```http
DELETE /api/cart/:id
Authorization: Bearer <token>
```

**Example:**
```http
DELETE /api/cart/507f1f77bcf86cd799439012
```

**Response:**
```json
{
  "message": "Item removed from cart"
}
```

### Clear Cart
```http
DELETE /api/cart/clear/all
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Cart cleared successfully"
}
```

---

## 📋 Orders (Requires Authentication)

### Get User Orders
```http
GET /api/orders
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439014",
    "user_id": "507f1f77bcf86cd799439011",
    "items": [
      {
        "product_id": "507f1f77bcf86cd799439013",
        "name": "Wireless Headphones",
        "quantity": 2,
        "price": 199.99,
        "image_url": "https://..."
      }
    ],
    "total_amount": 399.98,
    "status": "Pending",
    "shippingAddress": "123 Main St, City, Country",
    "paymentMethod": "Credit Card",
    "order_date": "2024-01-15T10:30:00.000Z",
    "estimatedDelivery": "2024-01-22T10:30:00.000Z"
  }
]
```

### Get Single Order
```http
GET /api/orders/:id
Authorization: Bearer <token>
```

**Example:**
```http
GET /api/orders/507f1f77bcf86cd799439014
```

**Response:** Single order object

### Create Order
```http
POST /api/orders/create
Authorization: Bearer <token>
Content-Type: application/json

{
  "shippingAddress": "123 Main St, City, Country",
  "paymentMethod": "Credit Card"
}
```

**Note:** This automatically creates an order from current cart items

**Response:** Created order object

### Update Order Status
```http
PUT /api/orders/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "Shipped"
}
```

**Valid Status Values:**
- `Pending`
- `Processing`
- `Shipped`
- `Delivered`
- `Cancelled`

**Response:** Updated order object

---

## 👤 User Profile (Requires Authentication)

### Get User Profile
```http
GET /api/user/profile
Authorization: Bearer <token>
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "address": "123 Main St, City, Country",
  "phone": "1234567890",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### Update User Profile
```http
PUT /api/user/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Updated",
  "address": "456 New St, City, Country",
  "phone": "9876543210"
}
```

**Response:** Updated user object (without password)

---

## 🧪 Testing with cURL

### Register
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "test123",
    "phone": "1234567890",
    "address": "123 Test St"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }'
```

### Get Products
```bash
curl http://localhost:3000/api/products
```

### Get Products by Category
```bash
curl "http://localhost:3000/api/products?category=Electronics"
```

### Add to Cart (requires token)
```bash
TOKEN="your_token_here"

curl -X POST http://localhost:3000/api/cart/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "product_id": "507f1f77bcf86cd799439013",
    "quantity": 1
  }'
```

### Get Cart
```bash
curl http://localhost:3000/api/cart \
  -H "Authorization: Bearer $TOKEN"
```

### Create Order
```bash
curl -X POST http://localhost:3000/api/orders/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "shippingAddress": "123 Main St",
    "paymentMethod": "Credit Card"
  }'
```

---

## 📊 Response Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (missing/invalid token) |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## 🔒 Authentication Headers

For all protected routes, include the JWT token:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Token expires after 7 days. User needs to login again after expiry.

---

## 💡 Tips

1. **Save your token** after login/register for authenticated requests
2. **Product IDs** are MongoDB ObjectIds (24 character hex string)
3. **Dates** are in ISO 8601 format
4. **Prices** are in USD as decimal numbers
5. **Stock** is updated automatically when orders are created

---

## 🧩 Postman Collection

You can import these endpoints into Postman:

1. Create new collection "E-Commerce API"
2. Add requests for each endpoint
3. Set up environment variable for `{{token}}`
4. Use collection variable for `{{baseUrl}}` = `http://localhost:3000/api`

---

## 📞 Need Help?

- Check server logs for detailed error messages
- Verify MongoDB connection
- Ensure all required fields are provided
- Check token expiry for 401 errors

---

**Happy API Testing! 🚀**

