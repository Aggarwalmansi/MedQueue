# 🏥 MedQueue - Hospital Management System

A comprehensive, real-time hospital management platform that connects patients with healthcare facilities, enabling smart hospital discovery, appointment booking, and live bed availability tracking.

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://med-queue.vercel.app)
[![Backend](https://img.shields.io/badge/backend-Node.js-green)](https://nodejs.org/)
[![Frontend](https://img.shields.io/badge/frontend-React-blue)](https://reactjs.org/)
[![Database](https://img.shields.io/badge/database-PostgreSQL-blue)](https://www.postgresql.org/)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Environment Variables](#-environment-variables)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

---

## ✨ Features

### For Patients
- 🔍 **Smart Hospital Search** - Semantic search with autocomplete suggestions
- 📍 **Location-Based Discovery** - Find nearby hospitals using geolocation
- 🏨 **Real-Time Bed Availability** - Live updates on ICU, Oxygen, and General beds
- ⏱️ **ER Wait Times** - View current emergency room wait times by severity
- 📅 **Appointment Booking** - Book appointments via triage or calendar
- ⭐ **Hospital Ratings** - Rate and review hospitals
- 📱 **Virtual Queue** - Join virtual waiting lists for emergency care
- 🎫 **Booking Management** - View and cancel appointments

### For Hospital Managers
- 📊 **Dashboard** - Comprehensive overview of hospital operations
- 🛏️ **Inventory Management** - Update bed counts and doctor availability
- 📋 **Booking Management** - View and manage all appointments (triage + calendar)
- ⏰ **ER Wait Time Updates** - Manage emergency room wait times
- 🏥 **Facility Management** - Update specializations, diagnostics, and accreditations
- 🔔 **Real-Time Notifications** - Instant alerts for new bookings via WebSocket
- 📈 **Profile Completeness** - Track and improve hospital profile quality

### For Administrators
- ✅ **Hospital Verification** - Approve/reject hospital registrations
- 📊 **System Analytics** - View platform statistics and metrics
- 🏥 **Hospital Management** - Activate/deactivate hospitals
- 👥 **User Management** - Monitor platform users

---

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js (Express.js v5.1.0)
- **Database:** PostgreSQL with Prisma ORM (v6.18.0)
- **Authentication:** JWT + Google OAuth 2.0 (Passport.js)
- **Real-Time:** Socket.io (v4.8.1)
- **Security:** bcryptjs, express-session
- **API:** RESTful architecture

### Frontend
- **Framework:** React (v19.1.1)
- **Build Tool:** Vite (v7.1.7)
- **Routing:** React Router DOM (v7.9.5)
- **Styling:** Tailwind CSS (v4.1.17)
- **Maps:** Leaflet + React Leaflet
- **Animations:** Framer Motion (v12.23.24)
- **Icons:** Lucide React
- **Real-Time:** Socket.io Client

### DevOps
- **Hosting:** Vercel (Frontend) + Render/Railway (Backend)
- **Database:** PostgreSQL (Cloud)
- **Version Control:** Git

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (React)                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Patient  │  │ Hospital │  │  Admin   │  │   Auth   │   │
│  │Dashboard │  │Dashboard │  │Dashboard │  │  Pages   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTP/WebSocket
┌─────────────────────────────────────────────────────────────┐
│                    Backend (Express + Socket.io)             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   Auth   │  │ Patient  │  │ Hospital │  │  Admin   │   │
│  │  Routes  │  │  Routes  │  │  Routes  │  │  Routes  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                 │
│  │  Search  │  │   Auth   │  │ Socket   │                 │
│  │Controller│  │Middleware│  │  Events  │                 │
│  └──────────┘  └──────────┘  └──────────┘                 │
└─────────────────────────────────────────────────────────────┘
                            ↕ Prisma ORM
┌─────────────────────────────────────────────────────────────┐
│                    PostgreSQL Database                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Users   │  │Hospitals │  │ Bookings │  │ Ratings  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│  ┌──────────┐  ┌──────────┐                               │
│  │  Queue   │  │  Tokens  │                               │
│  └──────────┘  └──────────┘                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn
- Git

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/medqueue.git
cd medqueue
```

#### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration (see Environment Variables section)

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# (Optional) Seed database with sample data
npx prisma db seed

# Start development server
npm run dev
```

The backend will run on `http://localhost:5001`

#### 3. Frontend Setup
```bash
cd ../frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your backend URL

# Start development server
npm run dev
```

The frontend will run on `http://localhost:5173`

### Quick Start with Docker (Optional)
```bash
# Coming soon
docker-compose up
```

---

## 📡 API Documentation

### Base URL
- **Development:** `http://localhost:5001/api`
- **Production:** `https://your-backend-url.com/api`

### Authentication

All authenticated endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

### 🔐 Auth Routes (`/api/auth`)

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "role": "PATIENT | HOSPITAL | ADMIN",
  "fullName": "John Doe",
  "phone": "+1234567890",
  
  // Required if role is HOSPITAL
  "hospitalName": "City General Hospital",
  "address": "123 Main St",
  "city": "New York",
  "latitude": 40.7128,
  "longitude": -74.0060
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "refresh_token_here",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "PATIENT",
    "fullName": "John Doe"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "refresh_token_here",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "PATIENT",
    "fullName": "John Doe"
  }
}
```

#### Google OAuth Login
```http
GET /api/auth/google
```
Redirects to Google OAuth consent screen.

#### Refresh Token
```http
POST /api/auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "your_refresh_token"
}
```

#### Logout
```http
POST /api/auth/logout
Content-Type: application/json

{
  "refreshToken": "your_refresh_token"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

---

### 🏥 Patient Routes (`/api/patient`)

#### Get Hospitals (with filters)
```http
GET /api/patient/hospitals?lat=40.7128&lng=-74.0060&specialization=Cardiology&page=1&limit=10&sortBy=distance&order=asc&bedType=ICU&minRating=4
```

**Query Parameters:**
- `lat` (optional): User latitude
- `lng` (optional): User longitude
- `specialization` (optional): Filter by department
- `page` (default: 1): Page number
- `limit` (default: 10): Results per page
- `sortBy` (default: distance): Sort by `distance`, `rating`, `name`, or `availability`
- `order` (default: asc): `asc` or `desc`
- `bedType` (optional): Filter by `ICU`, `Oxygen`, `Ventilator`, or `General`
- `minRating` (optional): Minimum average rating

**Response:**
```json
{
  "hospitals": [
    {
      "id": 1,
      "name": "City General Hospital",
      "address": "123 Main St",
      "city": "New York",
      "latitude": 40.7128,
      "longitude": -74.0060,
      "phone": "+1234567890",
      "bedsGeneral": 50,
      "bedsICU": 20,
      "bedsOxygen": 15,
      "doctorsActive": 30,
      "distance": 2.5,
      "totalBeds": 85,
      "viabilityScore": 837.5,
      "averageRating": 4.5,
      "totalRatings": 120,
      "erWaitTimes": {
        "critical": { "avgWaitMinutes": 10, "currentQueue": 2, "status": "Available" },
        "moderate": { "avgWaitMinutes": 45, "currentQueue": 5, "status": "Busy" },
        "nonUrgent": { "avgWaitMinutes": 120, "currentQueue": 10, "status": "Available" }
      }
    }
  ],
  "pagination": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "totalPages": 3
  }
}
```

#### Get Hospital Details
```http
GET /api/patient/hospitals/:id
```

#### Get Hospital Facilities
```http
GET /api/patient/hospitals/:id/facilities
```

**Response:**
```json
{
  "hospital": { /* full hospital object */ },
  "facilities": {
    "specializations": [
      { "department": "Cardiology", "specialists": 5, "beds": 20 }
    ],
    "diagnostics": {
      "mri": true,
      "ctScan": true,
      "xray": true
    },
    "criticalCare": {
      "ventilators": 10,
      "dialysis": true,
      "bloodBank": true
    },
    "supportServices": {
      "pharmacy": true,
      "cafeteria": true,
      "parking": true
    },
    "accreditations": [
      { "name": "NABH", "validUntil": "2025-12-31" }
    ]
  },
  "profileCompleteness": 85
}
```

#### Create Booking
```http
POST /api/patient/bookings
Content-Type: application/json

{
  "hospitalId": 1,
  "patientName": "John Doe",
  "patientPhone": "+1234567890",
  "condition": "Chest Pain",
  "severity": "CRITICAL | MODERATE | LOW",
  "source": "TRIAGE | CALENDAR | WALK_IN",
  "status": "INCOMING | SCHEDULED",
  "appointmentTime": "2024-12-10T14:00:00Z",  // Optional, for calendar bookings
  "userId": 1  // Optional, for authenticated users
}
```

**Response:**
```json
{
  "message": "Booking created successfully",
  "booking": {
    "id": 1,
    "hospitalId": 1,
    "patientName": "John Doe",
    "condition": "Chest Pain",
    "severity": "CRITICAL",
    "status": "INCOMING",
    "source": "TRIAGE",
    "createdAt": "2024-12-03T18:30:00Z"
  }
}
```

#### Get My Bookings
```http
GET /api/patient/my-bookings
Authorization: Bearer <token>
```

#### Cancel Booking
```http
DELETE /api/patient/bookings/:id
Authorization: Bearer <token>
```

#### Rate Hospital
```http
POST /api/patient/hospitals/:id/rate
Authorization: Bearer <token>
Content-Type: application/json

{
  "value": 5,  // 1-5
  "comment": "Excellent service and care!"
}
```

#### Get ER Wait Times
```http
GET /api/patient/hospitals/:id/er-wait-times
```

#### Join Virtual Queue
```http
POST /api/patient/hospitals/:id/virtual-queue
Content-Type: application/json

{
  "patientName": "John Doe",
  "severity": "CRITICAL | MODERATE | LOW",
  "userId": 1  // Optional
}
```

**Response:**
```json
{
  "message": "Successfully joined virtual queue",
  "queueEntry": {
    "id": 1,
    "hospitalId": 1,
    "patientName": "John Doe",
    "severity": "MODERATE",
    "status": "WAITING",
    "checkInTime": "2024-12-03T18:30:00Z"
  },
  "position": 5
}
```

#### Check Queue Status
```http
GET /api/patient/hospitals/:id/virtual-queue/:entryId
```

---

### 🏥 Hospital Routes (`/api/hospital`)
*All routes require authentication with HOSPITAL role*

#### Get Hospital Profile
```http
GET /api/hospital/profile
Authorization: Bearer <token>
```

#### Update Inventory
```http
PATCH /api/hospital/inventory
Authorization: Bearer <token>
Content-Type: application/json

{
  "bedsGeneral": 50,
  "bedsICU": 20,
  "bedsOxygen": 15,
  "doctorsActive": 30
}
```

#### Get All Bookings
```http
GET /api/hospital/bookings?status=INCOMING&source=TRIAGE
Authorization: Bearer <token>
```

**Query Parameters:**
- `status` (optional): Filter by `INCOMING`, `ADMITTED`, `DIVERTED`, `CANCELLED`, `SCHEDULED`, `COMPLETED`, `NO_SHOW`, or `ALL`
- `source` (optional): Filter by `TRIAGE`, `CALENDAR`, `WALK_IN`, or `ALL`
- `hId` (optional): Hospital ID (if not using authenticated manager)

#### Update Booking Status
```http
PATCH /api/hospital/bookings/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "ADMITTED | DIVERTED | CANCELLED | COMPLETED | NO_SHOW"
}
```

#### Update ER Wait Times
```http
PUT /api/hospital/er-wait-times
Authorization: Bearer <token>
Content-Type: application/json

{
  "critical": {
    "avgWaitMinutes": 10,
    "currentQueue": 2,
    "status": "Available"
  },
  "moderate": {
    "avgWaitMinutes": 45,
    "currentQueue": 5,
    "status": "Busy"
  },
  "nonUrgent": {
    "avgWaitMinutes": 120,
    "currentQueue": 10,
    "status": "Available"
  }
}
```

#### Get Virtual Queue
```http
GET /api/hospital/virtual-queue
Authorization: Bearer <token>
```

#### Update Queue Entry Status
```http
PATCH /api/hospital/virtual-queue/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "WAITING | CALLED | COMPLETED | EXPIRED | CANCELLED"
}
```

#### Remove from Queue
```http
DELETE /api/hospital/virtual-queue/:id
Authorization: Bearer <token>
```

#### Update Facilities
```http
PUT /api/hospital/facilities
Authorization: Bearer <token>
Content-Type: application/json

{
  "specializations": [
    { "department": "Cardiology", "specialists": 5, "beds": 20 }
  ],
  "diagnostics": {
    "mri": true,
    "ctScan": true
  },
  "criticalCare": {
    "ventilators": 10,
    "dialysis": true
  },
  "supportServices": {
    "pharmacy": true
  },
  "accreditations": [
    { "name": "NABH", "validUntil": "2025-12-31" }
  ]
}
```

---

### 👨‍💼 Admin Routes (`/api/admin`)

#### Get System Stats
```http
GET /api/admin/stats
```

**Response:**
```json
{
  "totalHospitals": 150,
  "activeHospitals": 120,
  "pendingHospitals": 30,
  "totalUsers": 5000,
  "totalBeds": 12500,
  "systemHealth": "Excellent"
}
```

#### Get Pending Hospitals
```http
GET /api/admin/hospitals/pending
```

#### Get All Hospitals
```http
GET /api/admin/hospitals/all
```

#### Verify/Reject Hospital
```http
PATCH /api/admin/hospitals/:id/verify
Content-Type: application/json

{
  "isVerified": true  // true to approve, false to reject
}
```

---

### 🔍 Search Routes (`/api/search`)

#### Semantic Search
```http
GET /api/search?q=hospitals with ICU beds near me&lat=40.7128&lng=-74.0060&page=1&limit=10
```

**Query Parameters:**
- `q` (required): Search query (supports natural language)
- `lat`, `lng` (optional): User coordinates
- `page`, `limit` (optional): Pagination

**Supported Search Patterns:**
- "hospitals with ICU beds"
- "cardiac care near me"
- "emergency room in New York"
- "pediatric hospital with ventilators"

#### Get Suggestions (Autocomplete)
```http
GET /api/search/suggestions?q=card
```

**Response:**
```json
{
  "hospitals": [
    { "name": "Cardiac Care Center", "id": 5 }
  ],
  "specializations": ["Cardiology"],
  "facilities": ["Cardiac ICU"],
  "bedTypes": ["ICU Beds"]
}
```

#### Get Trending Hospitals
```http
GET /api/search/trending
```

Returns top 5 hospitals by average rating.

#### Get Recommended Hospitals
```http
GET /api/search/recommended
```

Returns 3 recommended hospitals with reasons.

---

### 🔌 WebSocket Events

#### Client → Server
```javascript
// Join hospital room for real-time updates
socket.emit('join_hospital', hospitalId);
```

#### Server → Client
```javascript
// New booking received
socket.on('new_booking', (booking) => { /* ... */ });

// Booking status updated
socket.on('booking_updated', (booking) => { /* ... */ });

// Hospital inventory updated
socket.on('hospital_updated', (hospital) => { /* ... */ });

// Public hospital update (for patient dashboard)
socket.on('hospital_updated_public', (hospital) => { /* ... */ });

// ER wait times updated
socket.on('er_wait_times_updated', (data) => { /* ... */ });

// Queue entry updated
socket.on('queue_entry_updated', (entry) => { /* ... */ });

// Queue entry removed
socket.on('queue_entry_removed', (data) => { /* ... */ });
```

---

## 🗄️ Database Schema

### Entity Relationship Diagram

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│    User     │────────▶│   Hospital   │◀────────│   Booking   │
│             │ manages │              │ receives│             │
│ - id        │         │ - id         │         │ - id        │
│ - email     │         │ - name       │         │ - userId    │
│ - password  │         │ - address    │         │ - hospitalId│
│ - role      │         │ - latitude   │         │ - condition │
│ - fullName  │         │ - longitude  │         │ - severity  │
│ - phone     │         │ - bedsGeneral│         │ - status    │
│ - googleId  │         │ - bedsICU    │         │ - source    │
└─────────────┘         │ - bedsOxygen │         └─────────────┘
      │                 │ - managerId  │               │
      │                 └──────────────┘               │
      │                       │                        │
      │                       │                        │
      ▼                       ▼                        ▼
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Rating    │         │VirtualQueue  │         │RefreshToken │
│             │         │              │         │             │
│ - id        │         │ - id         │         │ - id        │
│ - value     │         │ - hospitalId │         │ - token     │
│ - comment   │         │ - patientName│         │ - userId    │
│ - userId    │         │ - severity   │         │ - expiresAt │
│ - hospitalId│         │ - status     │         │ - revoked   │
└─────────────┘         └──────────────┘         └─────────────┘
```

### Key Models

#### User
- **Roles:** `PATIENT`, `HOSPITAL`, `ADMIN`
- **Authentication:** Email/Password + Google OAuth
- **Relations:** Can manage one hospital, create multiple bookings and ratings

#### Hospital
- **Verification:** Admin approval required (`isVerified`)
- **Live Inventory:** Real-time bed counts and doctor availability
- **Facilities:** JSON fields for specializations, diagnostics, critical care, support services, accreditations
- **Profile Completeness:** Calculated score (0-100)

#### Booking
- **Sources:** `TRIAGE` (emergency), `CALENDAR` (scheduled), `WALK_IN`
- **Statuses:** `INCOMING`, `ADMITTED`, `DIVERTED`, `CANCELLED`, `SCHEDULED`, `COMPLETED`, `NO_SHOW`
- **Severity:** `LOW`, `MODERATE`, `CRITICAL`

#### VirtualQueueEntry
- **Statuses:** `WAITING`, `CALLED`, `COMPLETED`, `EXPIRED`, `CANCELLED`
- **Ordering:** By severity (CRITICAL first) then check-in time

---

## 🔧 Environment Variables

### Backend (`.env`)

```env
# Server Configuration
PORT=5001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/medqueue?schema=public"

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_EXPIRES_IN=7d

# Session
SESSION_SECRET=your_session_secret_here

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5001/api/auth/google/callback

# CORS
ALLOWED_ORIGINS=http://localhost:5173,https://med-queue.vercel.app
```

### Frontend (`.env`)

```env
# Backend API
VITE_API_URL=http://localhost:5001/api
VITE_SOCKET_URL=http://localhost:5001

# Google Maps (if using)
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

---

## 🚀 Deployment

### Backend Deployment (Render/Railway)

1. **Create PostgreSQL Database**
   - Set up a PostgreSQL instance
   - Copy the connection string

2. **Deploy Backend**
   ```bash
   # On Render/Railway
   - Connect your GitHub repository
   - Set build command: npm install && npx prisma generate && npx prisma migrate deploy
   - Set start command: npm start
   - Add all environment variables
   ```

3. **Run Migrations**
   ```bash
   npx prisma migrate deploy
   ```

### Frontend Deployment (Vercel)

1. **Connect Repository**
   - Import your GitHub repository to Vercel

2. **Configure Build Settings**
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Set Environment Variables**
   - Add `VITE_API_URL` with your backend URL
   - Add `VITE_SOCKET_URL` with your backend URL

4. **Deploy**
   ```bash
   vercel --prod
   ```

---

## 🧪 Testing

### Run Backend Tests
```bash
cd backend
npm test
```

### Run Frontend Tests
```bash
cd frontend
npm test
```

### Manual Testing Checklist
- [ ] User registration and login
- [ ] Google OAuth flow
- [ ] Hospital search with filters
- [ ] Booking creation and cancellation
- [ ] Real-time bed updates
- [ ] Hospital manager dashboard
- [ ] Admin approval workflow
- [ ] Rating submission
- [ ] Virtual queue functionality

---

## 📊 Performance Optimization

- **Database Indexing:** Indexes on `latitude`, `longitude`, `isVerified`, `userId`, `hospitalId`
- **Pagination:** All list endpoints support pagination
- **Caching:** Consider Redis for frequently accessed data
- **WebSocket:** Real-time updates without polling
- **Image Optimization:** Use CDN for hospital images
- **Code Splitting:** React lazy loading for routes

---

## 🔒 Security

- ✅ JWT-based authentication
- ✅ Password hashing with bcryptjs
- ✅ CORS protection
- ✅ SQL injection prevention (Prisma ORM)
- ✅ XSS protection
- ✅ Rate limiting (recommended: express-rate-limit)
- ✅ HTTPS in production
- ✅ Environment variable protection

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Code Style
- Follow ESLint configuration
- Use Prettier for formatting
- Write meaningful commit messages
- Add comments for complex logic

---

## 📝 License

This project is licensed under the ISC License.

---

## 👥 Authors

- **Mansi Agarwal** - *Initial work* - [GitHub](https://github.com/Aggarwalmansi)

---

## 🙏 Acknowledgments

- React and Vite communities
- Prisma team for excellent ORM
- Socket.io for real-time capabilities
- Leaflet for mapping functionality
- All contributors and testers

---

## 📞 Support

For support, email support@medqueue.com or open an issue on GitHub.

---

## 🗺️ Roadmap

- [ ] Mobile app (React Native)
- [ ] SMS notifications
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] AI-powered hospital recommendations
- [ ] Telemedicine integration
- [ ] Insurance verification
- [ ] Payment gateway integration

---

**Built with ❤️ for better healthcare accessibility**
