# QuickRent CI/CD Pipeline

## 📋 Overview

This project uses GitHub Actions for Continuous Integration. We have separate workflows for backend and frontend.

---

## 🔧 Backend CI Pipeline

**File:** `.github/workflows/backend-ci.yml`

**Status:** ✅ **ACTIVE**

### Triggers:
- Push to `main`, `backend`, or `backend-*` branches
- Pull requests to `main` branch
- Only when backend files change (`backend/**`)

### Jobs:

#### 1. Test Job
- **Node versions:** 18.x, 20.x (matrix testing)
- **Steps:**
  - Checkout code
  - Setup Node.js
  - Install dependencies (`npm ci`)
  - Run linter (optional)
  - Run tests (`npm test`)
  - Upload coverage reports to Codecov

#### 2. Build Job
- **Runs after:** Tests pass
- **Steps:**
  - Checkout code
  - Setup Node.js 20.x
  - Install dependencies
  - Check syntax errors
  - Verify build success

### Environment Variables:
```yaml
NODE_ENV: test
JWT_SECRET: test_jwt_secret_for_ci
MONGO_URI: mongodb://localhost:27017/quickrent_test
```

### What It Tests:
- ✅ Backend unit tests (42 tests)
- ✅ Database Singleton pattern
- ✅ Repository pattern
- ✅ UserService logic
- ✅ Code syntax validation

---

## 🎨 Frontend CI Pipeline

**File:** `.github/workflows/frontend-ci.yml`

**Status:** ⏸️ **PLACEHOLDER** (to be configured by frontend team)

### TODO:
- [ ] Uncomment the workflow
- [ ] Configure test commands
- [ ] Add build step
- [ ] Add ESLint checks
- [ ] Add TypeScript type checking

---

## 🚀 CI Badge

Add this to your README.md to show build status:

```markdown
![Backend CI](https://github.com/rahul912313/csye7230-project-team-1-/actions/workflows/backend-ci.yml/badge.svg)
```

This will show a badge indicating if the backend build is passing or failing.

---

## 📊 Workflow Features

### ✅ What the CI Does:
1. **Automatic Testing** - Runs on every push/PR
2. **Multiple Node Versions** - Tests on Node 18 and 20
3. **Path Filtering** - Only runs when backend files change
4. **Coverage Reports** - Uploads to Codecov (optional)
5. **Fast Feedback** - Developers know immediately if they broke something

### ⚡ Benefits:
- Catch bugs before merging
- Ensure tests pass on all Node versions
- Prevent breaking changes
- Maintain code quality
- Show build status with badges

---

## 🔍 Local Testing Before Push

Always test locally before pushing:

```bash
# Backend
cd backend
npm install
npm test        # Run tests
npm run dev     # Start server and manually test

# Frontend (when ready)
cd frontend
npm install
npm run build   # Check build works
npm run dev     # Test locally
```

---

## 🛠️ CI Configuration Files

```
.github/
└── workflows/
    ├── backend-ci.yml      ✅ Active
    └── frontend-ci.yml     ⏸️ Placeholder
```

---

## 📝 Adding More CI Steps (Future)

You can add:
- **Code Coverage Threshold** - Fail if coverage drops below X%
- **Security Scanning** - Check for vulnerabilities
- **Docker Build** - Build Docker images
- **Deployment** - Auto-deploy on merge to main
- **Code Quality** - SonarQube or CodeClimate
- **API Testing** - Integration tests with Postman/Newman

---

## ⚠️ Important Notes

1. **MongoDB in CI**: Currently using localhost MongoDB. For actual CI, you might need:
   - GitHub Actions MongoDB service
   - Mock MongoDB with mongodb-memory-server
   - Skip DB-dependent tests in CI

2. **Secrets**: Store sensitive data (API keys, tokens) in GitHub Secrets:
   - Go to repo Settings → Secrets → Actions
   - Add secrets like `STRIPE_SECRET_KEY`, `HUGGINGFACE_API_KEY`
   - Reference in workflow: `${{ secrets.STRIPE_SECRET_KEY }}`

3. **Coverage**: To enable Codecov:
   - Sign up at codecov.io
   - Add repo
   - Get upload token
   - Add to GitHub Secrets as `CODECOV_TOKEN`

---

## 🎯 Current Status

- ✅ Backend CI configured and ready
- ✅ Tests will run automatically on push/PR
- ✅ Multiple Node versions tested
- ⏸️ Frontend CI placeholder (frontend team to configure)

---

## 📧 Questions?

Check GitHub Actions documentation or ask the team!
