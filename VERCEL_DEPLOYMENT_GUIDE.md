# Frontend Deployment Guide for Vercel

This guide will walk you through deploying your React frontend to Vercel.

## Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com) - free tier available)
2. Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)
3. Your backend deployed on Render (URL: `https://elementk.onrender.com`)

## Step-by-Step Deployment Process

### Step 1: Prepare Your Repository

1. **Ensure your code is committed and pushed to Git:**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

### Step 2: Deploy to Vercel

#### Option A: Using Vercel Dashboard (Recommended)

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**
2. **Click "Add New..." → "Project"**
3. **Import your Git repository:**
   - Connect your GitHub/GitLab/Bitbucket account if not already connected
   - Select your repository (`ElementK`)
   - Click "Import"

4. **Configure Project Settings:**
   - **Framework Preset**: Leave as "Other" or "Create React App"
   - **Root Directory**: Leave **empty** (or set to `frontend` if you want to deploy only frontend)
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Output Directory**: `frontend/build`
   - **Install Command**: `cd frontend && npm install`

   **OR if Root Directory is set to `frontend`:**
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`

5. **Add Environment Variables:**
   - Click "Environment Variables"
   - Add the following:
     ```
     REACT_APP_API_URL=https://elementk.onrender.com
     ```
   - Make sure to select all environments (Production, Preview, Development)

6. **Click "Deploy"**
7. **Wait for deployment to complete** (usually 2-3 minutes)

#### Option B: Using Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy from project root:**
   ```bash
   vercel
   ```

4. **Follow the prompts:**
   - Set up and deploy? **Yes**
   - Which scope? (Select your account)
   - Link to existing project? **No** (first time) or **Yes** (subsequent deployments)
   - What's your project's name? `elementk-frontend` (or your choice)
   - In which directory is your code located? `./frontend` or `.` (depending on setup)

5. **Set environment variables:**
   ```bash
   vercel env add REACT_APP_API_URL
   # Enter: https://elementk.onrender.com
   # Select: Production, Preview, Development
   ```

6. **Deploy to production:**
   ```bash
   vercel --prod
   ```

### Step 3: Verify Deployment

1. **Once deployed, you'll get a URL like:**
   - Production: `https://elementk-frontend.vercel.app`
   - Preview: `https://elementk-frontend-xxxxx.vercel.app`

2. **Test your application:**
   - Open the URL in your browser
   - Test creating an invoice
   - Verify API calls are working (check browser console)

3. **Check API connectivity:**
   - Open browser DevTools → Network tab
   - Verify requests are going to `https://elementk.onrender.com`

## Configuration Details

### Root Directory Options

You have two options for Root Directory:

#### Option 1: Empty Root Directory (Current Setup)
- **Root Directory**: (empty/blank)
- **Build Command**: `cd frontend && npm install && npm run build`
- **Output Directory**: `frontend/build`
- **Install Command**: `cd frontend && npm install`

**Pros:**
- Works with monorepo structure
- Keeps both frontend and backend in same repo

#### Option 2: Frontend as Root Directory
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `build`
- **Install Command**: `npm install`

**Pros:**
- Simpler configuration
- Vercel auto-detects React app better

**Recommendation:** Use **Option 1** (empty root) since your `vercel.json` is already configured for it.

### Environment Variables

Required environment variable:
```
REACT_APP_API_URL=https://elementk.onrender.com
```

**Important Notes:**
- React requires `REACT_APP_` prefix for environment variables
- These variables are embedded at build time
- You need to redeploy after changing environment variables

### CORS Configuration

Make sure your backend on Render has CORS configured to allow your Vercel domain:
- Your backend should allow: `https://your-app.vercel.app`
- Update `FRONTEND_URL` in Render backend environment variables

## Updating Your Deployment

### Automatic Deployments
- Vercel automatically deploys on every push to your main branch
- Preview deployments are created for pull requests

### Manual Updates
1. **Make changes to your code**
2. **Commit and push:**
   ```bash
   git add .
   git commit -m "Update frontend"
   git push origin main
   ```
3. **Vercel will automatically detect and deploy**

### Updating Environment Variables
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Edit or add variables
3. Click "Redeploy" to apply changes

## Custom Domain (Optional)

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Vercel automatically provisions SSL certificates

## Troubleshooting

### Build Fails
- **Check build logs** in Vercel dashboard
- **Verify Node.js version** (Vercel uses Node 18.x by default)
- **Check for missing dependencies** in `package.json`
- **Ensure build command is correct**

### API Calls Not Working
- **Verify `REACT_APP_API_URL`** is set correctly in Vercel
- **Check browser console** for CORS errors
- **Verify backend URL** is accessible: `https://elementk.onrender.com`
- **Check backend CORS** configuration allows your Vercel domain

### 404 Errors on Routes
- **Verify `vercel.json`** has rewrites configured
- **Check that `rewrites`** point to `/index.html`
- **Ensure React Router** is configured correctly

### Environment Variables Not Working
- **Redeploy after adding variables** (they're embedded at build time)
- **Check variable name** starts with `REACT_APP_`
- **Verify variable is set** for correct environment (Production/Preview/Development)

## Vercel Configuration File

Your `vercel.json` is already configured correctly:

```json
{
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/build",
  "installCommand": "cd frontend && npm install",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This configuration:
- ✅ Builds from the frontend directory
- ✅ Outputs to `frontend/build`
- ✅ Handles React Router routing (SPA rewrites)

## Quick Reference

| Setting | Value |
|---------|-------|
| **Root Directory** | (empty) or `frontend` |
| **Build Command** | `cd frontend && npm install && npm run build` |
| **Output Directory** | `frontend/build` |
| **Install Command** | `cd frontend && npm install` |
| **Environment Variable** | `REACT_APP_API_URL=https://elementk.onrender.com` |

## Next Steps

1. ✅ Deploy frontend to Vercel
2. ✅ Set environment variables
3. ✅ Update backend CORS to allow Vercel domain
4. ✅ Test the full application
5. ⭐ (Optional) Set up custom domain
6. ⭐ (Optional) Configure preview deployments
7. ⭐ (Optional) Set up analytics

## Support

- Vercel Documentation: https://vercel.com/docs
- Vercel Community: https://github.com/vercel/vercel/discussions
- Check deployment logs in Vercel dashboard for debugging

