# 🔌 FYP Portal — Backend Integration Guide
> **For the backend team.** This document reflects the current, production-ready state of the frontend after all fixes have been applied.

---

## ⚡ Quick Start (3 Steps)

### Step 1 — Set Your Backend URL
Edit `frontend/.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### Step 2 — Start Your Backend
Your backend must be running on **port 5000** (or whatever port you set above).

### Step 3 — Restart the Frontend Dev Server
```bash
# Press Ctrl+C to stop, then:
npm run dev
```

That's it. The Vite dev proxy automatically routes all `/api/*` requests to your backend — **no CORS configuration needed during development**.

---

## 🏗️ How the Frontend Connects to the Backend

```
Browser (Vite Dev Server :5176)
         │
         │  GET /api/tasks
         ▼
  Vite Proxy (vite.config.js)
         │
         │  Forwards to → http://localhost:5000/api/tasks
         ▼
  Your Backend Server (:5000)
         │
         │  Returns JSON response
         ▼
  Frontend renders data
```

> The Vite proxy is only active during development (`npm run dev`).  
> In production (`npm run build`), `VITE_API_BASE_URL` in `.env.production` is used directly.

---

## 📁 Key Files Reference

| File | Purpose |
|---|---|
| `frontend/.env` | Backend URL for **development** |
| `frontend/.env.production` | Backend URL for **production build** |
| `frontend/vite.config.js` | Vite proxy config (eliminates CORS in dev) |
| `frontend/src/services/api.js` | Shared Axios instance (reads from `.env`) |
| `frontend/src/api/apiClient.js` | Secondary Axios instance with full error mapping |
| `frontend/src/services/apiUrls.js` | All API endpoint path constants |

---

## 🔑 Authentication

### `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "student@cuiatd.edu.pk",
  "password": "Student@123",
  "role": "Student"
}
```

**Response `200 OK`:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "S001",
    "name": "Ahmed Farooq",
    "email": "student@cuiatd.edu.pk",
    "role": "Student",
    "studentId": "SP21-BCS-001",
    "department": "Computer Science",
    "semester": "8th",
    "cgpa": 3.5,
    "fatherName": "Farooq Ahmed",
    "classification": "Sem 8 / A",
    "course": "FYP-1",
    "avatar": "AF"
  }
}
```

> [!IMPORTANT]
> The `token` is automatically saved to `localStorage` as `"token"` and sent on every request as `Authorization: Bearer <token>`. The `user` object is saved as `"user"`.

**Supported roles:**
- `"Student"`
- `"Faculty Supervisor"`
- `"FYP Office"`
- `"Evaluator"`

---

### `POST /api/auth/register`

**Request Body:**
```json
{
  "name": "Ahmed Farooq",
  "email": "student@cuiatd.edu.pk",
  "password": "Student@123",
  "role": "Student",
  "regNo": "SP21-BCS-001"
}
```

**Response `201 Created`:** Same shape as login response.

---

## 📊 Dashboard

### `GET /api/dashboard/stats`
**Auth:** `Authorization: Bearer <token>` ✅ Required

**Response `200 OK`:**
```json
{
  "totalTasks": 20,
  "completedTasks": 5,
  "pendingRequests": 2,
  "projectProgress": 25,
  "phase": "Proposal",
  "groupId": "G-042"
}
```

> **Fallback behaviour:** If this endpoint fails in **development**, the page silently shows static mock data. In **production**, it shows a red error banner to the user.

---

## 📋 Tasks

### `GET /api/tasks`
**Auth:** Required

The frontend accepts **either** of these response shapes (it normalises automatically):

**Option A — Grouped Object (preferred):**
```json
{
  "Not Started": [
    { "id": "T001", "title": "Task Name", "categories": ["Frontend"], "priority": "high", "date": "Mar 1", "overdue": true, "assignee": "AR" }
  ],
  "In Progress": [
    { "id": "T008", "title": "Task Name", "categories": ["Backend"], "priority": "medium", "date": "Feb 15", "overdue": true, "progress": 75, "assignee": "FK" }
  ],
  "Review": [ ... ],
  "Completed": [ ... ]
}
```

**Option B — Flat Array (also works):**
```json
[
  { "id": "T001", "title": "Task Name", "status": "todo", "categories": ["Frontend"], "priority": "high", "date": "Mar 1", "overdue": true, "assignee": "AR" },
  { "id": "T008", "title": "Task Name", "status": "in-progress", "categories": ["Backend"], "priority": "medium", "progress": 75, "assignee": "FK" }
]
```

**Status values for flat array mapping:**

| Backend `status` value | Frontend column |
|---|---|
| `"todo"` or `"not-started"` | **Not Started** |
| `"in-progress"` | **In Progress** |
| `"review"` | **Review** |
| `"done"` or `"completed"` | **Completed** |

**Field constraints:**
- `priority`: `"high"` | `"medium"` | `"low"`
- `progress`: `0–100` (optional, only for In Progress / Review / Completed)
- `assignee`: 2-letter initials string e.g. `"AR"`, `"FK"`

---

### `POST /api/tasks`
**Auth:** Required

**Request Body:**
```json
{
  "title": "Write Proposal Document",
  "categories": ["Frontend"],
  "priority": "medium",
  "date": "Feb 22",
  "overdue": true,
  "assignee": "AR"
}
```

**Response `201 Created`:**
```json
{ "id": "T021", "title": "Write Proposal Document", "status": "todo", ... }
```

---

### `PUT /api/tasks/:id`
**Auth:** Required

**Request Body:** Full updated task object
```json
{
  "id": "T001",
  "title": "Updated Title",
  "categories": ["Backend"],
  "priority": "high",
  "date": "Mar 1",
  "overdue": false,
  "assignee": "UA"
}
```

**Response `200 OK`:** Updated task object.

---

### `DELETE /api/tasks/:id`
**Auth:** Required

**Response `200 OK`:**
```json
{ "message": "Task deleted successfully" }
```

---

## 👨‍🏫 Supervisors

### `GET /api/supervisor`
**Auth:** Required

**Response `200 OK`:**
```json
[
  {
    "id": 1,
    "name": "Dr. Ali Hassan",
    "designation": "Associate Professor",
    "expertise": "AI, Machine Learning, Computer Vision",
    "avatar": "AH"
  },
  {
    "id": 2,
    "name": "Dr. Zeeshan Ali",
    "designation": "Assistant Professor",
    "expertise": "Web Technologies, Cloud Computing",
    "avatar": "ZA"
  }
]
```

> **Fallback behaviour:** If this fails in **development**, the page shows a hardcoded list of 3 supervisors. In **production**, it shows a red error banner.

---

### `POST /api/supervisor`
**Auth:** Required — sends a supervisor request

**Request Body:**
```json
{
  "supervisorId": 1
}
```

**Response `200 OK`:**
```json
{ "message": "Supervisor request sent successfully" }
```

---

## 👤 Profile

### `GET /api/profile`
**Auth:** Required

**Response `200 OK`:**
```json
{
  "fatherName": "Farooq Ahmed",
  "section": "A",
  "classification": "Sem 8 / A",
  "dob": "15/08/99",
  "phone": "+92-300-1234567",
  "previewUrl": "https://your-cdn.com/photo.jpg"
}
```

> `previewUrl` is optional. If returned, it will be displayed as the user's profile photo.

---

### `PUT /api/profile`
**Auth:** Required

**Request Body:**
```json
{
  "fatherName": "Farooq Ahmed",
  "section": "A",
  "dob": "15/08/99",
  "phone": "+92-300-1234567",
  "previewUrl": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
}
```

> [!WARNING]
> `previewUrl` is currently sent as a **base64 data URL**. For production, you should store this as a file (S3/Cloudinary/disk) and return a permanent CDN URL in the response.

**Response `200 OK`:**
```json
{
  "fatherName": "Farooq Ahmed",
  "section": "A",
  "dob": "15/08/99",
  "phone": "+92-300-1234567"
}
```

---

## 🌐 CORS Configuration

### Development
**No CORS setup needed.** The Vite proxy handles all `/api/*` requests server-side, so the browser never makes a cross-origin request.

### Production
When deployed, the frontend and backend are on separate domains — CORS is required.

**Express.js example:**
```js
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? ['https://your-fyp-portal.vercel.app']  // ← replace with your real frontend URL
  : ['http://localhost:5173', 'http://localhost:5174',
     'http://localhost:5175', 'http://localhost:5176'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS: Not allowed'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

---

## ⚠️ Error Response Format

All error responses should use this format so the frontend can display proper messages:

```json
{
  "message": "Human-readable description",
  "error": "ERROR_CODE"
}
```

**HTTP status code → frontend behaviour:**

| Status | Frontend Action |
|---|---|
| `400` | Shows "Please check your input." |
| `401` | Clears localStorage + redirects to `/login` |
| `403` | Shows "Access Denied" |
| `404` | Shows "The resource doesn't exist." |
| `500` | Shows "Technical difficulties, please try again later." |

---

## 🗺️ Full API Route Map

| Method | Endpoint | Page | Auth |
|---|---|---|---|
| `POST` | `/api/auth/login` | Login | ❌ |
| `POST` | `/api/auth/register` | Register | ❌ |
| `GET` | `/api/dashboard/stats` | Dashboard | ✅ |
| `GET` | `/api/tasks` | TaskManager | ✅ |
| `POST` | `/api/tasks` | TaskManager | ✅ |
| `PUT` | `/api/tasks/:id` | TaskManager | ✅ |
| `DELETE` | `/api/tasks/:id` | TaskManager | ✅ |
| `GET` | `/api/supervisor` | SupervisorSelection | ✅ |
| `POST` | `/api/supervisor` | SupervisorSelection | ✅ |
| `GET` | `/api/profile` | Profile | ✅ |
| `PUT` | `/api/profile` | Profile | ✅ |

---

## ✅ Connection Checklist

**One-time setup:**
- [ ] Set `VITE_API_BASE_URL=http://localhost:5000/api` in `frontend/.env`
- [ ] Restart `npm run dev` after editing `.env`

**Backend must:**
- [ ] Run on port `5000` (matches the Vite proxy target)
- [ ] `POST /api/auth/login` → return `{ token, user }`
- [ ] All protected routes validate `Authorization: Bearer <token>`
- [ ] Return errors as `{ message, error }` with correct HTTP status codes

**Before production build:**
- [ ] Update `frontend/.env.production` with real backend URL
- [ ] Add CORS config on backend allowing your deployed frontend domain
- [ ] Run `npm run build`
