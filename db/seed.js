import { randomUUID } from "node:crypto";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const DATABASE_URL =
  process.env.DATABASE_URL || "postgres://smart_failure:smart_failure@localhost:5432/smart_failure";

const pool = new Pool({ connectionString: DATABASE_URL });

async function seed() {
  console.log("🌱 Starting Database Seed for Smart Failure Detection...");

  try {
    // 1. Ensure tables exist
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

    // 2. Check if demo user already exists
    const demoEmail = "demo@smartfailure.local";
    let userResult = await pool.query(`SELECT id FROM users WHERE email = $1`, [demoEmail]);
    let userId = userResult.rows[0]?.id;

    if (!userId) {
      userId = randomUUID();
      const passwordHash = await bcrypt.hash("password123", 10);
      await pool.query(
        `INSERT INTO users (id, email, name, password_hash) VALUES ($1, $2, $3, $4)`,
        [userId, demoEmail, "Demo Developer", passwordHash]
      );
      console.log(`✅ Created demo user: ${demoEmail} (Password: password123)`);
    } else {
      console.log(`ℹ️ Demo user (${demoEmail}) already exists.`);
    }

    // 3. Seed sample projects if user has no projects
    const projectCheck = await pool.query(`SELECT COUNT(*)::int FROM projects WHERE user_id = $1`, [userId]);
    if (projectCheck.rows[0].count === 0) {
      const sampleProjects = [
        {
          id: randomUUID(),
          name: "DevPulse AI Analytics",
          industry: "AI",
          business_model: "B2B Subscription",
          target_market: "Engineering teams & DevOps managers in tech startups",
          budget: 50000,
          description: "Real-time AI failure detection and automated root-cause analysis for CI/CD test pipelines.",
        },
        {
          id: randomUUID(),
          name: "CloudShield Sentinel",
          industry: "SaaS",
          business_model: "Usage-based",
          target_market: "Mid-market FinTech companies requiring compliance monitoring",
          budget: 120000,
          description: "Automated cloud infrastructure vulnerability scanner with instant failure alert summaries.",
        },
        {
          id: randomUUID(),
          name: "HealthConnect Portal",
          industry: "Healthtech",
          business_model: "Enterprise licensing",
          target_market: "Regional clinics and independent medical labs",
          budget: 85000,
          description: "Patient telemetry and diagnostic failure risk assessment platform.",
        },
      ];

      for (const p of sampleProjects) {
        await pool.query(
          `INSERT INTO projects (id, user_id, name, industry, business_model, target_market, budget, description)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [p.id, userId, p.name, p.industry, p.business_model, p.target_market, p.budget, p.description]
        );
      }
      console.log(`✅ Inserted ${sampleProjects.length} sample analysis projects!`);
    } else {
      console.log("ℹ️ Sample projects already seeded.");
    }

    console.log("✨ Seeding completed successfully!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

await seed();
