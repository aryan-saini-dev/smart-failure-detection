import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
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
  Building2,
  CheckCircle2,
  DollarSign,
  Dice5,
  FileText,
  Loader2,
  Radar,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { computeAnalysis, randomDemo, type Project } from "@/lib/analysis";

export const Route = createFileRoute("/project-input")({
  head: () => ({
    meta: [
      { title: "Project Input — Nocturne" },
      {
        name: "description",
        content:
          "Submit your startup details for an instant market, competitor, and risk analysis.",
      },
      { property: "og:title", content: "Project Input — Nocturne" },
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
  description: "",
};

function ProjectInputPage() {
  const [form, setForm] = useState<FormState>(empty);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<Project | null>(null);
  const [tab, setTab] = useState<"overview" | "competitors" | "risk" | "market">(
    "overview",
  );

  const analysis = useMemo(() => (saved ? computeAnalysis(saved) : null), [saved]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function fillDemo() {
    setForm(randomDemo());
    setError(null);
  }

  async function submit(e: React.FormEvent) {
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
    setSubmitting(true);
    const { error: err } = await supabase.from("projects").insert({
      name: form.name.trim(),
      industry: form.industry.trim(),
      business_model: form.business_model.trim(),
      target_market: form.target_market.trim(),
      budget: form.budget,
      description: form.description.trim(),
    });
    setSubmitting(false);
    if (err) {
      setError(err.message);
      return;
    }
    setSaved({ ...form });
    setTab("overview");
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-12 md:px-10 md:py-16">
      <div className="mb-10">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[color:var(--accent)]">
          Project input
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          Project Submission
        </h1>
        <p className="mt-3 max-w-2xl text-[color:var(--muted-foreground)]">
          Tell Nocturne about your startup. The moment you submit, a fresh
          market and competitor analysis appears on the right.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        {/* FORM */}
        <form onSubmit={submit} className="glass-card p-6 md:p-7 h-fit sticky top-24">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-xl font-semibold">Details</h2>
            <button
              type="button"
              onClick={fillDemo}
              className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-[color:var(--foreground)] transition-colors hover:border-white/25 hover:bg-white/5 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
            >
              <Dice5 className="h-3.5 w-3.5" strokeWidth={1.75} />
              Fill demo
            </button>
          </div>

          <div className="mt-6 space-y-5">
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

            <div className="grid grid-cols-2 gap-4">
              <Field
                label="Industry"
                icon={<Radar className="h-3.5 w-3.5" strokeWidth={1.5} />}
              >
                <input
                  list="industry-list"
                  value={form.industry}
                  onChange={(e) => update("industry", e.target.value)}
                  placeholder="SaaS"
                  className={inputCls}
                />
                <datalist id="industry-list">
                  {INDUSTRIES.map((i) => (
                    <option key={i} value={i} />
                  ))}
                </datalist>
              </Field>
              <Field
                label="Business model"
                icon={<Target className="h-3.5 w-3.5" strokeWidth={1.5} />}
              >
                <input
                  list="model-list"
                  value={form.business_model}
                  onChange={(e) => update("business_model", e.target.value)}
                  placeholder="B2B Subscription"
                  className={inputCls}
                />
                <datalist id="model-list">
                  {MODELS.map((i) => (
                    <option key={i} value={i} />
                  ))}
                </datalist>
              </Field>
            </div>

            <Field
              label="Target market"
              icon={<Users className="h-3.5 w-3.5" strokeWidth={1.5} />}
            >
              <input
                value={form.target_market}
                onChange={(e) => update("target_market", e.target.value)}
                placeholder="Mid-market RevOps teams in North America"
                className={inputCls}
              />
            </Field>

            <Field
              label="Budget (USD)"
              icon={<DollarSign className="h-3.5 w-3.5" strokeWidth={1.5} />}
            >
              <input
                type="number"
                min={0}
                value={form.budget || ""}
                onChange={(e) => update("budget", Number(e.target.value))}
                placeholder="120000"
                className={inputCls}
              />
            </Field>

            <Field
              label="Project description"
              icon={<FileText className="h-3.5 w-3.5" strokeWidth={1.5} />}
            >
              <textarea
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                placeholder="Describe the product, the wedge, and why now…"
                rows={4}
                className={`${inputCls} resize-none`}
              />
            </Field>
          </div>

          {error && (
            <div className="mt-4 flex items-start gap-2 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.75} />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[color:var(--accent)] px-6 py-3 text-sm font-medium text-[color:var(--accent-foreground)] transition-all duration-200 hover:brightness-110 hover:shadow-[0_0_28px_rgba(245,158,11,0.45)] active:scale-[0.98] disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--background)]"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Saving…
              </>
            ) : (
              <>
                Run analysis <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
              </>
            )}
          </button>

          {saved && (
            <div className="mt-4 flex items-center gap-2 text-xs text-emerald-300/80">
              <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={1.75} />
              Saved to your workspace
            </div>
          )}
        </form>

        {/* ANALYSIS */}
        <section>
          {!saved || !analysis ? (
            <EmptyAnalysis />
          ) : (
            <div className="space-y-6">
              <header className="glass-card p-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--accent)]">
                  Market & competitor analysis
                </p>
                <div className="mt-3 flex flex-wrap items-baseline justify-between gap-4">
                  <h2 className="font-display text-2xl font-semibold">{saved.name}</h2>
                  <div className="flex flex-wrap gap-4 text-xs text-[color:var(--muted-foreground)]">
                    <Stat label="Sector growth" value={`${analysis.growth}%`} accent />
                    <Stat
                      label="Overall risk"
                      value={`${analysis.overallRisk}/100`}
                    />
                    <Stat
                      label="Budget"
                      value={`$${saved.budget.toLocaleString()}`}
                    />
                  </div>
                </div>
              </header>

              <div className="flex gap-1 rounded-lg border border-white/10 bg-white/[0.03] p-1">
                {(
                  [
                    { id: "overview", label: "Revenue & Risk" },
                    { id: "competitors", label: "Competitors" },
                    { id: "risk", label: "Risk breakdown" },
                    { id: "market", label: "Market segments" },
                  ] as const
                ).map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] ${
                      tab === t.id
                        ? "bg-[color:var(--accent)]/15 text-[color:var(--foreground)] shadow-[0_0_20px_rgba(245,158,11,0.15)]"
                        : "text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)]"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {tab === "overview" && (
                <div className="grid gap-6 md:grid-cols-2">
                  <ChartCard title="6-month revenue projection" icon={TrendingUp}>
                    <ResponsiveContainer width="100%" height={260}>
                      <LineChart data={analysis.projections}>
                        <CartesianGrid stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="month" stroke="#71717A" fontSize={11} />
                        <YAxis stroke="#71717A" fontSize={11} />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Line
                          type="monotone"
                          dataKey="revenue"
                          stroke="#F59E0B"
                          strokeWidth={2}
                          dot={{ r: 3, fill: "#F59E0B" }}
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

                  <ChartCard title="Risk profile" icon={AlertTriangle}>
                    <ResponsiveContainer width="100%" height={260}>
                      <BarChart data={analysis.risks} layout="vertical">
                        <CartesianGrid stroke="rgba(255,255,255,0.05)" />
                        <XAxis
                          type="number"
                          domain={[0, 100]}
                          stroke="#71717A"
                          fontSize={11}
                        />
                        <YAxis
                          type="category"
                          dataKey="category"
                          stroke="#71717A"
                          fontSize={11}
                          width={90}
                        />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Bar dataKey="score" radius={[0, 6, 6, 0]}>
                          {analysis.risks.map((r, i) => (
                            <Cell
                              key={i}
                              fill={
                                r.score > 65
                                  ? "#ef4444"
                                  : r.score > 45
                                    ? "#F59E0B"
                                    : "#10b981"
                              }
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartCard>
                </div>
              )}

              {tab === "competitors" && (
                <div className="glass-card p-6">
                  <h3 className="font-display text-lg font-semibold">
                    Competitor landscape
                  </h3>
                  <p className="mt-1 text-sm text-[color:var(--muted-foreground)]">
                    Estimated positioning against{" "}
                    <span className="text-[color:var(--foreground)]">
                      {saved.industry || "the sector"}
                    </span>{" "}
                    incumbents.
                  </p>
                  <div className="mt-6 divide-y divide-white/5">
                    {analysis.competitors.map((c) => (
                      <div
                        key={c.name}
                        className="grid gap-4 py-4 md:grid-cols-[1fr_2fr_auto] md:items-center"
                      >
                        <div>
                          <p className="font-display font-semibold">{c.name}</p>
                          <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-[color:var(--muted-foreground)]">
                            {c.marketShare}% market · {c.overlap}% overlap
                          </p>
                        </div>
                        <div className="grid gap-2 text-sm md:grid-cols-2">
                          <div>
                            <p className="text-[10px] font-mono uppercase tracking-widest text-emerald-400/70">
                              Strength
                            </p>
                            <p className="text-[color:var(--foreground)]/90">
                              {c.strength}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] font-mono uppercase tracking-widest text-red-400/70">
                              Weakness
                            </p>
                            <p className="text-[color:var(--foreground)]/90">
                              {c.weakness}
                            </p>
                          </div>
                        </div>
                        <div className="h-2 w-32 overflow-hidden rounded-full bg-white/5">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[color:var(--accent)] to-amber-300"
                            style={{ width: `${c.overlap}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {tab === "risk" && (
                <div className="grid gap-4 md:grid-cols-2">
                  {analysis.risks.map((r) => (
                    <div key={r.category} className="glass-card p-6">
                      <div className="flex items-center justify-between">
                        <p className="font-display text-lg font-semibold">
                          {r.category}
                        </p>
                        <span
                          className={`rounded-md px-2 py-0.5 font-mono text-xs ${
                            r.score > 65
                              ? "bg-red-500/15 text-red-300"
                              : r.score > 45
                                ? "bg-amber-500/15 text-amber-300"
                                : "bg-emerald-500/15 text-emerald-300"
                          }`}
                        >
                          {r.score}/100
                        </span>
                      </div>
                      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/5">
                        <div
                          className={`h-full rounded-full ${
                            r.score > 65
                              ? "bg-red-500"
                              : r.score > 45
                                ? "bg-[color:var(--accent)]"
                                : "bg-emerald-500"
                          }`}
                          style={{ width: `${r.score}%` }}
                        />
                      </div>
                      <p className="mt-4 text-sm text-[color:var(--muted-foreground)]">
                        {r.note}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {tab === "market" && (
                <div className="grid gap-6 md:grid-cols-[1fr_1fr]">
                  <ChartCard title="Adoption segments" icon={Users}>
                    <ResponsiveContainer width="100%" height={280}>
                      <PieChart>
                        <Pie
                          data={analysis.marketSegments}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={3}
                        >
                          {analysis.marketSegments.map((_, i) => (
                            <Cell
                              key={i}
                              fill={
                                ["#F59E0B", "#fbbf24", "#71717A", "#3f3f46"][i]
                              }
                            />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={tooltipStyle} />
                        <Legend
                          wrapperStyle={{ fontSize: 12, color: "#71717A" }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartCard>
                  <div className="glass-card p-6">
                    <h3 className="font-display text-lg font-semibold">
                      Positioning summary
                    </h3>
                    <p className="mt-2 text-sm text-[color:var(--muted-foreground)]">
                      {saved.description}
                    </p>
                    <dl className="mt-5 space-y-3 text-sm">
                      <Row label="Target market" value={saved.target_market || "—"} />
                      <Row label="Model" value={saved.business_model || "—"} />
                      <Row
                        label="Industry growth"
                        value={`${analysis.growth}% projected annual`}
                      />
                      <Row
                        label="Recommended focus"
                        value={
                          analysis.overallRisk > 60
                            ? "De-risk before scaling — validate demand and unit economics"
                            : "Sharpen wedge and accelerate distribution"
                        }
                      />
                    </dl>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
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
      <span className="mb-1.5 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-[color:var(--muted-foreground)]">
        {icon}
        {label}
      </span>
      {children}
    </label>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">
        {label}
      </p>
      <p
        className={`mt-0.5 font-display text-lg font-semibold ${
          accent ? "text-[color:var(--accent)]" : ""
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
    <div className="glass-card p-6">
      <div className="mb-4 flex items-center gap-2">
        <Icon className="h-4 w-4 text-[color:var(--accent)]" strokeWidth={1.5} />
        <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-[color:var(--muted-foreground)]">
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-white/5 pb-2 last:border-0">
      <dt className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--muted-foreground)]">
        {label}
      </dt>
      <dd className="max-w-[60%] text-right text-[color:var(--foreground)]/90">
        {value}
      </dd>
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
        Complete the form on the left and hit <span className="text-[color:var(--foreground)]">Run analysis</span>. Your revenue projection, competitor map, and risk breakdown appear here.
      </p>
    </div>
  );
}

const tooltipStyle: React.CSSProperties = {
  background: "rgba(26, 26, 36, 0.95)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 8,
  fontSize: 12,
  color: "#FAFAFA",
};
