# Study Planner — MERN Stack Architecture

## 1. Project Overview

A simple study planner for students.

The first version (MVP) allows a student to:

- Add a study task
- Add a course name
- Add a topic name
- Assign a priority
- Set a duration
- Mark a task as completed
- View all tasks
- View pending tasks
- View completed tasks

The application should be intentionally simple and beginner-friendly.

---

## 2. Technology Stack

### Frontend

- React
- JavaScript
- HTML/CSS
- Vite
- React Router only if routing becomes necessary

### Backend

- Node.js
- Express.js

### Database

- MongoDB
- Mongoose

### Development Tools

- npm
- Git
- `.env` for configuration/secrets

---

## 3. High-Level Architecture

```text
                    Study Planner
                         |
          +--------------+--------------+
          |                             |
       Frontend                      Backend
        React                       Node.js
        Vite                       Express.js
          |                             |
          | HTTP / JSON API              |
          +------------->---------------+
                                        |
                                     Mongoose
                                        |
                                     MongoDB
```

### Request flow

```text
User
  |
  v
React UI
  |
  v
API Request
  |
  v
Express Route
  |
  v
Controller
  |
  v
Mongoose Model
  |
  v
MongoDB
```

---

## 4. Recommended Project Structure

Use a simple separation between frontend and backend.

```text
study-planner/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TaskForm.jsx
│   │   │   ├── TaskList.jsx
│   │   │   ├── TaskItem.jsx
│   │   │   ├── TaskFilter.jsx
│   │   │   └── EmptyState.jsx
│   │   │
│   │   ├── pages/
│   │   │   └── Dashboard.jsx
│   │   │
│   │   ├── services/
│   │   │   └── taskService.js
│   │   │
│   │   ├── hooks/
│   │   │   └── useTasks.js
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   │
│   │   ├── controllers/
│   │   │   └── taskController.js
│   │   │
│   │   ├── models/
│   │   │   └── Task.js
│   │   │
│   │   ├── routes/
│   │   │   └── taskRoutes.js
│   │   │
│   │   ├── middleware/
│   │   │   └── errorHandler.js
│   │   │
│   │   └── server.js
│   │
│   ├── package.json
│   └── .env
│
├── .gitignore
├── README.md
└── package.json
```

Do not over-engineer the project at this stage.

---

## 5. Data Model

The main entity is `Task`.

### Task schema

```text
Task
├── _id
├── taskName
├── courseName
├── topicName
├── priority
├── duration
├── completed
├── createdAt
└── updatedAt
```

### Suggested Mongoose schema

```js
{
  taskName: String,
  courseName: String,
  topicName: String,
  priority: "Low" | "Medium" | "High",
  duration: Number,
  completed: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Validation

- `taskName`: required, trimmed
- `courseName`: required, trimmed
- `topicName`: required, trimmed
- `priority`: required, enum: `Low`, `Medium`, `High`
- `duration`: required, positive number
- `completed`: boolean, default `false`

Store duration in **minutes**.

Example:

```json
{
  "taskName": "Read Chapter 3",
  "courseName": "Data Structures",
  "topicName": "Linked Lists",
  "priority": "High",
  "duration": 60,
  "completed": false
}
```

---

## 6. REST API

Keep the API small.

### Create task

```http
POST /api/tasks
```

Request:

```json
{
  "taskName": "Read Chapter 3",
  "courseName": "Data Structures",
  "topicName": "Linked Lists",
  "priority": "High",
  "duration": 60
}
```

---

### Get tasks

```http
GET /api/tasks
```

Optional filtering:

```http
GET /api/tasks?status=pending
GET /api/tasks?status=completed
```

The backend should interpret:

- no status → all tasks
- `pending` → `completed: false`
- `completed` → `completed: true`

---

### Mark task completed

```http
PATCH /api/tasks/:id/complete
```

Request:

```json
{
  "completed": true
}
```

The API can also support changing back to pending if the UI needs an undo action.

---

### Delete task

Although deletion was not required in the initial requirements, structure the backend so this can be added later:

```http
DELETE /api/tasks/:id
```

Do not add unnecessary UI functionality unless requested.

---

## 7. Frontend Components

### `Dashboard`

Main page.

Responsibilities:

- Load tasks
- Hold selected filter
- Display the task form
- Display task list
- Display empty states

### `TaskForm`

Responsibilities:

- Collect task information
- Validate basic input
- Submit a new task
- Clear the form after successful creation

Fields:

```text
Task Name
Course Name
Topic Name
Priority
Duration
Add Task
```

### `TaskList`

Responsibilities:

- Render tasks
- Show appropriate empty state

### `TaskItem`

Display:

```text
Task name
Course
Topic
Priority
Duration
Status
Complete button
```

### `TaskFilter`

Options:

```text
All
Pending
Completed
```

---

## 8. State Management

Do not introduce Redux for the MVP.

Use React state and hooks.

Suggested state:

```js
const [tasks, setTasks] = useState([]);
const [filter, setFilter] = useState("all");
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
```

A custom `useTasks` hook can encapsulate API-related task operations if it keeps the code simpler.

---

## 9. Error Handling

Backend should return consistent JSON errors.

Example:

```json
{
  "success": false,
  "message": "Task name is required"
}
```

Success example:

```json
{
  "success": true,
  "data": {
    "...": "..."
  }
}
```

Handle:

- Validation errors
- Invalid MongoDB IDs
- Task not found
- Database connection errors
- Unexpected server errors
- Network/API errors on the frontend

Do not expose stack traces to the client in production responses.

---

## 10. Edge Cases

The application should handle:

1. Empty task name
2. Empty course name
3. Empty topic name
4. Invalid priority
5. Duration of `0`
6. Negative duration
7. Non-numeric duration
8. Missing request fields
9. Invalid task ID
10. Completing a nonexistent task
11. Completing an already completed task
12. No tasks exist
13. No pending tasks exist
14. No completed tasks exist
15. API/server unavailable
16. MongoDB unavailable

Duplicate task names do not need to be prevented.

---

## 11. UI Behavior

### Initial state

Show:

```text
Study Planner

[ Add Task Form ]

All | Pending | Completed

No tasks yet.
```

### After adding tasks

Display each task as a card or row.

Example:

```text
Read Chapter 3
Data Structures • Linked Lists
Priority: High
Duration: 60 min

[ Mark Complete ]
```

Completed tasks should visually indicate their completed state.

Avoid excessive animations or complicated UI components.

---

## 12. Environment Variables

Backend `.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/study-planner
```

Do not commit `.env`.

Add `.env` to `.gitignore`.

If MongoDB Atlas is used, the connection string should be supplied through `MONGODB_URI`.

---

## 13. Development Setup

### Backend

```bash
cd server
npm install
npm run dev
```

### Frontend

```bash
cd client
npm install
npm run dev
```

Expected local setup:

```text
Frontend: http://localhost:5173
Backend:  http://localhost:5000
```

The exact ports may be changed if necessary.

---

## 14. API Design Principles

For the first version:

- Use REST
- Use JSON
- Use HTTP status codes correctly
- Keep routes predictable
- Keep controllers small
- Keep MongoDB logic inside models/controllers rather than React components
- Never connect React directly to MongoDB
- Never put MongoDB credentials in frontend code

---

## 15. Security and Reliability Basics

Even though this is an educational MVP:

- Validate input on the backend
- Do not trust frontend validation alone
- Store secrets in environment variables
- Do not return sensitive environment variables
- Handle malformed IDs
- Use appropriate HTTP status codes
- Add CORS configuration for the frontend
- Keep error responses user-friendly

Authentication is **out of scope for v1**.

---

## 16. Out of Scope for MVP

Do not implement these unless explicitly requested:

- User authentication
- Login/signup
- Multiple users
- JWT
- Calendar
- Notifications
- Email reminders
- Study streaks
- Analytics
- AI recommendations
- Drag-and-drop
- Recurring tasks
- File uploads
- Social features
- Redux
- Complex state-management libraries

These can be added in later versions.

---

## 17. Future Extensions

Possible future versions:

### V2

- Edit task
- Delete task
- Search tasks
- Sort by priority
- Sort by duration

### V3

- Due dates
- Study sessions
- Daily/weekly planning
- Dashboard statistics

### V4

- User authentication
- Personal task data
- Multiple users
- Cloud deployment

---

## 18. Implementation Philosophy

The goal is to produce a **working, understandable beginner-level MERN application**, not an enterprise architecture.

Priorities:

1. Correct functionality
2. Simple code
3. Clear folder structure
4. Good validation
5. Easy debugging
6. Minimal dependencies
7. Clean UI

Avoid abstraction until there is a clear reason for it.
