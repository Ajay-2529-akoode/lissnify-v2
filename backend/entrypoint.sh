#!/bin/bash

# Exit on any error
set -e

# Change to the correct directory where manage.py is located
cd /app/lissnify

# Function to wait for database
wait_for_db() {
    echo "Waiting for database..."
    while ! pg_isready -h $DATABASE_HOST -p $DATABASE_PORT -U $DATABASE_USER; do
        echo "Database is unavailable - sleeping"
        sleep 1
    done
    echo "Database is up - continuing"
}

# Function to wait for Redis
wait_for_redis() {
    echo "Waiting for Redis..."
    until python - << END
import os, sys, redis
from urllib.parse import urlparse

url = os.environ.get("REDIS_URL")
if not url:
    sys.exit(1)

parsed = urlparse(url)
try:
    r = redis.Redis(
        host=parsed.hostname,
        port=parsed.port,
        password=parsed.password,
        socket_connect_timeout=2
    )
    r.ping()
except Exception:
    sys.exit(1)
END
    do
        echo "Redis is unavailable - sleeping"
        sleep 2
    done
    echo "Redis is up - continuing"
}


# Wait for dependencies if they are not available
if [ -n "$DATABASE_URL" ]; then
    # Extract database connection details from DATABASE_URL
    export DATABASE_HOST=$(echo $DATABASE_URL | sed -n 's/.*@\([^:]*\):.*/\1/p')
    export DATABASE_PORT=$(echo $DATABASE_URL | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
    export DATABASE_USER=$(echo $DATABASE_URL | sed -n 's/.*:\/\/\([^:]*\):.*/\1/p')
    
    wait_for_db
fi

if [ -n "$REDIS_URL" ]; then
    wait_for_redis
fi

# Run database migrations
echo "Running database migrations..."
python manage.py migrate --noinput

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Create superuser if it doesn't exist (optional)
if [ "$CREATE_SUPERUSER" = "true" ]; then
    echo "Creating superuser..."
    python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'admin')
    print('Superuser created')
else:
    print('Superuser already exists')
"
fi

# Execute the main command
echo "Starting application..."
exec "$@"
