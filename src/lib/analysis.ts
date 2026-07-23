export type Project = {
  name: string;
  industry: string;
  business_model: string;
  target_market: string;
  budget: number;
  description: string;
};

export type Competitor = {
  name: string;
  strength: string;
  weakness: string;
  marketShare: number;
  overlap: number;
};

export type RiskFactor = {
  category: string;
  score: number;
  note: string;
};

const INDUSTRY_GROWTH: Record<string, number> = {
  saas: 22,
  fintech: 18,
  healthtech: 16,
  edtech: 14,
  ecommerce: 12,
  ai: 34,
  marketplace: 15,
  consumer: 10,
};

function growthFor(industry: string) {
  const key = industry.toLowerCase();
  for (const k of Object.keys(INDUSTRY_GROWTH)) {
    if (key.includes(k)) return INDUSTRY_GROWTH[k];
  }
  return 11;
}

function hash(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function computeAnalysis(p: Project) {
  const growth = growthFor(p.industry);
  const budget = Math.max(1000, p.budget);
  const seed = hash(p.name + p.industry);

  const projections = Array.from({ length: 6 }, (_, i) => {
    const month = i + 1;
    const base = budget * (0.05 + 0.02 * month) * (1 + growth / 100);
    const variance = ((seed % 20) - 10) / 100;
    return {
      month: `M${month}`,
      revenue: Math.round(base * (1 + variance * month * 0.1)),
      cost: Math.round(budget * (0.1 + 0.04 * month)),
    };
  });

  const risks: RiskFactor[] = [
    {
      category: "Market",
      score: Math.max(20, 90 - growth * 2),
      note: `${p.industry || "Sector"} shows ~${growth}% projected annual growth.`,
    },
    {
      category: "Capital",
      score: budget < 25000 ? 78 : budget < 100000 ? 52 : 30,
      note: `Runway modeled on a $${budget.toLocaleString()} budget.`,
    },
    {
      category: "Execution",
      score: 40 + (seed % 30),
      note: `${p.business_model || "Model"} against ${p.target_market || "market"}.`,
    },
    {
      category: "Competition",
      score: 45 + (seed % 25),
      note: "Fragmented incumbent set with clear differentiation opportunities.",
    },
  ];

  const competitors: Competitor[] = [
    {
      name: `${capitalize(p.industry) || "Sector"}Lab`,
      strength: "Established brand & distribution",
      weakness: "Slow to ship, aging UX",
      marketShare: 28,
      overlap: 62,
    },
    {
      name: `North${capitalize(p.industry.slice(0, 4)) || "Node"}`,
      strength: "Enterprise contracts",
      weakness: "Poor SMB fit, pricing opaque",
      marketShare: 19,
      overlap: 44,
    },
    {
      name: `${capitalize(p.name.split(" ")[0] || "Rival")}wise`,
      strength: "Modern UX, community",
      weakness: "Thin margins, limited integrations",
      marketShare: 12,
      overlap: 71,
    },
    {
      name: "Legacy Inc.",
      strength: "Scale, capital reserves",
      weakness: "Innovator's dilemma",
      marketShare: 34,
      overlap: 25,
    },
  ];

  const marketSegments = [
    { name: "Early adopters", value: 22 },
    { name: "Mainstream", value: 48 },
    { name: "Late majority", value: 20 },
    { name: "Laggards", value: 10 },
  ];

  const overallRisk = Math.round(
    risks.reduce((a, b) => a + b.score, 0) / risks.length,
  );

  return { projections, risks, competitors, marketSegments, growth, overallRisk };
}

function capitalize(s: string) {
  return s ? s[0].toUpperCase() + s.slice(1) : "";
}

const DEMO_POOL: Project[] = [
  {
    name: "Ember Analytics",
    industry: "SaaS",
    business_model: "B2B Subscription",
    target_market: "Mid-market ops teams in North America",
    budget: 120000,
    description:
      "AI copilot that turns spreadsheets into live dashboards for finance and RevOps teams.",
  },
  {
    name: "Lumen Health",
    industry: "Healthtech",
    business_model: "B2B2C",
    target_market: "Clinics offering preventive care in the EU",
    budget: 250000,
    description:
      "Wearable-linked platform that flags early cardiovascular risk from ambient sensor data.",
  },
  {
    name: "Cargo Loop",
    industry: "Marketplace",
    business_model: "Take-rate marketplace",
    target_market: "Independent freight carriers in LATAM",
    budget: 80000,
    description:
      "Route-matching platform that fills backhauls between mid-size logistics operators.",
  },
  {
    name: "Slate Studio",
    industry: "AI",
    business_model: "Usage-based",
    target_market: "Indie game studios and solo developers",
    budget: 45000,
    description:
      "Generative asset pipeline that keeps character art visually consistent across scenes.",
  },
];

export function randomDemo(): Project {
  return DEMO_POOL[Math.floor(Math.random() * DEMO_POOL.length)];
}
