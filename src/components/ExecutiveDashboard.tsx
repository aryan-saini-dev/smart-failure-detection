import React from "react";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  Cpu,
  DollarSign,
  Download,
  Lightbulb,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  generateExecutiveDashboardData,
  type AnalysisResult,
  type Project,
} from "@/lib/analysis";
import { exportAnalysisToPdf } from "@/lib/pdf-export";

interface ExecutiveDashboardProps {
  analysis: AnalysisResult;
  project?: Project;
  onTabSelect?: (tab: string) => void;
}

export function ExecutiveDashboard({
  analysis,
  project,
  onTabSelect,
}: ExecutiveDashboardProps) {
  const dashData =
    analysis.executiveDashboard ||
    generateExecutiveDashboardData(project || ({} as Project), analysis);

  const tooltipStyle: React.CSSProperties = {
    backgroundColor: "#09090b",
    borderColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: "14px",
    color: "#f8fafc",
    fontSize: "12px",
    padding: "10px 14px",
    boxShadow: "0 20px 30px -10px rgba(0, 0, 0, 0.8)",
  };

  const chartData = (dashData.riskTrend || []).map((pt, idx) => {
    const projRevenue = analysis.projections?.[idx]?.revenue || (idx + 1) * 15000;
    return {
      month: pt.month,
      riskScore: pt.riskScore,
      projectedRevenue: Math.round(projRevenue / 1000), // in $k
    };
  });

  return (
    <div className="mt-4 w-full space-y-5">
      {/* ================= HERO STATS BAR (4 METRIC CARDS) ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Overall Risk */}
        <div className="group relative overflow-hidden rounded-2xl border border-red-500/30 bg-gradient-to-br from-red-950/30 via-black/40 to-black/60 p-5 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-red-500/50 hover:shadow-[0_0_30px_rgba(239,68,68,0.2)]">
          <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-red-500/10 blur-xl group-hover:bg-red-500/20 transition-all" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Overall Risk Index
            </span>
            <div className="p-1.5 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="font-display text-3xl font-extrabold tracking-tight text-red-400">
              {dashData.overallRisk}%
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-red-500/40 bg-red-500/20 px-2.5 py-0.5 font-mono text-xs font-bold text-red-300 select-none">
              <ArrowUpRight className="h-3.5 w-3.5" />+{dashData.overallRiskChange}%
            </span>
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-red-600 to-rose-500"
              style={{ width: `${dashData.overallRisk}%` }}
            />
          </div>
        </div>

        {/* Metric 2: Success Probability */}
        <div className="group relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-950/30 via-black/40 to-black/60 p-5 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-amber-500/50 hover:shadow-[0_0_30px_rgba(245,158,11,0.2)]">
          <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-amber-500/10 blur-xl group-hover:bg-amber-500/20 transition-all" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Success Confidence
            </span>
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="font-display text-3xl font-extrabold tracking-tight text-amber-400">
              {dashData.successProb}%
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/40 bg-amber-500/20 px-2.5 py-0.5 font-mono text-xs font-bold text-amber-300 select-none">
              <ArrowDownRight className="h-3.5 w-3.5" />
              {dashData.successProbChange}%
            </span>
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-400"
              style={{ width: `${dashData.successProb}%` }}
            />
          </div>
        </div>

        {/* Metric 3: Market Risk */}
        <div className="group relative overflow-hidden rounded-2xl border border-rose-500/30 bg-gradient-to-br from-rose-950/30 via-black/40 to-black/60 p-5 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-rose-500/50 hover:shadow-[0_0_30px_rgba(244,63,94,0.2)]">
          <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-rose-500/10 blur-xl group-hover:bg-rose-500/20 transition-all" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Market Vulnerability
            </span>
            <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <Target className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="font-display text-3xl font-extrabold tracking-tight text-rose-400">
              {dashData.marketRisk}%
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/40 bg-rose-500/20 px-2.5 py-0.5 font-mono text-xs font-bold text-rose-300 select-none">
              <ArrowUpRight className="h-3.5 w-3.5" />+{dashData.marketRiskChange}%
            </span>
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-rose-600 to-pink-500"
              style={{ width: `${dashData.marketRisk}%` }}
            />
          </div>
        </div>

        {/* Metric 4: Technical Risk */}
        <div className="group relative overflow-hidden rounded-2xl border border-sky-500/30 bg-gradient-to-br from-sky-950/30 via-black/40 to-black/60 p-5 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-sky-500/50 hover:shadow-[0_0_30px_rgba(56,189,248,0.2)]">
          <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-sky-500/10 blur-xl group-hover:bg-sky-500/20 transition-all" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Technical Readiness
            </span>
            <div className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/30">
              <Cpu className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="font-display text-3xl font-extrabold tracking-tight text-sky-400">
              {dashData.techRisk}%
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-500/20 px-2.5 py-0.5 font-mono text-xs font-bold text-emerald-300 select-none">
              <ArrowDownRight className="h-3.5 w-3.5" />
              {dashData.techRiskChange}%
            </span>
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sky-500 to-cyan-400"
              style={{ width: `${dashData.techRisk}%` }}
            />
          </div>
        </div>
      </div>

      {/* ================= MAIN BENTO GRID MODULES ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 items-stretch">

        {/* BENTO TILE 1: Dual Risk vs Growth Trajectory Chart (Span 8) */}
        <div className="lg:col-span-8 group relative rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-white/20 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/30">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-display text-base font-bold tracking-tight text-white">
                  6-Month Risk & Growth Trajectory
                </h2>
                <p className="text-xs text-slate-400">Comparing risk evolution index against projected revenue growth</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs font-medium">
              <span className="flex items-center gap-1.5 text-red-400">
                <span className="h-2 w-2 rounded-full bg-red-500" /> Risk Index
              </span>
              <span className="flex items-center gap-1.5 text-sky-400">
                <span className="h-2 w-2 rounded-full bg-sky-400" /> Revenue ($k)
              </span>
            </div>
          </div>

          <div className="h-[210px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="heroRiskGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="heroRevGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} axisLine={false} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area
                  type="monotone"
                  dataKey="riskScore"
                  name="Risk Score"
                  stroke="#ef4444"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#heroRiskGradient)"
                  dot={{ r: 4, fill: "#ef4444" }}
                />
                <Area
                  type="monotone"
                  dataKey="projectedRevenue"
                  name="Projected Revenue ($k)"
                  stroke="#38bdf8"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  fillOpacity={1}
                  fill="url(#heroRevGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* BENTO TILE 2: Key Findings (Span 4) */}
        <div className="lg:col-span-4 group relative rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-white/20 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="font-display text-base font-bold tracking-tight text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-400" /> Executive Verdict
            </h3>
            <span className="rounded-full border border-amber-500/30 bg-amber-500/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-300">
              High Priority
            </span>
          </div>

          <ul className="space-y-3 text-xs text-slate-300 leading-relaxed flex-1">
            {dashData.keyFindings.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="mt-1.5 h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.8)] shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* BENTO TILE 3: Risk Assessment Summary (Span 4) */}
        <div className="lg:col-span-4 group relative rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-white/20 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="font-display text-base font-bold tracking-tight text-white flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-blue-400" /> Risk Assessment Summary
            </h3>
            <span className="rounded-full border border-blue-500/30 bg-blue-500/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-300">
              Medium Priority
            </span>
          </div>

          <div className="space-y-3 text-xs text-slate-300 leading-relaxed flex-1">
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
              <strong className="text-white block mb-1">Market Risk ({dashData.marketRisk}%)</strong>
              <p>{dashData.riskAssessmentSummary.market.replace(/^Market Risk \(\d+%\):\s*/, "")}</p>
            </div>
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
              <strong className="text-white block mb-1">Financial Risk ({dashData.overallRisk}%)</strong>
              <p>{dashData.riskAssessmentSummary.financial.replace(/^Financial Risk \(\d+%\):\s*/, "")}</p>
            </div>
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
              <strong className="text-white block mb-1">Technical Risk ({dashData.techRisk}%)</strong>
              <p>{dashData.riskAssessmentSummary.technical.replace(/^Technical Risk \(\d+%\):\s*/, "")}</p>
            </div>
          </div>
        </div>

        {/* BENTO TILE 4: Recommendations Roadmap (Span 4) */}
        <div className="lg:col-span-4 group relative rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-white/20 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="font-display text-base font-bold tracking-tight text-white flex items-center gap-2">
              <Target className="h-4 w-4 text-red-400" /> Strategic Recommendations
            </h3>
            <span className="rounded-full border border-red-500/30 bg-red-500/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-300">
              Action Required
            </span>
          </div>

          <ol className="space-y-2.5 text-xs text-slate-300 leading-relaxed flex-1">
            {dashData.recommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-2.5">
                <span className="h-5 w-5 rounded-full bg-red-500/30 text-red-300 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 shadow-sm">
                  {idx + 1}
                </span>
                <span>{rec.replace(/^\d+\.\s*/, "")}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* BENTO TILE 5: Funding Strategy & Tech Advantage (Span 4) */}
        <div className="lg:col-span-4 group relative rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-white/20 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="font-display text-base font-bold tracking-tight text-white flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-amber-400" /> Capital & Tech Insights
            </h3>
            <span className="rounded-full border border-sky-500/30 bg-sky-500/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-sky-300">
              Impact Strategy
            </span>
          </div>

          <div className="space-y-3.5 flex-1">
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white">{dashData.fundingStrategy.title}</h4>
                <span className="text-[9px] font-bold text-red-400 uppercase">{dashData.fundingStrategy.impact}</span>
              </div>
              <p className="text-xs text-slate-400">{dashData.fundingStrategy.description}</p>
              {onTabSelect && (
                <button
                  type="button"
                  onClick={() => onTabSelect(dashData.fundingStrategy.actionTab)}
                  className="inline-flex items-center text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors pt-1"
                >
                  {dashData.fundingStrategy.actionText}
                </button>
              )}
            </div>

            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white">{dashData.technicalAdvantage.title}</h4>
                <span className="text-[9px] font-bold text-amber-400 uppercase">{dashData.technicalAdvantage.impact}</span>
              </div>
              <p className="text-xs text-slate-400">{dashData.technicalAdvantage.description}</p>
              {onTabSelect && (
                <button
                  type="button"
                  onClick={() => onTabSelect(dashData.technicalAdvantage.actionTab)}
                  className="inline-flex items-center text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors pt-1"
                >
                  {dashData.technicalAdvantage.actionText}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* BENTO TILE 6: Recommended Next Steps Banner (Span 12 - Full Width) */}
        <div className="lg:col-span-12 group relative rounded-2xl border border-sky-500/30 bg-gradient-to-r from-sky-950/30 via-slate-900/50 to-indigo-950/30 p-6 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-sky-500/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="font-display text-base font-bold text-sky-300 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-sky-400" /> Recommended Action Roadmap
            </h3>
            <p className="text-xs text-slate-300 max-w-xl">
              Execute these high-priority milestones to systematically reduce overall failure risk index.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
            {dashData.recommendedNextSteps.map((step, idx) => (
              <div key={idx} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3 backdrop-blur">
                <div className="h-6 w-6 rounded-full bg-sky-500 text-white flex items-center justify-center text-xs font-extrabold shrink-0 shadow-md">
                  {idx + 1}
                </div>
                <span className="text-xs font-semibold text-white leading-tight">{step}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
