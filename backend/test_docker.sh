#!/bin/bash

echo "🐳 Testing Lissnify Backend Docker Setup"
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
    fi
}

# Check if Docker is installed
echo "Checking Docker installation..."
if command -v docker &> /dev/null; then
    print_status 0 "Docker is installed"
else
    print_status 1 "Docker is not installed"
    exit 1
fi

# Check if Docker Compose is installed
echo "Checking Docker Compose installation..."
if command -v docker-compose &> /dev/null; then
    print_status 0 "Docker Compose is installed"
else
    print_status 1 "Docker Compose is not installed"
    exit 1
fi

# Build the Docker image
echo "Building Docker image..."
docker build -t lissnify-backend .
if [ $? -eq 0 ]; then
    print_status 0 "Docker image built successfully"
else
    print_status 1 "Failed to build Docker image"
    exit 1
fi

# Start services with Docker Compose
echo "Starting services with Docker Compose..."
docker-compose up -d --build
if [ $? -eq 0 ]; then
    print_status 0 "Services started successfully"
else
    print_status 1 "Failed to start services"
    exit 1
fi

# Wait for services to be ready
echo "Waiting for services to be ready..."
sleep 10

# Check if web service is running
echo "Checking web service..."
if docker-compose ps web | grep -q "Up"; then
    print_status 0 "Web service is running"
else
    print_status 1 "Web service is not running"
fi

# Check if database is running
echo "Checking database service..."
if docker-compose ps db | grep -q "Up"; then
    print_status 0 "Database service is running"
else
    print_status 1 "Database service is not running"
fi

# Check if Redis is running
echo "Checking Redis service..."
if docker-compose ps redis | grep -q "Up"; then
    print_status 0 "Redis service is running"
else
    print_status 1 "Redis service is not running"
fi

# Test API endpoint
echo "Testing API endpoint..."
sleep 5
if curl -f http://localhost:8000/ > /dev/null 2>&1; then
    print_status 0 "API endpoint is responding"
else
    print_status 1 "API endpoint is not responding"
fi

# Show running containers
echo ""
echo "Running containers:"
docker-compose ps

echo ""
echo "🎉 Docker setup test completed!"
echo ""
echo "To view logs: docker-compose logs -f"
echo "To stop services: docker-compose down"
echo "To access the application: http://localhost:8000"
