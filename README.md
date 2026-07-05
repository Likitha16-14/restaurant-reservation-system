# Restaurant Reservation System

A full-stack restaurant reservation management system with a React/Vite frontend and an Express backend. It supports:

- User registration and login
- Role-based access for customers and admins
- Table management
- Reservation booking and management
- Admin dashboard with reservation stats

## Project Structure

- `backend/` – Express API and in-memory data store fallback
- `frontend/` – React + Vite client application

## Prerequisites

- Node.js 18+
- npm 9+

## Backend Setup

```bash
cd backend
npm install
npm run seed
npm start
```

The API will run on http://localhost:5000.

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on http://localhost:5173.

## Verification

### Backend health check

```bash
curl http://localhost:5000/api/health
```

Expected response:

```json
{"status":"ok","message":"Restaurant reservation API is running"}
```

### Frontend build

```bash
cd frontend
npm run build
```

## Default Admin Account

A seeded admin user is created when you run the backend seed script.

Email: admin@example.com
Password: admin123

## Notes

The backend uses an in-memory data store by default so it runs locally without requiring MongoDB.
