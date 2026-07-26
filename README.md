# Nexo — Personal Expense Tracker

Nexo is a full-stack expense tracking application with JWT authentication, category-based budgeting, and spending analytics. Built as a learning project covering backend API design, frontend state management, and cloud deployment.

**Live demo:** _add your Vercel URL here after deployment_
**API docs:** _add your Railway Swagger UI URL here after deployment_

---

## Tech Stack

**Backend**
- Java 21 · Spring Boot 4.1 · Spring Security · Spring Data JPA
- PostgreSQL (Docker locally, Railway in production)
- JWT authentication (JJWT 0.12.6)
- springdoc-openapi (Swagger UI)
- Maven

**Frontend**
- React 19 · Vite · React Router
- Tailwind CSS v4
- Chart.js (via react-chartjs-2)
- Axios

**Deployment**
- Backend + PostgreSQL: Railway (Docker)
- Frontend: Vercel

---

## Features

- **Auth** — Register/login with JWT, BCrypt password hashing, stateless sessions
- **Categories** — Preset categories seeded on registration (Food, Transport, Bills, Entertainment, Shopping, Others) plus custom user-defined categories
- **Expenses** — Full CRUD with filtering by category and date range
- **Budgets** — Monthly per-category limits with live spend tracking and over-budget alerts
- **Dashboard** — Monthly overview: total spent, budget, remaining, transaction count, category breakdown (donut chart), spending trend (line chart)
- **Reports** — Category vs. budget comparison, spending trends
- **Calculator** — Basic arithmetic widget built into the app
- **API documentation** — Interactive Swagger UI with JWT bearer-auth support

---

## Project Structure

```
Nexo Expense Tracker/
├── backend/                 # Spring Boot API
│   ├── src/main/java/com/nexo/expensetracker/
│   │   ├── config/          # Security, OpenAPI config
│   │   ├── controller/      # REST endpoints
│   │   ├── dto/              # Request/response payloads
│   │   ├── entity/           # JPA entities
│   │   ├── repository/       # Spring Data repositories
│   │   ├── security/          # JWT filter, util, UserDetailsService
│   │   ├── service/           # Business logic
│   │   └── specification/     # JPA Specifications (dynamic expense filtering)
│   ├── src/main/resources/
│   │   └── application.yml    # dev/prod/test profiles
│   ├── docker-compose.yml     # Local PostgreSQL
│   ├── Dockerfile             # Production build (Railway)
│   ├── .env.example
│   └── run-dev.ps1            # Loads .env and starts the app (Windows)
│
└── frontend/                 # React SPA
    └── src/
        ├── api/               # Axios service functions per resource
        ├── components/        # Sidebar, Topbar, Layout, modals, shared UI
        ├── context/           # AuthContext (JWT + user state)
        └── pages/             # Login, Register, Dashboard, Expenses,
                                 # Categories, Budgets, Reports, Calculator, Settings
```

---

## Local Development Setup

### Prerequisites
- JDK 21+
- Node.js LTS
- Docker Desktop
- Maven wrapper is included — no global Maven install needed

### Backend

```powershell
cd backend

# Copy the env template and fill in real values
cp .env.example .env

# Start local PostgreSQL
docker compose up -d

# Build and run (loads .env automatically)
.\mvnw.cmd clean install -DskipTests
.\run-dev.ps1
```

Backend runs at `http://localhost:8080`. Swagger UI: `http://localhost:8080/swagger-ui/index.html`

### Frontend

```powershell
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

---

## Environment Variables

See `backend/.env.example` for the full list. Required:

| Variable | Description |
|---|---|
| `DB_NAME`, `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` | Local PostgreSQL connection |
| `JWT_SECRET` | Base64 secret for signing JWTs (generate a long random value — never reuse across dev/prod) |
| `JWT_EXPIRATION_MS` | Token lifetime in milliseconds (default: 86400000 = 24h) |
| `SPRING_PROFILES_ACTIVE` | `dev`, `prod`, or `test` |

Frontend uses `VITE_API_URL` (see `.env.example` in `frontend/` if present) to point at the backend — defaults to `http://localhost:8080/api` if unset.

---

## API Overview

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create account, auto-seeds preset categories |
| POST | `/api/auth/login` | Returns JWT |
| GET/POST/PUT/DELETE | `/api/categories` | Category CRUD |
| GET/POST/PUT/DELETE | `/api/expenses` | Expense CRUD, supports `categoryId`/`startDate`/`endDate` filters |
| GET/POST/PUT/DELETE | `/api/budgets` | Budget CRUD, scoped per category + month |
| GET | `/api/summary?month=YYYY-MM` | Monthly totals + category breakdown |

Full interactive docs available via Swagger UI once the backend is running.

---

## Deployment

- **Backend + DB**: Deployed to Railway via the included `Dockerfile`; PostgreSQL provisioned as a linked Railway service. Production config reads `DATABASE_URL`, `JWT_SECRET`, and `JWT_EXPIRATION_MS` from Railway environment variables (`SPRING_PROFILES_ACTIVE=prod`).
- **Frontend**: Deployed to Vercel with `VITE_API_URL` pointing at the Railway backend's public URL.

---

## Notes

- Passwords are hashed with BCrypt; JWTs are signed with HMAC-SHA and validated on every request via a custom `OncePerRequestFilter`.
- Expense filtering uses JPA Specifications rather than raw JPQL with nullable parameters, avoiding PostgreSQL parameter-type-inference issues with optional filters.
- The Settings/Profile page currently updates local UI state only — no backend endpoint exists yet for persisting profile changes.
