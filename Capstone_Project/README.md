# Capstone Project

## Overview

This repository contains a full-stack Capstone Project with a Node.js/Express backend and a Vite-powered frontend. The backend contains API routes, controllers, middleware, and integration with Firebase Admin and (likely) a database. The frontend is built with Vite and modern tooling to provide a responsive single-page application.

This README covers how to set up, run, test, and contribute to the Capstone project.

## Contents

- `backend/` — Node/Express API, controllers, models, routes, tests and Docker setup.
- `frontend/` — Vite-based frontend application (HTML/CSS/JS/React or plain JS depending on implementation).

## Tech stack

- Node.js (Express)
- Vite (frontend)
- Jest (backend tests)
- Docker / docker-compose (containerization)
- Firebase Admin (service integration)
- Any database (MongoDB / others) — check `backend/config` and environment variables

## Assumptions

A few small assumptions made while writing this README:
- The backend expects environment variables such as `PORT`, `MONGO_URI` (or other DB connection), and `JWT_SECRET`.
- Firebase service credentials are present in `backend/serviceAccountKey.json` or set via an environment variable.
- `package.json` scripts for start/dev/test exist in `backend/` and `frontend/` (common in this project structure).

If any of these are different in your repo, adjust the `.env` and commands accordingly.

## Setup (Windows PowerShell)

Prerequisites:
- Node.js (v14+ recommended) and npm/yarn
- Docker (optional, for docker-compose)
- PowerShell (instructions below use PowerShell)

1) Backend

Open PowerShell and run:

```powershell
Set-Location -Path .\Capstone_Project\backend
npm install
# Create .env from example or create manually with required variables
# Example (create .env and add values):
# PORT=5000
# MONGO_URI=your_mongo_connection_string
# JWT_SECRET=your_jwt_secret
# FIREBASE_CREDENTIALS_PATH=./serviceAccountKey.json

# Start (development)
npm run dev
# or
npm start
```

2) Frontend

In a separate PowerShell window:

```powershell
Set-Location -Path .\Capstone_Project\frontend
npm install
npm run dev
# or to build for production
npm run build
```

3) Using Docker (optional)

If a `docker-compose.yml` is provided in `backend/`, you can build and run everything with Docker:

```powershell
Set-Location -Path .\Capstone_Project\backend
docker-compose up --build
```

This will start backend (and any linked services) per the compose file.

## Environment variables

Typical environment variables used by this project (confirm exact names in `backend/` files):

- PORT — port for backend server (e.g., 5000)
- MONGO_URI — connection string for MongoDB
- JWT_SECRET — secret for signing JWTs
- FIREBASE_CREDENTIALS_PATH or FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY — Firebase Admin credentials
- Any API keys used by the frontend/back

Store these in a `.env` file at `Capstone_Project/backend/.env` (do not commit secrets).

## Project structure (high level)

- `backend/app.js` or `server.js` — entry point for backend
- `backend/routes/` — API route definitions
- `backend/controllers/` — business logic handlers (e.g., `adminController.js`)
- `backend/models/` — data models
- `backend/middleware/` — auth, logging, error handlers
- `backend/tests/` — Jest tests
- `frontend/src/` — frontend source files

Explore these folders for implementation details and available endpoints.

## Testing

Run backend tests (if `package.json` has a test script):

```powershell
Set-Location -Path .\Capstone_Project\backend
npm test
```

Frontend tests (if present) can be run similarly from the `frontend` folder.

## API reference

See `backend/routes/` for the definitive list of endpoints. Common endpoints in Capstone setups include:

- `POST /api/auth/login` — login
- `POST /api/auth/register` — register user
- `GET /api/items` — list items/resources
- `POST /api/admin/*` — admin routes (protected)

Adjust paths according to your implementation.

## Linting & Formatting

If the repository includes ESLint or Prettier configs (e.g., `eslint.config.js`), run linting per the `package.json` scripts:

```powershell
npm run lint
```

## Deployment notes

- For production, build the frontend (`npm run build`) and serve the static assets with a static server or from the backend.
- Configure production environment variables securely (CI/CD, hosting provider secrets).
- When using Docker, production compose or Dockerfiles may need adjustments (multi-stage builds, proper env injection).

## Contribution

1. Fork the repo or create a feature branch.
2. Create a clear PR with a description of the changes.
3. Add tests for new features or bug fixes.
4. Run linting and tests before opening the PR.

## Troubleshooting tips

- If you see port conflicts, change `PORT` in `.env`.
- If Firebase authentication fails, confirm the service account JSON or environment key values and paths.
- For database errors, verify `MONGO_URI` or DB connection string and that the database server is reachable.

## Contact

For questions about this project, open an issue in the repository or contact the author (maintainer details if available).

---

Thank you for checking out the Capstone Project! Update this README with project-specific details (exact env variable names, sample `.env.example`, and full API docs) as you finalize the app.
