# API Reference

The QuickRent backend API is fully documented using JSDoc. The generated HTML documentation is hosted in the repository.

## 📄 View the API Documentation

**[Browse the full API docs here](https://htmlpreview.github.io/?https://github.com/rahul912313/csye7230-project-team-1-/blob/main/backend/docs/api/index.html)**

Or browse directly in the repository:
`backend/docs/api/index.html`

---

## API Overview

The backend exposes a RESTful API running on port `5000`.

### Base URL
```
http://localhost:5000/api
```

### Authentication
Protected routes require a JWT token in the `Authorization` header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Endpoints Summary

### User Routes
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/users/register` | Public | Register a new user |
| POST | `/users/login` | Public | Login and receive JWT token |
| GET | `/users/profile` | Private | Get logged-in user profile |
| PUT | `/users/profile` | Private | Update user profile |
| DELETE | `/users/account` | Private | Delete user account |
| POST | `/users/firebase-token` | Private | Store Firebase push token |

### Admin Routes
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/admin/signup` | Public | Create admin account |
| POST | `/admin/login` | Public | Admin login |
| GET | `/admin/user` | Admin | Get all users |
| GET | `/admin/user/:id` | Admin | Get user by ID |
| PUT | `/admin/user/:id` | Admin | Update user by ID |
| GET | `/admin/booking` | Admin | Get all bookings |

### Chatbot Routes
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/chatbot` | Public | Send message to AI chatbot |
| GET | `/chatbot/status` | Public | Check chatbot availability |

---

## Example Requests

### Register a User
```bash
POST /api/users/register
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "password123",
  "driverLicense": "DL987654"
}
```

### Login
```bash
POST /api/users/login
Content-Type: application/json

{
  "email": "jane@example.com",
  "password": "password123"
}
```

### Chat with the AI Chatbot
```bash
POST /api/chatbot
Content-Type: application/json

{
  "message": "How do I book a vehicle?",
  "conversationHistory": []
}
```
