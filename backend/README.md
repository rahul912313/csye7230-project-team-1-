# QuickRent Backend

Vehicle rental management platform backend built with Node.js, Express, and MongoDB.

## Tech Stack

- **Runtime**: Node.js + Express
- **Database**: MongoDB (Atlas in production)
- **Auth**: JWT + bcrypt
- **Payments**: Stripe
- **Notifications**: Firebase Admin SDK
- **AI Chatbot**: Hugging Face API
- **Testing**: Jest
- **API Docs**: JSDoc

## Design Patterns

| Pattern | Implementation |
|---------|---------------|
| Singleton | `db.js` — single DB connection instance |
| Repository | `repositories/BaseRepository.js` + domain repos |
| Strategy | `services/payment/StripePaymentStrategy.js` |
| Factory Method | `services/notification/NotificationFactory.js` |

## Project Structure

```
backend/
├── controllers/           # Route handlers (MVC layer)
├── services/              # Business logic
│   ├── payment/           # Strategy pattern
│   └── notification/      # Factory pattern
├── repositories/          # Data access layer (Repository pattern)
├── models/                # MongoDB schemas
├── routes/
│   ├── admin/             # Admin-only routes
│   └── user/              # User routes
├── middlewares/           # Auth, role, multer
├── docs/
│   ├── api/               # JSDoc generated HTML
│   ├── uml/               # PlantUML diagrams
│   └── wiki/              # User manual pages
├── __tests__/             # Jest test suites
├── .github/workflows/     # CI/CD pipeline
├── db.js                  # Singleton DB connection
└── index.js               # Entry point
```

## Installation & Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### Clone & Install

```bash
git clone https://github.com/your-org/quickrent.git
cd quickrent/backend
npm install
```

### Environment Variables

Create `config/.env`:

```env
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.3sujg.mongodb.net/quickrent
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
HUGGINGFACE_API_KEY=your_huggingface_key
FIREBASE_PROJECT_ID=your_firebase_project_id
NODE_ENV=development
PORT=5000
```

## Running the App

```bash
# Development (with hot reload)
npm run dev

# Production
npm start
```

API will be available at `http://localhost:5000/api`

## Running Tests

```bash
# Run all tests with coverage report
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run tests once (CI)
npm test
```

Coverage report is generated at `coverage/lcov-report/index.html`.

### Test Suites

| File | Coverage |
|------|----------|
| `__tests__/userService.test.js` | User auth, registration, login |
| `__tests__/adminService.test.js` | Admin creation, login, user management |
| `__tests__/chatbotService.test.js` | AI chatbot, keyword matching, HuggingFace API |
| `__tests__/baseRepository.test.js` | Repository pattern CRUD, pagination |
| `__tests__/db.test.js` | Singleton DB connection |
| `__tests__/notificationFactory.test.js` | Factory pattern notification types |

## Generating API Docs

```bash
npm run docs
```

HTML documentation is generated in `docs/api/index.html`.
Open it in a browser or view it on GitHub at `backend/docs/api/index.html`.

## CI/CD Pipeline

Pipeline configured in `.github/workflows/backend-ci.yml`.

**Triggers:**
- Push to `main`
- Pull requests to `main`

**Pipeline steps:**
1. Checkout repository
2. Setup Node.js (matrix: 18.x and 20.x)
3. Install dependencies — `npm ci`
4. Run linter — `npm run lint` (if configured)
5. Run tests — `npm test`
6. Security audit — `npm audit --audit-level=moderate`

To trigger manually: push any commit to `main` or open a PR.

## Deployment

### Backend — Railway

```bash
npm install -g @railway/cli
railway login
cd quickrent/backend
railway up
```

Set these environment variables in the Railway dashboard:

```
MONGO_URI=mongodb+srv://...
JWT_SECRET=...
STRIPE_SECRET_KEY=...
HUGGINGFACE_API_KEY=...
NODE_ENV=production
PORT=5000
```

### Frontend — Vercel

```bash
npm install -g vercel
cd quickrent/frontend
vercel --prod
```

Set `NEXT_PUBLIC_API_URL` to your Railway backend URL in Vercel dashboard.

## API Endpoints

### Auth (Public)
- `POST /api/users/register` — Register new user
- `POST /api/users/login` — Login user
- `POST /api/admin/login` — Admin login

### User (Protected — JWT required)
- `GET /api/users/profile` — Get profile
- `PUT /api/users/profile` — Update profile
- `GET /api/vehicles` — List vehicles
- `POST /api/bookings/request` — Request booking
- `POST /api/bookings/confirm/:id` — Confirm booking with payment
- `GET /api/bookings` — Get user bookings
- `GET /api/transactions` — Get transactions
- `POST /api/chatbot` — Chat with AI assistant

### Admin (Protected — Admin role required)
- `GET /api/admin/users` — All users
- `GET /api/admin/bookings` — All bookings
- `GET /api/admin/vehicles` — All vehicles
- `GET /api/admin/transactions` — All transactions
- `GET /api/admin/stats` — Platform analytics

## License

Academic project — CSYE7230 Software Engineering, Northeastern University.
