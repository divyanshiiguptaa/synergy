# Deployment Guide - Synergy App

This guide will help you deploy your Synergy app to Netlify for free.

## Prerequisites

1. **GitHub Account**: Your code should be pushed to a GitHub repository
2. **Netlify Account**: Sign up at [netlify.com](https://www.netlify.com/)
3. **Mapbox Access Token**: Get your token from [mapbox.com](https://www.mapbox.com/)

## Step 1: Prepare Your Repository

Make sure your code is committed and pushed to GitHub:

```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

## Step 2: Deploy to Netlify

### Option A: Deploy via Netlify UI (Recommended)

1. **Go to Netlify Dashboard**
   - Visit [app.netlify.com](https://app.netlify.com/)
   - Sign in with your GitHub account

2. **Create New Site**
   - Click **"Add new site"**
   - Select **"Import an existing project"**
   - Choose **GitHub** as your Git provider
   - Authorize Netlify to access your repositories

3. **Select Your Repository**
   - Find and select your `synergy` repository
   - Click **"Deploy site"**

4. **Configure Build Settings**
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - Click **"Deploy site"**

### Option B: Deploy via Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Deploy**
   ```bash
   netlify deploy --prod
   ```

## Step 3: Configure Environment Variables

After your site is deployed, you need to set up environment variables:

1. **Go to Site Settings**
   - In your Netlify dashboard, go to your site
   - Click **"Site settings"** → **"Environment variables"**

2. **Add Required Variables**
   ```
   VITE_MAPBOX_ACCESS_TOKEN=your_actual_mapbox_token_here
   VITE_APP_TITLE=Synergy - LA Infrastructure Analysis
   VITE_APP_DESCRIPTION=Visualizing Capital Improvement Projects and EV Chargers in Los Angeles
   ```

3. **Trigger a New Deploy**
   - Go to **"Deploys"** tab
   - Click **"Trigger deploy"** → **"Deploy site"**

## Step 4: Verify Deployment

1. **Check Your Site**
   - Your site will be available at `https://your-site-name.netlify.app`
   - Test all functionality: map loading, layer toggles, filters, etc.

2. **Check Build Logs**
   - If there are issues, check the build logs in the **"Deploys"** tab
   - Common issues: missing environment variables, build errors

## Environment Variables Reference

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `VITE_MAPBOX_ACCESS_TOKEN` | Your Mapbox access token | ✅ Yes | Fallback token |
| `VITE_APP_TITLE` | App title in browser | ❌ No | "Synergy - LA Infrastructure Analysis" |
| `VITE_APP_DESCRIPTION` | App description | ❌ No | "Visualizing Capital Improvement Projects..." |
| `VITE_ENABLE_EXPORT` | Enable export functionality | ❌ No | true |
| `VITE_ENABLE_FILTERS` | Enable filter functionality | ❌ No | true |

## Troubleshooting

### Build Fails
- Check that all dependencies are in `package.json`
- Verify Node.js version (18+ recommended)
- Check build logs for specific errors

### Map Not Loading
- Verify `VITE_MAPBOX_ACCESS_TOKEN` is set correctly
- Check browser console for Mapbox errors
- Ensure the token has the correct permissions

### Environment Variables Not Working
- Variables must start with `VITE_` to be exposed to the client
- Redeploy after adding environment variables
- Check that variables are set in the correct environment (production)

### Performance Issues
- Check that static assets are being cached properly
- Verify that the `dist` folder contains all necessary files
- Consider enabling Netlify's CDN features

## Custom Domain (Optional)

1. **Add Custom Domain**
   - Go to **"Domain settings"** in your site dashboard
   - Click **"Add custom domain"**
   - Follow the DNS configuration instructions

2. **SSL Certificate**
   - Netlify automatically provides SSL certificates
   - No additional configuration needed

## Continuous Deployment

By default, Netlify will automatically deploy when you push to your main branch. To configure:

1. **Go to Site Settings** → **"Build & deploy"**
2. **Configure build settings** if needed
3. **Set up branch deploys** for different environments

## Support

If you encounter issues:
1. Check the [Netlify documentation](https://docs.netlify.com/)
2. Review build logs in your Netlify dashboard
3. Check browser console for client-side errors
4. Verify all environment variables are set correctly

---

**Your app is now ready for production!** 🚀 