import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, ArrowLeft, Building2, CheckCircle2, ChevronDown, Compass, CopyPlus, Cpu, DollarSign, Lightbulb, Radar, ShieldCheck, Sparkles, Target, TrendingUp, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { computeAnalysis, type Project } from "@/lib/analysis";
import { getDemoProject, hasDemoSession } from "@/lib/demo-session";
import { getProject } from "@/lib/local-api";
import { EnhancedSuggestionsView } from "@/components/EnhancedSuggestionsView";

export const Route = createFileRoute("/projects/$projectId")({ component: SavedAnalysisPage });

function SavedAnalysisPage() {
  const { projectId } = Route.useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<"overview" | "competitors" | "risk" | "market" | "suggestions" | "swot" | "feasibility">("overview");
  const analysis = useMemo(() => (project ? computeAnalysis(project) : null), [project]);

  useEffect(() => {
    let active = true;
    const demoProject = hasDemoSession() ? getDemoProject(projectId) : null;
    if (demoProject) {
      setProject(demoProject);
      return () => { active = false; };
    }
    void getProject(projectId).then(({ project: record }) => {
      if (!active) return;
      if (!record) setError("This analysis is unavailable. Sign in with the account that created it.");
      else setProject(record);
    }).catch((queryError) => {
      if (!active) return;
      setError(queryError instanceof Error ? queryError.message : "This analysis is unavailable.");
    });
    return () => { active = false; };
  }, [projectId]);

  if (error) return <main className="mx-auto max-w-3xl px-6 py-16"><Link to="/profile" className="text-sm text-[color:var(--accent)]">Back to profile</Link><div className="glass-card mt-5 p-6 text-sm text-red-300">{error}</div></main>;
  if (!project || !analysis) return <main className="mx-auto max-w-6xl px-6 py-16"><div className="glass-card h-72 animate-pulse" /></main>;

  const tabLabels: Record<string, string> = {
    overview: "Overview",
    risk: "Risk Engine",
    swot: "SWOT Analysis",
    feasibility: "Feasibility",
    competitors: "Competitors",
    market: "Market",
    suggestions: "Suggestions",
  };

  return <main className="mx-auto max-w-6xl px-6 py-12 md:px-8 md:py-16">
    <div className="flex items-center justify-between">
      <Link to="/profile" className="inline-flex items-center gap-2 text-sm text-[color:var(--muted-foreground)] transition-colors hover:text-[color:var(--foreground)]"><ArrowLeft className="h-4 w-4" />Back to history</Link>
      <Link to="/project-input" search={{ name: project.name, industry: project.industry, business_model: project.business_model, target_market: project.target_market, budget: project.budget, description: project.description }} className="inline-flex items-center gap-2 rounded-md bg-white/5 px-3 py-1.5 text-sm font-medium text-[color:var(--foreground)] transition-colors hover:bg-white/10"><CopyPlus className="h-4 w-4" />Duplicate & Edit</Link>
    </div>
    <section className="glass-card mt-5 p-6 md:p-8">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--accent)]">Saved analysis</p>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-4"><div><h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">{project.name}</h1><p className="mt-2 text-sm text-[color:var(--muted-foreground)]">{project.industry} / {project.business_model || "Business model not set"}</p></div><div className="flex gap-5 text-sm"><Metric label="Growth" value={`${analysis.growth}%`} /><Metric label="Risk" value={`${analysis.overallRisk}/100`} /><Metric label="Budget" value={`$${project.budget.toLocaleString()}`} /></div></div>
    </section>
    {/* Mobile Dropdown Select (Visible on Phone < 640px) */}
    <div className="sm:hidden mt-6 w-full glass-card p-1.5 border border-white/10 rounded-xl relative">
      <div className="relative flex items-center">
        <select
          value={tab}
          onChange={(e) => setTab(e.target.value as typeof tab)}
          className="w-full appearance-none rounded-lg bg-[color:var(--accent)]/15 border border-[color:var(--accent)]/30 px-3.5 py-2.5 pr-10 text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]"
        >
          {(["overview", "risk", "swot", "feasibility", "competitors", "market", "suggestions"] as const).map((item) => (
            <option key={item} value={item} className="bg-[color:var(--background-alt)] text-white">
              {tabLabels[item]}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-[color:var(--accent)]" />
      </div>
    </div>

    {/* Desktop Tab Bar (Visible on Screens >= 640px) */}
    <div className="hidden sm:flex mt-6 overflow-x-auto rounded-lg border border-white/10 bg-white/[0.03] p-1">
      {(["overview", "risk", "swot", "feasibility", "competitors", "market", "suggestions"] as const).map((item) => <button key={item} onClick={() => setTab(item)} className={`min-w-max flex-1 rounded-md px-4 py-2 text-sm font-medium capitalize transition-colors ${tab === item ? "bg-[color:var(--accent)]/15 text-[color:var(--foreground)]" : "text-[color:var(--muted-foreground)]"}`}>{tabLabels[item]}</button>)}
    </div>
    {tab === "overview" && <Overview project={project} analysis={analysis} />}
    {tab === "competitors" && <Competitors analysis={analysis} />}
    {tab === "risk" && <Risks analysis={analysis} />}
    {tab === "swot" && analysis.swot && <SwotView swot={analysis.swot} />}
    {tab === "feasibility" && analysis.feasibility && <FeasibilityView feasibility={analysis.feasibility} />}
    {tab === "market" && <Market project={project} analysis={analysis} />}
    {tab === "suggestions" && <div className="mt-6"><EnhancedSuggestionsView analysis={analysis} project={project} /></div>}
  </main>;
}

function Overview({ project, analysis }: { project: Project; analysis: ReturnType<typeof computeAnalysis> }) { return <div className="mt-6 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]"><div className="space-y-5"><div className="glass-card p-6"><h2 className="font-display text-lg font-semibold">Revenue projection</h2><div className="mt-5 space-y-4">{analysis.projections.map((item) => <div key={item.month}><div className="flex justify-between text-sm"><span>{item.month}</span><span className="text-[color:var(--accent)]">${item.revenue.toLocaleString()}</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-white/5"><div className="h-full rounded-full bg-[color:var(--accent)]" style={{ width: `${Math.min(100, (item.revenue / Math.max(...analysis.projections.map((row) => row.revenue))) * 100)}%` }} /></div></div>)}</div></div>{analysis.mlPrediction && <div className="glass-card p-6"><div className="flex items-center justify-between"><h2 className="font-display text-lg font-semibold">Quantitative Verdict (ML Model)</h2><span className={`font-mono text-xs font-semibold px-2 py-0.5 rounded ${analysis.mlPrediction.prediction === 'Success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>{analysis.mlPrediction.prediction}</span></div><div className="mt-4 flex items-center justify-between text-sm"><span className="text-[color:var(--muted-foreground)]">Model Success Confidence</span><span className="font-mono font-bold text-[color:var(--foreground)]">{Math.round(analysis.mlPrediction.successProbability)}%</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-white/5"><div className={`h-full rounded-full ${analysis.mlPrediction.prediction === 'Success' ? 'bg-emerald-500' : 'bg-red-500'}`} style={{ width: `${analysis.mlPrediction.successProbability}%` }} /></div></div>}</div><div className="glass-card p-6"><h2 className="font-display text-lg font-semibold">Project brief</h2><p className="mt-3 text-sm leading-6 text-[color:var(--muted-foreground)]">{project.description}</p><dl className="mt-5 space-y-3 text-sm"><Fact icon={Target} label="Target market" value={project.target_market || "Not specified"} /><Fact icon={DollarSign} label="Budget" value={`$${project.budget.toLocaleString()}`} /><Fact icon={TrendingUp} label="Sector growth" value={`${analysis.growth}% projected`} /></dl></div></div> }
function Competitors({ analysis }: { analysis: ReturnType<typeof computeAnalysis> }) { return <div className="mt-6 grid gap-4 md:grid-cols-2">{analysis.competitors.map((item) => <div key={item.name} className="glass-card p-5"><div className="flex items-center justify-between"><h2 className="font-display text-lg font-semibold">{item.name}</h2><span className="font-mono text-xs text-[color:var(--accent)]">{item.overlap}% overlap</span></div><p className="mt-3 text-sm text-emerald-300/85"><span className="font-mono text-[10px] uppercase tracking-widest">Strength</span><br />{item.strength}</p><p className="mt-3 text-sm text-red-300/85"><span className="font-mono text-[10px] uppercase tracking-widest">Weakness</span><br />{item.weakness}</p></div>)}</div> }

function Risks({ analysis }: { analysis: ReturnType<typeof computeAnalysis> }) { 
  return <div className="mt-6 space-y-3">
    <div className="grid gap-3 md:grid-cols-2">
      {analysis.risks.map((r: any) => {
        const sev = r.severity || (r.score >= 75 ? "critical" : r.score >= 55 ? "high" : r.score >= 35 ? "medium" : "low");
        const sevBadge =
          sev === "critical"
            ? "bg-red-500/20 text-red-300 border-red-500/35"
            : sev === "high"
            ? "bg-amber-500/20 text-amber-300 border-amber-500/35"
            : sev === "medium"
            ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/35"
            : "bg-emerald-500/20 text-emerald-300 border-emerald-500/35";

        return (
          <div key={r.category} className="glass-card p-3.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <AlertTriangle className={`h-3.5 w-3.5 ${r.score > 65 ? "text-red-400" : r.score > 45 ? "text-amber-400" : "text-emerald-400"}`} />
                  <h2 className="font-display text-sm font-semibold">{r.category} Risk</h2>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase border ${sevBadge}`}>
                    {sev}
                  </span>
                  <span className="font-mono text-xs font-semibold text-[color:var(--accent)]">{r.score}/100</span>
                </div>
              </div>
              <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-white/5">
                <div className={`h-full rounded-full ${r.score > 65 ? "bg-red-500" : r.score > 45 ? "bg-[color:var(--accent)]" : "bg-emerald-500"}`} style={{ width: `${r.score}%` }} />
              </div>
              <p className="mt-2.5 text-[11px] text-[color:var(--muted-foreground)] line-clamp-2">{r.note}</p>
            </div>
            {r.mitigation && (
              <div className="mt-2.5 pt-2 border-t border-white/5 text-[10px] text-[color:var(--foreground)]/80 flex items-start gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="leading-tight line-clamp-2">
                  <span className="font-semibold text-emerald-400">Action: </span>
                  {r.mitigation}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  </div>;
}

function SwotView({ swot }: { swot: NonNullable<ReturnType<typeof computeAnalysis>["swot"]> }) {
  const quadrants = [
    { title: "Strengths", items: swot.strengths, accent: "text-emerald-400", badgeCls: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30", bgCls: "bg-emerald-950/10 border-emerald-500/20", icon: CheckCircle2 },
    { title: "Weaknesses", items: swot.weaknesses, accent: "text-rose-400", badgeCls: "bg-rose-500/15 text-rose-300 border-rose-500/30", bgCls: "bg-rose-950/10 border-rose-500/20", icon: AlertTriangle },
    { title: "Opportunities", items: swot.opportunities, accent: "text-sky-400", badgeCls: "bg-sky-500/15 text-sky-300 border-sky-500/30", bgCls: "bg-sky-950/10 border-sky-500/20", icon: Sparkles },
    { title: "Threats", items: swot.threats, accent: "text-amber-400", badgeCls: "bg-amber-500/15 text-amber-300 border-amber-500/30", bgCls: "bg-amber-950/10 border-amber-500/20", icon: Target },
  ];
  return <div className="mt-6 grid gap-3.5 sm:gap-4 grid-cols-1 sm:grid-cols-2 w-full min-w-0 overflow-hidden">
    {quadrants.map((q) => {
      const Icon = q.icon;
      return <div key={q.title} className={`glass-card p-3.5 sm:p-5 border ${q.bgCls} w-full min-w-0 overflow-hidden`}>
        <div className="flex items-center justify-between border-b border-white/10 pb-2.5 sm:pb-3 gap-2 min-w-0">
          <div className="flex items-center gap-2 min-w-0"><Icon className={`h-4 w-4 sm:h-5 sm:w-5 shrink-0 ${q.accent}`} /><h3 className="font-display text-sm sm:text-lg font-semibold truncate">{q.title}</h3></div>
          <span className={`shrink-0 text-[9px] sm:text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full border ${q.badgeCls}`}>{q.items.length} Points</span>
        </div>
        <ul className="mt-3 sm:mt-4 space-y-2.5">
          {q.items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-xs text-[color:var(--foreground)]/90 leading-relaxed min-w-0 w-full">
              <span className={`mt-1 h-1.5 w-1.5 rounded-full shrink-0 ${q.accent.replace("text-", "bg-")}`} />
              <div className="flex-1 min-w-0 break-words">
                <span className="break-words">{item.text}</span>
                {item.category && <span className="ml-2 text-[10px] font-mono uppercase text-[color:var(--muted-foreground)] opacity-75">• {item.category}</span>}
              </div>
            </li>
          ))}
        </ul>
      </div>;
    })}
  </div>;
}

function FeasibilityView({ feasibility }: { feasibility: NonNullable<ReturnType<typeof computeAnalysis>["feasibility"]> }) {
  const pillars = [
    { title: "Technical Feasibility", data: feasibility.technical, icon: Cpu },
    { title: "Financial Feasibility", data: feasibility.financial, icon: DollarSign },
    { title: "Market Feasibility", data: feasibility.market, icon: TrendingUp },
    { title: "Operational Feasibility", data: feasibility.operational, icon: Compass },
  ];
  const gradeColor = feasibility.grade === "A+" || feasibility.grade === "A" ? "text-emerald-400 border-emerald-500/40 bg-emerald-500/10" : feasibility.grade === "B" ? "text-amber-400 border-amber-500/40 bg-amber-500/10" : "text-rose-400 border-rose-500/40 bg-rose-500/10";

  return <div className="mt-6 space-y-3 sm:space-y-4 w-full min-w-0 overflow-hidden">
    <div className="glass-card p-3.5 sm:p-5 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 w-full min-w-0">
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        <div className={`h-12 w-12 sm:h-16 sm:w-16 rounded-xl sm:rounded-2xl border flex items-center justify-center font-display text-xl sm:text-2xl font-bold shrink-0 ${gradeColor}`}>{feasibility.grade}</div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2"><h3 className="font-display text-base sm:text-lg font-semibold">Feasibility Rating</h3><span className="text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full border border-white/15 bg-white/5">{feasibility.status}</span></div>
          <p className="mt-1 text-[11px] sm:text-xs text-[color:var(--muted-foreground)]">Viability score calculated across technical, capital, market & operational pillars.</p>
        </div>
      </div>
      <div className="text-right shrink-0 self-end sm:self-center"><p className="text-[10px] font-mono uppercase text-[color:var(--muted-foreground)]">Overall Score</p><p className="font-display text-xl sm:text-2xl font-bold text-[color:var(--accent)]">{feasibility.overallScore}%</p></div>
    </div>
    <div className="grid gap-3.5 sm:gap-4 grid-cols-1 sm:grid-cols-2 w-full min-w-0">
      {pillars.map((p) => {
        const Icon = p.icon;
        const scoreColor = p.data.score >= 75 ? "bg-emerald-500" : p.data.score >= 50 ? "bg-amber-500" : "bg-rose-500";
        return <div key={p.title} className="glass-card p-3.5 sm:p-5 w-full min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0"><Icon className="h-4 w-4 text-[color:var(--accent)] shrink-0" /><h4 className="font-display text-xs sm:text-sm font-semibold truncate">{p.title}</h4></div>
            <span className="font-mono text-xs font-bold text-[color:var(--foreground)] shrink-0">{p.data.score}/100</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/5 w-full"><div className={`h-full rounded-full ${scoreColor}`} style={{ width: `${p.data.score}%` }} /></div>
          <p className="mt-3 text-xs text-[color:var(--muted-foreground)] leading-relaxed break-words">{p.data.statusNote}</p>
        </div>;
      })}
    </div>
  </div>;
}

function Market({ project, analysis }: { project: Project; analysis: ReturnType<typeof computeAnalysis> }) { return <div className="mt-6 grid gap-5 md:grid-cols-2"><div className="glass-card p-6"><h2 className="font-display text-lg font-semibold">Market segments</h2><div className="mt-5 space-y-4">{analysis.marketSegments.map((item) => <div key={item.name}><div className="flex justify-between text-sm"><span>{item.name}</span><span>{item.value}%</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-white/5"><div className="h-full rounded-full bg-[color:var(--accent)]" style={{ width: `${item.value}%` }} /></div></div>)}</div></div><div className="glass-card p-6"><h2 className="font-display text-lg font-semibold">Positioning</h2><Fact icon={Users} label="Target market" value={project.target_market || "Not specified"} /><Fact icon={Building2} label="Industry" value={project.industry} /><Fact icon={Radar} label="Recommended focus" value={analysis.overallRisk > 60 ? "De-risk demand and unit economics" : "Sharpen the wedge and distribution"} /></div></div> }
function Metric({ label, value }: { label: string; value: string }) { return <div><p className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--muted-foreground)]">{label}</p><p className="mt-1 font-display font-semibold">{value}</p></div> }
function Fact({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string; strokeWidth?: number }>; label: string; value: string }) { return <div className="mt-4 flex gap-3"><Icon className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--accent)]" strokeWidth={1.5} /><div><p className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--muted-foreground)]">{label}</p><p className="mt-1 text-sm text-[color:var(--foreground)]/90">{value}</p></div></div> }

