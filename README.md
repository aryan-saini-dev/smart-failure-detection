# Smart Failure Detection

An intelligent workspace for startup failure detection, competitor analysis, risk scoring, and market insights powered by a lightweight local PostgreSQL database and Node.js backend.

---

## 🏗️ Tech Stack & Architecture

- **Frontend**: React 19, TanStack Start & Router, Tailwind CSS
- **Backend**: Node.js HTTP Server (`server/index.js`)
- **Database**: PostgreSQL 16 (running locally inside Docker)
- **Driver**: `pg` (Node Postgres) with `bcryptjs` authentication

---

## 🚀 Team Setup Guide (Step-by-Step)

Follow these instructions to get your local environment running from scratch in 5 minutes.

### 📋 Prerequisites

Ensure you have the following installed on your machine:
1. **[Docker Desktop](https://www.docker.com/products/docker-desktop/)** (Make sure Docker Engine is running)
2. **[Node.js](https://nodejs.org/)** (v18 or higher)
3. **npm** (bundled with Node.js)

---

### Step 1: Clone Repository & Install Dependencies

```bash
git clone https://github.com/aryan-saini-dev/smart-failure-detection.git
cd smart-failure-detection
npm install
```

---

### Step 2: Set Up Environment Variables

Create a local `.env` file from the provided template:

```bash
cp .env.example .env
```

Ensure your `.env` contains the following default variables:
```env
VITE_API_BASE_URL=http://localhost:8787
DATABASE_URL=postgres://smart_failure:smart_failure@localhost:5432/smart_failure
API_PORT=8787
```

---

### Step 3: Start Local PostgreSQL Database (Docker)

Spin up the containerized PostgreSQL database:

```bash
docker compose up -d
```

> 💡 **Tip**: To verify PostgreSQL is running, run `docker compose ps`. You should see `postgres` running on port `5432`.

---

### Step 4: Seed the Database

Populate your local database with initial tables and sample test data (demo user & sample analysis projects):

```bash
npm run db:seed
```

**Default Demo Credentials:**
- **Email**: `demo@smartfailure.local`
- **Password**: `password123`

---

### Step 5: Start the API Backend & Frontend

Open **two terminal windows**:

**Terminal 1 (Backend API)**:
```bash
npm run api
```
*(Runs the Node.js API server on `http://localhost:8787`)*

**Terminal 2 (Frontend App)**:
```bash
npm run dev
```
*(Runs the Vite dev server on `http://localhost:3000` or indicated port)*

Open your browser at `http://localhost:3000` to start using the app!

---

## 🔒 Authentication & Data Flow

- **User Signup & Login**:
  - Accounts are registered via POST `/api/auth/register` and signed in via POST `/api/auth/login`.
  - Passwords are securely hashed with `bcryptjs`.
  - Session tokens are stored in the PostgreSQL `sessions` table.
- **Analysis History**:
  - Every time you input a project on the `/project-input` page, the full project details and risk parameters are automatically saved to the `projects` table in Postgres linked to your account.
  - Revisit past analyses anytime on your **Profile** (`/profile`) or by direct URL (`/projects/$projectId`).

---

## 🛠️ Database Inspection & Utilities (PostgreSQL & Docker)

### Access PostgreSQL CLI (`psql`) in Docker

Connect directly to the interactive PostgreSQL shell running in your container:

```bash
docker compose exec postgres psql -U smart_failure -d smart_failure
```

---

### Essential `psql` Commands

| Command | Action |
| :--- | :--- |
| `\dt` | List all tables (`users`, `sessions`, `projects`) |
| `\d <table_name>` | Inspect schema & columns of a table (e.g. `\d users`) |
| `\l` | List all databases |
| `\q` | Exit the `psql` shell |

---

## 📊 Example PostgreSQL Queries (Docker CLI)

After running `docker compose exec postgres psql -U smart_failure -d smart_failure`, you can run any of these SQL queries directly inside `smart_failure=#`:

```sql
-- 1. View all registered users
SELECT id, name, email, created_at FROM users;

-- 2. View all seeded & stored projects
SELECT name, industry, business_model, budget, description FROM projects;

-- 3. View projects joined with user owner details
SELECT p.name, p.industry, p.budget, u.email 
FROM projects p 
JOIN users u ON p.user_id = u.id 
ORDER BY p.created_at DESC;

-- 4. View active authentication sessions
SELECT s.token, u.email, s.created_at 
FROM sessions s 
JOIN users u ON s.user_id = u.id;

-- 5. Count total projects in database
SELECT COUNT(*) AS total_projects FROM projects;
```

---


### View Database via GUI Clients

Connect using external database tools (DBeaver, TablePlus, pgAdmin, VS Code Database extensions):

- **Host**: `localhost`
- **Port**: `5432`
- **Database**: `smart_failure`
- **User**: `smart_failure`
- **Password**: `smart_failure`

---

### Reset Database Completely

Wipe local database data and re-seed clean data:

```bash
docker compose down -v
docker compose up -d
npm run db:seed
```


---

## 📜 Available Scripts

- `npm run dev` — Starts frontend development server
- `npm run api` — Starts Node.js backend server
- `npm run db:seed` — Runs schema setup and seeds demo data
- `npm run build` — Builds production frontend bundle
- `npm run lint` — Runs ESLint code check
