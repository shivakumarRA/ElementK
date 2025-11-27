# Sample Environment Files

Since `.env` files are gitignored, copy the examples below to create your `.env` files.

## Backend (.env)

Create `backend/.env` with the following:

```env
# Database Configuration
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=inventory_db
DB_PORT=3306

# Server Configuration
PORT=3000
NODE_ENV=development

# Frontend URL (for CORS)
# Leave empty for local development or set your production frontend URL
FRONTEND_URL=
```

## Frontend (.env)

Create `frontend/.env` with the following:

```env
# Backend API URL
# In development, leave empty to use proxy
# In production, set to your Render backend URL
REACT_APP_API_URL=
```

## For Production Deployment

### Render (Backend)
Set these in Render dashboard → Environment tab:
```env
NODE_ENV=production
PORT=10000
DB_HOST=your-database-host
DB_USER=your-database-user
DB_PASSWORD=your-database-password
DB_NAME=inventory_db
DB_PORT=3306
FRONTEND_URL=https://your-app.vercel.app
```

### Vercel (Frontend)
Set this in Vercel dashboard → Environment Variables:
```env
REACT_APP_API_URL=https://your-backend.onrender.com
```

See `ENV_VARIABLES.md` for more details.

