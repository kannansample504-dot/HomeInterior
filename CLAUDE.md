# CLAUDE.md — Home Interior

## Project Overview
Interior design estimation platform with dual-backend architecture (Django + NestJS) sharing a PostgreSQL database, React frontend, and Redis caching.

## Tech Stack
- **Frontend:** React 18 + Vite + TailwindCSS + TypeScript (`frontend/`)
- **Backend A:** Django 5 + DRF + SimpleJWT (`backend-django/`) — CMS, pricing, admin, auth
- **Backend B:** NestJS 10 + TypeORM + Passport-JWT (`backend-nest/`) — estimate engine
- **Database:** PostgreSQL 16 (shared, Django owns migrations)
- **Cache:** Redis 7
- **Design:** Manrope (headlines) + Inter (body), blue/white palette, ambient shadows, no borders

## Architecture Rules
- Django owns ALL database migrations. NestJS uses `synchronize: false` — never let TypeORM modify the schema.
- Frontend auth routes through Django (`/api/auth/*`), not NestJS, to avoid bcrypt hash format mismatches.
- NestJS handles `/api/estimate/*` only. Everything else routes to Django.
- UUID primary keys on `users` and `estimation_records` tables — generated in application code, not DB.
- Singleton models (CompanyProfile, TaxConfig) enforce `pk=1` in `save()` override.

## Running Locally
```bash
# Django (port 8000)
cd backend-django && source venv/bin/activate
export POSTGRES_DB=homeinterior POSTGRES_USER=homeinterior POSTGRES_PASSWORD=homeinterior123 \
  POSTGRES_HOST=localhost POSTGRES_PORT=5432 DJANGO_SECRET_KEY=dev-secret-key \
  DJANGO_DEBUG=True REDIS_URL=redis://localhost:6379/0 JWT_SECRET=jwt-secret-key \
  DJANGO_CORS_ALLOWED_ORIGINS=http://localhost:5173
python manage.py runserver 0.0.0.0:8000

# NestJS (port 3001)
cd backend-nest && npm run start:dev

# Frontend (port 5173)
cd frontend && npx vite --host
```

## Common Commands
```bash
# Django migrations
cd backend-django && source venv/bin/activate
python manage.py makemigrations
python manage.py migrate

# Seed data
python manage.py seed_pricing    # 24 pricing rows
python manage.py seed_cms        # CMS content, SEO, testimonials, FAQs

# Create admin
python manage.py createsuperuser
```

## API Routing (Vite Dev Proxy)
- `/api/estimate/*` → NestJS `:3001`
- `/api/*` → Django `:8000`

## Key Files
- `backend-django/apps/estimates/services.py` — Core estimation calculation engine
- `backend-django/apps/pricing/signals.py` — Auto-logs price changes to history
- `backend-django/apps/cms/views.py` — CMS with Redis caching + `cache.clear()` on updates
- `backend-nest/src/auth/auth.service.ts` — JWT auth with bcrypt + Redis token blacklist
- `backend-nest/src/estimate/estimate.service.ts` — NestJS estimation engine (mirrors Django)
- `frontend/src/context/AuthContext.tsx` — Auth state for entire React app
- `frontend/src/pages/estimate/EstimatePage.tsx` — 4-step estimation wizard

## Coding Conventions
- Django: snake_case, apps under `backend-django/apps/`, trailing slashes on URLs
- NestJS: camelCase in code, snake_case in DTOs/entities matching Django columns
- React: PascalCase components, pages in `src/pages/{feature}/`, API modules in `src/api/`
- Tailwind: Use design tokens from `tailwind.config.js` — never hardcode colors
- No 1px borders — use tonal surface shifts per design system (DESIGN.md)

## Testing
```bash
# Quick API smoke test
curl http://localhost:8000/api/cms/company/
curl http://localhost:8000/api/pricing/
curl -X POST http://localhost:8000/api/estimates/calculate/ \
  -H "Content-Type: application/json" \
  -d '{"rooms":[{"room_type":"bedroom","count":2}],"tier":"standard"}'
```

## Post-Review Workflow
After completing a code review and applying fixes:
1. Update `plan.md` — append a dated changelog entry summarizing what was reviewed and fixed
2. Stage all changed files (`git add`) including src, plan.md, tests, and migrations
3. Commit with a descriptive message
4. Push to `origin` (`git push`)

This workflow is mandatory after every successful review cycle. Do not ask for confirmation — execute all 4 steps automatically.

## Admin Access
- **Django Admin:** http://localhost:8000/admin/
- **Credentials:** admin@homeinterior.in / Admin@1234
