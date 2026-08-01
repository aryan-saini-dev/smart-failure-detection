import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  AlertTriangle,
  ArrowRight,
  BookmarkCheck,
  Building2,
  CheckCircle2,
  Compass,
  Cpu,
  Dice5,
  DollarSign,
  FileText,
  Globe,
  Lightbulb,
  Loader2,
  Radar,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  CURRENCY_MAP,
  CurrencyCode,
  computeAnalysis,
  computeRuleBasedAnalysis,
  formatCurrency,
  generateStartupSuggestions,
  getRandomDemoProject,
  type Project,
} from "@/lib/analysis";
import { hasDemoSession, saveDemoProject } from "@/lib/demo-session";
import { analyzeProject, createProject, getCurrentUser } from "@/lib/local-api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Aurora from "@/components/Aurora";

export const Route = createFileRoute("/project-input")({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      name: (search.name as string) || "",
      industry: (search.industry as string) || "",
      business_model: (search.business_model as string) || "",
      target_market: (search.target_market as string) || "",
      budget: Number(search.budget) || 0,
      description: (search.description as string) || "",
    };
  },
  head: () => ({
    meta: [
      { title: "Project Input — Smart Failure Detection" },
      {
        name: "description",
        content:
          "Submit your startup details for an instant market, competitor, and risk analysis.",
      },
      { property: "og:title", content: "Project Input — Smart Failure Detection" },
      {
        property: "og:description",
        content:
          "Submit your startup details for an instant market, competitor, and risk analysis.",
      },
    ],
  }),
  component: ProjectInputPage,
});

const INDUSTRIES = [
  "SaaS",
  "Fintech",
  "Healthtech",
  "Edtech",
  "E-commerce",
  "AI",
  "Marketplace",
  "Consumer",
  "Hardware",
  "Cybersecurity",
  "Other",
];

const MODELS = [
  "B2B Subscription",
  "B2C Subscription",
  "Usage-based",
  "Marketplace",
  "Freemium",
  "Enterprise licensing",
  "Transactional",
  "Ads",
];

type FormState = Project;

const empty: FormState = {
  name: "",
  industry: "",
  business_model: "",
  target_market: "",
  budget: 0,
  currency: "USD",
  description: "",
};


function ProjectInputPage() {
  const searchParams = Route.useSearch();
  const [form, setForm] = useState<FormState>({
    ...empty,
    name: searchParams.name || "",
    industry: searchParams.industry || "",
    business_model: searchParams.business_model || "",
    target_market: searchParams.target_market || "",
    budget: searchParams.budget || 0,
    description: searchParams.description || "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [runningAnalysis, setRunningAnalysis] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<Project | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [tab, setTab] = useState<"overview" | "competitors" | "risk" | "market" | "suggestions">("overview");

  const [liveAnalysis, setLiveAnalysis] = useState<any>(null);
  const [analyzedForm, setAnalyzedForm] = useState<FormState | null>(null);
  const [isAiSearching, setIsAiSearching] = useState(false);

  useEffect(() => {
    getCurrentUser().then(({ user }) => setCurrentUser(user));
  }, []);

  const activeAnalysis = saved?.analysis_data || liveAnalysis;
  const activeProjectName = saved?.name || analyzedForm?.name || form.name.trim() || "Live Analysis";

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function fillDemo() {
    setForm(getRandomDemoProject());
    setError(null);
  }

  function resetForm() {
    setForm(empty);
    setError(null);
    setSaved(null);
    setLiveAnalysis(null);
    setAnalyzedForm(null);
  }

  async function handleRunAnalysis(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.name.trim() || !form.industry.trim() || !form.description.trim()) {
      setError("Please complete name, industry, and description.");
      return;
    }
    if (form.budget < 0 || Number.isNaN(form.budget)) {
      setError("Budget must be a positive number.");
      return;
    }

    setRunningAnalysis(true);
    setIsAiSearching(true);
    try {
      const { analysis: aiResult } = await analyzeProject(form);
      if (aiResult) {
        setLiveAnalysis(aiResult);
        setAnalyzedForm(form);
      }
    } catch (err) {
      console.warn("Manual AI analysis error:", err);
    } finally {
      setRunningAnalysis(false);
      setIsAiSearching(false);
    }
  }

  async function handleSaveAnalysis(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!currentUser) {
      setError("Sign in to save this analysis to your account database.");
      return;
    }
    if (!activeAnalysis) {
      setError("Run an analysis first before saving.");
      return;
    }
    if (!form.name.trim() || !form.industry.trim() || !form.description.trim()) {
      setError("Please complete name, industry, and description.");
      return;
    }

    setSubmitting(true);
    try {
      const { project } = await createProject({
        name: form.name.trim(),
        industry: form.industry.trim(),
        business_model: form.business_model.trim(),
        target_market: form.target_market.trim(),
        budget: form.budget,
        currency: form.currency || "USD",
        description: form.description.trim(),
      });
      setSubmitting(false);
      setSaved(project || { ...form, analysis_data: activeAnalysis });
    } catch (error) {
      setSubmitting(false);
      setError(error instanceof Error ? error.message : "Unable to save analysis to database.");
    }
  }


  return (
    <div className="relative min-h-[calc(100vh-64px)] w-full overflow-hidden">
      {/* Interactive Background */}
      <div className="fixed inset-0 z-0">
        <Aurora
          colorStops={["#F97316","#ffc1ab","#ff5d00"]}
          blend={0.67}
          amplitude={1.0}
          speed={1}
        />
        {/* Subtle overlay to ensure text readability */}
        <div className="absolute inset-0 bg-background/40 backdrop-blur-[2px]" />
      </div>

      <main className="relative z-10 mx-auto max-w-[95%] px-6 py-4 md:px-10 md:py-6">
      <div className="mb-4">
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Startup Submission
        </h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] items-stretch">
        {/* FORM */}
        <form onSubmit={handleRunAnalysis} className="glass-card p-6 md:p-7 flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between gap-3 border-b border-white/5 pb-4">
              <h2 className="font-display text-xl font-semibold">Startup Details</h2>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={fillDemo}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-[color:var(--foreground)] transition-all duration-200 hover:border-white/25 hover:bg-white/5 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
                >
                  <Dice5 className="h-3.5 w-3.5" strokeWidth={1.75} />
                  Fill demo
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-[color:var(--muted-foreground)] transition-all duration-200 hover:border-white/25 hover:bg-white/5 hover:text-[color:var(--foreground)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
                >
                  <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.75} />
                  Reset
                </button>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <Field
                label="Startup / Project name"
                icon={<Building2 className="h-3.5 w-3.5" strokeWidth={1.5} />}
              >
                <input
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Ember Analytics"
                  className={inputCls}
                />
              </Field>

              <div className="grid grid-cols-2 gap-3.5">
                <Field label="Industry" icon={<Radar className="h-3.5 w-3.5" strokeWidth={1.5} />}>
                  <Select value={form.industry} onValueChange={(val) => update("industry", val)}>
                    <SelectTrigger className={inputCls}>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent className="border border-white/10 bg-[#12121a] text-[color:var(--foreground)] z-50">
                      {INDUSTRIES.map((i) => (
                        <SelectItem key={i} value={i} className="hover:bg-white/10 cursor-pointer">
                          {i}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field
                  label="Business model"
                  icon={<Target className="h-3.5 w-3.5" strokeWidth={1.5} />}
                >
                  <Select value={form.business_model} onValueChange={(val) => update("business_model", val)}>
                    <SelectTrigger className={inputCls}>
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent className="border border-white/10 bg-[#12121a] text-[color:var(--foreground)] z-50">
                      {MODELS.map((i) => (
                        <SelectItem key={i} value={i} className="hover:bg-white/10 cursor-pointer">
                          {i}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              <Field label="Target market" icon={<Users className="h-3.5 w-3.5" strokeWidth={1.5} />}>
                <input
                  value={form.target_market}
                  onChange={(e) => update("target_market", e.target.value)}
                  placeholder="Mid-market RevOps teams in North America"
                  className={inputCls}
                />
              </Field>

              <Field
                label="Budget & Currency"
                icon={<DollarSign className="h-3.5 w-3.5" strokeWidth={1.5} />}
              >
                <div className="grid grid-cols-[1fr_auto] gap-2">
                  <input
                    type="number"
                    min={0}
                    value={form.budget || ""}
                    onChange={(e) => update("budget", Number(e.target.value))}
                    placeholder="120000"
                    className={inputCls}
                  />
                  <Select
                    value={form.currency || "USD"}
                    onValueChange={(val) => update("currency", val as CurrencyCode)}
                  >
                    <SelectTrigger className="w-28 rounded-lg border border-white/10 bg-[color:var(--card-solid)]/60 px-3 py-2.5 text-sm text-[color:var(--foreground)] backdrop-blur">
                      <SelectValue placeholder="Currency" />
                    </SelectTrigger>
                    <SelectContent className="border border-white/10 bg-[#12121a] text-[color:var(--foreground)] z-50">
                      {Object.entries(CURRENCY_MAP).map(([code, meta]) => (
                        <SelectItem key={code} value={code} className="hover:bg-white/10 cursor-pointer">
                          {meta.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </Field>

              <Field
                label="Project description"
                icon={<FileText className="h-3.5 w-3.5" strokeWidth={1.5} />}
              >
                <textarea
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                  placeholder="Describe the product, the wedge, and why now…"
                  rows={3}
                  className={`${inputCls} resize-none`}
                />
              </Field>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/5 flex flex-col gap-2.5">
            {error && (
              <div className="mb-2 flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={handleRunAnalysis}
              disabled={runningAnalysis || isAiSearching}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[color:var(--accent)] px-6 py-3 text-sm font-semibold text-[color:var(--accent-foreground)] transition-all duration-200 hover:brightness-110 hover:shadow-[0_0_28px_rgba(245,158,11,0.45)] active:scale-[0.98] disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
            >
              {runningAnalysis || isAiSearching ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Analyzing market data…
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" /> Run analysis
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleSaveAnalysis}
              disabled={submitting || !currentUser || !activeAnalysis}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/[0.04] px-6 py-2.5 text-sm font-medium text-[color:var(--foreground)] transition-all duration-200 hover:border-white/30 hover:bg-white/10 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Saving to database…
                </>
              ) : (
                <>
                  <BookmarkCheck className="h-4 w-4 text-emerald-400" /> Save analysis
                </>
              )}
            </button>

            {!currentUser ? (
              <p className="text-center text-[11px] text-[color:var(--muted-foreground)]">
                🔒 Sign in to save analyses to your workspace
              </p>
            ) : !activeAnalysis ? (
              <p className="text-center text-[11px] text-[color:var(--muted-foreground)]">
                ⚡ Run an analysis first to enable saving
              </p>
            ) : saved ? (
              <div className="flex items-center justify-center gap-2 text-xs text-emerald-300/90">
                <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={1.75} />
                Analysis saved to database
              </div>
            ) : null}
          </div>
        </form>


        {/* ANALYSIS */}
        <section className="flex flex-col h-full gap-4">
          {isAiSearching ? (
            <CreativeAiRadarLoader projectName={activeProjectName} industry={form.industry || saved?.industry || ""} />
          ) : !activeAnalysis ? (
            <EmptyAnalysis />
          ) : (
            <div className="flex flex-col h-full gap-4">
              <header className="glass-card px-5 py-3.5 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <h2 className="font-display text-xl font-semibold tracking-tight">{activeProjectName}</h2>
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-medium text-amber-300">
                    <Sparkles className="h-3 w-3 text-amber-400" />
                    <span>Live Market Research Active</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-5 text-xs text-[color:var(--muted-foreground)]">
                  <Stat label="Growth" value={`${activeAnalysis.growth}%`} accent />
                  <div className="h-4 w-px bg-white/10 hidden sm:block" />
                  <Stat label="Risk" value={`${activeAnalysis.overallRisk}/100`} />
                  <div className="h-4 w-px bg-white/10 hidden sm:block" />
                  <Stat
                    label="Budget"
                    value={formatCurrency(
                      saved?.budget || analyzedForm?.budget || 0,
                      saved?.currency || analyzedForm?.currency || "USD"
                    )}
                  />
                </div>
              </header>

              <div className="flex gap-1 p-1 glass-card">
                {(
                  [
                    { id: "overview", label: "Revenue & Risk" },
                    { id: "competitors", label: "Competitors" },
                    { id: "risk", label: "Risk breakdown" },
                    { id: "market", label: "Market segments" },
                    { id: "suggestions", label: "Suggestions" },
                  ] as const
                ).map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`flex-1 rounded-md px-3 py-2 text-xs sm:text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] ${tab === t.id
                      ? "bg-[color:var(--accent)]/15 text-[color:var(--foreground)] shadow-[0_0_20px_rgba(245,158,11,0.15)]"
                      : "text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)]"
                      }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {tab === "overview" && (() => {
                const mlVerdict = activeAnalysis.mlPrediction || {
                  prediction: (activeAnalysis.overallRisk > 50 ? "Failure" : "Success") as "Failure" | "Success",
                  failureProbability: activeAnalysis.overallRisk,
                  successProbability: 100 - activeAnalysis.overallRisk,
                };
                const isSuccess = mlVerdict.prediction === "Success";

                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                    {/* Bento Tile 1: 6-Month Revenue Projection */}
                    <ChartCard title="6-Month Revenue Projection" icon={TrendingUp}>
                      <ResponsiveContainer width="100%" height={230}>
                        <LineChart data={activeAnalysis.projections}>
                          <CartesianGrid stroke="rgba(255,255,255,0.05)" />
                          <XAxis dataKey="month" stroke="#71717A" fontSize={11} />
                          <YAxis stroke="#71717A" fontSize={11} />
                          <Tooltip contentStyle={tooltipStyle} itemStyle={tooltipItemStyle} labelStyle={tooltipLabelStyle} />
                          <Line
                            type="monotone"
                            dataKey="revenue"
                            stroke="#F59E0B"
                            strokeWidth={2.5}
                            dot={{ r: 3.5, fill: "#F59E0B" }}
                          />
                          <Line
                            type="monotone"
                            dataKey="cost"
                            stroke="#71717A"
                            strokeWidth={1.5}
                            strokeDasharray="4 4"
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartCard>

                    {/* Bento Tile 2: Risk Profile Breakdown */}
                    <ChartCard title="Risk Profile Breakdown" icon={AlertTriangle}>
                      <ResponsiveContainer width="100%" height={230}>
                        <BarChart data={activeAnalysis.risks} layout="vertical" margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                          <CartesianGrid stroke="rgba(255,255,255,0.05)" />
                          <XAxis type="number" domain={[0, 100]} stroke="#71717A" fontSize={11} />
                          <YAxis
                            type="category"
                            dataKey="category"
                            stroke="#A1A1AA"
                            fontSize={11}
                            width={80}
                          />
                          <Tooltip contentStyle={tooltipStyle} itemStyle={tooltipItemStyle} labelStyle={tooltipLabelStyle} />
                          <Bar dataKey="score" radius={[0, 6, 6, 0]}>
                            {activeAnalysis.risks.map((r: any, i: number) => (
                              <Cell
                                key={i}
                                fill={r.score > 65 ? "#ef4444" : r.score > 45 ? "#F59E0B" : "#10b981"}
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartCard>

                    {/* Bento Tile 3: Machine Learning Venture Verdict Card (Full Width) */}
                    <div className={`md:col-span-2 glass-card p-5 border transition-all duration-300 ${
                      isSuccess 
                        ? "border-emerald-500/30 bg-gradient-to-r from-emerald-950/30 via-emerald-950/10 to-transparent shadow-[0_0_30px_rgba(16,185,129,0.12)]" 
                        : "border-red-500/30 bg-gradient-to-r from-red-950/30 via-red-950/10 to-transparent shadow-[0_0_30px_rgba(239,68,68,0.12)]"
                    }`}>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3.5">
                          <div className={`p-2.5 rounded-xl border shrink-0 ${
                            isSuccess 
                              ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]" 
                              : "bg-red-500/15 text-red-400 border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                          }`}>
                            <Cpu className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-display text-base font-semibold tracking-tight text-[color:var(--foreground)]">
                              ML Venture Viability Intelligence
                            </h3>
                            <p className="mt-0.5 text-xs text-[color:var(--muted-foreground)]">
                              Trained on 48,000+ venture outcomes & real-time capital velocity signals
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 self-start sm:self-center shrink-0">
                          <span className={`rounded-lg px-3 py-1.5 font-display text-xs font-semibold uppercase tracking-wider border shadow-sm ${
                            isSuccess 
                              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/35 shadow-[0_0_15px_rgba(16,185,129,0.25)]" 
                              : "bg-red-500/20 text-red-300 border-red-500/35 shadow-[0_0_15px_rgba(239,68,68,0.25)]"
                          }`}>
                            Verdict: {isSuccess ? "High Viability / Proceed" : "Elevated Failure Risk"}
                          </span>
                        </div>
                      </div>

                      {/* Dual Progress Meter */}
                      <div className="mt-3.5 pt-3 border-t border-white/5">
                        <div className="flex justify-between items-center text-xs font-medium mb-2">
                          <span className="text-emerald-400 font-sans flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-emerald-400 inline-block shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                            {Math.round(mlVerdict.successProbability)}% Success Viability
                          </span>
                          <span className="text-red-400 font-sans flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-red-400 inline-block shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
                            {Math.round(mlVerdict.failureProbability)}% Failure Risk
                          </span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-white/5 flex">
                          <div 
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-700 shadow-[0_0_10px_rgba(16,185,129,0.5)]" 
                            style={{ width: `${mlVerdict.successProbability}%` }}
                          />
                          <div 
                            className="h-full bg-gradient-to-r from-red-500 to-rose-400 transition-all duration-700 shadow-[0_0_10px_rgba(239,68,68,0.5)]" 
                            style={{ width: `${mlVerdict.failureProbability}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {tab === "competitors" && (
                <div className="glass-card p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display text-lg font-semibold">Competitor Landscape</h3>
                    <p className="mt-1 text-xs text-[color:var(--muted-foreground)]">
                      Estimated market positioning against{" "}
                      <span className="text-[color:var(--foreground)] font-medium">
                        {form.industry || saved?.industry || "the sector"}
                      </span>{" "}
                      incumbents.
                    </p>
                    <div className="mt-5 divide-y divide-white/5">
                      {activeAnalysis.competitors.map((c: any) => (
                        <div
                          key={c.name}
                          className="grid gap-4 py-3.5 md:grid-cols-[1fr_2fr_auto] md:items-center"
                        >
                          <div>
                            <p className="font-display font-semibold text-sm">{c.name}</p>
                            <p className="mt-0.5 text-xs text-[color:var(--muted-foreground)]">
                              {c.marketShare}% market · {c.overlap}% overlap
                            </p>
                          </div>
                          <div className="grid gap-2 text-xs md:grid-cols-2">
                            <div>
                              <p className="text-[11px] font-medium text-emerald-400">
                                Strength
                              </p>
                              <p className="text-[color:var(--foreground)]/90">{c.strength}</p>
                            </div>
                            <div>
                              <p className="text-[11px] font-medium text-red-400">
                                Weakness
                              </p>
                              <p className="text-[color:var(--foreground)]/90">{c.weakness}</p>
                            </div>
                          </div>
                          <div className="h-2 w-28 overflow-hidden rounded-full bg-white/5">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-[color:var(--accent)] to-amber-300"
                              style={{ width: `${c.overlap}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {tab === "risk" && (
                <div className="grid gap-4 md:grid-cols-2 flex-1">
                  {activeAnalysis.risks.map((r: any) => (
                    <div key={r.category} className="glass-card p-5 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <p className="font-display text-base font-semibold">{r.category}</p>
                          <span
                            className={`rounded-md px-2.5 py-0.5 text-xs font-semibold ${r.score > 65
                              ? "bg-red-500/15 text-red-300 border border-red-500/25"
                              : r.score > 45
                                ? "bg-amber-500/15 text-amber-300 border border-amber-500/25"
                                : "bg-emerald-500/15 text-emerald-300 border border-emerald-500/25"
                              }`}
                          >
                            {r.score}/100
                          </span>
                        </div>
                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/5">
                          <div
                            className={`h-full rounded-full ${r.score > 65
                              ? "bg-red-500"
                              : r.score > 45
                                ? "bg-[color:var(--accent)]"
                                : "bg-emerald-500"
                              }`}
                            style={{ width: `${r.score}%` }}
                          />
                        </div>
                      </div>
                      <p className="mt-3 text-xs leading-relaxed text-[color:var(--muted-foreground)]">{r.note}</p>
                    </div>
                  ))}
                </div>
              )}

              {tab === "market" && (
                <div className="grid gap-5 md:grid-cols-2 flex-1">
                  <ChartCard title="Adoption Segments" icon={Users}>
                    <ResponsiveContainer width="100%" height={260}>
                      <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                        <Pie
                          data={activeAnalysis.marketSegments}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="40%"
                          innerRadius={45}
                          outerRadius={75}
                          paddingAngle={4}
                        >
                          {activeAnalysis.marketSegments.map((_: any, i: number) => (
                            <Cell key={i} fill={["#F59E0B", "#fbbf24", "#71717A", "#3f3f46"][i % 4]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={tooltipStyle} itemStyle={tooltipItemStyle} labelStyle={tooltipLabelStyle} />
                        <Legend
                          verticalAlign="bottom"
                          align="center"
                          wrapperStyle={{ paddingTop: "14px", fontSize: 12, color: "#A1A1AA" }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartCard>

                  <div className="glass-card p-6 flex flex-col justify-between">
                    <div>
                      <h3 className="font-display text-lg font-semibold">Positioning Summary</h3>
                      <p className="mt-1 text-xs text-[color:var(--muted-foreground)]">
                        {form.description || saved?.description || "Startup venture evaluation"}
                      </p>
                      <dl className="mt-4 space-y-3 text-xs">
                        <Row label="Target market" value={form.target_market || saved?.target_market || "—"} />
                        <Row label="Model" value={form.business_model || saved?.business_model || "—"} />
                        <Row label="Industry growth" value={`${activeAnalysis.growth}% projected annual`} />
                        <Row
                          label="Recommended focus"
                          value={
                            activeAnalysis.overallRisk > 60
                              ? "De-risk before scaling — validate demand and unit economics"
                              : "Sharpen wedge and accelerate distribution"
                          }
                        />
                      </dl>
                    </div>
                  </div>
                </div>
              )}

              {tab === "suggestions" && (
                <div className="glass-card p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-white/5 pb-3">
                      <div className="flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-[color:var(--accent)]" />
                        <h3 className="font-display text-lg font-semibold">Strategic Recommendations</h3>
                      </div>
                      <span className="text-xs font-semibold text-[color:var(--accent)] bg-[color:var(--accent)]/10 px-3 py-1 rounded-full border border-[color:var(--accent)]/30">
                        Actionable Insights
                      </span>
                    </div>
                    <p className="mt-2.5 text-xs text-[color:var(--muted-foreground)]">
                      Concise, rule-based startup guidance calculated from your budget, business model, and risk profile.
                    </p>

                    <div className="mt-5 grid gap-3.5 md:grid-cols-2">
                      {(activeAnalysis.suggestions || generateStartupSuggestions(form, activeAnalysis)).map((item: any, idx: number) => (
                        <div
                          key={idx}
                          className="group relative rounded-xl border border-white/10 bg-white/[0.02] p-4 backdrop-blur transition-all duration-200 hover:border-white/20 hover:bg-white/[0.04]"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-display text-sm font-semibold text-[color:var(--foreground)]">
                              {item.title}
                            </span>
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${item.priority === "high"
                                ? "border border-red-500/30 bg-red-500/10 text-red-300"
                                : item.priority === "medium"
                                  ? "border border-amber-500/30 bg-amber-500/10 text-amber-300"
                                  : "border border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                                }`}
                            >
                              {item.priority} priority
                            </span>
                          </div>
                          <p className="mt-2 text-xs leading-relaxed text-[color:var(--muted-foreground)] group-hover:text-[color:var(--foreground)]/90">
                            {item.advice}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border border-white/10 bg-[color:var(--card-solid)]/60 px-3.5 py-2.5 text-sm text-[color:var(--foreground)] placeholder:text-[color:var(--muted-foreground)] backdrop-blur transition-all focus:border-[color:var(--accent)]/50 focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]/20 focus:shadow-[0_0_20px_rgba(245,158,11,0.12)]";

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-1.5 font-sans text-xs font-medium text-[color:var(--foreground)]/80">
        <span className="text-[color:var(--accent)]">{icon}</span>
        {label}
      </span>
      {children}
    </label>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <p className="font-sans text-[11px] font-medium text-[color:var(--muted-foreground)]">
        {label}
      </p>
      <p
        className={`mt-0.5 font-display text-lg font-semibold ${accent ? "text-[color:var(--accent)]" : "text-[color:var(--foreground)]"
          }`}
      >
        {value}
      </p>
    </div>
  );
}

function ChartCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  children: React.ReactNode;
}) {
  return (
    <div className="glass-card p-5 flex flex-col justify-between">
      <div className="mb-3 flex items-center gap-2">
        <Icon className="h-4 w-4 text-[color:var(--accent)]" strokeWidth={1.5} />
        <h3 className="font-display text-sm font-semibold tracking-wide text-[color:var(--foreground)]">
          {title}
        </h3>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-white/5 pb-2 last:border-0">
      <dt className="font-sans text-xs font-medium text-[color:var(--muted-foreground)]">
        {label}
      </dt>
      <dd className="max-w-[60%] text-right font-medium text-[color:var(--foreground)]/90">{value}</dd>
    </div>
  );
}

function EmptyAnalysis() {
  return (
    <div className="glass-card flex min-h-[520px] flex-col items-center justify-center gap-4 p-12 text-center">
      <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-[color:var(--accent)]/10 ring-1 ring-[color:var(--accent)]/30">
        <Radar className="h-7 w-7 text-[color:var(--accent)]" strokeWidth={1.5} />
        <span className="absolute inset-0 rounded-2xl shadow-[0_0_40px_rgba(245,158,11,0.3)]" />
      </div>
      <h3 className="font-display text-xl font-semibold">Awaiting your project</h3>
      <p className="max-w-md text-sm text-[color:var(--muted-foreground)]">
        Complete the form on the left and hit{" "}
        <span className="text-[color:var(--foreground)]">Run analysis</span>. Your revenue
        projection, competitor map, and risk breakdown appear here.
      </p>
    </div>
  );
}

const tooltipStyle: React.CSSProperties = {
  background: "rgba(18, 18, 26, 0.95)",
  border: "1px solid rgba(255, 255, 255, 0.15)",
  borderRadius: 8,
  fontSize: 12,
  color: "#FFFFFF",
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
};

const tooltipItemStyle: React.CSSProperties = {
  color: "#FFFFFF",
  fontSize: 12,
};

const tooltipLabelStyle: React.CSSProperties = {
  color: "#F59E0B",
  fontWeight: 600,
  fontSize: 12,
  marginBottom: 4,
};


function CreativeAiRadarLoader({ projectName, industry }: { projectName: string; industry: string }) {
  const [stepIndex, setStepIndex] = useState(0);

  const steps = [
    "Connecting to AI Live Search Grid…",
    `Scanning online competitor signals for ${industry || "the sector"}…`,
    "Evaluating market density & revenue trajectory…",
    "Analyzing capital runway & execution risk vectors…",
    "Synthesizing competitive advantage & market segments…",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % steps.length);
    }, 1200);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="glass-card relative overflow-hidden p-10 text-center flex flex-col items-center justify-center min-h-[500px]">
      {/* Background ambient glow orbs */}
      <div className="ambient-orb -top-12 -left-12 h-64 w-64 bg-amber-500/20" />
      <div className="ambient-orb -bottom-12 -right-12 h-64 w-64 bg-amber-600/15" />

      {/* Radar scanning graphic */}
      <div className="relative flex h-48 w-48 items-center justify-center">
        {/* Pulsing Concentric Rings */}
        <div className="absolute inset-0 rounded-full border border-amber-500/20 animate-pulse-ring" />
        <div className="absolute inset-4 rounded-full border border-amber-500/30" />
        <div className="absolute inset-10 rounded-full border border-amber-500/40" />

        {/* Rotating Radar Beam */}
        <div className="absolute inset-0 rounded-full animate-radar opacity-60 bg-[conic-gradient(from_0deg,transparent_0deg_280deg,rgba(245,158,11,0.5)_360deg)]" />

        {/* Orbiting Icons */}
        <div className="absolute -top-2 right-4 animate-float text-amber-400/80">
          <Globe className="h-5 w-5" />
        </div>
        <div className="absolute bottom-2 left-3 animate-float text-amber-300/80" style={{ animationDelay: "1s" }}>
          <Cpu className="h-5 w-5" />
        </div>
        <div className="absolute top-10 left-1 animate-float text-amber-400/90" style={{ animationDelay: "2s" }}>
          <Search className="h-5 w-5" />
        </div>

        {/* Center AI Core */}
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/15 border border-amber-500/40 shadow-[0_0_30px_rgba(245,158,11,0.35)] backdrop-blur">
          <Sparkles className="h-8 w-8 text-amber-400 animate-pulse" />
        </div>
      </div>

      {/* Title & Live Status */}
      <div className="mt-8 space-y-2">
        <h3 className="font-display text-xl font-semibold tracking-tight text-[color:var(--foreground)]">
          AI Online Intelligence Research
        </h3>
        <p className="font-mono text-xs uppercase tracking-widest text-[color:var(--accent)]">
          Searching market data for {projectName || "your submission"}
        </p>
      </div>

      {/* Live Telemetry Step Message */}
      <div className="mt-6 flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-xs font-medium text-amber-200 backdrop-blur transition-all duration-300">
        <Loader2 className="h-3.5 w-3.5 animate-spin text-amber-400" />
        <span className="animate-pulse">{steps[stepIndex]}</span>
      </div>

      {/* Signal Bar */}
      <div className="mt-8 h-1.5 w-48 overflow-hidden rounded-full bg-white/5">
        <div className="h-full rounded-full bg-gradient-to-r from-amber-500 via-amber-300 to-amber-500 animate-pulse" style={{ width: "70%" }} />
      </div>
    </div>
  );
}

