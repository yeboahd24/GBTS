#!/bin/bash

# Ghana Bus Ticket System - Deployment Script
echo "🚌 Deploying Ghana Bus Ticket System..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_warning "Docker Compose not found. Using 'docker compose' instead."
    COMPOSE_CMD="docker compose"
else
    COMPOSE_CMD="docker-compose"
fi

# Build and deploy
print_status "Building Docker image..."
if $COMPOSE_CMD build; then
    print_status "Docker image built successfully!"
else
    print_error "Failed to build Docker image"
    exit 1
fi

print_status "Starting application..."
if $COMPOSE_CMD up -d; then
    print_status "Application started successfully!"
    echo ""
    echo "🎉 Ghana Bus Ticket System is now running!"
    echo "📱 Access the application at: http://localhost:3000"
    echo ""
    echo "📊 To view logs: $COMPOSE_CMD logs -f"
    echo "🛑 To stop: $COMPOSE_CMD down"
    echo "🔄 To restart: $COMPOSE_CMD restart"
else
    print_error "Failed to start application"
    exit 1
fi