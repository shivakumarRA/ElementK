# Environment Variables

## Backend (Render)

Set these in Render dashboard under your service → Environment tab:

```bash
NODE_ENV=production
PORT=10000
DB_HOST=your-database-host
DB_USER=your-database-user
DB_PASSWORD=your-database-password
DB_NAME=inventory_db
DB_PORT=3306
FRONTEND_URL=https://your-app.vercel.app
```

## Frontend (Vercel)

Set these in Vercel dashboard under Project Settings → Environment Variables:

```bash
REACT_APP_API_URL=https://your-backend.onrender.com
```

**Important**: Replace `your-backend.onrender.com` with your actual Render backend URL after deployment.

