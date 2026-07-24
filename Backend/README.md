# LewaHub Backend — Part 1: Core Catalog

## Setup

```bash
npm install
cp .env.example .env        # then fill in your real DATABASE_URL
npm run prisma:migrate      # creates the Institution and Program tables
npm run prisma:seed         # loads sample data
npm run dev                 # starts the API on http://localhost:3000
```

## Try it

```
GET  http://localhost:3000/health
GET  http://localhost:3000/api/institutions
GET  http://localhost:3000/api/institutions/:id
POST http://localhost:3000/api/institutions
GET  http://localhost:3000/api/institutions/:id/programs
```

Use Thunder Client (VS Code extension) to send requests — see the create-institution
body shape in `src/validators/institution.schema.ts`.

## Notes for Part 2 and Part 3

- Add your models to `prisma/schema.prisma` below the existing ones, then run
  `npm run prisma:migrate` again.
- Mount your routers in `src/app.ts` where the comment says to.
- The `TODO: Part 2 adds requireAuth here` comments in the routes files mark exactly
  where your auth middleware plugs in — no route logic needs to change, just add
  `requireAuth` (and `requireRole` where relevant) as an extra argument before the
  controller function.
