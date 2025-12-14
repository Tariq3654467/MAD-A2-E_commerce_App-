# Vercel Deployment Guide

This guide will help you deploy the E-Commerce Backend API to Vercel.

## Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com))
2. Vercel CLI installed (optional, for CLI deployment)
3. MongoDB connection string

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard

1. **Push your code to GitHub/GitLab/Bitbucket**
   - Make sure your `Backend` folder is in your repository

2. **Import Project to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your repository
   - **Important**: Set the **Root Directory** to `Backend` (not the project root)
   - Click "Deploy"

3. **Configure Environment Variables**
   - In your Vercel project settings, go to "Environment Variables"
   - Add the following variables:
     - `MONGODB_URI`: Your MongoDB connection string
     - `JWT_SECRET`: Your JWT secret key for token signing
     - `NODE_ENV`: Set to `production`

4. **Redeploy**
   - After adding environment variables, trigger a new deployment

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Navigate to Backend directory**
   ```bash
   cd Backend
   ```

3. **Login to Vercel**
   ```bash
   vercel login
   ```

4. **Deploy**
   ```bash
   vercel
   ```
   - Follow the prompts
   - When asked for the root directory, confirm it's the current directory

5. **Set Environment Variables**
   ```bash
   vercel env add MONGODB_URI
   vercel env add JWT_SECRET
   vercel env add NODE_ENV production
   ```

6. **Deploy to Production**
   ```bash
   vercel --prod
   ```

## Environment Variables Required

Make sure to set these in your Vercel project settings:

- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token signing (use a strong random string)
- `NODE_ENV`: Set to `production`

## API Endpoints

After deployment, your API will be available at:
- `https://your-project-name.vercel.app/`
- `https://your-project-name.vercel.app/api/auth`
- `https://your-project-name.vercel.app/api/products`
- `https://your-project-name.vercel.app/api/cart`
- `https://your-project-name.vercel.app/api/orders`
- `https://your-project-name.vercel.app/api/user`
- `https://your-project-name.vercel.app/api/chatbot`

## Important Notes

1. **Root Directory**: When deploying, make sure to set the root directory to `Backend` folder, not the project root.

2. **Cold Starts**: Serverless functions may experience cold starts. The MongoDB connection is optimized to reuse existing connections.

3. **Function Timeout**: Vercel's free tier has a 10-second timeout for serverless functions on the Hobby plan. Consider upgrading if you need longer execution times.

4. **Database Connection**: Ensure your MongoDB Atlas cluster allows connections from Vercel's IP addresses (or set IP whitelist to 0.0.0.0/0 for development).

## Troubleshooting

- **Build Errors**: Check that all dependencies are listed in `package.json`
- **Connection Errors**: Verify your `MONGODB_URI` is correct and MongoDB allows connections
- **404 Errors**: Ensure the `vercel.json` configuration is correct
- **CORS Issues**: The CORS middleware is already configured, but verify your frontend URL is allowed

## Seeding the Database

**IMPORTANT**: If products are not loading, the database might be empty. You need to seed it with sample data.

### Option 1: Seed Locally (Recommended)

1. **Set up environment variables locally:**
   ```bash
   cd Backend
   # Create .env file with your MONGODB_URI
   echo "MONGODB_URI=your_mongodb_connection_string" > .env
   ```

2. **Run the seed script:**
   ```bash
   npm run seed
   ```

   This will populate your database with sample products.

### Option 2: Seed via API Endpoint (Alternative)

You can create a temporary seed endpoint in your backend for one-time seeding, then remove it after use.

## Testing the Deployment

After deployment, test your API:

```bash
# Test root endpoint
curl https://your-project-name.vercel.app/

# Test products endpoint
curl https://your-project-name.vercel.app/api/products
```

You should receive:
- Root: `{"message":"E-Commerce API Server is running!"}`
- Products: An array of products (may be empty if not seeded)

