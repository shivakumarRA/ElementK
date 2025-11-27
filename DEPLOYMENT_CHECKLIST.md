# Deployment Checklist

## ✅ Pre-Deployment Checks

- [x] Database configuration uses environment variables
- [x] CORS middleware added to backend
- [x] API configuration utility created for frontend
- [x] All frontend API calls updated to use API config
- [x] Vercel configuration file created
- [x] Render configuration file created
- [x] Environment variable documentation created

## 📋 Deployment Steps

### 1. Database Setup
- [ ] Create MySQL database (Render, PlanetScale, or other)
- [ ] Run database schema (see DEPLOYMENT.md)
- [ ] Note connection credentials

### 2. Backend on Render
- [ ] Connect GitHub repository to Render
- [ ] Create new Web Service
- [ ] Set build command: `npm install`
- [ ] Set start command: `npm start`
- [ ] Add environment variables (see ENV_VARIABLES.md)
- [ ] Deploy and note the backend URL

### 3. Frontend on Vercel
- [ ] Connect GitHub repository to Vercel
- [ ] Set root directory: `frontend` (if needed)
- [ ] Add environment variable: `REACT_APP_API_URL` = your Render backend URL
- [ ] Deploy and note the frontend URL

### 4. Final Configuration
- [ ] Update Render environment variable: `FRONTEND_URL` = your Vercel URL
- [ ] Redeploy backend on Render (to apply CORS settings)

### 5. Testing
- [ ] Test backend: Visit `https://your-backend.onrender.com/invoice` (should return JSON)
- [ ] Test frontend: Visit Vercel URL and create an invoice
- [ ] Verify API connectivity between frontend and backend
- [ ] Test all CRUD operations (Create, Read, Update, Delete)

## 🔍 Troubleshooting

If you encounter issues:
1. Check environment variables are set correctly
2. Verify database connection details
3. Check CORS settings match your Vercel URL exactly
4. Review Render and Vercel deployment logs
5. See DEPLOYMENT.md for detailed troubleshooting

