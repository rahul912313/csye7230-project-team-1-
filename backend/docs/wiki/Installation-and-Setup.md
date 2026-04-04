# Installation & Setup

This guide explains how to install and run QuickRent locally.

---

## Prerequisites

Before you begin, make sure you have the following installed:
- **Node.js** v18 or higher — [Download here](https://nodejs.org)
- **MongoDB** (local) or a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) URI
- **Git** — [Download here](https://git-scm.com)
- A **Stripe** account for payment processing — [stripe.com](https://stripe.com)

---

## Step 1 — Clone the Repository

```bash
git clone https://github.com/rahul912313/csye7230-project-team-1-.git
cd csye7230-project-team-1-
```

---

## Step 2 — Backend Setup

### Install dependencies
```bash
cd backend
npm install
```

### Configure environment variables
```bash
cp config/.env.example config/.env
```

Open `config/.env` and fill in the following values:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/quickrent
JWT_SECRET=your_jwt_secret_here
STRIPE_SECRET_KEY=sk_test_your_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
HUGGINGFACE_API_KEY=hf_your_api_key
FIREBASE_PROJECT_ID=your_firebase_project_id
```

### Start the backend server
```bash
# Development mode (auto-reload)
npm run dev

# Production mode
npm start
```

The backend API will be available at: `http://localhost:5000`

---

## Step 3 — Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

The frontend will be available at: `http://localhost:3000`

---

## Step 4 — Verify Installation

Once both servers are running:

1. Open your browser and go to `http://localhost:3000`
2. You should see the QuickRent landing page
3. Click **Sign Up** to create a new account and confirm everything is working

---

## Running Tests

```bash
cd backend
npm test
```

To generate a coverage report:
```bash
npm run test:coverage
```

---

## Triggering the CI Pipeline

The CI pipeline runs automatically on every push or pull request to `main`:
1. Make any change to a file in the `backend/` directory
2. Push to `main` or open a pull request
3. Go to the **Actions** tab on GitHub to see the pipeline run
