import http from "node:http";
import { randomBytes, randomUUID } from "node:crypto";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

import process from "node:process";

try {
  process.loadEnvFile();
} catch {
  // Ignore if .env does not exist
}

const PORT = Number(process.env.API_PORT || 8787);
const DATABASE_URL =
  process.env.DATABASE_URL || "postgres://smart_failure:smart_failure@localhost:5432/smart_failure";

const pool = new Pool({ connectionString: DATABASE_URL });


async function main() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      avatar_url TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
    CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
    CREATE TABLE IF NOT EXISTS projects (
      id UUID PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      industry TEXT NOT NULL,
      business_model TEXT NOT NULL,
      target_market TEXT NOT NULL,
      budget NUMERIC NOT NULL DEFAULT 0,
      description TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
    CREATE INDEX IF NOT EXISTS projects_user_id_created_at_idx ON projects (user_id, created_at DESC);
  `);

  const server = http.createServer(async (req, res) => {
    setCorsHeaders(res);

    if (req.method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return;
    }

    try {

      const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
      const body = await readJson(req);

      if (url.pathname === "/api/auth/register" && req.method === "POST") {
        const { name, email, password } = body;
        if (!name || !email || !password) return sendJson(res, 400, { error: "Missing name, email, or password" });
        const passwordHash = await bcrypt.hash(password, 10);
        const userId = randomUUID();
        const token = randomBytes(32).toString("hex");
        const user = await pool.query(
          `INSERT INTO users (id, email, name, password_hash) VALUES ($1, $2, $3, $4)
           RETURNING id, email, name, avatar_url, created_at`,
          [userId, email.toLowerCase(), name, passwordHash],
        );
        await pool.query(`INSERT INTO sessions (token, user_id) VALUES ($1, $2)`, [token, userId]);
        return sendJson(res, 200, { token, user: formatUser(user.rows[0]) });
      }

      if (url.pathname === "/api/auth/login" && req.method === "POST") {
        const { email, password } = body;
        const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [String(email || "").toLowerCase()]);
        const user = result.rows[0];
        if (!user || !(await bcrypt.compare(password || "", user.password_hash))) {
          return sendJson(res, 401, { error: "Invalid email or password" });
        }
        const token = randomBytes(32).toString("hex");
        await pool.query(`INSERT INTO sessions (token, user_id) VALUES ($1, $2)`, [token, user.id]);
        return sendJson(res, 200, { token, user: formatUser(user) });
      }

      if (url.pathname === "/api/auth/me" && req.method === "GET") {
        const user = await getUserFromRequest(req);
        return sendJson(res, 200, { user: user ? formatUser(user) : null });
      }

      if (url.pathname === "/api/projects" && req.method === "GET") {
        const user = await requireUser(req, res);
        if (!user) return;
        const result = await pool.query(
          `SELECT id, name, industry, business_model, target_market, budget, description, created_at, user_id
           FROM projects WHERE user_id = $1 ORDER BY created_at DESC`,
          [user.id],
        );
        return sendJson(res, 200, { projects: result.rows });
      }

      if (url.pathname === "/api/projects" && req.method === "POST") {
        const user = await requireUser(req, res);
        if (!user) return;
        const { name, industry, business_model, target_market, budget, description } = body;
        const result = await pool.query(
          `INSERT INTO projects (id, user_id, name, industry, business_model, target_market, budget, description)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           RETURNING id, name, industry, business_model, target_market, budget, description, created_at, user_id`,
          [randomUUID(), user.id, name, industry, business_model, target_market, budget, description],
        );
        return sendJson(res, 200, { project: result.rows[0] });
      }

      const projectMatch = url.pathname.match(/^\/api\/projects\/([^/]+)$/);
      if (projectMatch && req.method === "GET") {
        const user = await requireUser(req, res);
        if (!user) return;
        const result = await pool.query(
          `SELECT id, name, industry, business_model, target_market, budget, description, created_at, user_id
           FROM projects WHERE id = $1 AND user_id = $2`,
          [projectMatch[1], user.id],
        );
        return sendJson(res, 200, { project: result.rows[0] || null });
      }

      return sendJson(res, 404, { error: "Not found" });
    } catch (error) {
      console.error(error);
      return sendJson(res, 500, { error: error instanceof Error ? error.message : "Server error" });
    }
  });

  server.listen(PORT, () => {
    console.log(`Local API listening on http://localhost:${PORT}`);
  });
}

async function readJson(req) {
  if (req.method === "GET" || req.method === "HEAD") return {};
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const text = Buffer.concat(chunks).toString("utf8");
  return text ? JSON.parse(text) : {};
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { "content-type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
  return undefined;
}

async function getUserFromRequest(req) {
  const token = req.headers["x-session-token"];
  if (!token || Array.isArray(token)) return null;
  const session = await pool.query(`SELECT user_id FROM sessions WHERE token = $1`, [token]);
  const userId = session.rows[0]?.user_id;
  if (!userId) return null;
  const result = await pool.query(`SELECT id, email, name, avatar_url, created_at FROM users WHERE id = $1`, [userId]);
  return result.rows[0] || null;
}

async function requireUser(req, res) {
  const user = await getUserFromRequest(req);
  if (!user) {
    sendJson(res, 401, { error: "Unauthorized" });
    return null;
  }
  return user;
}

function formatUser(user) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    avatarUrl: user.avatar_url ?? undefined,
    createdAt: user.created_at,
  };
}

function setCorsHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-session-token");
}

await main();

