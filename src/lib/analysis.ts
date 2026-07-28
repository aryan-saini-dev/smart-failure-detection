export type CurrencyCode = "USD" | "EUR" | "GBP" | "INR" | "CAD";

export const CURRENCY_MAP: Record<CurrencyCode, { symbol: string; rate: number; label: string }> = {
  USD: { symbol: "$", rate: 1.0, label: "USD ($)" },
  EUR: { symbol: "€", rate: 0.92, label: "EUR (€)" },
  GBP: { symbol: "£", rate: 0.79, label: "GBP (£)" },
  INR: { symbol: "₹", rate: 83.5, label: "INR (₹)" },
  CAD: { symbol: "CA$", rate: 1.36, label: "CAD (CA$)" },
};

export function formatCurrency(amount: number, currency: CurrencyCode = "USD"): string {
  const meta = CURRENCY_MAP[currency] || CURRENCY_MAP.USD;
  const converted = amount * meta.rate;
  if (currency === "INR") {
    return `${meta.symbol}${Math.round(converted).toLocaleString("en-IN")}`;
  }
  return `${meta.symbol}${Math.round(converted).toLocaleString()}`;
}

export type Project = {
  name: string;
  industry: string;
  business_model: string;
  target_market: string;
  budget: number;
  currency?: CurrencyCode;
  description: string;
  analysis_data?: AnalysisResult | null;
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

export type ProjectionPoint = {
  month: string;
  revenue: number;
  cost: number;
};

export type MarketSegment = {
  name: string;
  value: number;
};

export type SuggestionItem = {
  type: "capital" | "strategy" | "risk" | "competitor";
  title: string;
  advice: string;
  priority: "high" | "medium" | "low";
};

export type AnalysisResult = {
  projections: ProjectionPoint[];
  risks: RiskFactor[];
  competitors: Competitor[];
  marketSegments: MarketSegment[];
  growth: number;
  overallRisk: number;
  suggestions?: SuggestionItem[];
};

const INDUSTRY_GROWTH_RATES: Record<string, number> = {
  saas: 24,
  fintech: 20,
  healthtech: 17,
  edtech: 15,
  ecommerce: 13,
  ai: 36,
  marketplace: 18,
  consumer: 12,
  hardware: 14,
  cybersecurity: 22,
};

export function growthForIndustry(industry: string): number {
  const normalized = (industry || "").toLowerCase().trim();
  for (const [key, rate] of Object.entries(INDUSTRY_GROWTH_RATES)) {
    if (normalized.includes(key)) return rate;
  }
  return 15;
}

export function computeAnalysis(p: Project): AnalysisResult {
  if (p.analysis_data && Array.isArray(p.analysis_data.competitors)) {
    if (!p.analysis_data.suggestions) {
      p.analysis_data.suggestions = generateStartupSuggestions(p, p.analysis_data);
    }
    return p.analysis_data;
  }

  return computeRuleBasedAnalysis(p);
}

export function computeRuleBasedAnalysis(p: Project): AnalysisResult {
  const industry = p.industry.trim() || "General Tech";
  const businessModel = p.business_model.trim() || "Subscription";
  const targetMarket = p.target_market.trim() || "Broad Market";
  const description = p.description.trim();

  const currency: CurrencyCode = p.currency || "USD";
  const currencyMeta = CURRENCY_MAP[currency] || CURRENCY_MAP.USD;
  const rawBudget = Math.max(1000, Number(p.budget) || 0);

  // Normalize budget to base USD for risk benchmark evaluations
  const budgetUsd = rawBudget / currencyMeta.rate;

  const growth = growthForIndustry(industry);

  // Business model revenue ramp factors
  const isEnterprise = /enterprise|licensing/i.test(businessModel);
  const isUsageBased = /usage|transaction/i.test(businessModel);
  const isB2C = /b2c|consumer/i.test(businessModel);

  const revenueRampMultiplier = isEnterprise ? 0.04 : isUsageBased ? 0.09 : isB2C ? 0.08 : 0.06;
  const monthlyCostBase = rawBudget / 12;

  const projections: ProjectionPoint[] = Array.from({ length: 6 }, (_, i) => {
    const monthIndex = i + 1;
    const growthScale = 1 + (growth / 100) * (monthIndex * 0.15);
    const revenue = Math.round(rawBudget * revenueRampMultiplier * monthIndex * growthScale);
    const cost = Math.round(monthlyCostBase * (0.8 + 0.12 * monthIndex));
    return {
      month: `M${monthIndex}`,
      revenue,
      cost,
    };
  });

  // Dynamic Capital Risk based on industry requirements vs budget in USD
  const minimumCapitalUsd = isEnterprise ? 150000 : /ai|healthtech/i.test(industry) ? 100000 : 40000;
  const minimumCapitalLocal = Math.round(minimumCapitalUsd * currencyMeta.rate);

  const capitalScore = Math.min(
    95,
    Math.max(15, Math.round(100 - (budgetUsd / minimumCapitalUsd) * 50))
  );

  const formattedBudget = formatCurrency(rawBudget / currencyMeta.rate, currency);
  const formattedMin = formatCurrency(minimumCapitalUsd, currency);

  const capitalNote =
    budgetUsd >= minimumCapitalUsd
      ? `Budget of ${formattedBudget} provides solid runway for ${industry} standards.`
      : `Budget of ${formattedBudget} is tight; average ${industry} projects require ~${formattedMin}.`;

  // Dynamic Market Risk based on growth rate & target market specificity
  const marketSpecificityFriction = targetMarket.length > 20 ? -10 : 10;
  const marketScore = Math.min(90, Math.max(20, Math.round(85 - growth * 1.8 + marketSpecificityFriction)));
  const marketNote = `${industry} shows a ${growth}% annual growth trajectory for ${targetMarket || "target segment"}.`;

  // Dynamic Execution Risk based on description detail & business model complexity
  const descriptionDepthBonus = Math.min(30, Math.floor(description.length / 15));
  const executionScore = Math.min(85, Math.max(25, 75 - descriptionDepthBonus));
  const executionNote =
    description.length > 80
      ? `Clear strategic positioning specified for ${businessModel} model.`
      : `Broad description increases execution uncertainty for ${businessModel}.`;

  // Dynamic Competition Risk based on industry crowding
  const crowdedIndustries = ["saas", "ai", "ecommerce", "fintech"];
  const isCrowded = crowdedIndustries.some((c) => industry.toLowerCase().includes(c));
  const competitionScore = isCrowded ? 68 : 42;
  const competitionNote = isCrowded
    ? `High incumbent density in ${industry}; requires distinct differentiation.`
    : `Moderate market competition with room for niche entry.`;

  const risks: RiskFactor[] = [
    { category: "Market", score: marketScore, note: marketNote },
    { category: "Capital", score: capitalScore, note: capitalNote },
    { category: "Execution", score: executionScore, note: executionNote },
    { category: "Competition", score: competitionScore, note: competitionNote },
  ];

  const overallRisk = Math.round(risks.reduce((acc, r) => acc + r.score, 0) / risks.length);

  // Dynamic Competitors generated from project context parameters
  const mainKeyword = p.name.split(" ")[0] || industry;
  const competitors: Competitor[] = [
    {
      name: `${capitalize(industry)} Leader`,
      strength: "Established distribution and enterprise customer base",
      weakness: "High pricing, legacy technology stack",
      marketShare: 32,
      overlap: 65,
    },
    {
      name: `${capitalize(mainKeyword)} Global`,
      strength: "Strong brand authority and sales team",
      weakness: "Slow update cycles, complex onboarding",
      marketShare: 22,
      overlap: 50,
    },
    {
      name: `NextGen ${capitalize(industry.slice(0, 5))}`,
      strength: "Modern user interface and developer ecosystem",
      weakness: "Limited support coverage, unproven unit economics",
      marketShare: 14,
      overlap: 72,
    },
  ];

  // Dynamic Market Segments derived from Business Model & Target Market orientation
  const marketSegments: MarketSegment[] = isEnterprise
    ? [
        { name: "Enterprise Accounts", value: 50 },
        { name: "Mid-Market", value: 30 },
        { name: "SMB & Growth", value: 15 },
        { name: "Others", value: 5 },
      ]
    : isB2C
      ? [
          { name: "Early Adopters", value: 40 },
          { name: "Gen Z / Young Professionals", value: 35 },
          { name: "Broad Consumer Base", value: 25 },
        ]
      : [
          { name: "Early Adopter Teams", value: 35 },
          { name: "Growing SMBs", value: 45 },
          { name: "Late Majority", value: 20 },
        ];

  const result: AnalysisResult = { projections, risks, competitors, marketSegments, growth, overallRisk };
  result.suggestions = generateStartupSuggestions(p, result);
  return result;
}

export function generateStartupSuggestions(p: Project, analysis: AnalysisResult): SuggestionItem[] {
  const currency: CurrencyCode = p.currency || "USD";
  const currencyMeta = CURRENCY_MAP[currency] || CURRENCY_MAP.USD;
  const rawBudget = Number(p.budget) || 0;
  const budgetUsd = rawBudget / currencyMeta.rate;

  const industry = (p.industry || "").toLowerCase();
  const model = (p.business_model || "").toLowerCase();

  const suggestions: SuggestionItem[] = [];

  // 1. Capital Runway & Budget Advice
  const minRequiredUsd = /enterprise/i.test(model) ? 150000 : /ai|healthtech/i.test(industry) ? 100000 : 40000;
  const formattedBudget = formatCurrency(rawBudget / currencyMeta.rate, currency);
  const formattedMin = formatCurrency(minRequiredUsd, currency);

  if (budgetUsd < minRequiredUsd * 0.7) {
    suggestions.push({
      type: "capital",
      title: "Increase Capital Runway",
      advice: `Allocated budget of ${formattedBudget} is tight for ${p.industry || "this sector"}. We recommend extending capital to ~${formattedMin} or launching with a streamlined MVP.`,
      priority: "high",
    });
  } else if (budgetUsd > minRequiredUsd * 2.5) {
    suggestions.push({
      type: "capital",
      title: "Optimize Capital Allocation",
      advice: `Strong runway backing (${formattedBudget}). Focus 45% of capital on early customer acquisition & key hires rather than bloated initial features.`,
      priority: "low",
    });
  } else {
    suggestions.push({
      type: "capital",
      title: "Balanced Runway Management",
      advice: `Your ${formattedBudget} budget provides 8-12 months of runway. Cap monthly burn rate until reaching initial product-market traction.`,
      priority: "medium",
    });
  }

  // 2. Strategic Focus & Go-To-Market
  if (/enterprise/i.test(model)) {
    suggestions.push({
      type: "strategy",
      title: "Focus on Pilot Conversions",
      advice: "Enterprise sales cycles take 4-9 months. Offer 30-day proof-of-concept pilots to land initial reference customers quickly.",
      priority: "high",
    });
  } else if (/freemium|b2c/i.test(model)) {
    suggestions.push({
      type: "strategy",
      title: "User Retention & Virality",
      advice: "Prioritize Day-1 and Day-7 user retention and product virality mechanisms before spending heavily on paid channels.",
      priority: "high",
    });
  } else {
    suggestions.push({
      type: "strategy",
      title: "Product-Led Onboarding",
      advice: "Build an effortless, self-serve onboarding flow to deliver immediate time-to-value for new signups.",
      priority: "medium",
    });
  }

  // 3. Risk Mitigation & Positioning Wedge
  if (analysis.overallRisk > 60) {
    suggestions.push({
      type: "risk",
      title: "Sharpen Market Wedge",
      advice: `Overall risk score is elevated (${analysis.overallRisk}/100). Focus on a specific, underserved sub-niche in ${p.target_market || "your market"} to establish defensibility.`,
      priority: "high",
    });
  } else {
    suggestions.push({
      type: "risk",
      title: "Accelerate GTM Distribution",
      advice: "Low risk profile detected. Double down on co-marketing and strategic partnerships to capture market share fast.",
      priority: "low",
    });
  }

  // 4. Competitor Differentiation
  if ((p.description || "").length < 60) {
    suggestions.push({
      type: "competitor",
      title: "Clarify Technology Moat",
      advice: "Detail your proprietary wedge (e.g. 10x speed, workflow automation, or cost advantage) to differentiate from incumbents.",
      priority: "medium",
    });
  }

  return suggestions;
}


function capitalize(str: string): string {
  if (!str) return "Industry";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const DEMO_PROJECT_POOL: Project[] = [
  {
    name: "PulseOps AI",
    industry: "SaaS",
    business_model: "B2B Subscription",
    target_market: "Mid-market DevOps & SRE teams in North America",
    budget: 120000,
    description: "AI-driven log anomaly detection and automated incident root-cause diagnosis platform for cloud infrastructure.",
  },
  {
    name: "BioTrack Health",
    industry: "Healthtech",
    business_model: "Enterprise licensing",
    target_market: "Hospital networks and diagnostic labs in the EU",
    budget: 250000,
    description: "Remote patient telemetry platform with real-time cardiac arrhythmia detection from ambient sensor feeds.",
  },
  {
    name: "FreightFlow",
    industry: "Marketplace",
    business_model: "Marketplace",
    target_market: "Independent freight logistics operators in LATAM",
    budget: 85000,
    description: "Real-time route optimization matching empty backhaul trucks with regional freight shippers.",
  },
  {
    name: "Canvas 3D Studio",
    industry: "AI",
    business_model: "Usage-based",
    target_market: "Indie game studios and solo 3D creators",
    budget: 60000,
    description: "Generative asset consistency pipeline keeping character textures and 3D mesh styles synced across scenes.",
  },
  {
    name: "PayShield Global",
    industry: "Fintech",
    business_model: "Transactional",
    target_market: "Cross-border e-commerce merchants in Southeast Asia",
    budget: 180000,
    description: "Fraud prevention engine leveraging graph neural networks for instant payment risk scoring and chargeback defense.",
  },
  {
    name: "Edify Reading",
    industry: "Edtech",
    business_model: "B2C Subscription",
    target_market: "K-12 tutoring centers and home educators",
    budget: 45000,
    description: "Personalized adaptive literacy app using real-time speech recognition to correct young readers' pronunciation.",
  },
  {
    name: "GreenGrid Energy",
    industry: "Hardware",
    business_model: "Enterprise licensing",
    target_market: "Commercial renewable microgrid operators",
    budget: 320000,
    description: "Battery energy storage management software balancing peak load demand and solar generation for microgrids.",
  },
  {
    name: "StorePulse Analytics",
    industry: "E-commerce",
    business_model: "Freemium",
    target_market: "Direct-to-consumer Shopify brands",
    budget: 35000,
    description: "Predictive inventory replenishment engine forecasting stockouts by analyzing local weather and social trends.",
  },
  {
    name: "CyberSentinel",
    industry: "SaaS",
    business_model: "B2B Subscription",
    target_market: "Cloud-native startups and FinTech platforms",
    budget: 140000,
    description: "Automated continuous security compliance scanner providing SOC 2 and HIPAA infrastructure audit reports.",
  },
  {
    name: "FarmSense IoT",
    industry: "Hardware",
    business_model: "Enterprise licensing",
    target_market: "Commercial agricultural cooperatives in Australia",
    budget: 210000,
    description: "IoT soil telemetry sensors paired with drone multispectral mapping to optimize crop yield and water usage.",
  },
  {
    name: "TalentMesh AI",
    industry: "Marketplace",
    business_model: "Transactional",
    target_market: "Tech recruiters and remote engineering hubs",
    budget: 75000,
    description: "Vetted developer recruitment platform using automated code review benchmarks to match candidates with open roles.",
  },
  {
    name: "CarePath Rehab",
    industry: "Healthtech",
    business_model: "B2C Subscription",
    target_market: "Outpatient physical therapy clinics",
    budget: 160000,
    description: "Computer vision mobile application guiding post-surgery orthopedic patients through home rehabilitation exercises.",
  },
  {
    name: "CloudSpend Optimizer",
    industry: "SaaS",
    business_model: "Usage-based",
    target_market: "Multi-cloud engineering teams spending >$10k/mo",
    budget: 95000,
    description: "Automated AWS and GCP cost governance tool identifying over-provisioned instances and terminating idle resources.",
  },
  {
    name: "LexiAI Legal",
    industry: "AI",
    business_model: "B2B Subscription",
    target_market: "Corporate legal departments and boutique law firms",
    budget: 110000,
    description: "Contract risk analyzer flagging non-standard indemnity clauses, liability caps, and termination penalties in minutes.",
  },
  {
    name: "OmniChannel Retail Hub",
    industry: "E-commerce",
    business_model: "Transactional",
    target_market: "Mid-market retail chains expanding into omni-channel",
    budget: 130000,
    description: "Unified point-of-sale and online store inventory synchronization platform with instant local delivery routing.",
  },
  {
    name: "SecureAuth Vault",
    industry: "SaaS",
    business_model: "Enterprise licensing",
    target_market: "Financial services and healthcare providers",
    budget: 290000,
    description: "Passwordless biometric identity verification API leveraging zero-knowledge proofs for regulatory compliance.",
  },
  {
    name: "SkillStream L&D",
    industry: "Edtech",
    business_model: "B2B Subscription",
    target_market: "Corporate learning & development teams in Fortune 1000",
    budget: 150000,
    description: "Micro-learning platform converting internal wiki documentation and videos into interactive bite-sized quizzes.",
  },
  {
    name: "LendMetric AI",
    industry: "Fintech",
    business_model: "Transactional",
    target_market: "Alternative SMB lenders and credit unions",
    budget: 175000,
    description: "Machine learning credit underwriting engine evaluating non-traditional cash flow metrics for small business loans.",
  },
  {
    name: "WorkSpace Spatial",
    industry: "AI",
    business_model: "B2C Subscription",
    target_market: "Remote design agencies and hybrid teams",
    budget: 50000,
    description: "Spatial whiteboarding and 3D product prototyping workspace for distributed product engineering squads.",
  },
  {
    name: "ZeroWaste Kitchen",
    industry: "Consumer",
    business_model: "Freemium",
    target_market: "Eco-conscious urban households",
    budget: 40000,
    description: "Smart pantry camera and grocery tracking app reducing household food waste with AI recipe suggestions from expiring items.",
  },
];

export function getRandomDemoProject(): Project {
  const index = Math.floor(Math.random() * DEMO_PROJECT_POOL.length);
  return DEMO_PROJECT_POOL[index];
}

