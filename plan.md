# Home Interior — Project Plan
## Interior Design Estimation & Management Platform

**Repo:** https://github.com/kannansample504-dot/HomeInterior
**Based on:** `home_interior_crc_prompt.docx`
**Status:** All phases complete | 10/10 functional tests passed

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + TailwindCSS + React Router v6 |
| Backend A (CMS) | Django 5 + DRF + SimpleJWT |
| Backend B (Engine) | NestJS 10 + TypeORM + Passport-JWT |
| Database | PostgreSQL 16 (shared by both backends) |
| Cache | Redis 7 |
| Proxy | Nginx (Docker) / Vite proxy (dev) |
| Design | Blue & white — Manrope + Inter typography |

---

## Phase 0: Infrastructure — COMPLETE

**Files created:**
- `docker-compose.yml` — 5 services: PostgreSQL, Redis, Django, NestJS, Nginx
- `docker-compose.prod.yml` — Production config with SSL-ready Nginx
- `.env.example` — DB creds, JWT secrets, Django secret key
- `.gitignore`
- `nginx/nginx.conf` — Reverse proxy routing:
  - `/api/cms/`, `/api/admin/`, `/api/pricing/`, `/api/estimates/` → Django :8000
  - `/api/auth/`, `/api/users/`, `/api/estimate/` → NestJS :3001
- `backend-django/` — Dockerfile, requirements.txt, manage.py, entrypoint.sh, config/
- `backend-nest/` — Dockerfile, package.json, tsconfig.json, nest-cli.json, src/main.ts
- `frontend/` — package.json, vite.config.ts, tailwind.config.js, index.html

---

## Phase 1: Django Backend (All 6 Apps) — COMPLETE

**Apps:** `authentication`, `users`, `cms`, `pricing`, `estimates`, `admin_panel`

### Models (9 total)
| Model | Table | Type |
|-------|-------|------|
| User (UUID PK, AbstractBaseUser) | `users` | Custom auth model |
| CMSContent | `cms_content` | Key-value page content (page_slug + field_key) |
| CompanyProfile | `company_profile` | Singleton (pk=1) — name, logo, contacts, socials |
| SEOMeta | `seo_meta` | Per-page meta title, description, OG tags |
| Testimonial | `testimonials` | Client testimonials |
| FAQ | `faqs` | FAQ entries |
| PricingMatrix | `pricing_matrix` | room_type × tier → price_per_sqft |
| PriceHistory | `price_history` | Auto-logged on every price change (signal) |
| TaxConfig | `tax_config` | Singleton — GST 18%, Labour 12% |
| EstimationRecord | `estimation_records` | Saved estimates with JSON room breakdown |

### Estimation Engine (`apps/estimates/services.py`)
```
room_cost = room_count × default_area[room_type] × pricing_matrix[room_type][tier]
material_total = Σ room_costs
labour = material_total × labour_percent / 100
subtotal = material_total + labour
gst = subtotal × gst_percent / 100
grand_total = subtotal + gst
```

### Default Room Areas (sqft)
| Room | Area |
|------|------|
| Living Room | 300 |
| Bedroom | 180 |
| Kitchen | 150 |
| Bathroom | 60 |
| Dining Room | 200 |
| Home Office | 160 |

### API Endpoints (Django — :8000)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register/` | Public | Register user, returns JWT |
| POST | `/api/auth/login/` | Public | Login, returns JWT |
| POST | `/api/auth/refresh/` | Public | Rotate refresh token |
| POST | `/api/auth/logout/` | Auth | Blacklist refresh token |
| GET/PATCH | `/api/users/me/` | Auth | User profile |
| GET | `/api/cms/company/` | Public | Company profile |
| PUT | `/api/cms/company/` | Admin | Update company profile |
| GET | `/api/cms/{page_slug}/` | Public | Page content as {key: value} |
| PUT | `/api/cms/{page_slug}/` | Admin | Bulk update page content |
| GET | `/api/cms/seo/{slug}/` | Public | SEO meta for page |
| PUT | `/api/cms/seo/{slug}/` | Admin | Update SEO meta |
| GET | `/api/cms/testimonials/` | Public | List testimonials |
| GET | `/api/cms/faqs/` | Public | List FAQs |
| GET | `/api/pricing/` | Public | Full pricing matrix (flat + grouped) |
| PUT | `/api/pricing/` | Admin | Bulk update prices |
| GET | `/api/pricing/tax/` | Public | GST & labour percentages |
| PUT | `/api/pricing/tax/` | Admin | Update tax config |
| GET | `/api/pricing/history/` | Admin | Price change audit log |
| POST | `/api/estimates/calculate/` | Public | Calculate estimate (stateless) |
| POST | `/api/estimates/` | Optional | Save estimate |
| GET | `/api/estimates/mine/` | Auth | User's saved estimates |
| GET | `/api/estimates/{id}/` | Auth | Single estimate detail |
| DELETE | `/api/estimates/{id}/` | Auth | Delete own estimate |
| GET | `/api/admin/stats/` | Admin | Dashboard statistics |
| GET | `/api/admin/users/` | Admin | All users (filterable) |
| PATCH | `/api/admin/users/{id}/` | Admin | Activate/deactivate user |
| GET | `/api/admin/estimates/` | Admin | All estimates (filterable) |

### Management Commands
- `python manage.py seed_pricing` — 24 pricing rows (6 rooms × 4 tiers)
- `python manage.py seed_cms` — 29 CMS fields, 5 SEO entries, 3 testimonials, 6 FAQs, company profile

### Caching
- CMS endpoints: `@cache_page(300)` — 5 min TTL
- Pricing: `@cache_page(600)` — 10 min TTL
- Cache cleared on admin updates via `cache.clear()`

---

## Phase 2: NestJS Backend — COMPLETE

**Modules:** `database`, `auth`, `users`, `estimate`, `common`

### Key Details
- TypeORM `synchronize: false` — Django owns all migrations
- Entities match Django column names exactly
- Password: NestJS uses plain bcrypt; Django uses `BCryptPasswordHasher`
- UUID generated via `uuid` package with `@BeforeInsert()` hook
- JWT secret shared via `.env`

### API Endpoints (NestJS — :3001)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | Public | Register user |
| POST | `/api/auth/login` | Public | Login (LocalStrategy) |
| POST | `/api/auth/refresh` | Public | Refresh token |
| POST | `/api/auth/logout` | Public | Blacklist token |
| GET/PATCH | `/api/users/me` | Auth | User profile |
| POST | `/api/estimate/calculate` | Public | Calculate estimate |
| POST | `/api/estimate` | Optional | Save estimate |
| GET | `/api/estimate` | Auth | List user estimates |
| GET | `/api/estimate/:id` | Auth | Single estimate |
| DELETE | `/api/estimate/:id` | Auth | Delete estimate |

### Verified
- Django ↔ NestJS calculation produces identical results
- Swagger docs at `/api/docs`

---

## Phase 3: React Frontend — Scaffold + Auth — COMPLETE

### Architecture
- **API Layer:** Axios with auto-refresh interceptor (401 → refresh → retry)
- **Auth:** `AuthContext` with login/register/logout, sessionStorage tokens
- **Routing:** React Router v6, `ProtectedRoute` + `AdminRoute` guards
- **Layout:** Glassmorphism Navbar (sticky, responsive hamburger) + Footer

### Vite Proxy (Dev)
- `/api/estimate/*` → NestJS :3001
- `/api/*` → Django :8000

### Routes
```
/              → HomePage
/about         → AboutPage
/how-it-works  → HowItWorksPage
/estimate      → EstimatePage (4-step wizard)
/login         → LoginPage (also /register)
/dashboard     → ProtectedRoute → DashboardPage
/admin         → AdminRoute → AdminDashboardPage
```

---

## Phase 4: Public Pages + Estimate Wizard — COMPLETE

### Pages (CMS-driven)
- **Home** — Hero (gradient), 6 service cards, 3-step preview, stats counter, testimonials, CTA
- **About** — Company story (asymmetric), mission/vision, 4 core values, team (4 members), USPs
- **How It Works** — 4-step zigzag layout, interactive timeline, FAQ accordion

### Estimate Wizard (4 Steps)
1. **Property Details** — type (card select), BHK, contact info
2. **Design Style** — 6 themes with multipliers, 4 pricing tiers
3. **Room Selection** — toggle switches, count +/-, per-room
4. **Results** — Cost break-up (Labour/Material/Misc/Design), Timeline (Gantt), Cost by Rooms (bar chart), Cost by Services sidebar, room-wise breakdown with progress bars, grand total summary, actions (Save/PDF/Modify)

---

## Phase 5: Dashboards — COMPLETE

### User Dashboard (`/dashboard`)
- Summary cards (pipeline value, total estimates, account info)
- Estimate history table (expandable rows with full breakdown)
- Delete estimates
- Empty state with CTA

### Admin Dashboard (`/admin`) — 6 Tabs
| Tab | Function |
|-----|----------|
| **Stats** | KPI cards (estimates, avg value, users, revenue) + monthly trend table |
| **Page Content** | Select page → edit all CMS fields + SEO meta per page |
| **Pricing** | Editable matrix table (room × tier) + GST/labour config |
| **Users** | List, search, activate/deactivate users |
| **Estimates** | All estimates across users, CSV export |
| **Company** | Edit name, logo, phone, email, address, socials, footer text |

---

## Phase 6: PDF Export + Production — COMPLETE

- **PDF:** jsPDF client-side with company header, project details, room breakdown table, cost totals, footer
- **Production Docker:** `docker-compose.prod.yml` with multi-stage frontend build, gunicorn, security headers
- **Frontend Dockerfile:** Multi-stage (npm build → nginx serve)

---

## Functional Test Results — 10/10 PASSED

| Test | Result | Assertions |
|------|--------|------------|
| 1. Page Loads | ✅ | 5 frontend pages + 9 API endpoints |
| 2. Registration | ✅ | Valid, duplicate email, missing fields, short password |
| 3. Login | ✅ | Valid, wrong password, non-existent user, token refresh, profile |
| 4. Estimate Calculation | ✅ | Single room, multi-room, all 4 tiers, math verification, Django=NestJS |
| 5. Save Estimate | ✅ | Authenticated (status=saved), Guest (status=draft) |
| 6. Dashboard | ✅ | List estimates, detail view, 401 for unauthenticated |
| 7. Admin Dashboard | ✅ | Stats, user list, estimate list, 403 for non-admin |
| 8. Pricing Update | ✅ | Update price → recalculation verified → price history logged |
| 9. CMS Update | ✅ | Hero title, company tagline, SEO meta |
| 10. Delete + Logout | ✅ | Delete (204), verify gone (404), logout |

### Bug Fixed During Testing
- Cache invalidation: `cache.delete_pattern()` didn't clear `@cache_page` entries → replaced with `cache.clear()`

---

## Project Structure (141 files)

```
HomeInterior/
├── .env.example                    # Environment template
├── .gitignore
├── docker-compose.yml              # Dev: 5 services
├── docker-compose.prod.yml         # Production config
├── plan.md                         # This file
├── home_interior_crc_prompt.docx   # CRC specification
│
├── nginx/
│   ├── Dockerfile
│   ├── nginx.conf                  # Dev proxy config
│   └── nginx.prod.conf             # Production config
│
├── backend-django/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── manage.py
│   ├── entrypoint.sh
│   ├── config/                     # settings, urls, wsgi
│   └── apps/
│       ├── users/                  # Custom User model (UUID, roles)
│       ├── authentication/         # JWT register/login/refresh/logout
│       ├── cms/                    # CompanyProfile, CMSContent, SEOMeta, Testimonials, FAQs
│       ├── pricing/                # PricingMatrix, PriceHistory, TaxConfig + signals
│       ├── estimates/              # EstimationRecord + calculation engine
│       └── admin_panel/            # Stats, user mgmt, estimate mgmt
│
├── backend-nest/
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── main.ts                 # Bootstrap + Swagger
│       ├── app.module.ts           # Root module
│       ├── database/               # TypeORM PostgreSQL config
│       ├── auth/                   # JWT auth (local + jwt strategies)
│       ├── users/                  # User entity + CRUD
│       ├── estimate/               # Calculation engine + CRUD
│       └── common/                 # Guards, decorators, filters
│
└── frontend/
    ├── Dockerfile                  # Multi-stage production build
    ├── package.json
    ├── vite.config.ts              # Proxy routing
    ├── tailwind.config.js          # Design tokens
    └── src/
        ├── api/                    # Axios instances + API modules
        ├── context/                # AuthContext
        ├── components/             # Layout (Navbar, Footer), ProtectedRoute, AdminRoute
        ├── pages/
        │   ├── home/               # HomePage
        │   ├── about/              # AboutPage
        │   ├── how-it-works/       # HowItWorksPage
        │   ├── estimate/           # EstimatePage (4-step wizard)
        │   ├── auth/               # LoginPage (login + register tabs)
        │   ├── dashboard/          # DashboardPage (user)
        │   └── admin/              # AdminDashboardPage (6 tabs)
        ├── types/                  # TypeScript interfaces
        └── utils/                  # formatCurrency, constants, pdfGenerator
```

---

## Quick Start

```bash
# 1. Clone
git clone https://github.com/kannansample504-dot/HomeInterior.git
cd HomeInterior

# 2. Install PostgreSQL + Redis (if not installed)
sudo apt install postgresql postgresql-contrib redis-server

# 3. Create database
sudo -u postgres psql -c "CREATE DATABASE homeinterior;"
sudo -u postgres psql -c "CREATE USER homeinterior WITH PASSWORD 'homeinterior123';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE homeinterior TO homeinterior;"
sudo -u postgres psql -c "ALTER DATABASE homeinterior OWNER TO homeinterior;"

# 4. Setup Django
cd backend-django
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
export POSTGRES_DB=homeinterior POSTGRES_USER=homeinterior POSTGRES_PASSWORD=homeinterior123 \
  POSTGRES_HOST=localhost POSTGRES_PORT=5432 DJANGO_SECRET_KEY=your-secret-key \
  DJANGO_DEBUG=True REDIS_URL=redis://localhost:6379/0 JWT_SECRET=your-jwt-secret \
  DJANGO_CORS_ALLOWED_ORIGINS=http://localhost:5173
python manage.py migrate
python manage.py seed_pricing
python manage.py seed_cms
python manage.py createsuperuser
python manage.py runserver 0.0.0.0:8000 &

# 5. Setup NestJS
cd ../backend-nest
npm install
npm run start:dev &

# 6. Setup Frontend
cd ../frontend
npm install
npx vite --host &

# 7. Open browser
# Frontend:      http://localhost:5173
# Django Admin:  http://localhost:8000/admin/
# Django Swagger: http://localhost:8000/api/docs/
# NestJS Swagger: http://localhost:3001/api/docs
```

---

## Admin Credentials
- **Email:** admin@homeinterior.in
- **Password:** Admin@1234

---

## Seeded Data
- 24 pricing rows (6 room types × 4 tiers)
- 29 CMS content fields (home, about, howitworks pages)
- 5 SEO meta entries
- 3 testimonials
- 6 FAQs
- Company profile (Home Interior, Bangalore)

---

## Changelog

### 2026-03-24 — Code Review Fixes & Test Suite
**Reviewed:** Full codebase (33 modified files, 15+ new files)
**Issues found:** 3 CLAUDE.md compliance, 0 bugs

**Fixes applied:**
- **No 1px borders:** Replaced all `border-*` dividers with tonal surface shifts in AdminLayout, UserAvatar, SEOTab
- **Design tokens:** Replaced all hardcoded Tailwind colors (`gray-*`, `red-*`, `emerald-*`, `blue-*`, `purple-*`, `amber-*`) with semantic tokens (`surface-container-*`, `error`, `error-container`, `primary`, `tertiary`) across 12 frontend files
- **Migrations staged:** All Django migration files (cms, estimates, pricing, users) staged for commit
- **Security:** Changed `DEFAULT_PERMISSION_CLASSES` to `IsAuthenticated`, added rate throttling, added HTTPS settings for production, narrowed `LogoutView` exception handling to `TokenError`
- **ErrorBoundary:** Added React error boundary wrapping entire app
- **Inline errors:** Replaced `alert()` with inline error messages in EstimatePage
- **Auto-clear messages:** Admin tab success/error messages auto-dismiss after 4 seconds
- **URL validation:** Backend validates `image_url` on PortfolioProject
- **Guest email validation:** Backend returns 400 if unauthenticated user saves without email
- **Unit tests:** 61 Django tests + 26 Vitest frontend tests (all passing)

---

## Key Decisions & Mitigations

| Decision | Rationale |
|----------|-----------|
| Django for auth (frontend) | Consistent bcrypt hashing; NestJS bcrypt format differs from Django's |
| `cache.clear()` on admin updates | `delete_pattern` doesn't reliably clear `@cache_page` keys |
| UUID generated in NestJS code | Django's UUID default doesn't create PostgreSQL gen_random_uuid(); TypeORM needs explicit generation |
| Vite proxy splits routes | `/api/estimate/*` → NestJS, everything else → Django for dev without Nginx |
| NestJS `synchronize: false` | Django owns all migrations; NestJS maps to existing tables |
