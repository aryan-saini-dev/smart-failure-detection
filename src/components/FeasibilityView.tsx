import React from "react";
import { Compass, Cpu, DollarSign, Lightbulb, TrendingUp } from "lucide-react";
import { computeAnalysis, type AnalysisResult } from "@/lib/analysis";

interface FeasibilityViewProps {
  feasibility?: NonNullable<ReturnType<typeof computeAnalysis>["feasibility"]>;
  analysis?: AnalysisResult;
}

export function FeasibilityView({ feasibility, analysis }: FeasibilityViewProps) {
  const f = feasibility || analysis?.feasibility || {
    grade: "B",
    status: "Feasible with Conditions",
    overallScore: 64,
    technical: { score: 75, level: "High", statusNote: "Standard technology stack; minimal risk of technical barriers." },
    financial: { score: 81, level: "High", statusNote: "Budget allocation covers projected launch and initial runway comfortably." },
    market: { score: 40, level: "Medium", statusNote: "18% sector growth provides a favorable adoption backdrop." },
    operational: { score: 44, level: "Medium", statusNote: "Operational complexity is manageable given standard Subscription workflows." },
  };

  const pillars = [
    { title: "Technical Feasibility", data: f.technical, icon: Cpu },
    { title: "Financial Feasibility", data: f.financial, icon: DollarSign },
    { title: "Market Feasibility", data: f.market, icon: TrendingUp },
    { title: "Operational Feasibility", data: f.operational, icon: Compass },
  ];

  return (
    <div className="mt-4 space-y-4 w-full min-w-0">
      {/* Top Card: Overall Feasibility Rating */}
      <div className="glass-card p-5 border border-white/10 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-full border border-amber-500/40 bg-amber-500/10 text-amber-400 font-display text-2xl font-bold flex items-center justify-center shrink-0">
            {f.grade}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-display text-base font-bold text-white">Project Feasibility Rating</h3>
              <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full border border-white/15 bg-white/5 text-slate-300">
                {f.status}
              </span>
            </div>
            <p className="mt-1 text-xs text-[color:var(--muted-foreground)]">
              Multi-dimensional viability score across technical, capital, market & operational pillars.
            </p>
          </div>
        </div>
        <div className="text-right shrink-0 self-end sm:self-center">
          <p className="text-[10px] font-mono uppercase tracking-wider text-[color:var(--muted-foreground)]">
            OVERALL INDEX
          </p>
          <p className="font-display text-2xl font-bold text-[color:var(--accent)]">{f.overallScore}%</p>
        </div>
      </div>

      {/* 2x2 Grid of 4 Pillars */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        {pillars.map((p) => {
          const Icon = p.icon;
          const isHigh = p.data.score >= 60;
          const scoreColor = isHigh ? "bg-emerald-500" : "bg-rose-500";
          return (
            <div key={p.title} className="glass-card p-5 border border-white/10 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-[color:var(--accent)]" />
                  <h4 className="font-display text-xs font-bold text-white">{p.title}</h4>
                </div>
                <span className="font-mono text-xs font-bold text-white">{p.data.score}/100</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div className={`h-full rounded-full ${scoreColor}`} style={{ width: `${p.data.score}%` }} />
              </div>
              <p className="text-xs text-[color:var(--muted-foreground)] leading-relaxed">{p.data.statusNote}</p>
            </div>
          );
        })}
      </div>

      {/* Bottom Guidance Card */}
      <div className="glass-card p-5 border border-white/10 rounded-2xl space-y-3">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-amber-400" />
          <h3 className="font-display text-xs font-bold text-white">Key Strategic Feasibility Guidance</h3>
        </div>
        <ul className="space-y-1.5 text-xs text-slate-300">
          <li className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0" />
            <span>Strong financial backing secures initial product runway.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0" />
            <span>Refine target customer persona to build a defensible niche.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0" />
            <span>Favorable technical feasibility enables fast time-to-market.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
