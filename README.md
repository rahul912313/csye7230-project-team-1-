# QuickRent - Vehicle Rental Platform

A comprehensive vehicle rental management system built with modern web technologies, implementing industry-standard design patterns and best practices.

## 🚀 Project Overview

QuickRent is a full-stack vehicle rental platform that allows users to browse, book, and manage vehicle rentals seamlessly. The platform includes features like real-time availability, secure payments, interactive maps, AI-powered chatbot, and comprehensive analytics.

## 📋 Team Members

- **Rahul** - Backend Engineer
- **Saumya Gorantala** - Backend Engineer  
- **Silin Zhang** - Frontend Engineer
- **Abbas** - Fullstack Engineer
- **Misha Patel** - Frontend Engineer

## 🏗️ Architecture

### Backend
- **Framework**: Node.js with Express
- **Database**: MongoDB
- **Design Patterns**: 
  - Singleton (Database Connection)
  - Repository (Data Access Layer)
  - Strategy (Payment Processing)
  - Factory (Notification System)
- **Key Features**:
  - Two-phase booking system with temporary locks
  - JWT-based authentication
  - Role-based authorization (User/Admin)
  - Payment integration with Stripe
  - Real-time notifications with Firebase

### Frontend
- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **Key Features**:
  - Responsive UI with modern design
  - Interactive maps with Leaflet
  - AI chatbot integration
  - Real-time analytics dashboard
  - Progressive Web App (PWA) support

## 🛠️ Tech Stack

### Backend
- Node.js & Express
- MongoDB with Mongoose
- JWT for authentication
- Stripe for payments
- Firebase Admin for notifications
- Hugging Face API for AI chatbot
- Multer for file uploads
- Jest for testing

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Redux Toolkit
- Axios
- Leaflet for maps
- Recharts for analytics
- React Hook Form

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Git

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Configure your .env file with required credentials
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:3000` and backend on `http://localhost:5000`.

## 🎯 Key Features

### For Users
- Browse available vehicles with filters
- Interactive map showing vehicle locations
- Two-phase booking system (request → payment)
- Secure payment processing with Stripe
- Real-time booking status updates
- AI chatbot for instant support
- Booking history and management

### For Admins
- Comprehensive dashboard with analytics
- Vehicle management (CRUD operations)
- Booking oversight and management
- Transaction history
- Revenue analytics with charts
- User management

## 🔐 Security Features

- JWT-based authentication with refresh tokens
- Password hashing with bcrypt
- Role-based access control (RBAC)
- CORS configuration
- Input validation and sanitization
- Secure payment processing via Stripe

## 📊 Design Patterns Implemented

1. **Singleton Pattern**: Database connection management
2. **Repository Pattern**: Data access abstraction layer
3. **Strategy Pattern**: Multiple payment methods (Stripe, future: PayPal)
4. **Factory Pattern**: Notification creation (Email, Push, SMS)

## 🧪 Testing

```bash
cd backend
npm test
```

## 📱 Progressive Web App

The frontend is configured as a PWA with:
- Service worker for offline support
- Installable on mobile devices
- Push notification support
- Optimized performance

## 🚀 Deployment

### Backend
Can be deployed to:
- Heroku
- AWS EC2
- DigitalOcean
- Render

### Frontend
Can be deployed to:
- Vercel (recommended for Next.js)
- Netlify
- AWS Amplify

## 📈 Development Process

This project follows an incremental commit strategy to showcase:
- Feature development progression
- Design pattern implementation
- Code refactoring and optimization
- Testing and bug fixes

## 📄 License

This project is developed as part of academic coursework at Northeastern University.

## 🤝 Contributing

This is an academic project. For any questions or suggestions, please contact the team members.

## 📧 Support

For support, please use the in-app AI chatbot or contact the development team.

---

**Note**: This project is part of CSYE7230 coursework and demonstrates comprehensive software engineering practices including design patterns, full-stack development, and modern DevOps practices.
