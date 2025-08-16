# Render Deployment Instructions

## 🚀 Deploy Ghana Bus Ticket System to Render

### Step 1: Prepare Your Repository

1. **Push all files to GitHub:**
   ```bash
   git add .
   git commit -m "Add Docker configuration for Render deployment"
   git push origin main
   ```

### Step 2: Create Render Account

1. Go to [render.com](https://render.com)
2. Sign up with your GitHub account
3. Authorize Render to access your repositories

### Step 3: Deploy on Render

1. **Click "New +" → "Web Service"**

2. **Connect Repository:**
   - Select your GBTS repository
   - Click "Connect"

3. **Configure Service:**
   - **Name:** `gbts-bus-booking-app`
   - **Environment:** `Docker`
   - **Region:** `Oregon (US West)` or closest to your users
   - **Branch:** `main`
   - **Dockerfile Path:** `./Dockerfile`

4. **Advanced Settings:**
   - **Auto-Deploy:** `Yes` (deploys on every push)
   - **Health Check Path:** `/`

5. **Environment Variables (Optional):**
   ```
   NODE_ENV=production
   PORT=3000
   VITE_APP_NAME=Ghana Bus Ticket System
   ```

6. **Click "Create Web Service"**

### Step 4: Monitor Deployment

1. **Watch the build logs** in real-time
2. **Build time:** ~3-5 minutes
3. **Your app will be available at:** `https://your-app-name.onrender.com`

### Step 5: Custom Domain (Optional)

1. Go to **Settings** → **Custom Domains**
2. Add your domain (e.g., `gbts.yourcompany.com`)
3. Update your DNS records as instructed

## 🔧 Render Configuration Details

### Automatic Features:
- ✅ **HTTPS/SSL** - Automatic SSL certificates
- ✅ **CDN** - Global content delivery
- ✅ **Health Checks** - Automatic container monitoring
- ✅ **Auto-scaling** - Handles traffic spikes
- ✅ **Zero-downtime deploys** - Rolling updates

### Free Tier Limitations:
- 🕐 **Sleep after 15 min** of inactivity
- 💾 **512MB RAM** limit
- 🔄 **750 hours/month** (enough for most apps)

### Production Recommendations:
- Upgrade to **Starter Plan** ($7/month) for:
  - No sleeping
  - More resources
  - Better performance

## 🐛 Troubleshooting

### Build Fails:
```bash
# Check your Dockerfile syntax
docker build -t test-build .
```

### App Won't Start:
- Check environment variables
- Verify port 3000 is exposed
- Review build logs in Render dashboard

### Slow Performance:
- Consider upgrading to paid plan
- Optimize Docker image size
- Enable caching

## 📱 Testing Your Deployment

1. **Visit your Render URL**
2. **Test all features:**
   - Login functionality
   - Booking tickets
   - Seat selection/auto-assignment
   - Payment methods
   - Dashboard analytics

## 🔄 Updates & Maintenance

### Deploy Updates:
```bash
git add .
git commit -m "Update feature X"
git push origin main
# Render automatically deploys!
```

### Monitor Performance:
- Use Render dashboard for metrics
- Check application logs
- Monitor response times

Your Ghana Bus Ticket System is now live! 🎉