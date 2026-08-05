# LewaHub Code Audit Report

**Date:** 2026-08-05  
**Auditor:** AI Review  
**Repository:** LewaHub (School Directory for Cameroon)

---

## Executive Summary

Overall the codebase shows **good architectural discipline**: clean separation of concerns (controller→service→repository), proper use of Prisma ORM, Zod validation, JWT auth, optional Redis caching, and a centralized API client. However there are **critical security gaps**, **performance anty issues**, **data inconsistencies between Frontend and Backend**, and **dead code** that need remediation.

**Severity Breakdown:**

- 🔴 **CRITICAL** — 5 issues
- ⚠️ **HIGH** — 8 issues
- 📝 **MEDIUM** — 7 issues
- 💡 **LOW** — 4 issues

---

## 1. CRITICAL Issues

### 1.1 Frontend Calls `/evaluations` Endpoints That Don't Exist in Backend

**File:** `Frontend/src/lib/api.ts` (lines 160–172, 235–247)

The frontend API client calls `/evaluations/:schoolId/aggregate`, `/evaluations/verify-student`, and `/evaluations` (POST). However, **no `evaluations` module exists** in the backend at all — there is no `evaluationsRoutes`, controller, service, or repository. All these calls will return 404.

**Remedy:** Either implement the evaluations module (model + routes + service) or remove these dead frontend methods.

### 1.2 Search Fallbac is O(n) In-Memory on 100 Records

**File:** `Backend/src/modules/search/searchService.js` (lines 69–110)

When AI parsing fails (no API key or parse failure), the fallback loads **all schools** (limit=100), then does in-memory scoring + filtering + pagination. This **will not scale** beyond a few hundred schools.

**Remdy:** Move the scoring logic into the database layer using PostgreSQL full-text search (`tsvector`/`tsquery`) or at minimum use Prisma's `OR` with `contains` on relevant fields, paginated directly.

### 1.3 Dead/Stale Configuration File

**File:** `Backend/src/config/database.js`

This file exports `getDb()` which simply returns `null`. It conflicts with `lib/database.js` which correctly initializes Prisma. This stale file could confuse developers.

**Remdy:** Delete `Backend/src/config/database.js` entirely.

### 1.4 Frontend Adm in Form Sends Fields That Don't Exist in Prisma Schema

**File:** `Frontend/src/Admin/pages/SchoolFormPage.tsx` (lnes 40–45, 185–340)

The form includes `ageRange`, `studentTeacherRatio`, `curriculum`, `annualFee`, `classesOffered`, `programType` and `highSchoolPrograms` (via `as any` cast). These fields **do not exist** in the Prisma `School` model and will be silently dropped by the ORM. The user may think these are saved but they are lost.

**Remdy:** Either:

- Add these fields to the Prisma schema and run a migration, OR
- Remove them from the frontend form to avoid false expectations

### 1.5 Multi-Select Filters Only Send First Value

**File:** `Frontend/src/features/search/services/searchApi.ts` (lnes 18–23)

```ts
region: filters.region.length > 0 ? filters.region[0] : undefined,
category: filters.category.length > 0 ? filters.category[0] : undefined,
```

Only the **first** selected filter value is sent to the backend. The backend only supports single values anyway. Multi-select UI gives false impression.

**Remdy:** Either let users only pick one value per filter category (UI change), or modify the backend to accept arrays.

---

##2. HIGH Issues

### 2.1 `.strict()` on Update Schema Causes 400 Errors on Admin Form Updates

**File:** `Backend/src/middleware/validate.js` (line 51)

```js
export const updateSchoolSchema = z.object(schoolBaseSchema).partial().strict();
```

`.strict()` rejects ANY field not defined in `schoolBaseSchema`. The admin form (`SchoolFormPage.tsx`) submits extra fields — `ageRange`, `studentTeacherRatio`, `curriculum`, `annualFee`, `classesOffered`, `programType`, `highSchoolPrograms` — which are **not** in the schema. As a result, **every school update from the admin UI returns HTTP 400** and no data is saved. This compounds the issue in section 1.4: fields are both rejected AND lost.

**Remedy:** Change `.strict()` to `.strip()` on `updateSchoolSchema` so unknown fields are silently dropped (and separately resolved via section 1.4), OR add the missing fields to the schema.

### 2.2 JWT Token Missing `aud` and `iss` Claims

**File:** `Backend/src/modules/auth/athService.js` (line 22–26)

The JWT token signes only `sub`, `email`, `name` with no `aud` (audience) or `iss` (issuer). This means a token issued for the admin API could teoretically be used els where.

**Remdy:** Add `aud: 'lewahub-admin'` and `iss: 'lewahub-backend'`.

### 2.3 No CSRF Protection

**File:** `Backend/src/index.js`

The app has `helmet` but no CSRF protection for state-changing requests. Sice credentials are sent via `Authorization` header (not cookies), this is les of an issue for browser-based CSRF, but if cookies are used in future it'es a gap.

**Remdy:** Add `csurf` or similar if cookie-based auth is introduced. For now, add a comment flagging this assumption.

### 2.4 No Request Body size Limiting

**File:** `Backend/src/index.js` (line 31)

```js
app.use(express.json());
```

No `limit` parameter. A malicious client could send a multi-megabyte payload and crash the server or exhaust memory.

**Remdy:**

```js
app.use(express.json({ limit: "10kb" }));
```

### 2.5 API Client Response Spread Creates Ambiguous Structure

**File:** `Frontend/src/lib/api.ts` (lnes 78–82)

```ts
const data = await response.json();
return {
  data: data as T,
  ...data, // Spreads same properties again
};
```

If `data` has a property named `data` (e.g., `{ data: [...] }`), it **overrites** the explicit `data` key. This causes inconsistnt behavior across callers.

**Remdy:** Remove the spread:

```ts
return { data: data as T };
```

### 2.6 Prisma Raw Query for Nearby Without PG Extension Check

**File:** `Backend/src/modules/schools/schoolsRepository.js` (lnes 110–127)

The `findNearby` function uses `ST_DWithin` and `ST_Distance` which require **PostGIS** extension. If PostGIS is not installed, the query throws a raw SQL error (not handled gracefully).

**Remdy:** Add a startup check for PostGIS or catch the error and fall back to a Haversine formula calculation.

### 2.7 Redis Cache Invalidation Uses Blocking `KEYS *`

**File:** `Backend/src/config/redis.js` (line 52)

```js
const keys = await client.keys(pattern);
```

`KEYS *` in production can block the Redis event loop for seconds with many keys (>10k). Use `SCAN` instead.

**Remdy:** Replace `keys()` with `scan()` iteration, or use Redis tags/sets for cache invalidation.

### 2.8 Hardcoded `rating: 4.5` Placeholder

**File:** `Frontend/src/features/search/services/searchApi.ts` (lnes 48, 108)

```ts
rating: 4.5, // Placeholder until ratings are implemented
```

This gives a false impression to users. All schools show 4.5 rating.

**Remdy:** Exclude `rating` from the frontend type until real ratings are implemented, or show `null` / "No ratings yet".

---

## 3. MEDIUM Issues

### 3.1 No Pagionation on `findNearby` Response

**File:** `Backend/src/modules/schools/schoolsController.js` (line 72)

```js
res.json({ data: nearb, total: nearb.length });
```

If there are 500 schools within 50km, all 500 are returned. The frontend has no pagination for this either.

**Remdy:** Add `page`/`limit` parmeters to `findNeary`.

### 3.2 Inline Styles Instead of Tailwind Classes

**File:** `Frontend/src/Admin/pages/SchoolFormPage.tsx`

Every element uses inline `style={{}}` with custom CSS variables. This defeats Tailwind utility classes, makes theming harder to maintain, and bloates the bundle.

**Remdy:** Define Tailwin utility classes for the custom theme and replace inline styles.

### 3.3 Rate Limiting Too Restrictive for Production Use

**File:** `Backend/src/index.js` (line 36)

```js
max: 100, // limit each IP to 100 requests per windowMs
```

100 requests per 15 minutes is very low for a directory API. A user browsing schools (listing, detail views, search, programs) could hit this limit in a few minutes of normal browsing.

**Remedy:** Increase to 200–500 for the general API, keep 5 for login.

### 3.4 No Health Chec on Dtabase Connection

**File:** `Backend/src/index.js` (lnes 60–62)

The health endpoint only returns `{ status: "ok" }` without verifying the database connection is alive. It would return "ok" even if the database is disconnected.

**Remdy:** Add a simple `await prismaClient.$queryRaw('SELECT 1')` to the health check.

### 3.5 Adm in `api.ts` Wraps `api.request()` Unesarily

**File:** `Frontend/src/Admin/lib/api.ts`

Most functions just delgate to `api.ts` methods with identical signatures. This adds a redundant layer without value.

**Remdy:** Eher consolidate into a single API layer or use the main `api.singleton` directly.

### 3.6 No Input Sanitization on Search Query

**File:** `Backend/src/modules/schools/schoolsRepository.js` (lnes 10–15)

The search query is passed directly to Prisma's `contains`. While Prisma preents SQL injection, there's no sanitiation for extremely long or malicious strings.

**Remdy:** Add a max lentgh check on the search query (e.g., Zod string cap).

### 3.7 Prisma Schema Missing `@@map` for Table Names

**File:** `Backend/prisma/schema.prisma`

All models use default table names (camelCase in PostgreSQL). Best practice is to explicitely set table names:

```prisma
@@map("school")
```

---

## 4. LOW Issues

### 4.1 `cachDelPattern` Uses Glob Patten, Not Redis Keys

The pattern `schools:list:*` is a Redis key pattern, not a glob. It works but could matc unintended keys if naming is not strict.

**Remdy:** Ensure cache key naming conventions are documented and enforced.

### 4.2 Inconsistnt Error Message Casing

`UNAUTHORIZED` (all caps) in auth middleware vs `Invalid email or password` (sentnce case).

**Remdy:** Standardize error message casing (prefer sentence case for user-facing messages).

### 4.3 Missing TypeScript Strict Mode Config

**File:** `Frontend/tsconfig.json`

Should enable `strict: true` to catch null/undefined issues at compile time.

**Remdy:** Add `"strict": true` to `compilerOptions`.

### 4.4 No `.gitignore` for `Frontend/.env`

The `Frontend/.env` file is visible in the Open Tabs. Ensure it's in `.gitignore`.

---

## 5. Arcitectural Recomendations

1. **Adopt a single truth source for data shaping** – Don't let the frontend assume fields the backend doesn't store. Use a shared types packge.
2. **Add integration tests** – There are none. Jest + Supertest for API tests.
3. **Use migration-based seeding** – The `seed.js` script should use the `seed` command with Prisma's integrated seeding.
4. **Add a CI/CD pipeline** – Linting → tests → build → deploy.
5. **Consider removing Redis as a hard dependcy** – The graceful fallback is good. Document it as optional.

---

## 6. Complete API Endpoint Inventory

All endpoints are prefixed with `/api/v1`. Protected routes require `Authorization: Bearer <JWT>`.

### 6.1 Implemented Backend Endpoints

| Method | Path                                     | Auth                           | Description                                       | Source File            |
| ------ | ---------------------------------------- | ------------------------------ | ------------------------------------------------- | ---------------------- |
| POST   | `/admin/login`                           | Public (rate-limited: 5/15min) | Admin login, returns JWT                          | `authRoutes.js`        |
| GET    | `/admin/dashboard`                       | 🔒 Admin                       | Dashboard stats                                   | `dashboardRoutes.js`   |
| PUT    | `/admin/settings/password`               | 🔒 Admin                       | Change admin password                             | `settingsRoutes.js`    |
| GET    | `/schools`                               | Public                         | List schools with filters + pagination            | `schoolsRoutes.js`     |
| GET    | `/schools/nearby`                        | Public                         | Nearby schools (raw PostGIS query)                | `schoolsRoutes.js`     |
| GET    | `/schools/:id`                           | Public                         | Get school detail (increments views)              | `schoolsRoutes.js`     |
| POST   | `/schools`                               | 🔒 Admin                       | Create school (Zod validated)                     | `schoolsRoutes.js`     |
| PUT    | `/schools/:id`                           | 🔒 Admin                       | Update school (Zod validated)                     | `schoolsRoutes.js`     |
| DELETE | `/schools/:id`                           | 🔒 Admin                       | Delete school + cascade programs/images           | `schoolsRoutes.js`     |
| GET    | `/schools/:schoolId/programs`            | Public                         | List programs for a school                        | `programsRoutes.js`    |
| POST   | `/schools/:schoolId/programs`            | 🔒 Admin                       | Add program to school (Zod validated)             | `programsRoutes.js`    |
| PUT    | `/schools/:schoolId/programs/:programId` | 🔒 Admin                       | Update program (Zod validated)                    | `programsRoutes.js`    |
| DELETE | `/schools/:schoolId/programs/:programId` | 🔒 Admin                       | Delete program                                    | `programsRoutes.js`    |
| GET    | `/search?q=`                             | Public                         | Natural-language search (AI intent parsing)       | `searchRoutes.js`      |
| GET    | `/ai-summary/drafts`                     | 🔒 Admin                       | List AI summary drafts                            | `aiSummaryRoutes.js`   |
| POST   | `/ai-summary/drafts/:draftId/approve`    | 🔒 Admin                       | Approve AI summary draft                          | `aiSummaryRoutes.js`   |
| POST   | `/ai-summary/drafts/:draftId/reject`     | 🔒 Admin                       | Reject AI summary draft                           | `aiSummaryRoutes.js`   |
| POST   | `/ai-summary/:schoolId/regenerate`       | 🔒 Admin                       | Regenerate AI summary for a school                | `aiSummaryRoutes.js`   |
| POST   | `/ai-summary/batch/regenerate-all`       | 🔒 Admin                       | Regenerate all school summaries                   | `aiSummaryRoutes.js`   |
| GET    | `/geolocation/nearby`                    | Public                         | Nearby schools (delegates to geolocation service) | `geolocationRoutes.js` |
| GET    | `/health`                                | Public                         | Health check (no DB ping)                         | `index.js`             |

### 6.2 Frontend Calls with NO Backend Endpoint (Broken)

| Method | Path                               | Frontend Caller                                        | Status                                |
| ------ | ---------------------------------- | ------------------------------------------------------ | ------------------------------------- |
| GET    | `/evaluations/:schoolId/aggregate` | `Frontend/src/lib/api.ts` → `getEvaluationAggregate()` | 🔴 404 — no evaluations module exists |
| POST   | `/evaluations/verify-student`      | `Frontend/src/lib/api.ts` → `verifyStudent()`          | 🔴 404 — no evaluations module exists |
| POST   | `/evaluations`                     | `Frontend/src/lib/api.ts` → `recordEvaluation()`       | 🔴 404 — no evaluations module exists |

### 6.3 Duplicate/Overlapping Nearby Endpoints

- `GET /schools/nearby` — uses PostGIS `ST_DWithin` directly in `schoolsRepository.findNearby()`
- `GET /geolocation/nearby` — mounts a separate `geolocationService` that also wraps nearby logic

Both fulfill the same purpose. The frontend `api.findNearby()` calls `/geolocation/nearby` while schools routes expose a second near-identical endpoint. **Consolidate into one.**

### 6.4 Notable Observation on Route Order (Correct)

- `schoolsRoutes.js` correctly registers `GET /nearby` **before** `GET /:id` — otherwise "nearby" would be captured as an id.
- `aiSummaryRoutes.js` correctly registers `/drafts` before `/:schoolId/regenerate` for the same reason.

---

## 7. How to Test the Endpoints

### 7.1 Prerequisites

1. **PostgreSQL with PostGIS** running locally (required — no fallback):

   ```bash
   # Create the database
   createdb lewahub
   # Enable PostGIS (required for /schools/nearby and /geolocation/nearby)
   psql -d lewahub -c "CREATE EXTENSION IF NOT EXISTS postgis;"
   ```

2. **Configure environment** — copy `.env.example` to `.env` and set values:

   ```bash
   cd Backend
   cp .env.example .env
   # Edit .env: set DATABASE_URL, JWT_SECRET (≥32 chars), PORT=4000
   ```

3. **Install dependencies & run migrations + seed**:

   ```bash
   cd Backend
   npm install
   npx prisma migrate dev
   npm run seed   # creates an admin user + sample schools
   ```

4. **Start the server**:
   ```bash
   npm run dev   # runs on http://localhost:4000/api/v1
   ```

### 7.2 Get an Admin Token (for protected routes)

```bash
# Login (rate-limited to 5 attempts / 15 min per IP)
curl -X POST http://localhost:4000/api/v1/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@lewahub.com","password":"your-password"}'

# Response contains: { "token": "eyJhbGci...", "admin": {...} }
# Save the token for use in protected routes:
export TOKEN="eyJhbGci..."
```

### 7.3 Public Endpoints (no auth)

```bash
# Health check
curl http://localhost:4000/api/v1/health

# List schools (paginated, with filters)
curl "http://localhost:4000/api/v1/schools?page=1&limit=10"
curl "http://localhost:4000/api/v1/schools?category=University&region=Centre"
curl "http://localhost:4000/api/v1/schools?search=university&verified=true"

# Get single school (increments anonymousViews)
curl http://localhost:4000/api/v1/schools/<SCHOOL_ID>

# Nearby schools (requires PostGIS)
curl "http://localhost:4000/api/v1/schools/nearby?latitude=3.8480&longitude=11.5021&radius=50"
curl "http://localhost:4000/api/v1/geolocation/nearby?latitude=3.8480&longitude=11.5021&radius=50"

# List programs for a school
curl http://localhost:4000/api/v1/schools/<SCHOOL_ID>/programs

# Natural-language search (AI if configured, else keyword fallback)
curl "http://localhost:4000/api/v1/search?q=universities in yaounde"
curl "http://localhost:4000/api/v1/search?q=computer science&category=University"
```

### 7.4 Protected Endpoints (require `Authorization: Bearer <TOKEN>`)

```bash
# Dashboard stats
curl http://localhost:4000/api/v1/admin/dashboard -H "Authorization: Bearer $TOKEN"

# Change password
curl -X PUT http://localhost:4000/api/v1/admin/settings/password \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"currentPassword":"old-pass","newPassword":"new-pass-12345"}'

# Create school (Zod validated)
curl -X POST http://localhost:4000/api/v1/schools \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test University",
    "category": "University",
    "description": "A test university",
    "region": "Centre",
    "city": "Yaoundé",
    "address": "123 Main St",
    "latitude": 3.8480,
    "longitude": 11.5021,
    "programs": [{"name": "Computer Science", "level": "Bachelor", "duration": "3 years", "tuition": 500000}]
  }'

# Update school (NOTE: currently returns 400 due to .strict() bug — see section 2.1)
curl -X PUT http://localhost:4000/api/v1/schools/<SCHOOL_ID> \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated Name"}'

# Delete school
curl -X DELETE http://localhost:4000/api/v1/schools/<SCHOOL_ID> \
  -H "Authorization: Bearer $TOKEN"

# Add program to school
curl -X POST http://localhost:4000/api/v1/schools/<SCHOOL_ID>/programs \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Masters in CS","level":"Master","duration":"2 years","tuition":800000}'

# Update program
curl -X PUT http://localhost:4000/api/v1/schools/<SCHOOL_ID>/programs/<PROGRAM_ID> \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"tuition":900000}'

# Delete program
curl -X DELETE http://localhost:4000/api/v1/schools/<SCHOOL_ID>/programs/<PROGRAM_ID> \
  -H "Authorization: Bearer $TOKEN"

# AI Summary endpoints (require AI_API_KEY configured)
curl http://localhost:4000/api/v1/ai-summary/drafts -H "Authorization: Bearer $TOKEN"
curl -X POST http://localhost:4000/api/v1/ai-summary/<SCHOOL_ID>/regenerate -H "Authorization: Bearer $TOKEN"
curl -X POST http://localhost:4000/api/v1/ai-summary/drafts/<DRAFT_ID>/approve -H "Authorization: Bearer $TOKEN"
curl -X POST http://localhost:4000/api/v1/ai-summary/drafts/<DRAFT_ID>/reject -H "Authorization: Bearer $TOKEN"
curl -X POST http://localhost:4000/api/v1/ai-summary/batch/regenerate-all -H "Authorization: Bearer $TOKEN"
```

### 7.5 Testing with Postman / Insomnia

1. Create a **collection** with the base URL `http://localhost:4000/api/v1`.
2. Add a **Login** request → save the `token` from the response as a collection variable.
3. For protected routes, set the header `Authorization: Bearer {{token}}`.
4. Use the **Environment** feature to store `schoolId`, `programId`, `draftId` from responses.

### 7.6 Testing with a REST Client (VS Code)

Create a `.http` file (e.g., `Backend/test.http`):

```http
### Health
GET http://localhost:4000/api/v1/health

### Login
POST http://localhost:4000/api/v1/admin/login
Content-Type: application/json

{ "email": "admin@lewahub.com", "password": "your-password" }

### List schools
GET http://localhost:4000/api/v1/schools?page=1&limit=10

### Get school (replace ID)
GET http://localhost:4000/api/v1/schools/REPLACE_WITH_ID

### Create school (replace TOKEN)
POST http://localhost:4000/api/v1/schools
Authorization: Bearer REPLACE_WITH_TOKEN
Content-Type: application/json

{
  "name": "Test University",
  "category": "University",
  "description": "A test university",
  "region": "Centre",
  "city": "Yaoundé",
  "address": "123 Main St",
  "latitude": 3.8480,
  "longitude": 11.5021
}
```

### 7.7 Expected Error Responses (for verification)

| Scenario                               | Expected Status | Body                                                        |
| -------------------------------------- | --------------- | ----------------------------------------------------------- |
| Missing/invalid JWT on protected route | `401`           | `{ "error": "UNAUTHORIZED" }`                               |
| Invalid login credentials              | `401`           | `{ "error": "Invalid email or password" }`                  |
| Login rate limit exceeded (5/15min)    | `429`           | `{ "message": "Too many login attempts..." }`               |
| Invalid school payload (Zod)           | `400`           | `{ "error": "...", "details": [...] }`                      |
| School not found                       | `404`           | `{ "error": "School not found" }`                           |
| Unknown route                          | `404`           | `{ "error": "Route not found" }`                            |
| Search query < 2 chars                 | `400`           | `{ "error": "Search query must be at least 2 characters" }` |
| Missing lat/lng on nearby              | `400`           | `{ "error": "Latitude and longitude required" }`            |
| `/evaluations/*` (broken)              | `404`           | `{ "error": "Route not found" }`                            |

### 7.8 Known Issues to Expect While Testing

1. **`PUT /schools/:id` returns 400** — the `.strict()` Zod schema rejects the extra fields the admin form sends (see section 2.1). Test with only schema-defined fields to confirm the endpoint works, then fix the schema.
2. **`/schools/nearby` and `/geolocation/nearby` fail** if PostGIS isn't enabled — run `CREATE EXTENSION postgis;` first.
3. **`/search` falls back to keyword search** if `AI_API_KEY` isn't set — this is expected behavior.
4. **`/evaluations/*` always 404** — the module doesn't exist (see section 1.1).

---

_Generated by AI code audt_
