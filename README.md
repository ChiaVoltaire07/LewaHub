# Lewahub

A school discovery catalog platform for post-secondary and secondary institutions in Cameroon. Parents and students search, filter, and compare schools by location, curriculum system, and programs — with no account required to browse.

![status](https://img.shields.io/badge/status-in%20development-teal)


---

## Table of Contents

- [Overview](#overview)
-
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Connecting to a Real Backend](#connecting-to-a-real-backend)
- [Design Decisions](#design-decisions)
- [Roadmap](#roadmap)
- [Contributing](#contributing)


---

## Overview

Lewahub centralizes school information that is currently scattered across word-of-mouth and informal channels — location, fees, curriculum type (Anglophone / Francophone / Bilingual), accreditation, and programs offered — into a single, publicly browsable catalog.

Unlike a typical review-aggregation site, Lewahub does not rely on public user reviews as its trust signal. Instead, school quality is communicated through:

- An **in-house evaluation program**, where the platform team directly assesses selected students and records a school-level score
- **Admin-reviewed AI content** — natural-language search and weekly AI-drafted summaries, never auto-published without human approval

There is no login for the general public. Browsing, searching, and viewing school details work anonymously. Authentication exists only for the admin team managing listings, evaluations, and content review.

## Key Features

**Public site**
- Anonymous browsing ,that is  no account required
- Keyword, region, curriculum type, fee range, boarding, and program/specialty filters
- "Schools near you" on Home, using live geolocation with a graceful fallback to featured schools
- Interactive map (Leaflet + OpenStreetMap) synced with search results , hover a card to highlight its pin, click a pin to highlight its card
- School detail pages with subschools, programs, certificate types, and multi-campus support
- "Not yet evaluated" vs "Evaluated" status shown transparently. No misleading star ratings
- Related-school recommendations
- Public contact form and listing-update-request flow (no account needed)

**Admin panel** (authenticated)
- Dashboard with pending submissions, evaluations, and AI-review counts
- Add / edit / delete school listings, including subschools, programs, and campuses
- Evaluation recording, with student identity verification (receipt / school ID / matricule) stored only as a **hashed reference** — never the raw document or number
- AI-generated content review queue (approve/reject before anything goes live)
- Listing update request queue

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend framework | React 18 + TypeScript + Vite |
| Planned backend | Express + TypeScript, Prisma, PostgreSQL + PostGIS |
| Styling | Tailwind CSS v4 |
| Routing | React Router v6 |
| Data fetching / caching | TanStack Query |
| Forms & validation | React Hook Form + Zod |
| Maps | Leaflet + React-Leaflet (OpenStreetMap tiles) |
| Mock API (development) | Mock Service Worker (MSW) |


## Project Structure

```
src/
├── api/            # One function per backend endpoint (schools.ts, admin.ts, client.ts)
├── types/          # TypeScript models matching the database schema
├── mocks/          # MSW request handlers + seed data (development only)
├── hooks/          # useAuth (admin session), useGeolocation
├── layouts/        # PublicLayout (bottom nav mobile / top nav desktop), AdminLayout (sidebar)
├── components/      # SchoolCard, MapView, and shared building blocks
│   └── ui/          # Badge, Accordion, loading/empty/error states
└── pages/
    ├── admin/        # Login, Dashboard, ManageSchools, SchoolForm, Evaluations, AiReview, ListingRequests
    └── ...           # Home, Search, SchoolDetails, About, Contact
```

## Getting Started

**Requirements:** Node.js 18+ and npm.

```bash
git clone <your-repo-url>
cd lewahub
npm install
npm run dev
```

Open the local URL printed in your terminal (typically `http://localhost:5173`).

The app runs fully client-side against **mock data** in development — no backend setup required to explore it. MSW intercepts API calls and returns realistic sample data: ~20 schools across five regions, a mix of evaluated/not-yet-evaluated listings, and sample subschools, programs, and campuses.

To sign in to the admin panel at `/admin/login`, use any email address with a password of 4 or more characters.

## Environment Variables

Create a `.env` file (see `.env.example`):

```
VITE_API_BASE_URL=/api
```

Point this at your real API's base URL once a backend is available.

## Connecting to a Real Backend

The frontend is architected so switching from mock to live data requires **no component or hook changes**:

1. Set `VITE_API_BASE_URL` to your deployed API's URL.
2. Delete the `src/mocks/` directory.
3. Remove the MSW bootstrap block in `src/main.tsx` (marked with a comment).

Every function in `src/api/` already calls real REST-style paths (`GET /schools`, `POST /evaluations`, etc.)  MSW was simply intercepting those same paths locally. The intended backend pairing is Express + Prisma + PostgreSQL with the PostGIS extension enabled for proximity search.

## Design Decisions

A few intentional choices worth knowing before contributing:

- **No public accounts or reviews.** This was a deliberate pivot away from a review-based trust model, to avoid the moderation and fraud burden of open public reviews at small-team scale.
- **Student verification data is never stored raw.** Evaluation records keep only a one-way hashed reference to the verification method used (receipt / school ID / matricule) never the document, image, or number itself.
- **AI content is never auto-published.** Natural-language search falls back to keyword search on low confidence or timeout; weekly AI-drafted summaries sit in an admin queue until approved.


## Roadmap

- [ ] Connect to live Express/Prisma/PostgreSQL backend
- [ ] Marker clustering on the map for higher listing density
- [ ] Offline/PWA support with cached tiles and skeleton states
- [ ] Natural-language search parsing via an LLM API
- [ ] Weekly AI-drafted school summaries with source tracking

## Contributing

Issues and pull requests are welcome. Please open an issue describing the change before submitting a PR for anything beyond a small fix.

