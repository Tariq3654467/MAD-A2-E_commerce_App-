# How to Seed Database for Vercel Deployment

## Why Seed Data Doesn't Auto-Deploy

When you deploy to Vercel, the `seedData.js` script is **not automatically run**. Vercel only deploys your API code, not scripts that need to be executed separately.

## Solution: Two Easy Options

### ✅ Option 1: Run Seed Script Locally (Easiest)

Since your local environment and Vercel both connect to the **same MongoDB database**, you can simply run the seed script locally:

```bash
cd Backend
npm run seed
```

This will populate your MongoDB database with 47 sample products, which will immediately be available on your Vercel deployment!

**Why this works:** Both your local machine and Vercel use the same `MONGODB_URI`, so seeding locally populates the database that Vercel reads from.

### ✅ Option 2: Use the Seed API Endpoint

A secure seed endpoint is available at `/api/seed`:

1. **Set environment variable in Vercel:**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add: `SEED_SECRET_KEY` = `your-secret-key-here` (use a strong random string)
   - Redeploy your application

2. **Call the seed endpoint:**
   ```bash
   curl -X POST https://commerce-app-ashy.vercel.app/api/seed \
     -H "Content-Type: application/json" \
     -H "x-seed-key: your-secret-key-here" \
     -d '{"secretKey": "your-secret-key-here"}'
   ```

   Or use Postman/Insomnia:
   - **Method:** POST
   - **URL:** `https://commerce-app-ashy.vercel.app/api/seed`
   - **Headers:** 
     - `x-seed-key: your-secret-key-here`
   - **Body (JSON):**
     ```json
     {
       "secretKey": "your-secret-key-here"
     }
     ```

3. **Verify it worked:**
   ```bash
   curl https://commerce-app-ashy.vercel.app/api/products
   ```
   You should see an array of products.

## Quick Start (Recommended)

**Just run this locally:**
```bash
cd Backend
npm run seed
```

That's it! Your Vercel deployment will now have products because they're using the same database.

## Troubleshooting

- **No products showing?** Make sure you ran the seed script and it completed successfully.
- **Connection error?** Verify your `MONGODB_URI` in the seed script matches your Vercel environment variable.
- **Still empty?** Check that both local and Vercel are using the same MongoDB database (same connection string).

