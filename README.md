# Workforce Hub

A production-grade, full-stack **Employee & Project Management System** built to demonstrate end-to-end engineering across a modern enterprise tech stack — GraphQL API, Go backend, React frontend, MySQL database, and fully containerized with Docker.

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Browser                        │
│              React + TypeScript + Apollo Client              │
└──────────────────────────┬──────────────────────────────────┘
                           │ GraphQL over HTTP
┌──────────────────────────▼──────────────────────────────────┐
│                      nginx (Port 3000)                       │
│          Serves static files + proxies /query → backend      │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                   Go Backend (Port 8080)                     │
│         gqlgen GraphQL Server + EntGo ORM + chi Router       │
│         JWT Authentication + bcrypt Password Hashing         │
└──────────────────────────┬──────────────────────────────────┘
                           │ TCP/3306
┌──────────────────────────▼──────────────────────────────────┐
│                    MySQL 8.0 (Port 3306)                     │
│          6 relational tables, FK constraints, indexes        │
└─────────────────────────────────────────────────────────────┘
```

---

## ⚡ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React 18 + TypeScript + Vite | Component-based UI with type safety |
| Styling | Tailwind CSS v4 | Utility-first responsive design |
| GraphQL Client | Apollo Client | Queries, mutations, caching |
| State Management | Zustand | Lightweight global auth state |
| Charts | Recharts | Dashboard data visualizations |
| Routing | React Router v6 | Client-side navigation with protected routes |
| Backend | Go 1.26 | High-performance statically typed server |
| GraphQL Server | gqlgen | Type-safe, code-generated GraphQL in Go |
| ORM | EntGo | Schema-first ORM with auto-migration |
| Database | MySQL 8.0 | Relational data with FK constraints |
| Auth | JWT + bcrypt | Stateless authentication, secure password hashing |
| HTTP Router | chi | Lightweight, idiomatic Go HTTP router |
| Containerization | Docker + Docker Compose | Multi-stage builds, orchestrated services |
| CI/CD | GitHub Actions | Automated build, test, and Docker validation |

---

## ✨ Features

- **JWT Authentication** — Register and login with bcrypt-hashed passwords and JWT tokens persisted across browser sessions
- **GraphQL API** — 12 queries and 9 mutations covering the full data model; interactive Playground at `/`
- **Employee Management** — Users with roles (Admin, Manager, Employee) and department assignments
- **Project Management** — Full project lifecycle (planning → active → completed) with team assignments and role tracking
- **Timesheet System** — Log hours per project per day with approval workflow (draft → submitted → approved)
- **Dashboard Analytics** — Live stat cards and Recharts bar chart showing project status distribution
- **Role-based Data Model** — Complex relational schema with 6 entities and proper FK constraints
- **Auto-migration** — EntGo creates and updates database schema on every server start
- **Protected Routes** — Unauthenticated users are redirected to login; token stored in localStorage
- **Fully Dockerized** — Single `docker-compose up --build` runs the entire stack

---

## 🗄️ Database Schema

```
roles ──────────────────────────────────────────┐
                                                 │
departments ──┐                                  │
              │                                  │
              ▼                                  ▼
           users ────────────────────────────────┘
              │
              ├──── project_assignments ──── projects
              │
              └──── timesheets ──────────────────┘
```

**Entities:**
- `roles` — admin, manager, employee
- `departments` — Engineering, Product, Marketing, HR
- `users` — employees with role + department FK
- `projects` — with status enum and department FK
- `project_assignments` — junction table (user ↔ project) with role and allocated hours
- `timesheets` — daily hour logs per user per project with approval status

---

## 📁 Project Structure

```
workforce-hub/
├── backend/
│   ├── cmd/server/              # main.go entry point
│   ├── config/                  # Database connection + auto-migration
│   ├── ent/schema/              # EntGo entity definitions (source of truth for DB schema)
│   ├── graph/
│   │   ├── generated/           # gqlgen auto-generated code (do not edit)
│   │   ├── model/               # gqlgen auto-generated GraphQL models
│   │   ├── resolver.go          # Root resolver with DB dependency injection
│   │   ├── helpers.go           # JWT, bcrypt, EntGo→GraphQL converters
│   │   └── schema.resolvers.go  # All query + mutation implementations
│   ├── graph/schema.graphqls    # GraphQL schema (source of truth for API)
│   ├── Dockerfile               # Multi-stage Go build
│   └── go.mod
├── frontend/
│   ├── src/
│   │   ├── components/layout/   # Sidebar, AppLayout (protected route wrapper)
│   │   ├── pages/               # Login, Dashboard, Users, Departments, Projects, Timesheets
│   │   ├── lib/                 # Apollo client config, GraphQL operations
│   │   ├── store/               # Zustand auth store
│   │   └── App.tsx              # Router + ApolloProvider setup
│   ├── nginx.conf               # React Router fallback + GraphQL proxy
│   └── Dockerfile               # Multi-stage Node build + nginx serve
├── db/init/                     # SQL seed files (auto-run on first MySQL start)
├── .github/workflows/ci.yml     # GitHub Actions CI pipeline
└── docker-compose.yml           # Orchestrates all 4 services
```

---

## 🚀 Quick Start

### Prerequisites
- Docker Desktop
- Git

### Run with Docker (recommended)

```bash
git clone https://github.com/sai18022001/workforce-hub.git
cd workforce-hub
docker-compose up --build
```

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| GraphQL Playground | http://localhost:8080 |
| Adminer (DB GUI) | http://localhost:8081 |

### Run locally (development)

**Prerequisites:** Go 1.26+, Node.js 22+, MySQL 8.0 running on port 3306

```bash
# Terminal 1 — Backend
cd backend
cp .env.example .env        # fill in your DB credentials
go mod tidy
go run cmd/server/main.go

# Terminal 2 — Frontend
cd frontend
npm install
npm run dev                 # http://localhost:5173
```

---

## 🔐 First-time Setup

1. Start the stack with `docker-compose up --build`
2. Go to **Adminer** at `http://localhost:8081` (server: `mysql`, user: `root`, password: `root`)
3. Insert seed roles:
```sql
INSERT INTO roles (name, description, created_at) VALUES
  ('admin', 'Full system access', NOW()),
  ('manager', 'Can manage projects and teams', NOW()),
  ('employee', 'Standard employee access', NOW());
```
4. Open **GraphQL Playground** at `http://localhost:8080` and register your first user:
```graphql
mutation {
  createDepartment(input: { name: "Engineering" }) { id }
}

mutation {
  register(input: {
    firstName: "Your"
    lastName: "Name"
    email: "you@example.com"
    password: "yourpassword"
    roleId: "1"
    departmentId: "1"
  }) {
    token
    user { id firstName }
  }
}
```
5. Login at `http://localhost:3000`

---

## 🔌 GraphQL API Reference

### Queries
| Query | Description |
|---|---|
| `users` | List all employees with role and department |
| `user(id)` | Get single user |
| `departments` | List all departments with member/project counts |
| `roles` | List all roles |
| `projects` | List all projects with team assignments |
| `project(id)` | Get single project |
| `projectsByDepartment(departmentId)` | Filter projects by department |
| `timesheets(userId)` | Get timesheets for a user |
| `pendingTimesheets` | Get all submitted timesheets awaiting approval |
| `dashboardStats` | Aggregate stats: total users, projects, hours logged |
| `me` | Get current authenticated user |

### Mutations
| Mutation | Description |
|---|---|
| `register(input)` | Create user account, returns JWT |
| `login(input)` | Authenticate, returns JWT |
| `createDepartment(input)` | Create a department |
| `createProject(input)` | Create a project under a department |
| `updateProject(id, input)` | Update project fields or status |
| `deleteProject(id)` | Delete a project |
| `assignUserToProject(input)` | Assign employee to project with role + hours |
| `removeUserFromProject(assignmentId)` | Remove assignment |
| `logTimesheet(input)` | Log hours for a user on a project |
| `updateTimesheetStatus(input)` | Approve or reject a timesheet |

---

## ⚙️ CI/CD Pipeline

GitHub Actions runs on every push to `main` and `develop`, and on all pull requests:

```
push/PR
  │
  ├── Go Backend CI
  │     ├── go mod tidy
  │     ├── go build ./...
  │     └── go test ./... -v
  │
  ├── React Frontend CI
  │     ├── npm ci
  │     ├── tsc --noEmit (type check)
  │     └── npm run build
  │
  └── Docker Build CI (runs only if both above pass)
        ├── docker build backend
        └── docker build frontend
```

---

## 🐳 Docker Details

Both services use **multi-stage builds** to minimize image size:

| Image | Base | Final Size |
|---|---|---|
| Backend | `golang:1.26-alpine` → `alpine:latest` | ~18 MB |
| Frontend | `node:22-alpine` → `nginx:alpine` | ~35 MB |

The nginx container serves the React static bundle and **proxies all `/query` requests** to the backend container — eliminating CORS issues in production without any frontend code changes.

Startup order is enforced via Docker health checks:
```
MySQL (healthy) → Backend starts → Frontend starts
```

---

## 🧪 Running Tests

```bash
cd backend
go test ./... -v
```

---

## 📄 Environment Variables

| Variable | Description | Default |
|---|---|---|
| `DB_HOST` | MySQL host | `localhost` |
| `DB_PORT` | MySQL port | `3306` |
| `DB_USER` | MySQL user | `root` |
| `DB_PASSWORD` | MySQL password | `root` |
| `DB_NAME` | Database name | `workforce_hub` |
| `JWT_SECRET` | JWT signing secret | — |
| `SERVER_PORT` | Backend port | `8080` |
| `VITE_GRAPHQL_URL` | GraphQL endpoint (frontend dev) | `/query` |

---

## 🗺️ Roadmap

- [ ] JWT middleware wired into `me` query and protected mutations
- [ ] Role-based access control (managers approve timesheets, employees view their own)
- [ ] Pagination on users and projects queries
- [ ] Integration tests using EntGo's SQLite test driver
- [ ] GitHub Actions CD — deploy to cloud on merge to `main`
- [ ] WebSocket subscriptions for real-time timesheet updates

---

## 👤 Author

**Sai Sanjay Chikne**  
M.Tech Signal Processing & ML — NIT Surathkal  
SDE Intern @ Siemens Digital Industries Software  

[LinkedIn](https://linkedin.com/in/sai-sanjay-chikne) · [GitHub](https://github.com/sai18022001)