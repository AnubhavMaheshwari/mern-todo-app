# Deployment Guide - Vercel Serverless

## Quick Setup

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Set Environment Variables on Vercel**:
   ```bash
   vercel env add MONGODB_URI
   # Paste your MongoDB Atlas connection string when prompted
   
   vercel env add CORS_ORIGIN
   # Enter your frontend URL (e.g., https://your-app.vercel.app)
   ```

4. **Deploy**:
   ```bash
   vercel --prod
   ```

## What Changed

- ✅ Created `vercel.json` for serverless configuration
- ✅ Modified `server.js` to export app for Vercel
- ✅ Server still works locally for development
- ✅ Backend will run as serverless functions on Vercel

## Frontend Environment Variable

After deploying backend, update your frontend `.env`:
```
VITE_API_URL=https://your-backend.vercel.app/api
```

## Common Issues

**"Serverless Function has crashed":**
- Check environment variables are set on Vercel
- Verify MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
- Check Vercel logs: `vercel logs`

**CORS errors:**
- Update CORS_ORIGIN environment variable on Vercel with your frontend URL
