#!/bin/bash
set -e

echo "Waiting for database..."
python -c "
import time, os, psycopg2
while True:
    try:
        conn = psycopg2.connect(
            dbname=os.environ['POSTGRES_DB'],
            user=os.environ['POSTGRES_USER'],
            password=os.environ['POSTGRES_PASSWORD'],
            host=os.environ['POSTGRES_HOST'],
            port=os.environ['POSTGRES_PORT'],
        )
        conn.close()
        break
    except psycopg2.OperationalError:
        print('Database not ready, waiting...')
        time.sleep(2)
"

echo "Running migrations..."
python manage.py migrate --noinput

echo "Collecting static files..."
python manage.py collectstatic --noinput 2>/dev/null || true

echo "Starting Django server..."
if [ "$DJANGO_DEBUG" = "True" ]; then
    python manage.py runserver 0.0.0.0:8000
else
    gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 4
fi
