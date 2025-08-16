# Docker Deployment Guide

## Ghana Bus Ticket System (GBTS) - Docker Setup

### Quick Start

1. **Build and run with Docker Compose:**
   ```bash
   docker-compose up --build
   ```

2. **Or build and run manually:**
   ```bash
   # Build the image
   docker build -t gbts-app .
   
   # Run the container
   docker run -p 3000:3000 --name gbts-container gbts-app
   ```

3. **Access the application:**
   Open your browser to `http://localhost:3000`

### Render Deployment

1. **Connect your GitHub repository to Render**
2. **Create a new Web Service**
3. **Use the following settings:**
   - **Environment:** Docker
   - **Dockerfile Path:** `./Dockerfile`
   - **Build Command:** (leave empty - Docker handles this)
   - **Start Command:** (leave empty - Docker handles this)

4. **Environment Variables (optional):**
   ```
   NODE_ENV=production
   PORT=3000
   ```

### Production Features

- ✅ Multi-stage Docker build for smaller image size
- ✅ Non-root user for security
- ✅ Health checks for container monitoring
- ✅ Proper signal handling with dumb-init
- ✅ Production-optimized Vite build
- ✅ Static file serving

### Container Details

- **Base Image:** node:18-alpine
- **Port:** 3000
- **Health Check:** HTTP GET on /
- **User:** Non-root (nextjs:nodejs)
- **Size:** ~150MB (optimized)

### Troubleshooting

1. **Port issues:** Ensure port 3000 is available
2. **Build failures:** Check Node.js version compatibility
3. **Health check fails:** Verify the app starts correctly

### Local Development

For local development, use:
```bash
npm run dev
```

For production preview:
```bash
npm run build
npm run preview
```