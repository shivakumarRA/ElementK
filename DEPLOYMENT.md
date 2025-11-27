# Deployment Guide

This application is set up to deploy the frontend on **Vercel** and the backend on **Render**.

## Prerequisites

1. **GitHub Account** - Your code should be in a GitHub repository
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
3. **Render Account** - Sign up at [render.com](https://render.com)
4. **MySQL Database** - You can use:
   - Render's MySQL service (recommended)
   - PlanetScale
   - AWS RDS
   - Any other MySQL hosting service

## Database Setup

### Option 1: Render MySQL (Recommended)
1. Go to Render Dashboard
2. Click "New +" → "PostgreSQL" (or "MySQL" if available)
3. Create a new database
4. Note the connection details (host, user, password, database name, port)

### Option 2: PlanetScale
1. Sign up at [planetscale.com](https://planetscale.com)
2. Create a new database
3. Get connection details from the dashboard

## Backend Deployment on Render

1. **Connect Repository**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure Service**
   - **Name**: `inventory-backend` (or your preferred name)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (or paid if you need more resources)

3. **Set Environment Variables**
   Go to Environment tab and add:
   ```
   NODE_ENV=production
   PORT=10000
   DB_HOST=<your-database-host>
   DB_USER=<your-database-user>
   DB_PASSWORD=<your-database-password>
   DB_NAME=inventory_db
   DB_PORT=3306
   FRONTEND_URL=https://your-app.vercel.app
   ```
   (Note: Update FRONTEND_URL after deploying frontend)

4. **Deploy**
   - Click "Create Web Service"
   - Render will build and deploy your backend
   - Note the service URL (e.g., `https://inventory-backend.onrender.com`)

## Frontend Deployment on Vercel

1. **Connect Repository**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New..." → "Project"
   - Import your GitHub repository

2. **Configure Project**
   - **Framework Preset**: Create React App
   - **Root Directory**: `./frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`

3. **Set Environment Variables**
   Go to Settings → Environment Variables and add:
   ```
   REACT_APP_API_URL=https://your-backend.onrender.com
   ```
   (Replace with your actual Render backend URL)

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your frontend
   - Note your deployment URL (e.g., `https://your-app.vercel.app`)

5. **Update Backend CORS**
   - Go back to Render dashboard
   - Update `FRONTEND_URL` environment variable with your Vercel URL
   - Redeploy the backend service

## Database Schema

Make sure your MySQL database has the following tables:

```sql
CREATE TABLE IF NOT EXISTS invoices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  subtotal DECIMAL(10, 2) NOT NULL,
  coupon_code VARCHAR(50) NULL,
  discount_percent DECIMAL(5, 2) DEFAULT 0,
  discount_amount DECIMAL(10, 2) DEFAULT 0,
  final_price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS invoice_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  invoice_id INT NOT NULL,
  item_name VARCHAR(255) NOT NULL,
  quantity DECIMAL(10, 2) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS coupons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  discount_percent DECIMAL(5, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Testing

1. **Backend**: Visit `https://your-backend.onrender.com/invoice` - should return JSON
2. **Frontend**: Visit your Vercel URL and test creating/viewing invoices

## Troubleshooting

### CORS Errors
- Ensure `FRONTEND_URL` in Render matches your exact Vercel URL (including `https://`)
- Check that backend CORS middleware is properly configured

### Database Connection Errors
- Verify all database environment variables are set correctly in Render
- Check that your database allows connections from Render's IP addresses
- For PlanetScale, ensure you're using the correct connection string format

### API Not Working
- Check that `REACT_APP_API_URL` is set in Vercel environment variables
- Verify the backend URL is accessible (visit it in browser)
- Check browser console for any error messages

## Notes

- Render free tier services spin down after 15 minutes of inactivity (first request may be slow)
- Vercel has excellent free tier for frontend hosting
- Consider using environment-specific configurations for development vs production

