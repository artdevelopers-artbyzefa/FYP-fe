# 🔌 FYP Portal — Backend Integration Guide

> **For the Backend Team.** This document provides the exact, updated instructions and endpoint maps to fully connect the frontend portal with your Express/Node.js backend database.

---

## ⚡ Quick Start: 3-Step Frontend Setup

To prepare the frontend to send requests to your backend, complete these three simple steps:

### Step 1 — Create the `.env` File
In your `frontend/` folder, create a new file named `.env` and add:
```env
VITE_API_BASE_URL=/api
```
> [!NOTE]
> Setting the base URL to `/api` directs the Axios client (`apiClient.js`) to make relative requests to the same origin (e.g., `http://localhost:5173/api/*`). The Vite proxy will then intercept these requests and route them directly to your backend on port 5000 — **eliminating CORS issues entirely in development**.

### Step 2 — Verify the Vite Dev Proxy
Ensure that the `frontend/vite.config.js` is set to proxy requests to port `5000` (where your backend should listen):
```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:5000',
      changeOrigin: true,
      secure: false,
    },
  },
}
```

### Step 3 — Restart the Frontend Dev Server
Run this inside the `frontend/` folder:
```bash
npm run dev
```

---

## 🏗️ The Frontend Network Architecture

The frontend uses a hybrid architecture designed for extreme reliability, offline demo compatibility, and self-healing.

```
                  ┌────────────────────────────────────────┐
                  │          Browser UI Components         │
                  └───────────┬────────────────┬───────────┘
                              │                │
                              ▼                ▼
                     [ API Service Layer ]    [ Older Services ]
                     (e.g., student.service)  (e.g., headService)
                              │                │
                              ▼                ▼
                     ┌────────────────┐       ┌────────────────┐
                     │  apiClient.js  │       │     api.js     │
                     │ (uses .env)    │       │ (hardcoded URL)│
                     └────────┬───────┘       └────────┬───────┘
                              │                        │
                              └───────────┬────────────┘
                                          │  GET /api/tasks
                                          ▼
                               ┌───────────────────────┐
                               │ Vite Proxy (:5173)    │
                               └──────────┬────────────┘
                                          │ (Forwards to port 5000)
                                          ▼
                               ┌───────────────────────┐
                               │ Express Backend (:5000)│
                               └───────────────────────┘
```

### 1. The Core HTTP Clients
* **`frontend/src/api/apiClient.js` (Primary)**: 
  * Automatically intercepts every request to inject the Authorization header (`Authorization: Bearer <token>`).
  * Features a **global error mapper** that translates standard HTTP status codes (`400`, `401`, `403`, `404`, `500`) into clean user-facing notifications.
  * Automatically clears local storage and redirects to `/login` if it receives a `401 Unauthorized` response.
* **`frontend/src/services/api.js` (Legacy)**: 
  * Hardcoded to `http://localhost:5000/api`. This client is used in older supervisor components.

### 2. Transitioning from "Demo Mode" to "Live Backend"
To make the frontend stop using mock data and start calling your database, open the service files under `frontend/src/services/` (e.g., `student.service.js`, `admin.service.js`) and update the functions.

**Example: Converting `getStudentProfile` in `student.service.js`**

* **Before (Demo Mode):**
  ```javascript
  export const getStudentProfile = async () => {
    // const res = await apiClient.get(STUDENT_GET_PROFILE_URL);
    // return res.data;
    return DEMO_STUDENT_PROFILE;
  };
  ```

* **After (Live Mode):**
  ```javascript
  export const getStudentProfile = async () => {
    const res = await apiClient.get(STUDENT_GET_PROFILE_URL);
    return res.data;
  };
  ```

---

## 🌐 Backend Configuration Requirements

Your Express backend server must be configured with the following settings to ensure seamless communication.

### 1. CORS Configuration (for Production)
In production, since your frontend and backend run on different domains, CORS is required. In development, CORS is handled by Vite.
Add the following package to your backend:
```bash
npm install cors
```
Configure your Express app entrypoint (`server.js` or `app.js`):
```javascript
const express = require('express');
const cors = require('cors');
const app = express();

const allowedOrigins = process.env.NODE_ENV === 'production'
  ? ['https://your-fyp-portal.vercel.app'] // Your deployed frontend URL
  : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS: Not allowed by security configuration'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json()); // Essential for parsing JSON request bodies
```

### 2. Standardized Error Response Format
To allow the frontend's global error handler to print clean, user-friendly messages, all error responses from the backend should return JSON in this format:
```json
{
  "message": "Human-readable explanation of what went wrong",
  "error": "ERROR_INTERNAL_CODE"
}
```

---

## 🗺️ Complete Endpoints & Service Map

The table below maps all frontend interactions directly to the backend router. Make sure your Express app defines these routes under the `/api` namespace (e.g., `app.use('/api', router)`).

### 🔑 Authentication & Profiles

| HTTP Method | Backend Route | Frontend Service | Description | JWT Auth Required? |
| :--- | :--- | :--- | :--- | :---: |
| **POST** | `/api/auth/login` | `auth.service.js` | Authenticate credentials and return token + user | ❌ |
| **POST** | `/api/auth/register` | `auth.service.js` | Create a new student/faculty account | ❌ |
| **POST** | `/api/auth/logout` | `auth.service.js` | Blacklist or destroy user session | ✅ |
| **GET** | `/api/user/profile` | `student.service.js` | Fetch currently logged-in user's profile | ✅ |
| **PUT** | `/api/user/profile` | `student.service.js` | Update user details (phone, dob, etc.) | ✅ |

### 🎓 Student Workflows

| HTTP Method | Backend Route | Frontend Service | Description | JWT Auth Required? |
| :--- | :--- | :--- | :--- | :---: |
| **GET** | `/api/student/profile` | `student.service.js` | Retrieve student-specific academic information | ✅ |
| **POST** | `/api/student/profile/update`| `student.service.js` | Save updated academic fields | ✅ |
| **GET** | `/api/student/partners/search`| `student.service.js` | Query potential FYP group partners by Reg No / email | ✅ |
| **POST** | `/api/student/partners/request`| `student.service.js` | Dispatch a group partner invitation request | ✅ |
| **GET** | `/api/student/partners/incoming`| `student.service.js` | Fetch received group partner invitation requests | ✅ |
| **POST** | `/api/student/partners/respond`| `student.service.js` | Accept or reject partner invitations | ✅ |
| **GET** | `/api/student/supervisors` | `student.service.js` | Fetch list of available faculty supervisors | ✅ |
| **POST** | `/api/student/supervisors/request`| `student.service.js`| Send supervision request to a faculty member | ✅ |
| **POST** | `/api/student/ideas/submit` | `student.service.js` | Submit a new FYP project proposal topic | ✅ |
| **GET** | `/api/student/ideas/approved` | `student.service.js` | Retrieve catalog of approved faculty project ideas | ✅ |
| **POST** | `/api/student/ideas/select` | `student.service.js` | Select an approved project topic for the group | ✅ |
| **GET** | `/api/student/tasks` | `student.service.js` | Fetch project task board columns and items | ✅ |

### 👨‍🏫 Faculty & Committee Management

| HTTP Method | Backend Route | Frontend Service | Description | JWT Auth Required? |
| :--- | :--- | :--- | :--- | :---: |
| **GET** | `/api/faculty/dashboard` | `Dashboard.jsx` | Fetch stats (pending proposals, active groups counts) | ✅ |
| **GET** | `/api/faculty/research-tags` | `ResearchTags.jsx` | Retrieve supervisor tags | ✅ |
| **GET** | `/api/faculty/availability` | `availabilityService.js`| Fetch supervisor weekly meeting availability grid | ✅ |
| **GET** | `/api/faculty/proposals` | `proposalService.js` | Fetch student proposals submitted for approval | ✅ |
| **GET** | `/api/faculty/groups` | `supervisionService.js`| Fetch active groups supervised by this faculty member | ✅ |
| **GET** | `/api/faculty/evaluations` | `evaluationService.js`| Fetch scheduled presentations and evaluations | ✅ |
| **GET** | `/api/head/consensus-groups` | `headService.js` | Get evaluation groups for consensus score submission | ✅ |
| **POST** | `/api/v1/committee/publish` | `headService.js` | Lock and publish final consensus grades | ✅ |

### 🛠️ Administrative Controls

| HTTP Method | Backend Route | Frontend Service | Description | JWT Auth Required? |
| :--- | :--- | :--- | :--- | :---: |
| **GET** | `/api/admin/dashboard/stats` | `admin.service.js` | Fetch overall user, audit, and health stats | ✅ |
| **GET** | `/api/admin/users` | `admin.service.js` | Retrieve complete active accounts database | ✅ |
| **POST** | `/api/admin/users/create` | `admin.service.js` | Provision a new administrative/faculty user | ✅ |
| **POST** | `/api/admin/users/:id/reset` | `admin.service.js` | Trigger system password reset token email | ✅ |
| **POST** | `/api/admin/users/:id/status`| `admin.service.js` | Toggle account status (Active/Suspended) | ✅ |
| **GET** | `/api/admin/rbac` | `admin.service.js` | View structural Role-Based Access details | ✅ |
| **GET** | `/api/admin/audit-logs` | `admin.service.js` | View system activity history logging | ✅ |
| **GET** | `/api/admin/system/health` | `admin.service.js` | Check CPU, DB, memory metrics live | ✅ |
| **POST** | `/api/admin/system/backup` | `admin.service.js` | Force full MongoDB database snapshot | ✅ |
| **POST** | `/api/admin/system/cache` | `admin.service.js` | Clear cached resources | ✅ |

---

## 🔑 Authentication Data Schema

When your backend receives a login request, it must return a JWT token and a user profile payload with the exact keys below:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "unique_database_id",
    "name": "Full Name",
    "email": "user@cuiatd.edu.pk",
    "role": "Student | Faculty Supervisor | FYP Office | Evaluator",
    "avatar": "Initials (e.g. AH)",
    "profileCompleted": true
  }
}
```

Standard roles recognized by the frontend routers are:
* `"Student"`
* `"Faculty Supervisor"`
* `"FYP Office"`
* `"Evaluator"`
