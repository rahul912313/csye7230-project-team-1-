# QuickRent Backend

A vehicle rental management platform backend built with Node.js, Express, and MongoDB.

## Tech Stack

- **Runtime**: Node.js + Express
- **Database**: MongoDB (Atlas in production)
- **Auth**: JWT + bcrypt
- **Payments**: Stripe
- **Notifications**: Firebase Admin SDK
- **AI Chatbot**: Hugging Face API
- **Testing**: Jest
- **Docs**: JSDoc

## Design Patterns

- **Singleton** — `db.js` (database connection)
- **Repository** — `repositories/BaseRepository.js` + domain repositories
- **Strategy** — `services/payment/StripePaymentStrategy.js`
- **Factory Method** — `services/notification/NotificationFactory.js`

## Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### Installation

```bash
git clone https://github.com/your-repo/quickrent.git
cd quickrent/backend
npm install
```

### Environment Variables

Create `config/.env`:

```env
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.3sujg.mongodb.net/quickrent
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_key
HUGGINGFACE_API_KEY=your_hf_key
NODE_ENV=development
PORT=5000
```

## Running the App

```bash
# Development
npm start

# Production
npm run start:prod
```

## Running Tests

```bash
# Run all tests with coverage
npm test

# Watch mode
npm run test:watch
```

Coverage report is generated in `coverage/lcov-report/index.html`.

## Generating API Docs

```bash
npm run docs
```

HTML documentation is generated in `docs/api/index.html`.

## CI/CD

GitHub Actions pipeline is configured in `.github/workflows/ci.yml`.

**Triggers:**
- Push to `main` or `develop`
- Pull requests to `main` or `develop`

**Pipeline steps:**
1. Checkout repository
2. Setup Node.js (matrix: 18.x and 20.x)
3. Install dependencies — `npm ci`
4. Run linter — `npm run lint` (if configured)
5. Run tests — `npm test`
6. Security audit — `npm audit --audit-level=moderate`

To trigger the pipeline: push any commit to `main` or open a pull request to `main`.


## Deployment

### Backend (Railway)

```bash
npm install -g @railway/cli
railway login
railway up
```

Set the following environment variables in Railway dashboard:
- `MONGO_URI`, `JWT_SECRET`, `STRIPE_SECRET_KEY`, `HUGGINGFACE_API_KEY`, `NODE_ENV=production`

### Frontend (Vercel)

```bash
npm install -g vercel
cd frontend
vercel --prod
```

## Project Structure

```
backend/
├── controllers/       # Route handlers
├── services/          # Business logic
├── repositories/      # Data access layer
├── models/            # MongoDB schemas
├── routes/            # Express routes
├── middlewares/       # Auth, role, multer
├── docs/              # UML diagrams + API docs
├── __tests__/         # Jest test suites
└── .github/workflows/ # CI/CD pipeline
```
