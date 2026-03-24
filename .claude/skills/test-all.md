---
name: test-all
description: Run all backend and frontend unit tests
user_invocable: true
---

# Run All Tests

Execute the complete test suite for both Django backend and React frontend.

## Steps

### 1. Django Tests
```bash
cd /var/www/html/HomeInterior/backend-django && source venv/bin/activate
export POSTGRES_DB=homeinterior POSTGRES_USER=homeinterior POSTGRES_PASSWORD=homeinterior123 \
  POSTGRES_HOST=localhost POSTGRES_PORT=5432 DJANGO_SECRET_KEY=dev-secret-key \
  DJANGO_DEBUG=True REDIS_URL=redis://localhost:6379/0 JWT_SECRET=jwt-secret-key
python manage.py test apps.users apps.authentication apps.estimates apps.cms apps.pricing --verbosity=2
```

### 2. Frontend Tests
```bash
cd /var/www/html/HomeInterior/frontend && npx vitest run
```

### 3. Report
- Report total pass/fail counts for both suites
- If any tests fail, show the failure details and suggest fixes
