# Docker Deployment Guide for Lissnify Backend

This guide covers deploying the Lissnify Django backend using Docker on Render.

## 🐳 Docker Setup

### Local Development

1. **Start all services with Docker Compose:**
   ```bash
   cd backend
   docker-compose up --build
   ```

2. **Run in background:**
   ```bash
   docker-compose up -d --build
   ```

3. **View logs:**
   ```bash
   docker-compose logs -f web
   ```

4. **Stop services:**
   ```bash
   docker-compose down
   ```

5. **Clean up (remove volumes):**
   ```bash
   docker-compose down -v
   ```

### Production with Nginx

1. **Start with Nginx:**
   ```bash
   docker-compose --profile production up -d --build
   ```

## 🚀 Render Deployment

### Option 1: Using render.yaml (Recommended)

1. **Push your code to GitHub**

2. **In Render Dashboard:**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository
   - Render will automatically detect the `render.yaml` file

3. **Environment Variables:**
   Set these in your Render service:
   ```
   SECRET_KEY=your-secret-key-here
   DEBUG=False
   ALLOWED_HOSTS=your-app-name.onrender.com
   DATABASE_URL=postgresql://username:password@host:port/database
   REDIS_URL=redis://username:password@host:port/0
   FRONTEND_URL=https://your-frontend-url.com
   EMAIL_HOST_USER=your-email@gmail.com
   EMAIL_HOST_PASSWORD=your-app-password
   ```

### Option 2: Manual Docker Deployment

1. **Create a new Web Service:**
   - Environment: Docker
   - Connect your GitHub repository

2. **Configure:**
   - Dockerfile Path: `./Dockerfile`
   - Docker Context: `.`
   - Port: 8000

3. **Set Environment Variables:**
   Same as Option 1

## 🔧 Docker Configuration Files

### Dockerfile
- Multi-stage build for optimization
- Non-root user for security
- Health checks included
- Automatic dependency installation

### docker-compose.yml
- PostgreSQL database
- Redis for caching and channels
- Django web application
- Optional Nginx for production

### entrypoint.sh
- Database migration automation
- Static file collection
- Health checks for dependencies
- Superuser creation (optional)

## 📁 File Structure

```
backend/
├── Dockerfile
├── docker-compose.yml
├── .dockerignore
├── entrypoint.sh
├── nginx.conf
├── render.yaml
├── requirements.txt
└── lissnify/
    └── Lissnify/
        ├── settings.py
        └── settings_production.py
```

## 🛠️ Local Development Commands

```bash
# Build and start all services
docker-compose up --build

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild specific service
docker-compose up --build web

# Access Django shell
docker-compose exec web python manage.py shell

# Run Django commands
docker-compose exec web python manage.py migrate
docker-compose exec web python manage.py createsuperuser

# Access database
docker-compose exec db psql -U lissnify_user -d lissnify

# Access Redis
docker-compose exec redis redis-cli
```

## 🔍 Troubleshooting

### Common Issues

1. **Port already in use:**
   ```bash
   # Check what's using the port
   lsof -i :8000
   # Kill the process or change port in docker-compose.yml
   ```

2. **Database connection issues:**
   - Check if PostgreSQL container is running
   - Verify DATABASE_URL environment variable
   - Check database logs: `docker-compose logs db`

3. **Redis connection issues:**
   - Check if Redis container is running
   - Verify REDIS_URL environment variable
   - Check Redis logs: `docker-compose logs redis`

4. **Static files not loading:**
   - Ensure `collectstatic` runs during build
   - Check WhiteNoise configuration
   - Verify static files volume mounting

5. **WebSocket connection issues:**
   - Check Redis is running and accessible
   - Verify WebSocket URL in frontend
   - Check nginx configuration for WebSocket support

### Debug Commands

```bash
# Check container status
docker-compose ps

# Check container logs
docker-compose logs web
docker-compose logs db
docker-compose logs redis

# Access container shell
docker-compose exec web bash

# Check environment variables
docker-compose exec web env

# Test database connection
docker-compose exec web python manage.py dbshell

# Test Redis connection
docker-compose exec web python manage.py shell
# Then in shell: import redis; r = redis.from_url('redis://redis:6379/0'); r.ping()
```

## 🔒 Security Considerations

1. **Environment Variables:**
   - Never commit `.env` files
   - Use strong SECRET_KEY in production
   - Rotate database passwords regularly

2. **Container Security:**
   - Running as non-root user
   - Minimal base image (python:3.11-slim)
   - Regular security updates

3. **Network Security:**
   - Internal container communication
   - Proper firewall configuration
   - HTTPS in production

## 📊 Monitoring

1. **Health Checks:**
   - Built-in Docker health checks
   - Application-level health endpoints
   - Database and Redis connectivity checks

2. **Logging:**
   - Structured logging in Django
   - Container logs via Docker
   - Centralized logging in production

## 🚀 Performance Optimization

1. **Docker Optimizations:**
   - Multi-stage builds
   - Layer caching
   - Minimal base images

2. **Application Optimizations:**
   - Gunicorn with multiple workers
   - Redis caching
   - Static file compression
   - Database connection pooling

## 📝 Environment Variables Reference

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `SECRET_KEY` | Django secret key | - | Yes |
| `DEBUG` | Debug mode | False | Yes |
| `ALLOWED_HOSTS` | Allowed hosts | localhost | Yes |
| `DATABASE_URL` | Database connection | - | Yes |
| `REDIS_URL` | Redis connection | redis://redis:6379/0 | Yes |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:3000 | Yes |
| `EMAIL_HOST_USER` | Email username | - | No |
| `EMAIL_HOST_PASSWORD` | Email password | - | No |
| `CREATE_SUPERUSER` | Create admin user | false | No |

This Docker setup provides a complete, production-ready environment for your Lissnify backend that can be easily deployed to Render or any other container platform.
