# 🎓 LewaHub

**Find the right verified school**

A school discovery platform for Cameroon — covering Primary/Nursery, Secondary, and University
schools, with location-based search, verified student ratings, and an admin panel for managing
the catalog.

![status](https://img.shields.io/badge/status-in%20development-teal)

---

## 📖 Overview

LewaHub helps parents and students in Cameroon discover and evaluate schools with confidence.
Institutions are searchable by region, level, and program, locatable on a map, and rated by students
who have verified their enrollment — so ratings reflect real experience, not anonymous reviews.

The platform has two sides:

- **Public site** — fully anonymous browsing, no account required
- **Admin panel** — staff-only, for managing the institution catalog

---

## ✨ Features

### Public Site

- 🔍 **Search & filter** — Region, Level (Nursery/Primary/Secondary/University), Language of
  instruction, Ownership, Boarding/Day, Programs, Minimum rating
- 🗺️ **Interactive map** — real institution locations, "find near me" support
- 🏫 **Institution profiles** — description, programs, verified rating, location, contact info,
  related institutions
- ⭐ **Verified ratings** — only students who confirm enrollment (via receipt, school ID, or
  matricule) can rate a school; only the aggregate average and count are shown publicly
- 🌍 **Bilingual** : full French / English toggle across the entire site
- 📱 **Fully responsive** : mobile-first design, works on any screen size

### Admin Panel

- 🔐 Secure staff login
- 📊 Dashboard with live catalog stats
- 🏫 Full CRUD on schools — add, edit, delete, all reflected instantly on the public site
- 🧩 Smart forms — fields adapt to the school's category (a Primary/Nursery form looks
  different from a University's); Secondary schools can optionally flag `offersHighSchool`
  to indicate they also run Lower/Upper Sixth alongside O-Level

---

## 🗂️ School Category Model

LewaHub uses exactly **3 categories**, matching the database schema:

| Category value   | Displayed as      | Notes                                                                                   |
| ---------------- | ----------------- | --------------------------------------------------------------------------------------- |
| `PrimaryNursery` | Primary / Nursery | Nursery and primary schools combined                                                    |
| `Secondary`      | Secondary         | May have `offersHighSchool: true` for schools that also run A-Level (Lower/Upper Sixth) |
| `University`     | University        | Includes colleges and technical institutes                                              |

There is no separate "High School" category — a secondary school that offers both O-Level and
A-Level is a single `Secondary` record with `offersHighSchool: true`.

---

## 🛠️ Tech Stack

| Layer    | Technology                                              |
| -------- | ------------------------------------------------------- |
| Frontend | React · Vite · TypeScript · Tailwind CSS · React Router |
| Maps     | Leaflet + OpenStreetMap                                 |
| Backend  | Node.js · Express                                       |
| Database | PostgreSQL + PostGIS                                    |
| ORM      | Prisma                                                  |
| Auth     | JWT + bcrypt                                            |

**Architecture:** the backend follows a layered pattern (`routes → controllers → services →
repositories`), organized into feature modules (institutions, programs, geolocation, evaluations,
search, admin). The frontend mirrors this with a `features/<name>/` structure per page.

---

## 📂 Project Structure

```
LewaHub/
├── Frontend/
│   └── src/
│       ├── components/        # shared layout — Navbar, Footer
│       ├── features/
│       │   ├── home/
│       │   ├── search/
│       │   ├── school-details/
│       │   ├── contact/
│       │   ├── about/
│       │   └── admin/
│       ├── lib/                # shared API client
│       └── App.tsx             # route definitions
│
└── Backend/
    ├── src/
    │   ├── modules/
    │   │   ├── schools/
    │   │   ├── programs/
    │   │   ├── geolocation/
    │   │   ├── search/
    │   │   └── admin/
    │   ├── middleware/
    │   └── config/
    └── prisma/
        ├── schema.prisma
        └── seed.js
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL with the PostGIS extension

### 1. Clone the repo

```bash
git clone https://github.com/ChiaVoltaire07/LewaHub.git
cd LewaHub
```

### 2. Set up the database

```sql
CREATE DATABASE lewahub;
\c lewahub
CREATE EXTENSION postgis;
```

### 3. Backend

```bash
cd Backend
npm install
cp .env.example .env   # then fill in DATABASE_URL, JWT_SECRET
npx prisma migrate dev
npm run seed
npm run dev
```

Runs at `http://localhost:4000`.

### 4. Frontend

```bash
cd Frontend
npm install
echo "VITE_API_BASE_URL=http://localhost:4000/api/v1" > .env
npm run dev
```

Runs at `http://localhost:5173`.

### 5. Admin access

Visit `/admin/login` using the admin account created by the seed script.

---

## 🔒 Security

- All admin write operations require a valid JWT
- Passwords hashed with bcrypt
- Input validation on every write endpoint
- Rate limiting on public and auth endpoints

---

## 👥 Team

Built collaboratively by a team of student developers in Cameroon.

---

## 📄 License

This project is currently unlicensed / for academic use. Add a license file if you plan to open-source it.
