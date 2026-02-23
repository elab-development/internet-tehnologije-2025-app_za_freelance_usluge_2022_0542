# Moj Vodič — Freelance App

Lični cheat-sheet za sve što treba znati o projektu.

---

## Šta je ova aplikacija

Freelance platforma koja spaja **klijente** (firme/osobe koje imaju posao) i **freelancere** (programeri/dizajneri koji traže posao).

- Klijent objavi projekat sa opisom i budžetom
- Freelancer ponudi svoju cenu (bid)
- Klijent prihvati najboljeg freelancera
- Projekat prelazi u status "In Progress"

---

## Live aplikacija (Railway)

| Šta | URL |
|-----|-----|
| **Frontend** (aplikacija) | https://internet-tehnologije-2025-appzafreelanceuslug-production.up.railway.app |
| **Backend API** | https://dynamic-exploration-production-2a6d.up.railway.app |
| **Swagger dokumentacija** | https://dynamic-exploration-production-2a6d.up.railway.app/docs |
| **Health check** | https://dynamic-exploration-production-2a6d.up.railway.app/health |

---

## Kako ugasiti/pauzirati Railway (da ne troši besplatne sate)

Railway daje **500 sati besplatno mesečno** na hobby planu. Kada ne koristiš app, možeš pauzirati servise.

### Pauziranje (preporučeno — podaci ostaju, lako se ponovo upali)
1. Idi na [railway.app](https://railway.app) → Personal workspace → tvoj projekat
2. Klikni na servis (npr. `dynamic-exploration`)
3. Gore desno → tri tačke `...` → **"Pause"**
4. Ponovi za frontend servis
5. **PostgreSQL NE pauzirati** (baza mora biti online da bi migracije radile)

### Brisanje (trajno — gubi se sve)
- Tri tačke → **"Delete"** → potvrdi naziv servisa
- Koristiti samo ako zaista ne treba više

### Kako ponovo upaliti
- Tri tačke → **"Resume"** ili klikni **"Deploy"**

---

## Kako koristiti aplikaciju

### Registracija
1. Otvori frontend URL
2. Klikni **"Register here"** na login stranici
3. Unesi email, lozinku i odaberi ulogu:
   - **CLIENT** — ako objavljuješ projekte
   - **FREELANCER** — ako tražiš projekte
4. Klikni Register → automatski si prebačen na dashboard

---

### Flow za CLIENT-a

**Korak 1 — Kreiraj projekat**
- Dashboard → klikni **"Create Project"** (plavo dugme) ili **"New Project"** u navbaru
- Popuni: naziv, opis, budžet (min/max u RSD), deadline
- Klikni Submit → projekat je vidljiv svim freelancerima

**Korak 2 — Čekaj bidove**
- Dashboard → **"My Projects"** → klikni na projekat
- Vidiš listu svih bidova sa iznosom i porukom freelancera

**Korak 3 — Prihvati bid**
- Na stranici projekta → pored bida klikni **"Accept"**
- Projekat prelazi u status **IN_PROGRESS**
- Ostali bidovi su automatski odbijeni

---

### Flow za FREELANCER-a

**Korak 1 — Pregledaj projekte**
- Dashboard → klikni **"Browse Projects"** ili **"Explore"** u navbaru
- Vidiš sve projekte sa statusom OPEN

**Korak 2 — Postavi bid**
- Klikni na projekat → **"Place a Bid"**
- Unesi iznos (u RSD) i poruku zašto si dobar kandidat
- Klikni Submit

**Korak 3 — Ažuriraj profil**
- Dashboard → navbar → **"My Profile"** (vidljivo samo za FREELANCER-e)
- Popuni: titulu (npr. "Full Stack Developer"), kratki opis, GitHub URL
- Profil je vidljiv klijentima na stranici `/freelancers`

**Korak 4 — Prati svoje bidove**
- Dashboard → **"My Bids"** → vidiš status svakog bida (PENDING / ACCEPTED / REJECTED)

---

## Stranice aplikacije

| Stranica | URL | Ko ima pristup |
|----------|-----|----------------|
| Login | `/login` | svi |
| Register | `/register` | svi |
| Dashboard | `/dashboard` | ulogovani |
| Lista projekata | `/projects` | svi |
| Novi projekat | `/projects/new` | CLIENT |
| Moji projekti + bidovi | `/my-projects` | CLIENT |
| Projekat detalji | `/my-projects/[id]` | CLIENT |
| Moji bidovi | `/my-bids` | FREELANCER |
| Moj profil | `/me/profile` | FREELANCER |
| Lista freelancera | `/freelancers` | svi |

---

## Šta je sve dodato u projektu (za odbranu)

### Funkcionalnosti

| Šta | Gde | Zašto |
|-----|-----|-------|
| **Autentifikacija** | `/auth/login`, `/auth/register` | Korisnici se prijavljuju i registruju, JWT token čuva sesiju |
| **Upravljanje projektima** | `/projects`, `/my-projects` | Klijenti kreiraju projekte, freelanceri ih pregledaju |
| **Bidovanje** | `/projects/[id]` | Freelanceri postavljaju ponude, klijenti prihvataju najboljeg |
| **Freelancer profili** | `/me/profile`, `/freelancers` | Freelanceri unose bio i GitHub, klijenti mogu da ih pregledaju |
| **Statistike** | Dashboard → grafovi | Recharts vizualizacija projekata i bidova po statusu |
| **EUR konverzija** | Detalji projekta | Budžet u RSD automatski konvertovan u EUR (Exchange Rate API) |
| **GitHub integracija** | Lista freelancera | Prikazuje se avatar i broj repo-a sa GitHub profila |

### Tehničke implementacije

| Šta | Tehnologija | Napomena |
|-----|-------------|----------|
| **Docker** | Dockerfile + docker-compose.yml | Multi-stage build, health check na bazi |
| **Swagger UI** | @fastify/swagger + @fastify/swagger-ui | Dostupno na `/docs` |
| **Bezbednost** | Helmet + Rate Limiting | 100 req/min po IP-u, zaštita headera |
| **Testovi** | Vitest (20 testova) | Pokrivaju password hash, HTTP errors, normalizaciju |
| **CI/CD** | GitHub Actions | Automatski testovi i build na svakom push-u |
| **Cloud deploy** | Railway | Backend + Frontend + PostgreSQL |
| **Eksterni API-ji** | Exchange Rate API, GitHub API | Valuta + GitHub podaci freelancera |

---

## Kako pokrenuti lokalno

### Šta ti treba pre pokretanja
- **Node.js 20+** — provjeri sa `node -v` u terminalu
- **PostgreSQL** — baza podataka (može i bez ako koristiš Docker)
- **Git** — za kloniranje repo-a

### Opcija A — bez Dockera

Otvori terminal (PowerShell ili cmd) i uradi:

```bash
# Kloniraj projekat (ako već nemaš)
git clone https://github.com/tvoj-username/repo-name.git
cd repo-name

# Backend — terminal 1
cd backend
cp .env.example .env
# Uredi .env i postavi DATABASE_URL na svoju PostgreSQL bazu
npm install
npx prisma migrate dev
npm run dev
# Backend radi na http://localhost:4000

# Frontend — terminal 2 (novi prozor)
cd frontend
# Kreiraj .env.local fajl sa:
# NEXT_PUBLIC_API_URL=http://localhost:4000
npm install
npm run dev
# Frontend radi na http://localhost:3000
```

### Opcija B — sa Dockerom (lakše)

```bash
# Pokreni sve odjednom (PostgreSQL + Backend + Frontend)
docker-compose up --build

# Zaustavi
docker-compose down
```

Aplikacija je dostupna na http://localhost:3000

---

## Tehnologije — jedno-rečenično objašnjenje

| Tehnologija | Šta radi |
|-------------|----------|
| **Next.js** | React framework koji generiše stranice na serveru i klientu |
| **React** | JavaScript biblioteka za pravljenje UI komponenti |
| **Tailwind CSS** | CSS framework — stilovi se pišu direktno u HTML klase |
| **Fastify** | Brzi Node.js web server za API endpoint-e |
| **TypeScript** | JavaScript sa tipovima — sprječava greške u kodu |
| **Prisma** | ORM — TypeScript interfejs za bazu podataka umjesto SQL-a |
| **PostgreSQL** | Relaciona baza podataka za čuvanje korisnika, projekata, bidova |
| **JWT** | Token koji dokazuje da si ulogovan (čuva se u localStorage) |
| **Docker** | Kontejner koji pakuje aplikaciju sa svim zavisnostima |
| **Railway** | Cloud platforma — server u oblaku gdje živi aplikacija |
| **Vitest** | Test runner za TypeScript/JavaScript kod |
| **GitHub Actions** | Automatski pokreće testove i build pri svakom push-u na GitHub |
| **Recharts** | React biblioteka za crtanje grafova i dijagrama |
| **Swagger** | Auto-generisana dokumentacija API endpoint-a sa interaktivnim UI |
| **Helmet** | Dodaje sigurnosne HTTP headere (zaštita od XSS, clickjacking itd.) |
| **Zod** | Validacija podataka — provjerava da li su inputi ispravnog oblika |
| **Bcrypt** | Hash-uje lozinke — ne čuva se "test123" nego kriptovani string |

---

## Git grane

```
main        ← produkciona verzija (ono što je na Railway)
develop     ← integraciona grana (spajanje feature-a)
feature/auth        ← autentifikacija
feature/dashboard   ← dashboard i komponente
```

Workflow: raditi na feature grani → merge u develop → merge u main → Railway deploy
