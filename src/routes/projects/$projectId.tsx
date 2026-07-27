import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, ArrowLeft, Building2, DollarSign, Radar, Target, TrendingUp, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { computeAnalysis, type Project } from "@/lib/analysis";
import { getDemoProject, hasDemoSession } from "@/lib/demo-session";
import { getProject } from "@/lib/local-api";

export const Route = createFileRoute("/projects/$projectId")({ component: SavedAnalysisPage });

function SavedAnalysisPage() {
  const { projectId } = Route.useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<"overview" | "competitors" | "risk" | "market">("overview");
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

  return <main className="mx-auto max-w-6xl px-6 py-12 md:px-8 md:py-16">
    <Link to="/profile" className="inline-flex items-center gap-2 text-sm text-[color:var(--muted-foreground)] transition-colors hover:text-[color:var(--foreground)]"><ArrowLeft className="h-4 w-4" />Back to history</Link>
    <section className="glass-card mt-5 p-6 md:p-8">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--accent)]">Saved analysis</p>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-4"><div><h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">{project.name}</h1><p className="mt-2 text-sm text-[color:var(--muted-foreground)]">{project.industry} / {project.business_model || "Business model not set"}</p></div><div className="flex gap-5 text-sm"><Metric label="Growth" value={`${analysis.growth}%`} /><Metric label="Risk" value={`${analysis.overallRisk}/100`} /><Metric label="Budget" value={`$${project.budget.toLocaleString()}`} /></div></div>
    </section>
    <div className="mt-6 flex overflow-x-auto rounded-lg border border-white/10 bg-white/[0.03] p-1">
      {(["overview", "competitors", "risk", "market"] as const).map((item) => <button key={item} onClick={() => setTab(item)} className={`min-w-max flex-1 rounded-md px-4 py-2 text-sm font-medium capitalize transition-colors ${tab === item ? "bg-[color:var(--accent)]/15 text-[color:var(--foreground)]" : "text-[color:var(--muted-foreground)]"}`}>{item === "risk" ? "Risk breakdown" : item}</button>)}
    </div>
    {tab === "overview" && <Overview project={project} analysis={analysis} />}
    {tab === "competitors" && <Competitors analysis={analysis} />}
    {tab === "risk" && <Risks analysis={analysis} />}
    {tab === "market" && <Market project={project} analysis={analysis} />}
  </main>;
}

function Overview({ project, analysis }: { project: Project; analysis: ReturnType<typeof computeAnalysis> }) { return <div className="mt-6 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]"><div className="glass-card p-6"><h2 className="font-display text-lg font-semibold">Revenue projection</h2><div className="mt-5 space-y-4">{analysis.projections.map((item) => <div key={item.month}><div className="flex justify-between text-sm"><span>{item.month}</span><span className="text-[color:var(--accent)]">${item.revenue.toLocaleString()}</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-white/5"><div className="h-full rounded-full bg-[color:var(--accent)]" style={{ width: `${Math.min(100, (item.revenue / Math.max(...analysis.projections.map((row) => row.revenue))) * 100)}%` }} /></div></div>)}</div></div><div className="glass-card p-6"><h2 className="font-display text-lg font-semibold">Project brief</h2><p className="mt-3 text-sm leading-6 text-[color:var(--muted-foreground)]">{project.description}</p><dl className="mt-5 space-y-3 text-sm"><Fact icon={Target} label="Target market" value={project.target_market || "Not specified"} /><Fact icon={DollarSign} label="Budget" value={`$${project.budget.toLocaleString()}`} /><Fact icon={TrendingUp} label="Sector growth" value={`${analysis.growth}% projected`} /></dl></div></div> }
function Competitors({ analysis }: { analysis: ReturnType<typeof computeAnalysis> }) { return <div className="mt-6 grid gap-4 md:grid-cols-2">{analysis.competitors.map((item) => <div key={item.name} className="glass-card p-5"><div className="flex items-center justify-between"><h2 className="font-display text-lg font-semibold">{item.name}</h2><span className="font-mono text-xs text-[color:var(--accent)]">{item.overlap}% overlap</span></div><p className="mt-3 text-sm text-emerald-300/85"><span className="font-mono text-[10px] uppercase tracking-widest">Strength</span><br />{item.strength}</p><p className="mt-3 text-sm text-red-300/85"><span className="font-mono text-[10px] uppercase tracking-widest">Weakness</span><br />{item.weakness}</p></div>)}</div> }
function Risks({ analysis }: { analysis: ReturnType<typeof computeAnalysis> }) { return <div className="mt-6 grid gap-4 md:grid-cols-2">{analysis.risks.map((item) => <div key={item.category} className="glass-card p-5"><div className="flex items-center justify-between"><h2 className="font-display text-lg font-semibold">{item.category}</h2><span className="font-mono text-sm text-[color:var(--accent)]">{item.score}/100</span></div><div className="mt-4 h-2 overflow-hidden rounded-full bg-white/5"><div className={`h-full rounded-full ${item.score > 65 ? "bg-red-500" : item.score > 45 ? "bg-[color:var(--accent)]" : "bg-emerald-500"}`} style={{ width: `${item.score}%` }} /></div><p className="mt-4 text-sm text-[color:var(--muted-foreground)]">{item.note}</p></div>)}</div> }
function Market({ project, analysis }: { project: Project; analysis: ReturnType<typeof computeAnalysis> }) { return <div className="mt-6 grid gap-5 md:grid-cols-2"><div className="glass-card p-6"><h2 className="font-display text-lg font-semibold">Market segments</h2><div className="mt-5 space-y-4">{analysis.marketSegments.map((item) => <div key={item.name}><div className="flex justify-between text-sm"><span>{item.name}</span><span>{item.value}%</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-white/5"><div className="h-full rounded-full bg-[color:var(--accent)]" style={{ width: `${item.value}%` }} /></div></div>)}</div></div><div className="glass-card p-6"><h2 className="font-display text-lg font-semibold">Positioning</h2><Fact icon={Users} label="Target market" value={project.target_market || "Not specified"} /><Fact icon={Building2} label="Industry" value={project.industry} /><Fact icon={Radar} label="Recommended focus" value={analysis.overallRisk > 60 ? "De-risk demand and unit economics" : "Sharpen the wedge and distribution"} /></div></div> }
function Metric({ label, value }: { label: string; value: string }) { return <div><p className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--muted-foreground)]">{label}</p><p className="mt-1 font-display font-semibold">{value}</p></div> }
function Fact({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string; strokeWidth?: number }>; label: string; value: string }) { return <div className="mt-4 flex gap-3"><Icon className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--accent)]" strokeWidth={1.5} /><div><p className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--muted-foreground)]">{label}</p><p className="mt-1 text-sm text-[color:var(--foreground)]/90">{value}</p></div></div> }
