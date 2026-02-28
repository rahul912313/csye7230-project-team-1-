# QuickRent Backend

Vehicle rental platform backend API built with Node.js and Express.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **User Management**: Registration, login, profile management
- **Admin Panel**: User management, statistics, search functionality
- **Design Patterns**: Singleton (DB), Repository (Data Access), Middleware Chain
- **Security**: Password hashing with bcrypt, JWT tokens, input validation

## 📦 Tech Stack

- Node.js & Express
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing

## 🛠️ Installation

```bash
# Install dependencies
npm install

# Create .env file
cp config/.env.example config/.env

# Update .env with your MongoDB URI and JWT secret

# Run development server
npm run dev

# Run production server
npm start
```

## 📚 API Endpoints

### Public Routes

#### User Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user

### Protected Routes (Require Authentication)

#### User Profile
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `DELETE /api/users/account` - Delete user account

### Admin Routes (Require Admin Role)

#### User Management
- `GET /api/admin/users` - Get all users (paginated)
- `GET /api/admin/users/search?q=term` - Search users
- `GET /api/admin/users/:id` - Get user by ID
- `PUT /api/admin/users/:id/block` - Block user
- `PUT /api/admin/users/:id/unblock` - Unblock user
- `DELETE /api/admin/users/:id` - Delete user

#### Statistics
- `GET /api/admin/stats/users` - Get user statistics

## 🔐 Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## 📝 Request Examples

### Register User
```bash
POST /api/users/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "driverLicense": "DL123456"
}
```

### Login
```bash
POST /api/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Get Profile (Protected)
```bash
GET /api/users/profile
Authorization: Bearer <jwt_token>
```

## 🗄️ Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  driverLicense: String (unique),
  role: String (user/admin),
  firebaseToken: String,
  isBlocked: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Admin Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (admin/super_admin),
  permissions: [String],
  createdAt: Date,
  updatedAt: Date
}
```

## 🏗️ Project Structure

```
backend/
├── config/                 # Configuration files
│   └── .env               # Environment variables
├── controllers/           # Request handlers
│   ├── userController.js
│   └── adminController.js
├── middlewares/           # Express middlewares
│   ├── authMiddleware.js
│   ├── roleMiddleware.js
│   ├── validationMiddleware.js
│   └── errorMiddleware.js
├── models/                # Mongoose models
│   ├── user.js
│   └── admin.js
├── repositories/          # Data access layer
│   ├── BaseRepository.js
│   └── UserRepository.js
├── routes/                # API routes
│   ├── userRoutes.js
│   └── adminRoutes.js
├── services/              # Business logic
│   ├── userService.js
│   └── adminService.js
├── utils/                 # Utility functions
│   ├── passwordUtils.js
│   └── jwtUtils.js
├── db.js                  # Database connection (Singleton)
└── index.js               # Server entry point
```

## 🧪 Testing

```bash
npm test
```

## 🔧 Environment Variables

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/quickrent
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
```

## 🤝 Contributing

This is an academic project for CSYE7230 at Northeastern University.

## 📄 License

See LICENSE file for details.
