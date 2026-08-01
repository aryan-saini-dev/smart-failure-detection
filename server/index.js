import http from "node:http";
import { randomBytes, randomUUID } from "node:crypto";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import { exec } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";
import process from "node:process";

const execAsync = promisify(exec);

try {
  process.loadEnvFile();
} catch {
  // Ignore if .env does not exist
}

const PORT = Number(process.env.API_PORT || 8787);
const DATABASE_URL =
  process.env.DATABASE_URL || "postgres://smart_failure:smart_failure@localhost:5432/smart_failure";

const pool = new Pool({ connectionString: DATABASE_URL });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";


async function analyzeProjectWithGemini(p) {
  if (!GEMINI_API_KEY) {
    console.log("⚠️ GEMINI_API_KEY not set. Using rule-based calculation.");
    return generateFallbackAnalysis(p);
  }

  try {
    const promptText = `Act as a top venture capital analyst and competitive intelligence expert. Conduct market and competitor analysis online for this project:

Project Details:
- Name: ${p.name}
- Industry: ${p.industry}
- Business Model: ${p.business_model}
- Target Market: ${p.target_market}
- Budget (USD): ${p.budget}
- Description: ${p.description}

Analyze real market competitors, identify strengths/weaknesses, compute risk factors, dynamic financial revenue/cost projections over 6 months, and market adoption segments.
In addition, extract or estimate the following features specifically formatted for our ML model in the 'mlFeatures' object based on the context. If dates or exact numbers aren't provided, make highly realistic estimates for an early-stage startup.

Respond strictly in JSON matching this JSON schema (do not include markdown blocks, just the JSON):
{
  "growth": <annual industry growth percentage e.g. 24>,
  "overallRisk": <risk score 0-100>,
  "competitors": [
    {
      "name": "<Competitor Name>",
      "strength": "<Key Strength>",
      "weakness": "<Key Weakness>",
      "marketShare": <0-100 number>,
      "overlap": <0-100 number>
    }
  ],
  "risks": [
    { "category": "Market", "score": <0-100>, "note": "<Diagnostic note>" },
    { "category": "Capital", "score": <0-100>, "note": "<Diagnostic note>" },
    { "category": "Execution", "score": <0-100>, "note": "<Diagnostic note>" },
    { "category": "Competition", "score": <0-100>, "note": "<Diagnostic note>" }
  ],
  "projections": [
    { "month": "M1", "revenue": <number>, "cost": <number> },
    { "month": "M2", "revenue": <number>, "cost": <number> },
    { "month": "M3", "revenue": <number>, "cost": <number> },
    { "month": "M4", "revenue": <number>, "cost": <number> },
    { "month": "M5", "revenue": <number>, "cost": <number> },
    { "month": "M6", "revenue": <number>, "cost": <number> }
  ],
  "marketSegments": [
    { "name": "<Segment>", "value": <0-100 number> }
  ],
  "mlFeatures": {
    "funding_total_usd": <Convert budget to USD numeric value e.g. 500000>,
    "funding_rounds": <Estimate 1 to 5 rounds based on context>,
    "funding_duration": <Estimate days between first and last funding round, e.g. 0 if only 1 round, or 365 if multiple>,
    "time_to_first_funding": <Estimate days from founding to first funding, e.g. 30 to 365>,
    "category_count": <Count of distinct categories the startup falls into (1 to 5)>,
    "country_code": "<3-letter ISO country code e.g. USA, GBR, IND>",
    "main_category": "<Primary industry sector e.g. Software, E-Commerce, Mobile, Health Care>"
  }
}`;

    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptText }] }],
          generationConfig: { responseMimeType: "application/json" },
        }),
      }
    );

    if (!resp.ok) {
      const errText = await resp.text();
      console.error("Gemini API HTTP Error:", resp.status, errText);
      return generateFallbackAnalysis(p);
    }

    const data = await resp.json();
    let candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (candidateText) {
      candidateText = candidateText.replace(/```json/gi, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(candidateText);
      if (parsed && parsed.competitors && parsed.risks && parsed.projections) {
        console.log("✨ Successfully retrieved online market & competitor review from Gemini AI!");
        
        // ML Model Integration
        if (parsed.mlFeatures) {
          console.log("🧠 Sending Gemini features to local ML pipeline...");
          try {
            const pythonPath = process.env.PYTHON_PATH || path.resolve(process.cwd(), "Dataset/venv/Scripts/python.exe");
            const scriptPath = path.resolve(process.cwd(), "server/ml/predict.py");
            
            // On Windows, carefully escape the JSON string argument for powershell/cmd
            const arg = JSON.stringify(parsed.mlFeatures).replace(/"/g, '\\"');
            const { stdout } = await execAsync(`"${pythonPath}" "${scriptPath}" "${arg}"`);
            
            const mlResult = JSON.parse(stdout);
            if (!mlResult.error) {
              console.log("✅ ML Prediction Result:", mlResult);
              parsed.mlPrediction = mlResult;
              // Adjust overall risk based on ML failure probability if we want
              parsed.overallRisk = Math.round((parsed.overallRisk + mlResult.failureProbability) / 2);
            } else {
              console.error("❌ ML Prediction Error inside python script:", mlResult.error);
            }
          } catch (mlErr) {
            console.error("❌ Failed to execute ML script:", mlErr);
          }
        }
        
        return parsed;
      }
    }
  } catch (err) {
    console.error("Gemini analysis failed:", err);
  }

  return generateFallbackAnalysis(p);
}

function generateFallbackAnalysis(p) {
  const budget = Math.max(1000, Number(p.budget) || 0);
  const growth = 18;
  const projections = Array.from({ length: 6 }, (_, i) => {
    const month = i + 1;
    return {
      month: `M${month}`,
      revenue: Math.round(budget * 0.05 * month * (1 + growth / 100)),
      cost: Math.round((budget / 12) * (0.8 + 0.1 * month)),
    };
  });
  return {
    growth,
    overallRisk: 52,
    competitors: [
      { name: `${p.industry || "Sector"} Incumbent`, strength: "Scale and distribution", weakness: "Legacy product architecture", marketShare: 35, overlap: 60 },
      { name: `${p.name.split(" ")[0] || "Market"} Rival`, strength: "Brand presence", weakness: "Slower update cadence", marketShare: 20, overlap: 50 }
    ],
    risks: [
      { category: "Market", score: 45, note: `${p.industry || "Industry"} sector shows projected ${growth}% growth.` },
      { category: "Capital", score: budget > 50000 ? 40 : 70, note: `Runway derived from budget of $${budget.toLocaleString()}.` },
      { category: "Execution", score: 50, note: `Based on business model: ${p.business_model || "Subscription"}.` },
      { category: "Competition", score: 55, note: `Competitive landscape in ${p.industry || "market"}.` }
    ],
    marketSegments: [
      { name: "Early Adopters", value: 35 },
      { name: "Mainstream", value: 45 },
      { name: "Late Majority", value: 20 }
    ]
  };
}

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
      analysis_data JSONB,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
    ALTER TABLE projects ADD COLUMN IF NOT EXISTS analysis_data JSONB;
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

      if (url.pathname === "/api/analyze" && req.method === "POST") {
        const { name, industry, business_model, target_market, budget, description } = body;
        if (!name || !industry) return sendJson(res, 400, { error: "Missing required fields for analysis" });
        console.log(`🤖 Running Gemini AI online analysis for "${name}"...`);
        const analysisData = await analyzeProjectWithGemini({
          name,
          industry,
          business_model,
          target_market,
          budget,
          description,
        });
        return sendJson(res, 200, { analysis: analysisData });
      }

      if (url.pathname === "/api/projects" && req.method === "GET") {

        const user = await requireUser(req, res);
        if (!user) return;
        const result = await pool.query(
          `SELECT id, name, industry, business_model, target_market, budget, description, analysis_data, created_at, user_id
           FROM projects WHERE user_id = $1 ORDER BY created_at DESC`,
          [user.id],
        );
        return sendJson(res, 200, { projects: result.rows });
      }

      if (url.pathname === "/api/projects" && req.method === "POST") {
        const user = await requireUser(req, res);
        if (!user) return;
        const { name, industry, business_model, target_market, budget, description } = body;

        // 1. Analyze online market & competitors with Gemini AI BEFORE database insertion
        console.log(`🤖 Reviewing project "${name}" online with Gemini AI...`);
        const analysisData = await analyzeProjectWithGemini({
          name,
          industry,
          business_model,
          target_market,
          budget,
          description,
        });

        // 2. Save project AND its AI analysis result into Postgres DB
        const result = await pool.query(
          `INSERT INTO projects (id, user_id, name, industry, business_model, target_market, budget, description, analysis_data)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
           RETURNING id, name, industry, business_model, target_market, budget, description, analysis_data, created_at, user_id`,
          [randomUUID(), user.id, name, industry, business_model, target_market, budget, description, JSON.stringify(analysisData)],
        );
        console.log(`✅ Saved reviewed project "${name}" to database.`);
        return sendJson(res, 200, { project: result.rows[0] });
      }

      const projectMatch = url.pathname.match(/^\/api\/projects\/([^/]+)$/);
      if (projectMatch && req.method === "GET") {
        const user = await requireUser(req, res);
        if (!user) return;
        const result = await pool.query(
          `SELECT id, name, industry, business_model, target_market, budget, description, analysis_data, created_at, user_id
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

