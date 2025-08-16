#!/bin/bash

# Test build script to verify Docker build works
echo "🧪 Testing Docker build..."

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Test the build
if docker build -t gbts-test .; then
    echo -e "${GREEN}✅ Docker build successful!${NC}"
    
    # Test if the container starts
    echo "🚀 Testing container startup..."
    if docker run -d --name gbts-test-container -p 3001:3000 gbts-test; then
        echo -e "${GREEN}✅ Container started successfully!${NC}"
        
        # Wait a moment for startup
        sleep 5
        
        # Test health check
        if curl -f http://localhost:3001 > /dev/null 2>&1; then
            echo -e "${GREEN}✅ Health check passed!${NC}"
            echo "🎉 Build test completed successfully!"
        else
            echo "⚠️  Health check failed, but container is running"
        fi
        
        # Cleanup
        docker stop gbts-test-container
        docker rm gbts-test-container
    else
        echo -e "${RED}❌ Container failed to start${NC}"
    fi
    
    # Cleanup image
    docker rmi gbts-test
else
    echo -e "${RED}❌ Docker build failed${NC}"
    exit 1
fi