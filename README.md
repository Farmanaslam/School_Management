# SchoolDesk – School Management System

A full-stack MERN (MongoDB, Express, React, Node.js) application for managing school students and assignments.

---

## Features

- **Admin Authentication** – Register and login with JWT-secured sessions
- **Student Management** – Add, edit, delete, search students
- **Task / Assignment Management** – Assign homework, mark done/pending, filter by status or student
- **Dashboard** – Live stats: total students, tasks, completed, pending
- **Protected Routes** – All pages require login; token auto-attaches to requests

---

## Project Structure

```
school-mgmt/
├── server/                     # Express + Node.js backend
│   ├── index.js                # App entry, DB connect, routes
│   ├── .env.example            # Environment variables template
│   ├── models/
│   │   ├── Admin.js            # Admin schema with password hashing
│   │   ├── Student.js          # Student schema
│   │   └── Task.js             # Task/assignment schema
│   ├── middleware/
│   │   └── authMiddleware.js   # JWT verification
│   ├── controllers/
│   │   ├── authController.js   # Login / Register logic
│   │   ├── studentController.js# Student CRUD
│   │   └── taskController.js   # Task CRUD + toggle
│   └── routes/
│       ├── authRoutes.js
│       ├── studentRoutes.js
│       └── taskRoutes.js
│
└── client/                     # React frontend
    └── src/
        ├── App.js              # Router setup
        ├── index.js            # React root
        ├── api/index.js        # Axios instance + all API helpers
        ├── context/
        │   └── AuthContext.js  # Global auth state (login/logout)
        ├── components/
        │   ├── Navbar.js       # Top navigation bar
        │   └── PrivateRoute.js # Route guard for protected pages
        └── pages/
            ├── Login.js        # Login + Register form
            ├── Dashboard.js    # Overview stats + recent data
            ├── Students.js     # Student management
            └── Tasks.js        # Task management
```

---

## Setup Instructions

### Prerequisites
- Node.js v18 or above
- MongoDB running locally **or** a MongoDB Atlas connection string

---

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/school-mgmt.git
cd school-mgmt
```

---

### 2. Backend Setup

```bash
cd server
npm install
cp .env.example .env
```

Edit `.env` and fill in your values:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/schooldb
JWT_SECRET=replaceWithAnyLongRandomString
CLIENT_URL=http://localhost:3000
```

Start the backend:

```bash
npm run dev
```

Backend runs at: `http://localhost:5000`

---

### 3. Frontend Setup

Open a new terminal:

```bash
cd client
npm install
npm start
```

Frontend runs at: `http://localhost:3000`

---

### 4. First Login

1. Open `http://localhost:3000`
2. Click **"Register here"** to create your admin account
3. Login with those credentials
4. You'll land on the Dashboard

---

## API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Create admin account |
| POST | `/api/auth/login` | No | Login, returns JWT |
| GET | `/api/students` | Yes | List all students |
| POST | `/api/students` | Yes | Add new student |
| PUT | `/api/students/:id` | Yes | Update student |
| DELETE | `/api/students/:id` | Yes | Remove student |
| GET | `/api/tasks` | Yes | List all tasks |
| GET | `/api/tasks/student/:id` | Yes | Tasks for one student |
| POST | `/api/tasks` | Yes | Create task |
| PATCH | `/api/tasks/:id/toggle` | Yes | Toggle done/pending |
| DELETE | `/api/tasks/:id` | Yes | Delete task |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6 |
| Backend | Node.js, Express |
| Database | MongoDB with Mongoose |
| Auth | JWT + bcryptjs |
| HTTP Client | Axios |
