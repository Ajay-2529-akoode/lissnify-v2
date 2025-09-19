# Lissnify Backend

A Django REST API backend for the Lissnify application with WebSocket support for real-time chat and notifications.

## Features

- Django REST Framework API
- JWT Authentication
- WebSocket support for real-time chat
- Redis for caching and channels
- PostgreSQL database support
- Email notifications
- Admin panel
- CORS support

## Production Deployment on Render

### Prerequisites

1. A Render account
2. A PostgreSQL database (can be created through Render)
3. A Redis instance (can be created through Render)

### Deployment Steps

1. **Fork/Clone this repository**

2. **Connect to Render**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" and select "Web Service"
   - Connect your GitHub repository

3. **Configure Environment Variables**
   Set the following environment variables in your Render service:
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

4. **Build Settings**
   - Build Command: `pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate`
   - Start Command: `gunicorn Lissnify.wsgi:application`

5. **Deploy**
   - Click "Create Web Service"
   - Render will automatically build and deploy your application

### Alternative: Using render.yaml

You can also use the included `render.yaml` file for automatic deployment:

1. Push the `render.yaml` file to your repository
2. In Render Dashboard, select "New +" → "Blueprint"
3. Connect your repository
4. Render will automatically create all services defined in the YAML file

### Environment Variables

Create a `.env` file in the `lissnify` directory with the following variables:

```env
# Django Settings
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/database_name

# Redis Configuration
REDIS_URL=redis://localhost:6379/0

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password

# Frontend URL for CORS
FRONTEND_URL=http://localhost:3000
```

### Local Development

1. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Run migrations**
   ```bash
   python manage.py migrate
   ```

4. **Create superuser**
   ```bash
   python manage.py createsuperuser
   ```

5. **Run development server**
   ```bash
   python manage.py runserver
   ```

### API Endpoints

- **Authentication**: `/api/token/` (POST)
- **Token Refresh**: `/api/token/refresh/` (POST)
- **API**: `/api/`
- **Admin**: `/admin/`
- **Chat WebSocket**: `/ws/chat/`
- **Notifications WebSocket**: `/ws/notifications/`

### Production Settings

The application includes production-ready settings in `settings_production.py` with:
- Security headers
- Static file serving with WhiteNoise
- Database connection pooling
- Redis caching
- Logging configuration
- CORS configuration

### Troubleshooting

1. **Static files not loading**: Ensure `collectstatic` is run during build
2. **Database connection issues**: Check your `DATABASE_URL` environment variable
3. **WebSocket connection issues**: Verify Redis is running and accessible
4. **CORS issues**: Update `CORS_ALLOWED_ORIGINS` with your frontend URL

### Support

For issues and questions, please check the Django documentation or create an issue in the repository.
