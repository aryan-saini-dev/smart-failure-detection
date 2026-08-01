import http from "node:http";
import { exec } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";
import process from "node:process";
import { createClient } from "@supabase/supabase-js";

const execAsync = promisify(exec);

try {
  process.loadEnvFile();
} catch {
  // Ignore if .env does not exist
}

const PORT = Number(process.env.API_PORT || 8787);
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || "";

const supabaseBase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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
            
            const arg = JSON.stringify(parsed.mlFeatures).replace(/"/g, '\\"');
            const { stdout } = await execAsync(`"${pythonPath}" "${scriptPath}" "${arg}"`);
            
            const mlResult = JSON.parse(stdout);
            if (!mlResult.error) {
              console.log("✅ ML Prediction Result:", mlResult);
              parsed.mlPrediction = mlResult;
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

      if (url.pathname === "/api/projects" && req.method === "POST") {
        const user = await requireUser(req, res);
        if (!user) return;
        const { name, industry, business_model, target_market, budget, description } = body;

        console.log(`🤖 Reviewing project "${name}" online with Gemini AI...`);
        const analysisData = await analyzeProjectWithGemini({
          name,
          industry,
          business_model,
          target_market,
          budget,
          description,
        });

        // Save project AND its AI analysis result into Supabase
        const token = req.headers["x-supabase-token"];
        const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
          global: { headers: { Authorization: `Bearer ${token}` } }
        });

        const { data, error } = await userClient.from("projects").insert({
          user_id: user.id,
          name,
          industry,
          business_model,
          target_market,
          budget: Number(budget) || 0,
          description,
          analysis_data: analysisData
        }).select().single();

        if (error) throw new Error(error.message);

        console.log(`✅ Saved reviewed project "${name}" to Supabase.`);
        return sendJson(res, 200, { project: data });
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
  const token = req.headers["x-supabase-token"];
  if (!token || Array.isArray(token)) return null;
  const { data: { user }, error } = await supabaseBase.auth.getUser(token);
  if (error || !user) return null;
  return user;
}

async function requireUser(req, res) {
  const user = await getUserFromRequest(req);
  if (!user) {
    sendJson(res, 401, { error: "Unauthorized" });
    return null;
  }
  return user;
}

function setCorsHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-supabase-token");
}

await main();
