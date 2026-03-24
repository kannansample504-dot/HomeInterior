---
name: seed-data
description: Run Django migrations and seed all sample data
user_invocable: true
---

# Seed Data

Reset and seed the database with sample data for development.

## Steps

```bash
cd /var/www/html/HomeInterior/backend-django && source venv/bin/activate
export POSTGRES_DB=homeinterior POSTGRES_USER=homeinterior POSTGRES_PASSWORD=homeinterior123 \
  POSTGRES_HOST=localhost POSTGRES_PORT=5432 DJANGO_SECRET_KEY=dev-secret-key \
  DJANGO_DEBUG=True REDIS_URL=redis://localhost:6379/0 JWT_SECRET=jwt-secret-key
```

1. Run migrations: `python manage.py migrate`
2. Seed pricing: `python manage.py seed_pricing` (24 pricing rows: 6 rooms x 4 tiers)
3. Seed CMS: `python manage.py seed_cms` (CMS content, SEO, testimonials, FAQs, company profile)
4. Report what was seeded
