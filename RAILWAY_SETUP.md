# Railway MySQL Setup Guide

## Getting Your Railway MySQL Credentials

1. Go to your Railway dashboard
2. Click on your MySQL database service
3. Go to the **Variables** tab
4. You'll see these environment variables automatically created:
   - `MYSQL_URL` (connection string)
   - OR individual variables:
     - `MYSQLHOST`
     - `MYSQLUSER`
     - `MYSQLPASSWORD`
     - `MYSQLDATABASE`
     - `MYSQLPORT`

## Setting Up Your .env File

### Option 1: Use Railway Connection String (Recommended)

Create `backend/.env` or root `.env`:

```env
# Railway automatically provides MYSQL_URL, but you can also use it locally
MYSQL_URL=mysql://user:password@host:port/database

# OR copy the individual variables from Railway:
MYSQLHOST=your-railway-host
MYSQLUSER=your-railway-user
MYSQLPASSWORD=your-railway-password
MYSQLDATABASE=railway
MYSQLPORT=3306

# Server Configuration
PORT=3000
NODE_ENV=development

# Frontend URL
FRONTEND_URL=http://localhost:3001
```

### Option 2: Use Custom Variable Names

If you prefer custom names, create `backend/.env`:

```env
# Copy values from Railway Variables tab
DB_HOST=your-railway-host
DB_USER=your-railway-user
DB_PASSWORD=your-railway-password
DB_NAME=railway
DB_PORT=3306

PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:3001
```

## How to Get Connection Details from Railway

1. In Railway dashboard, go to your MySQL service
2. Click on **Variables** tab
3. Copy the values for:
   - `MYSQLHOST` → Use as `DB_HOST`
   - `MYSQLUSER` → Use as `DB_USER`
   - `MYSQLPASSWORD` → Use as `DB_PASSWORD`
   - `MYSQLDATABASE` → Use as `DB_NAME`
   - `MYSQLPORT` → Use as `DB_PORT`

## For Production Deployment on Render

When deploying backend to Render, add these environment variables in Render dashboard:

1. Copy all the Railway MySQL variables from Railway dashboard
2. Add them to Render → Environment Variables:
   - `MYSQLHOST` or `DB_HOST`
   - `MYSQLUSER` or `DB_USER`
   - `MYSQLPASSWORD` or `DB_PASSWORD`
   - `MYSQLDATABASE` or `DB_NAME`
   - `MYSQLPORT` or `DB_PORT` (usually 3306)
   - `FRONTEND_URL` (your Vercel URL)
   - `NODE_ENV=production`
   - `PORT=10000`

## Testing Connection

After setting up your .env file:

1. Make sure your `.env` file is in the root directory or `backend/.env`
2. Restart your server
3. You should see: "Connected to MySQL database successfully"
4. Check the console for any connection errors

## Troubleshooting

- **"Missing required database configuration"**: Make sure all DB variables are set in .env
- **"Access denied"**: Double-check your Railway credentials
- **"Can't connect to server"**: Verify Railway MySQL service is running and accessible

