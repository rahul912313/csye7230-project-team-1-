# QuickRent — Vehicle Rental Management Platform

QuickRent is a full-stack vehicle rental platform that allows users to browse vehicles, make bookings with real-time availability, pay securely via Stripe, and chat with an AI assistant. Admins can manage the fleet, users, bookings, and view analytics.

**Course:** CSYE 7230 — Software Engineering, Northeastern University, Spring 2026
**Team:** Rahul Patil · Silin Zhang · Syed Rizvi · Misha Patel · Saumya Gorantala
**GitHub:** https://github.com/rahul912313/csye7230-project-team-1-

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
| Testing | Jest 29 |
| CI/CD | GitHub Actions |

---

## Repository Structure

```
quickrent/
├── backend/               # Node.js + Express REST API
│   ├── controllers/       # HTTP request handlers
│   ├── services/          # Business logic layer
│   ├── repositories/      # Data access layer (Repository pattern)
│   ├── models/            # MongoDB schemas
│   ├── routes/            # Express routes
│   ├── middlewares/       # Auth, role, validation
│   ├── docs/
│   │   ├── api/           # JSDoc generated HTML documentation
│   │   ├── uml/           # PlantUML class diagrams
│   │   └── wiki/          # User manual source files
│   ├── __tests__/         # Jest unit test suites
│   ├── .github/workflows/ # CI/CD pipeline
│   └── README.md          # Backend-specific instructions
├── frontend/              # Next.js 14 TypeScript frontend
│   ├── src/
│   │   ├── app/           # Next.js app router pages
│   │   ├── components/    # React components
│   │   ├── services/      # API service layer
│   │   ├── store/         # Redux state management
│   │   └── types/         # TypeScript type definitions
│   └── README.md
└── README.md              # This file
```

---

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Stripe account
- Hugging Face API key
- Firebase project

### 1. Clone the repository

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

Start the backend:

```bash
npm run dev       # Development with hot reload
npm start         # Production
```

Backend runs at `http://localhost:5000/api`

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Frontend runs at `http://localhost:3000`

---

## Running Tests

```bash
cd backend
npm test                  # Run all tests
npm run test:coverage     # Run with coverage report
```

**76 passing tests** across 6 test files covering all four Gang of Four design patterns.

| Test File | Tests | Coverage |
|-----------|-------|---------|
| __tests__/userService.test.js | 14 | User auth, registration, login |
| __tests__/adminService.test.js | 12 | Admin creation, login, management |
| __tests__/chatbotService.test.js | 20 | AI chatbot, keyword fallback |
| __tests__/baseRepository.test.js | 22 | Repository pattern, pagination |
| __tests__/db.test.js | 7 | Singleton DB connection |
| __tests__/notificationFactory.test.js | 5 | Factory Method pattern |

---

## Generating API Documentation

```bash
cd backend
npm run docs
```

HTML documentation generated at `backend/docs/api/index.html`

View online: https://github.com/rahul912313/csye7230-project-team-1-/blob/main/backend/docs/api/index.html

---

## CI/CD Pipeline

Pipeline: `.github/workflows/backend-ci.yml`

**Triggers:** Push to `main` or `backend` branches, Pull Requests to `main`

**Pipeline steps:**
1. Checkout repository
2. Setup Node.js 20.x
3. Install dependencies — `npm ci`
4. Run linter — `npm run lint` (if configured)
5. Run tests — `npm test`
6. Upload coverage to Codecov
7. Build check — `node -c index.js` (syntax validation)

View pipeline: https://github.com/rahul912313/csye7230-project-team-1-/actions/workflows/backend-ci.yml

![Backend CI](https://github.com/rahul912313/csye7230-project-team-1-/actions/workflows/backend-ci.yml/badge.svg)

---

## Deployment

### Backend — Railway

```bash
npm install -g @railway/cli
railway login
cd backend
railway up
```

Set environment variables in Railway dashboard:
- `MONGO_URI`, `JWT_SECRET`, `STRIPE_SECRET_KEY`, `HUGGINGFACE_API_KEY`, `NODE_ENV=production`, `PORT=5000`

### Frontend — Vercel

```bash
npm install -g vercel
cd frontend
vercel --prod
```

Set `NEXT_PUBLIC_API_URL` to your Railway backend URL in Vercel dashboard.

---

## Design Patterns

| Pattern | Location | Purpose |
|---------|----------|---------|
| Singleton | `backend/db.js` | Single shared MongoDB connection |
| Repository | `backend/repositories/` | Abstracts all DB operations, enables unit testing |
| Strategy | `backend/services/payment/` | Swappable payment providers (Stripe today, PayPal tomorrow) |
| Factory Method | `backend/services/notification/` | Creates Push/Email/SMS notifications from type string |

---

## User Manual

Full user manual with screenshots is available on the GitHub Wiki:
https://github.com/rahul912313/csye7230-project-team-1-/wiki

- [Home](https://github.com/rahul912313/csye7230-project-team-1-/wiki/Home)
- [Installation & Setup](https://github.com/rahul912313/csye7230-project-team-1-/wiki/Installation-and-Setup)
- [User Guide](https://github.com/rahul912313/csye7230-project-team-1-/wiki/User-Guide)
- [Admin Guide](https://github.com/rahul912313/csye7230-project-team-1-/wiki/Admin-Guide)
- [API Reference](https://github.com/rahul912313/csye7230-project-team-1-/wiki/API-Reference)

---

## License

Apache-2.0 — Academic project for CSYE 7230, Northeastern University.
