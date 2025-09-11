# Vercel Deployment Guide

## ✅ Fixed Issues

The 500 INTERNAL_SERVER_ERROR on Vercel has been fixed with the following changes:

### 1. **Serverless Configuration**
- Added `vercel.json` configuration for proper serverless routing
- Created `api/index.ts` as the serverless function handler
- Added `@vercel/node` dependency for Vercel runtime support

### 2. **App Class Serverless Compatibility**
- Modified `App` class to detect serverless environment
- Added public `connectDatabase()` method for serverless initialization
- Optimized middleware for serverless (disabled rate limiting, reduced logging)
- Added proper error handling for serverless environment

### 3. **Database Connection Optimization**
- Added connection caching to prevent connection churn in serverless
- Optimized connection pool size for serverless (5 vs 10 connections)
- Faster timeouts for serverless environment (3s vs 5s)
- Proper connection status checking before connecting
- Added environment-specific error handling

### 4. **Environment Validation**
- Added basic environment variable validation in serverless handler
- Better error messages for missing configuration

## 🚀 Deployment Steps

### 1. **Environment Variables in Vercel**
Make sure to set these environment variables in your Vercel dashboard:

```bash
# Database
MONGODB_URI=mongodb+srv://your-connection-string

# JWT
JWT_SECRET=your-jwt-secret-here

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,http://localhost:5173

# Cloudinary (if using file uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Environment
NODE_ENV=production
```

### 2. **Deploy to Vercel**
```bash
# Deploy to Vercel
vercel --prod
```

### 3. **Test Your API**
After deployment, your API will be available at:
- Health check: `https://your-app.vercel.app/health`
- API base: `https://your-app.vercel.app/api/v1/`
- Make endpoints: `https://your-app.vercel.app/api/v1/makes`

## 📝 Key Changes Made

1. **src/app.ts**: Added serverless constructor parameter, database connection method, environment detection
2. **api/index.ts**: Created Vercel serverless function handler with caching and error handling
3. **src/config/database.ts**: Optimized for serverless with connection caching and better timeouts
4. **vercel.json**: Added serverless configuration with proper rewrites
5. **package.json**: Added vercel-build script

## 🔧 Testing Locally

To test the serverless setup locally:
```bash
# Install Vercel CLI if not installed
npm i -g vercel

# Start local development
vercel dev
```

## 📋 Environment Variables Checklist

Make sure these are set in Vercel dashboard:
- [ ] MONGODB_URI
- [ ] JWT_SECRET  
- [ ] ALLOWED_ORIGINS
- [ ] NODE_ENV=production
- [ ] CLOUDINARY_* (if using file uploads)

Your Royal Drive Backend should now deploy successfully to Vercel! 🎉
