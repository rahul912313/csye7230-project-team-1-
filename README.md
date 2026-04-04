# QuickRent — Vehicle Rental Management Platform

![Backend CI](https://github.com/rahul912313/csye7230-project-team-1-/actions/workflows/backend-ci.yml/badge.svg)

A full-stack vehicle rental platform built with Node.js, Express, MongoDB, and Next.js. Developed as part of CSYE7230 Software Engineering at Northeastern University.

---

## 👥 Team Members

| Name | Role |
|---|---|
| Rahul Ramesh | Backend — Auth, Infrastructure, AI Chatbot |
| Silin Zhang | Backend — Vehicles, Bookings |
| Abbas (Syed Rizvi) | Backend — Payments, Notifications |
| Misha Patel | Frontend Engineer |
| Saumya Gorantala | Backend Support |

---

## 🏗️ Architecture & Design Patterns

- **Singleton** — MongoDB connection (`backend/db.js`)
- **Repository** — Data access abstraction (`backend/repositories/`)
- **Strategy** — Payment processing (`backend/services/payment/`)
- **Factory** — Notification system (`backend/services/notification/`)

---

## 🛠️ Tech Stack

**Backend:** Node.js, Express, MongoDB, Mongoose, JWT, Stripe, Firebase Admin, Hugging Face API, Jest

**Frontend:** Next.js 14, TypeScript, Tailwind CSS, Redux Toolkit, Leaflet, Recharts

---

## ⚙️ Prerequisites

- Node.js v18 or higher
- MongoDB (local) or MongoDB Atlas URI
- Git

---

## 🚀 Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/rahul912313/csye7230-project-team-1-.git
cd csye7230-project-team-1-
```

### 2. Backend Setup

```bash
cd backend
npm install
cp config/.env.example config/.env
```

Edit `config/.env` with your credentials (see Environment Variables section below), then:

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Backend runs on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`

---

## 🔧 Environment Variables

Create `backend/config/.env` with the following:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/quickrent
JWT_SECRET=your_jwt_secret_here
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
HUGGINGFACE_API_KEY=your_huggingface_api_key
FIREBASE_PROJECT_ID=your_firebase_project_id
```

---

## 🧪 Running Tests

```bash
cd backend
npm test
```

To run with coverage report:

```bash
npm run test:coverage
```

Tests are located in `backend/__tests__/` and cover:
- `db.test.js` — Singleton pattern (DatabaseConnection)
- `baseRepository.test.js` — Repository pattern (BaseRepository)
- `userService.test.js` — User business logic (UserService)
- `adminService.test.js` — Admin business logic (AdminService)
- `chatbotService.test.js` — AI Chatbot service (ChatbotService)

---

## 🔁 CI Pipeline

The CI pipeline is defined in `.github/workflows/backend-ci.yml` and runs automatically on:
- Every **push to `main`** that changes backend files
- Every **pull request to `main`** that changes backend files

### Pipeline Jobs

1. **test** — Spins up a MongoDB service container, installs dependencies, runs the full Jest test suite, uploads coverage to Codecov
2. **build** — Runs after `test` passes, checks for syntax errors in `index.js`

To trigger the CI manually, push any change to the `backend/` directory on the `main` branch or open a pull request.

---

## 📁 Project Structure

```
quickrent/
├── backend/
│   ├── config/             # Environment config
│   ├── controllers/        # Route handlers
│   ├── middlewares/        # Auth, role, validation middleware
│   ├── models/             # Mongoose schemas
│   ├── repositories/       # Repository pattern (data access)
│   ├── routes/             # Express routes
│   ├── services/           # Business logic
│   │   ├── notification/   # Factory pattern
│   │   └── payment/        # Strategy pattern
│   ├── utils/              # Helpers
│   ├── __tests__/          # Jest test suites
│   ├── db.js               # Singleton DB connection
│   └── index.js            # Server entry point
├── frontend/
│   ├── app/                # Next.js App Router pages
│   ├── components/         # React components
│   └── store/              # Redux store
└── .github/
    └── workflows/
        ├── backend-ci.yml  # Backend CI pipeline
        └── frontend-ci.yml # Frontend CI (placeholder)
```

---

## 📖 User Manual

See the [GitHub Wiki](https://github.com/rahul912313/csye7230-project-team-1-/wiki) for the full user manual including installation guide and feature walkthroughs.

---

## 📄 License

This project is developed as part of academic coursework at Northeastern University (CSYE7230 — Software Engineering).
