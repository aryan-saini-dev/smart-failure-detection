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

export type RiskSeverity = "critical" | "high" | "medium" | "low";

export type RiskFactor = {
  category: string;
  score: number;
  note: string;
  likelihood?: number; // 1 - 5
  impact?: number; // 1 - 5
  severity?: RiskSeverity;
  mitigation?: string;
  timeframe?: string;
  expectedImpact?: string;
  riskReductionScore?: number;
  steps?: string[];
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
  type?: "capital" | "strategy" | "risk" | "competitor" | "product" | "operations" | string;
  category?: string;
  title: string;
  advice: string;
  priority: "high" | "medium" | "low" | "critical";
  timeframe?: string;
  steps?: string[];
  impactScore?: number;
  riskReduction?: string;
};

export type SwotItem = {
  text: string;
  impact: "high" | "medium" | "low";
  category?: string;
};

export type SwotAnalysis = {
  strengths: SwotItem[];
  weaknesses: SwotItem[];
  opportunities: SwotItem[];
  threats: SwotItem[];
};

export type FeasibilityMetric = {
  score: number; // 0 - 100
  level: "High" | "Moderate" | "Low";
  statusNote: string;
};

export type FeasibilityAssessment = {
  overallScore: number; // 0 - 100
  grade: "A+" | "A" | "B" | "C" | "D";
  status: "Highly Feasible" | "Feasible with Conditions" | "High Risk / Challenging";
  technical: FeasibilityMetric;
  financial: FeasibilityMetric;
  market: FeasibilityMetric;
  operational: FeasibilityMetric;
  keyTakeaways: string[];
};

export type LangGraphWorkflowStep = {
  id: string;
  name: string;
  status: string;
  timestamp: string;
  details: string;
};

export type LangGraphMetadata = {
  executed: boolean;
  steps: LangGraphWorkflowStep[];
  nodeCount: number;
  refined: boolean;
};

export type AnalysisResult = {
  projections: ProjectionPoint[];
  risks: RiskFactor[];
  competitors: Competitor[];
  marketSegments: MarketSegment[];
  growth: number;
  overallRisk: number;
  suggestions?: SuggestionItem[];
  swot?: SwotAnalysis;
  feasibility?: FeasibilityAssessment;
  mlPrediction?: {
    prediction: "Success" | "Failure";
    failureProbability: number;
    successProbability: number;
  };
  langgraphWorkflow?: LangGraphMetadata;
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

export function computeAnalysis(p: Project | AnalysisResult | any): AnalysisResult {
  let result: AnalysisResult;
  let projectObj: Project;

  if (p && Array.isArray(p.competitors)) {
    result = { ...p };
    projectObj = {
      name: p.name || "Project",
      industry: p.industry || "General",
      business_model: p.business_model || "Subscription",
      target_market: p.target_market || "Market",
      budget: p.budget || 50000,
      description: p.description || "",
    };
  } else if (p && p.analysis_data && Array.isArray(p.analysis_data.competitors)) {
    result = { ...p.analysis_data };
    projectObj = p as Project;
  } else {
    projectObj = (p || {}) as Project;
    result = computeRuleBasedAnalysis(projectObj);
  }

  if (!result.projections || !Array.isArray(result.projections) || result.projections.length === 0) {
    result.projections = computeRuleBasedAnalysis(projectObj).projections;
  }
  if (!result.suggestions) {
    result.suggestions = generateStartupSuggestions(projectObj, result);
  }
  if (!result.swot || !Array.isArray(result.swot.strengths)) {
    result.swot = generateSwotAnalysis(projectObj, result.risks || [], result.competitors || [], result.growth || 15);
  }
  if (!result.feasibility || typeof result.feasibility.overallScore !== "number") {
    result.feasibility = computeFeasibilityAssessment(projectObj, result.risks || [], result.growth || 15);
  }

  return result;
}

function getRiskSeverity(score: number): RiskSeverity {
  if (score >= 75) return "critical";
  if (score >= 55) return "high";
  if (score >= 35) return "medium";
  return "low";
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

  // Technical Feasibility Risk
  const isHighTech = /ai|healthtech|hardware|cybersecurity/i.test(industry);
  const techRiskScore = isHighTech ? (description.length > 100 ? 45 : 70) : 30;
  const techRiskNote = isHighTech
    ? `Advanced technical requirements for ${industry}; specialized dev talent required.`
    : `Standard software architecture pattern for ${industry}.`;

  // Regulatory / Legal Risk
  const isRegulated = /fintech|healthtech|edtech/i.test(industry);
  const regRiskScore = isRegulated ? 58 : 25;
  const regRiskNote = isRegulated
    ? `Industry subject to compliance oversight (e.g. data privacy / financial norms).`
    : `Minimal regulatory hurdles detected for standard market entry.`;

  const risks: RiskFactor[] = [
    {
      category: "Market",
      score: marketScore,
      note: marketNote,
      likelihood: Math.min(5, Math.max(1, Math.round(marketScore / 20))),
      impact: 4,
      severity: getRiskSeverity(marketScore),
      mitigation: "Focus on rapid customer feedback loops and tight positioning in sub-niches.",
    },
    {
      category: "Capital",
      score: capitalScore,
      note: capitalNote,
      likelihood: Math.min(5, Math.max(1, Math.round(capitalScore / 20))),
      impact: 5,
      severity: getRiskSeverity(capitalScore),
      mitigation: "Cap non-essential burn rate and target MVP release within initial 90 days.",
    },
    {
      category: "Execution",
      score: executionScore,
      note: executionNote,
      likelihood: Math.min(5, Math.max(1, Math.round(executionScore / 20))),
      impact: 4,
      severity: getRiskSeverity(executionScore),
      mitigation: "Define clear bi-weekly milestones and refine product scope to core value driver.",
    },
    {
      category: "Competition",
      score: competitionScore,
      note: competitionNote,
      likelihood: Math.min(5, Math.max(1, Math.round(competitionScore / 20))),
      impact: 3,
      severity: getRiskSeverity(competitionScore),
      mitigation: "Emphasize unique feature differentiation and superior user experience.",
    },
    {
      category: "Technical",
      score: techRiskScore,
      note: techRiskNote,
      likelihood: Math.min(5, Math.max(1, Math.round(techRiskScore / 20))),
      impact: 4,
      severity: getRiskSeverity(techRiskScore),
      mitigation: "Use proven cloud frameworks and establish early prototype benchmarks.",
    },
    {
      category: "Regulatory",
      score: regRiskScore,
      note: regRiskNote,
      likelihood: Math.min(5, Math.max(1, Math.round(regRiskScore / 20))),
      impact: 3,
      severity: getRiskSeverity(regRiskScore),
      mitigation: "Integrate compliance best practices and standard security headers from day 1.",
    },
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

  const failureProb = Math.min(95, Math.max(5, overallRisk));
  const mlPrediction = {
    prediction: (failureProb > 50 ? "Failure" : "Success") as "Failure" | "Success",
    failureProbability: failureProb,
    successProbability: 100 - failureProb,
  };

  const result: AnalysisResult = { projections, risks, competitors, marketSegments, growth, overallRisk, mlPrediction };
  result.suggestions = generateStartupSuggestions(p, result);
  result.swot = generateSwotAnalysis(p, result.risks, result.competitors, result.growth);
  result.feasibility = computeFeasibilityAssessment(p, result.risks, result.growth);
  return result;
}

export function generateSwotAnalysis(
  p: Project,
  risks: RiskFactor[],
  competitors: Competitor[],
  growth: number
): SwotAnalysis {
  const industry = p.industry || "General";
  const desc = p.description || "";
  const rawBudget = Number(p.budget) || 0;
  const currencyMeta = CURRENCY_MAP[p.currency || "USD"] || CURRENCY_MAP.USD;
  const budgetUsd = rawBudget / currencyMeta.rate;

  const strengths: SwotItem[] = [];
  const weaknesses: SwotItem[] = [];
  const opportunities: SwotItem[] = [];
  const threats: SwotItem[] = [];

  // STRENGTHS
  if (growth >= 20) {
    strengths.push({
      text: `High market tailwinds in ${industry} with ${growth}% projected annual growth.`,
      impact: "high",
      category: "Market Growth",
    });
  } else {
    strengths.push({
      text: `Stable baseline demand trajectory in established ${industry} domain.`,
      impact: "medium",
      category: "Market Stability",
    });
  }

  if (p.target_market && p.target_market.length > 15) {
    strengths.push({
      text: `Well-defined niche target market (${p.target_market}), reducing GTM acquisition waste.`,
      impact: "high",
      category: "Targeting",
    });
  } else {
    strengths.push({
      text: `Broad potential market addressability across consumer and business segments.`,
      impact: "medium",
      category: "Addressability",
    });
  }

  if (desc.length > 100) {
    strengths.push({
      text: `Clear execution blueprint and detailed value proposition outlined in project brief.`,
      impact: "high",
      category: "Strategy Depth",
    });
  }

  if (budgetUsd >= 100000) {
    strengths.push({
      text: `Substantial seed budget (${formatCurrency(budgetUsd, "USD")}) providing extended 12+ month runway.`,
      impact: "high",
      category: "Financial Runway",
    });
  }

  if (strengths.length < 3) {
    strengths.push({
      text: `Agile startup structure allowing rapid iteration over legacy market incumbents.`,
      impact: "medium",
      category: "Agility",
    });
  }

  // WEAKNESSES
  if (budgetUsd < 50000) {
    weaknesses.push({
      text: `Constrained budget (${formatCurrency(budgetUsd, "USD")}) limiting early paid marketing & tech scaling.`,
      impact: "high",
      category: "Capital Constraint",
    });
  }

  if (desc.length < 60) {
    weaknesses.push({
      text: `High-level project scope needs deeper specification on technical moat & onboarding.`,
      impact: "high",
      category: "Scope Definition",
    });
  }

  const capitalRisk = risks.find((r) => r.category === "Capital");
  if (capitalRisk && capitalRisk.score > 60) {
    weaknesses.push({
      text: `Elevated capital risk score (${capitalRisk.score}/100) requires tight monthly cash flow governance.`,
      impact: "high",
      category: "Cash Burn",
    });
  }

  if (weaknesses.length < 3) {
    weaknesses.push({
      text: `Early brand awareness deficit relative to dominant market players.`,
      impact: "medium",
      category: "Brand Authority",
    });
  }

  // OPPORTUNITIES
  opportunities.push({
    text: `Capitalize on incumbent weaknesses (e.g. legacy tech, complex pricing) with a streamlined solution.`,
    impact: "high",
    category: "Disruption",
  });

  if (/saas|ai|fintech/i.test(industry)) {
    opportunities.push({
      text: `Expand product offering via API integrations and automated self-service onboarding.`,
      impact: "high",
      category: "Product Expansion",
    });
  }

  opportunities.push({
    text: `Leverage content-led and product-led growth (PLG) channels to lower CAC.`,
    impact: "medium",
    category: "Distribution",
  });

  opportunities.push({
    text: `Establish strategic channel partnerships in ${p.target_market || "target verticals"}.`,
    impact: "medium",
    category: "Partnerships",
  });

  // THREATS
  const compRisk = risks.find((r) => r.category === "Competition");
  if (compRisk && compRisk.score > 55) {
    threats.push({
      text: `Aggressive response or feature duplication from well-capitalized industry leaders.`,
      impact: "high",
      category: "Competitor Response",
    });
  } else {
    threats.push({
      text: `Emergence of new low-cost competitors entering the ${industry} space.`,
      impact: "medium",
      category: "New Entrants",
    });
  }

  if (/fintech|healthtech/i.test(industry)) {
    threats.push({
      text: `Tightening data privacy & regulatory compliance frameworks adding unexpected overhead.`,
      impact: "high",
      category: "Regulatory Shift",
    });
  } else {
    threats.push({
      text: `Macroeconomic friction affecting enterprise and consumer software purchasing budgets.`,
      impact: "medium",
      category: "Macroeconomic",
    });
  }

  threats.push({
    text: `Rising digital advertising costs (CAC) inflating customer acquisition expenses.`,
    impact: "medium",
    category: "Customer Acquisition",
  });

  return { strengths, weaknesses, opportunities, threats };
}

export function computeFeasibilityAssessment(
  p: Project,
  risks: RiskFactor[],
  growth: number
): FeasibilityAssessment {
  const industry = p.industry || "General";
  const desc = p.description || "";
  const rawBudget = Number(p.budget) || 0;
  const currencyMeta = CURRENCY_MAP[p.currency || "USD"] || CURRENCY_MAP.USD;
  const budgetUsd = rawBudget / currencyMeta.rate;

  // Technical Feasibility
  const isComplexTech = /ai|healthtech|hardware|cybersecurity/i.test(industry);
  const techScore = isComplexTech
    ? Math.min(90, Math.max(35, 45 + (desc.length > 80 ? 25 : 10)))
    : Math.min(95, Math.max(50, 70 + (desc.length > 50 ? 20 : 5)));
  const techLevel = techScore >= 75 ? "High" : techScore >= 50 ? "Moderate" : "Low";
  const techNote = isComplexTech
    ? `Complex domain requirements; manageable with experienced technical leads.`
    : `Standard technology stack; minimal risk of technical barriers.`;

  // Financial Feasibility
  const minRequiredUsd = /enterprise/i.test(p.business_model || "") ? 150000 : isComplexTech ? 100000 : 40000;
  const finRatio = budgetUsd / minRequiredUsd;
  const finScore = Math.min(98, Math.max(20, Math.round(finRatio * 65)));
  const finLevel = finScore >= 75 ? "High" : finScore >= 50 ? "Moderate" : "Low";
  const finNote =
    finRatio >= 1.0
      ? `Budget allocation covers projected launch and initial runway comfortably.`
      : `Capital is tight; lean execution and early revenue traction will be critical.`;

  // Market Feasibility
  const marketScore = Math.min(95, Math.max(30, Math.round(growth * 2.2 + (p.target_market.length > 15 ? 15 : 0))));
  const marketLevel = marketScore >= 75 ? "High" : marketScore >= 50 ? "Moderate" : "Low";
  const marketNote = `${growth}% sector growth provides a favorable adoption backdrop.`;

  // Operational Feasibility
  const opScore = Math.min(92, Math.max(35, Math.round(85 - (risks.find((r) => r.category === "Execution")?.score || 50) * 0.6)));
  const opLevel = opScore >= 75 ? "High" : opScore >= 50 ? "Moderate" : "Low";
  const opNote = `Operational complexity is manageable given standard ${p.business_model || "business"} workflows.`;

  // Overall Score (Weighted)
  const overallScore = Math.round(techScore * 0.25 + finScore * 0.35 + marketScore * 0.25 + opScore * 0.15);

  let grade: FeasibilityAssessment["grade"] = "B";
  let status: FeasibilityAssessment["status"] = "Feasible with Conditions";

  if (overallScore >= 85) {
    grade = "A+";
    status = "Highly Feasible";
  } else if (overallScore >= 75) {
    grade = "A";
    status = "Highly Feasible";
  } else if (overallScore >= 60) {
    grade = "B";
    status = "Feasible with Conditions";
  } else if (overallScore >= 45) {
    grade = "C";
    status = "Feasible with Conditions";
  } else {
    grade = "D";
    status = "High Risk / Challenging";
  }

  const keyTakeaways: string[] = [];
  if (finScore >= 70) keyTakeaways.push("Strong financial backing secures initial product runway.");
  else keyTakeaways.push("Focus on low-cost MVP release to validate unit economics quickly.");

  if (marketScore >= 70) keyTakeaways.push("High sector growth supports rapid customer acquisition.");
  else keyTakeaways.push("Refine target customer persona to build a defensible niche.");

  if (techScore >= 70) keyTakeaways.push("Favorable technical feasibility enables fast time-to-market.");

  return {
    overallScore,
    grade,
    status,
    technical: { score: techScore, level: techLevel, statusNote: techNote },
    financial: { score: finScore, level: finLevel, statusNote: finNote },
    market: { score: marketScore, level: marketLevel, statusNote: marketNote },
    operational: { score: opScore, level: opLevel, statusNote: opNote },
    keyTakeaways,
  };
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
      category: "Capital Runway",
      title: "Increase Capital Runway & Cap Monthly Burn",
      advice: `Allocated budget of ${formattedBudget} is tight for ${p.industry || "this sector"}. We recommend extending capital to ~${formattedMin} or launching with a streamlined MVP.`,
      priority: "high",
      timeframe: "Immediate (0-30 Days)",
      impactScore: 92,
      riskReduction: "35% Risk Reduction",
      steps: [
        "Audit monthly recurring expenses and defer non-critical software/hardware commitments.",
        "Prioritize lean MVP scope focused exclusively on core value delivery.",
        "Set milestone-based budget releases tied to customer acquisition targets."
      ]
    });
  } else if (budgetUsd > minRequiredUsd * 2.5) {
    suggestions.push({
      type: "capital",
      category: "Capital Runway",
      title: "Optimize Capital Allocation Strategy",
      advice: `Strong runway backing (${formattedBudget}). Focus 45% of capital on early customer acquisition & key hires rather than bloated initial features.`,
      priority: "low",
      timeframe: "Q1-Q2 (0-90 Days)",
      impactScore: 82,
      riskReduction: "15% Risk Reduction",
      steps: [
        "Allocate 45% of budget to customer acquisition & strategic marketing channels.",
        "Reserve 30% for core engineering and key technical leadership hires.",
        "Maintain 25% cash buffer for market pivots and unexpected opportunities."
      ]
    });
  } else {
    suggestions.push({
      type: "capital",
      category: "Capital Runway",
      title: "Balanced Cash & Burn Rate Governance",
      advice: `Your ${formattedBudget} budget provides 8-12 months of runway. Cap monthly burn rate until reaching initial product-market traction.`,
      priority: "medium",
      timeframe: "Monthly (Ongoing)",
      impactScore: 86,
      riskReduction: "20% Risk Reduction",
      steps: [
        "Implement bi-weekly financial reviews tracking actual vs projected cash burn.",
        "Establish key performance indicators (KPIs) required before expanding team headcount.",
        "Secure pre-negotiated credit or strategic cloud credits."
      ]
    });
  }

  // 2. Strategic Focus & Go-To-Market
  if (/enterprise/i.test(model)) {
    suggestions.push({
      type: "strategy",
      category: "Go-To-Market",
      title: "Focus on High-Intent Pilot Conversions",
      advice: "Enterprise sales cycles take 4-9 months. Offer 30-day proof-of-concept pilots to land initial reference customers quickly.",
      priority: "high",
      timeframe: "30-60 Days",
      impactScore: 94,
      riskReduction: "30% Risk Reduction",
      steps: [
        "Design a 30-day structured Proof of Concept (PoC) pilot framework.",
        "Target mid-market decision makers with pain-point specific case studies.",
        "Secure early customer testimonials to build industry credibility."
      ]
    });
  } else if (/freemium|b2c/i.test(model)) {
    suggestions.push({
      type: "strategy",
      category: "Go-To-Market",
      title: "Drive User Retention & Product Virality",
      advice: "Prioritize Day-1 and Day-7 user retention and product virality mechanisms before spending heavily on paid channels.",
      priority: "high",
      timeframe: "First 30 Days",
      impactScore: 89,
      riskReduction: "25% Risk Reduction",
      steps: [
        "Optimize onboarding flow to achieve under 60-second time-to-value.",
        "Implement in-app viral sharing loops and incentive mechanics.",
        "Monitor user drop-off points with analytics telemetry."
      ]
    });
  } else {
    suggestions.push({
      type: "strategy",
      category: "Go-To-Market",
      title: "Implement Product-Led Onboarding",
      advice: "Build an effortless, self-serve onboarding flow to deliver immediate time-to-value for new signups.",
      priority: "medium",
      timeframe: "30 Days",
      impactScore: 85,
      riskReduction: "20% Risk Reduction",
      steps: [
        "Remove pre-signup friction and lengthy registration forms.",
        "Provide interactive sample data for immediate product exploration.",
        "Set up automated email sequences triggering feature adoption."
      ]
    });
  }

  // 3. Risk Mitigation & Positioning Wedge
  if (analysis.overallRisk > 60) {
    suggestions.push({
      type: "risk",
      category: "Risk Defense",
      title: "Sharpen Sub-Niche Market Wedge",
      advice: `Overall risk score is elevated (${analysis.overallRisk}/100). Focus on a specific, underserved sub-niche in ${p.target_market || "your market"} to establish defensibility.`,
      priority: "high",
      timeframe: "Immediate (0-15 Days)",
      impactScore: 95,
      riskReduction: "40% Risk Reduction",
      steps: [
        "Identify top 3 underserved sub-segments within target market.",
        "Tailor landing page messaging and feature prioritization to primary niche.",
        "Conduct 15 customer discovery interviews to validate willingness-to-pay."
      ]
    });
  } else {
    suggestions.push({
      type: "risk",
      category: "Risk Defense",
      title: "Accelerate GTM Distribution Velocity",
      advice: "Low risk profile detected. Double down on co-marketing and strategic partnerships to capture market share fast.",
      priority: "low",
      timeframe: "Q1 (0-60 Days)",
      impactScore: 84,
      riskReduction: "15% Risk Reduction",
      steps: [
        "Identify 5 non-competing partner products in the same ecosystem.",
        "Launch joint webinars and integration announcements.",
        "Scale high-performing acquisition channels."
      ]
    });
  }

  // 4. Competitor Differentiation & Product Moat
  suggestions.push({
    type: "product",
    category: "Product Moat",
    title: "Build a 10x Product Moat & Differentiation Wedge",
    advice: `Detail your proprietary wedge in ${p.industry || "this market"} (e.g. 10x workflow speed, AI automation, or structural cost advantage) to build defensibility against incumbents.`,
    priority: "high",
    timeframe: "30 Days",
    impactScore: 92,
    riskReduction: "30% Risk Reduction",
    steps: [
      "Publish competitive comparison matrix highlighting unique tech & speed advantages.",
      "Focus product roadmap on core 10x workflow accelerator features.",
      "Gather early user telemetry on feature usage to deepen workflow lock-in."
    ]
  });

  suggestions.push({
    type: "product",
    category: "Product Moat",
    title: "Proprietary Data & Integration Flywheel",
    advice: "Create proprietary data loops and multi-tool integrations that increase switching costs for target customers.",
    priority: "medium",
    timeframe: "60 Days",
    impactScore: 88,
    riskReduction: "20% Risk Reduction",
    steps: [
      "Build native connectors into 3 most-used tools in customer workflow.",
      "Store aggregated workspace metadata to provide personalized insights.",
      "Incentivize team-wide adoption with shared workspace features."
    ]
  });

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

