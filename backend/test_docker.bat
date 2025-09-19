@echo off
echo 🐳 Testing Lissnify Backend Docker Setup
echo ========================================

REM Check if Docker is installed
echo Checking Docker installation...
docker --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Docker is installed
) else (
    echo ❌ Docker is not installed
    exit /b 1
)

REM Check if Docker Compose is installed
echo Checking Docker Compose installation...
docker-compose --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Docker Compose is installed
) else (
    echo ❌ Docker Compose is not installed
    exit /b 1
)

REM Build the Docker image
echo Building Docker image...
docker build -t lissnify-backend .
if %errorlevel% equ 0 (
    echo ✅ Docker image built successfully
) else (
    echo ❌ Failed to build Docker image
    exit /b 1
)

REM Start services with Docker Compose
echo Starting services with Docker Compose...
docker-compose up -d --build
if %errorlevel% equ 0 (
    echo ✅ Services started successfully
) else (
    echo ❌ Failed to start services
    exit /b 1
)

REM Wait for services to be ready
echo Waiting for services to be ready...
timeout /t 10 /nobreak >nul

REM Check if web service is running
echo Checking web service...
docker-compose ps web | findstr "Up" >nul
if %errorlevel% equ 0 (
    echo ✅ Web service is running
) else (
    echo ❌ Web service is not running
)

REM Check if database is running
echo Checking database service...
docker-compose ps db | findstr "Up" >nul
if %errorlevel% equ 0 (
    echo ✅ Database service is running
) else (
    echo ❌ Database service is not running
)

REM Check if Redis is running
echo Checking Redis service...
docker-compose ps redis | findstr "Up" >nul
if %errorlevel% equ 0 (
    echo ✅ Redis service is running
) else (
    echo ❌ Redis service is not running
)

REM Test API endpoint
echo Testing API endpoint...
timeout /t 5 /nobreak >nul
curl -f http://localhost:8000/ >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ API endpoint is responding
) else (
    echo ❌ API endpoint is not responding
)

REM Show running containers
echo.
echo Running containers:
docker-compose ps

echo.
echo 🎉 Docker setup test completed!
echo.
echo To view logs: docker-compose logs -f
echo To stop services: docker-compose down
echo To access the application: http://localhost:8000
