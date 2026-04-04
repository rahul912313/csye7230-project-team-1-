# QuickRent — Vehicle Rental Management Platform

> A full-stack vehicle rental platform with real-time availability, secure Stripe payments, interactive map search, and an AI-powered chatbot assistant.

![Backend CI](https://github.com/rahul912313/csye7230-project-team-1-/actions/workflows/backend-ci.yml/badge.svg)
![Frontend CI](https://github.com/rahul912313/csye7230-project-team-1-/actions/workflows/frontend-ci.yml/badge.svg)

**Course:** CSYE 7230 — Software Engineering, Northeastern University, Spring 2026
**Team:** Rahul Patil · Silin Zhang · Syed Rizvi · Misha Patel · Saumya Gorantala

---

## Features

- **User Authentication** — JWT-based registration and login with bcrypt password hashing and role-based access control
- **Vehicle Discovery** — Browse vehicles by type, filter by availability, and find nearby vehicles using an interactive Leaflet map with Haversine distance search
- **Two-Phase Booking** — Request a price quote (Phase 1), then confirm with Stripe payment (Phase 2). MongoDB TTL index prevents double-bookings automatically
- **Secure Payments** — Stripe integration with webhook processing, idempotency checking, and transaction lifecycle management
- **AI Chatbot** — Hugging Face-powered assistant with keyword-based fallback responses for instant replies without API calls
- **Admin Dashboard** — Full fleet, user, booking, and transaction management with Recharts analytics (bookings trend, revenue by type, fleet distribution)
- **Push Notifications** — Firebase Admin SDK for booking confirmation and cancellation alerts

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS, Redux |
| Backend | Node.js 20, Express 4 |
| Database | MongoDB Atlas + Mongoose ODM |
| Authentication | JWT + bcrypt |
| Payments | Stripe SDK |
| Notifications | Firebase Admin SDK |
| AI Chatbot | Hugging Face Inference API |
| Maps | Leaflet.js |
| Analytics | Recharts |
| Testing | Jest 29 — 76 passing tests |
| API Docs | JSDoc 4 |
| CI/CD | GitHub Actions |

---

## Architecture & Design Patterns

QuickRent follows an N-Tier architecture with a Layered backend structure and MVC frontend pattern.

| Pattern | Location | Role |
|---------|----------|------|
| **Singleton** | `backend/db.js` | Single shared MongoDB connection across the entire application |
| **Repository** | `backend/repositories/` | Abstracts all database operations — enables full unit testing without a live DB |
| **Strategy** | `backend/services/payment/` | Interchangeable payment providers — StripePaymentStrategy implements PaymentStrategy |
| **Factory Method** | `backend/services/notification/` | Creates Push, Email, or SMS notification objects from a type string |

---

## Repository Structure

```
quickrent/
├── backend/                    # Node.js + Express REST API
│   ├── controllers/            # HTTP request handlers
│   ├── services/               # Business logic (Strategy + Factory patterns)
│   ├── repositories/           # Data access layer (Repository pattern)
│   ├── models/                 # MongoDB schemas
│   ├── routes/                 # Express routes (admin + user)
│   ├── middlewares/            # JWT auth, role check, validation
│   ├── docs/
│   │   ├── api/                # JSDoc generated HTML documentation
│   │   ├── uml/                # PlantUML class diagrams
│   │   └── wiki/               # User manual markdown source
│   ├── __tests__/              # Jest unit test suites (76 tests)
│   ├── db.js                   # Singleton database connection
│   ├── jsdoc.json              # JSDoc configuration
│   └── README.md               # Backend setup and API reference
├── frontend/                   # Next.js 14 TypeScript frontend
│   ├── src/
│   │   ├── app/                # Next.js app router pages
│   │   ├── components/         # React components (vehicles, bookings, admin, map, chatbot)
│   │   ├── services/           # API service layer
│   │   ├── store/              # Redux state management
│   │   └── types/              # TypeScript type definitions
│   └── README.md
├── .github/
│   └── workflows/
│       ├── backend-ci.yml      # Backend CI — tests + build
│       └── frontend-ci.yml     # Frontend CI — lint + build
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Stripe account (test keys work fine)
- Hugging Face API key (free tier)
- Firebase project with Admin SDK credentials

### 1. Clone the Repository

```bash
git clone https://github.com/rahul912313/csye7230-project-team-1-.git
cd csye7230-project-team-1-
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `backend/config/.env`:

```env
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/quickrent
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
HUGGINGFACE_API_KEY=your_huggingface_key
NODE_ENV=development
PORT=5000
```

```bash
npm run dev      # Development server with hot reload (nodemon)
npm start        # Production server
```

API available at `http://localhost:5000/api`

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

```bash
npm run dev
```

Application available at `http://localhost:3000`

---

## Testing

```bash
cd backend
npm test                  # Run all 76 tests
npm run test:coverage     # Run with lcov coverage report
```

Coverage report is generated at `backend/coverage/lcov-report/index.html`.

| Test File | Tests | What It Covers |
|-----------|-------|----------------|
| `__tests__/userService.test.js` | 14 | Registration, login, profile, password hashing |
| `__tests__/adminService.test.js` | 12 | Admin creation, login, user management |
| `__tests__/chatbotService.test.js` | 20 | Keyword fallback, HuggingFace API, error handling |
| `__tests__/baseRepository.test.js` | 22 | CRUD, pagination, soft delete, text search |
| `__tests__/db.test.js` | 7 | Singleton pattern — connection instance |
| `__tests__/notificationFactory.test.js` | 5 | Factory Method pattern — notification types |

All services are tested in isolation using Jest mocks — no live database required.

---

## API Documentation

Generated from JSDoc comments using:

```bash
cd backend
npm run docs
```

Documentation is available at `backend/docs/api/index.html` and online at:
https://htmlpreview.github.io/?https://raw.githubusercontent.com/rahul912313/csye7230-project-team-1-/main/backend/docs/api/index.html

---

## CI/CD

| Pipeline | File | Trigger |
|----------|------|---------|
| Backend CI | `.github/workflows/backend-ci.yml` | Push/PR to `main` when `backend/**` changes |
| Frontend CI | `.github/workflows/frontend-ci.yml` | Push/PR to `main` when `frontend/**` changes |

**Backend pipeline steps:**
1. Spin up MongoDB 7.0 service container
2. Setup Node.js 20.x
3. `npm ci` — install dependencies
4. `npm run lint` — run linter
5. `npm test` — run 76 unit tests with JWT and MongoDB env vars injected
6. Upload coverage to Codecov
7. `node -c index.js` — syntax validation build check

**Frontend pipeline steps:**
1. Setup Node.js 20.x
2. `npm install` — install dependencies
3. Clear `.next` build cache
4. `npm run lint` — ESLint check
5. `npm run build` — full Next.js production build

---

## Deployment

### Backend — Railway

```bash
npm install -g @railway/cli
railway login
cd backend
railway up
```

Configure these environment variables in the Railway dashboard:

| Variable | Description |
|----------|-------------|
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for JWT signing |
| `STRIPE_SECRET_KEY` | Stripe secret API key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `HUGGINGFACE_API_KEY` | Hugging Face API token |
| `NODE_ENV` | Set to `production` |
| `PORT` | Set to `5000` |

### Frontend — Vercel

```bash
npm install -g vercel
cd frontend
vercel --prod
```

Set `NEXT_PUBLIC_API_URL` to your Railway backend URL in the Vercel dashboard.

---

## User Manual

The full user manual with screenshots is published on the GitHub Wiki:

| Page | Description |
|------|-------------|
| [Home](https://github.com/rahul912313/csye7230-project-team-1-/wiki/Home) | Platform overview and tech stack |
| [Installation & Setup](https://github.com/rahul912313/csye7230-project-team-1-/wiki/Installation-and-Setup) | Local setup and cloud deployment |
| [User Guide](https://github.com/rahul912313/csye7230-project-team-1-/wiki/User-Guide) | Registration, vehicle search, booking, payment, chatbot |
| [Admin Guide](https://github.com/rahul912313/csye7230-project-team-1-/wiki/Admin-Guide) | Fleet management, user management, analytics dashboard |
| [API Reference](https://github.com/rahul912313/csye7230-project-team-1-/wiki/API-Reference) | All REST endpoints with request and response examples |

---

## License

Licensed under the [Apache-2.0 License](LICENSE).
Academic project — CSYE 7230 Software Engineering, Northeastern University, Spring 2026.
