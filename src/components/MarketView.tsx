import React from "react";
import { Users } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { computeAnalysis, type AnalysisResult, type Project } from "@/lib/analysis";

interface MarketViewProps {
  project?: Project;
  analysis: AnalysisResult;
}

export function MarketView({ project, analysis }: MarketViewProps) {
  const p = project || ({} as Project);
  const segments = analysis.marketSegments || [
    { name: "Early Adopters", value: 35 },
    { name: "Mainstream", value: 65 },
  ];

  const COLORS = ["#F59E0B", "#EAB308"];

  const tooltipStyle: React.CSSProperties = {
    backgroundColor: "#0f172a",
    borderColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: "10px",
    color: "#f8fafc",
    fontSize: "11px",
    padding: "8px 12px",
  };

  return (
    <div className="mt-4 grid gap-5 md:grid-cols-2">
      {/* Left Card: Adoption Segments */}
      <div className="glass-card p-6 border border-white/10 rounded-2xl flex flex-col justify-between space-y-4">
        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
          <Users className="h-4 w-4 text-[color:var(--accent)]" />
          <h3 className="font-display text-sm font-bold text-white">Adoption Segments</h3>
        </div>

        <div className="h-[200px] w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={segments}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={78}
                paddingAngle={4}
                dataKey="value"
                nameKey="name"
              >
                {segments.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-center gap-6 text-xs text-slate-300">
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#F59E0B]" /> Early Adopters
          </span>
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#EAB308]" /> Mainstream
          </span>
        </div>
      </div>

      {/* Right Card: Positioning Summary */}
      <div className="glass-card p-6 border border-white/10 rounded-2xl flex flex-col justify-between space-y-4">
        <div>
          <h3 className="font-display text-base font-bold text-white">Positioning Summary</h3>
          <p className="mt-2 text-xs leading-relaxed text-[color:var(--muted-foreground)]">
            {p.description || "No description provided."}
          </p>
        </div>

        <div className="space-y-3 border-t border-white/10 pt-4 text-xs">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <span className="text-[color:var(--muted-foreground)]">Target market</span>
            <span className="font-semibold text-white">{p.target_market || "Not specified"}</span>
          </div>

          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <span className="text-[color:var(--muted-foreground)]">Model</span>
            <span className="font-semibold text-white">{p.business_model || "Enterprise licensing"}</span>
          </div>

          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <span className="text-[color:var(--muted-foreground)]">Industry growth</span>
            <span className="font-semibold text-white">{analysis.growth}% projected annual</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[color:var(--muted-foreground)]">Recommended focus</span>
            <span className="font-semibold text-white">
              {analysis.overallRisk > 60
                ? "De-risk demand and unit economics"
                : "Sharpen wedge and accelerate distribution"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
