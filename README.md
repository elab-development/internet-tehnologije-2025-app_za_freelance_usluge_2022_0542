# Freelance App

Platforma za freelance angažmane koja povezuje klijente i freelancere. Klijenti objavljuju projekte, freelanceri postavljaju ponude (bidove), a klijenti prihvataju najboljeg kandidata.

## Tehnologije

| Sloj | Tehnologija |
|------|------------|
| Frontend | Next.js 16, React 19, Tailwind CSS |
| Backend | Fastify 5, TypeScript, Prisma ORM |
| Baza | PostgreSQL 16 |
| Auth | JWT (@fastify/jwt) |
| Kontejnerizacija | Docker, Docker Compose |
| API Docs | Swagger UI (`/docs`) |

## Tipovi korisnika

- **CLIENT** — objavljuje projekte, pregledava i prihvata ponude
- **FREELANCER** — pregledava projekte, postavlja ponude, ažurira profil
- **ADMIN** — upravljanje platformom

## Pokretanje

### Lokalno (bez Dockera)

**Preduslovi:** Node.js 20+, PostgreSQL

```bash
# 1. Backend
cd backend
cp .env.example .env        # podesiti DATABASE_URL
npm install
npx prisma migrate dev
npm run dev                 # http://localhost:4000

# 2. Frontend (novi terminal)
cd frontend
cp .env.local.example .env.local   # ili kreirati .env.local sa:
# NEXT_PUBLIC_API_URL=http://localhost:4000
npm install
npm run dev                 # http://localhost:3000
```

### Docker Compose

```bash
docker-compose up --build
```

Aplikacija je dostupna na:
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000
- Swagger docs: http://localhost:4000/docs

## API Dokumentacija

Swagger UI je dostupan na `http://localhost:4000/docs` nakon pokretanja backenda.

Glavne rute:

| Metoda | Ruta | Opis | Auth |
|--------|------|------|------|
| POST | `/auth/register` | Registracija | — |
| POST | `/auth/login` | Prijava | — |
| GET | `/auth/me` | Trenutni korisnik | JWT |
| GET | `/projects` | Lista otvorenih projekata | — |
| POST | `/projects` | Kreiranje projekta | CLIENT |
| GET | `/me/projects` | Moji projekti | CLIENT |
| POST | `/projects/:id/bids` | Postavljanje ponude | FREELANCER |
| GET | `/projects/:id/bids` | Ponude na projektu | CLIENT |
| POST | `/bids/:id/accept` | Prihvatanje ponude | CLIENT |
| GET | `/me/bids` | Moje ponude | FREELANCER |
| GET | `/freelancers` | Lista freelancera | — |
| PUT | `/me/profile` | Ažuriranje profila | FREELANCER |
| GET | `/stats` | Statistike platforme | — |
| GET | `/health` | Health check | — |

## Sigurnost

- **JWT autentifikacija** — zaštita svih mutacija
- **CORS** — konfigurisan za dozvoljene origin-e
- **Helmet** — HTTP sigurnosni headeri (XSS, Clickjacking, MIME sniffing...)
- **Rate limiting** — max 100 zahteva/minuti po IP-u (zaštita od brute-force)
- **Zod validacija** — validacija svih ulaznih podataka
- **Bcrypt** — hash lozinki (10 rounds)
- **Prisma ORM** — zaštita od SQL injection-a (parametrizovani upiti)

## Struktura projekta

```
freelance-app2/
├── backend/
│   ├── src/
│   │   ├── routes/       # auth, projects, bids, freelancers, stats
│   │   ├── services/     # poslovna logika
│   │   ├── middleware/   # JWT guards
│   │   ├── utils/        # validacija, greške
│   │   └── server.ts     # entry point
│   └── prisma/
│       ├── schema.prisma
│       └── migrations/
├── frontend/
│   └── app/
│       ├── components/   # reusable komponente (Button, Card, InputField...)
│       ├── hooks/        # useAuth, useAsync, useRequireRole...
│       ├── services/     # API pozivi
│       └── (stranice)/   # dashboard, projects, my-projects, my-bids...
├── docker-compose.yml
└── README.md
```

## Git grane

- `main` — stabilna produkciona verzija
- `develop` — integraciona grana
- `feature/auth` — implementacija autentifikacije
- `feature/dashboard` — implementacija dashboard-a
