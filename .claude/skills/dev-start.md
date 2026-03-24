---
name: dev-start
description: Start all three dev servers (Django, NestJS, Vite)
user_invocable: true
---

# Start Dev Servers

Launch all three development servers for local development.

## Steps

### 1. Django (port 8000)
```bash
cd /var/www/html/HomeInterior/backend-django && source venv/bin/activate
export POSTGRES_DB=homeinterior POSTGRES_USER=homeinterior POSTGRES_PASSWORD=homeinterior123 \
  POSTGRES_HOST=localhost POSTGRES_PORT=5432 DJANGO_SECRET_KEY=dev-secret-key \
  DJANGO_DEBUG=True REDIS_URL=redis://localhost:6379/0 JWT_SECRET=jwt-secret-key \
  DJANGO_CORS_ALLOWED_ORIGINS=http://localhost:5173
python manage.py runserver 0.0.0.0:8000
```
Run in background.

### 2. NestJS (port 3001)
```bash
cd /var/www/html/HomeInterior/backend-nest && npm run start:dev
```
Run in background.

### 3. Frontend (port 5173)
```bash
cd /var/www/html/HomeInterior/frontend && npx vite --host
```
Run in background.

### 4. Report
Print the URLs:
- Frontend: http://localhost:5173
- Django API: http://localhost:8000/api/docs/
- NestJS API: http://localhost:3001/api/docs
- Django Admin: http://localhost:8000/admin/
