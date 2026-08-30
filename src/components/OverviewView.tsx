import React from "react";
import {
  AlertTriangle,
  Cpu,
  TrendingUp,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { computeAnalysis, type AnalysisResult, type Project } from "@/lib/analysis";

interface OverviewViewProps {
  analysis: AnalysisResult;
  project?: Project;
}

export function OverviewView({ analysis, project }: OverviewViewProps) {
  const tooltipStyle: React.CSSProperties = {
    backgroundColor: "#0f172a",
    borderColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: "10px",
    color: "#f8fafc",
    fontSize: "11px",
    padding: "8px 12px",
  };

  const mlVerdict = analysis.mlPrediction || {
    prediction: (analysis.overallRisk > 50 ? "Failure" : "Success") as "Failure" | "Success",
    failureProbability: analysis.overallRisk,
    successProbability: Math.max(5, 100 - analysis.overallRisk),
  };
  const isSuccess = mlVerdict.prediction === "Success";
  const successPct = Math.round(mlVerdict.successProbability);
  const failurePct = Math.round(mlVerdict.failureProbability);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 mt-3">
      {/* Bento Tile 1: 6-Month Revenue Projection */}
      <div className="glass-card p-5 border border-white/10 rounded-2xl flex flex-col justify-between">
        <div className="flex items-center gap-2 border-b border-white/10 pb-3 mb-2">
          <TrendingUp className="h-4 w-4 text-[color:var(--accent)]" />
          <h3 className="font-display text-sm font-bold text-white tracking-tight">
            6-Month Revenue Projection
          </h3>
        </div>
        <div className="w-full min-w-0 overflow-hidden h-[210px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={analysis.projections} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" stroke="#71717A" fontSize={11} axisLine={false} tickLine={false} />
              <YAxis stroke="#71717A" fontSize={11} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line
                type="monotone"
                dataKey="revenue"
                name="Revenue ($)"
                stroke="#F59E0B"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "#F59E0B" }}
              />
              <Line
                type="monotone"
                dataKey="cost"
                name="Estimated Cost ($)"
                stroke="#71717A"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bento Tile 2: Risk Profile Breakdown */}
      <div className="glass-card p-5 border border-white/10 rounded-2xl flex flex-col justify-between">
        <div className="flex items-center gap-2 border-b border-white/10 pb-3 mb-2">
          <AlertTriangle className="h-4 w-4 text-amber-400" />
          <h3 className="font-display text-sm font-bold text-white tracking-tight">
            Risk Profile Breakdown
          </h3>
        </div>
        <div className="w-full min-w-0 overflow-hidden h-[210px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={analysis.risks}
              layout="vertical"
              margin={{ top: 5, right: 15, left: 10, bottom: 0 }}
            >
              <CartesianGrid stroke="rgba(255,255,255,0.05)" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} stroke="#71717A" fontSize={11} axisLine={false} tickLine={false} />
              <YAxis
                type="category"
                dataKey="category"
                stroke="#A1A1AA"
                fontSize={11}
                width={85}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="score" name="Risk Score" radius={[0, 6, 6, 0]} barSize={16}>
                {analysis.risks.map((r, i) => (
                  <Cell
                    key={i}
                    fill={r.score > 60 ? "#ef4444" : r.score > 35 ? "#F59E0B" : "#10b981"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bento Tile 3: ML Venture Viability Intelligence Card (Full Width) */}
      <div
        className={`md:col-span-2 glass-card p-5 border rounded-2xl transition-all duration-300 ${
          isSuccess
            ? "border-emerald-500/30 bg-gradient-to-r from-emerald-950/20 via-slate-900/40 to-transparent shadow-[0_0_25px_rgba(16,185,129,0.1)]"
            : "border-red-500/30 bg-gradient-to-r from-red-950/20 via-slate-900/40 to-transparent shadow-[0_0_25px_rgba(239,68,68,0.1)]"
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`p-2.5 rounded-xl border shrink-0 ${
                isSuccess
                  ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                  : "bg-red-500/15 text-red-400 border-red-500/30"
              }`}
            >
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-sm font-bold text-white tracking-tight">
                ML Venture Viability Intelligence
              </h3>
              <p className="text-xs text-slate-400">
                Trained on 48,000+ venture outcomes & real-time capital velocity signals
              </p>
            </div>
          </div>

          <div className="shrink-0 self-start sm:self-center">
            <span
              className={`inline-block rounded-lg px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider border shadow-sm ${
                isSuccess
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/35"
                  : "bg-red-500/20 text-red-300 border-red-500/35"
              }`}
            >
              VERDICT: {isSuccess ? "HIGH VIABILITY / PROCEED" : "ELEVATED FAILURE RISK"}
            </span>
          </div>
        </div>

        {/* Dual Bar Progress Meter */}
        <div className="mt-4 pt-3 border-t border-white/10 space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold">
            <span className="text-emerald-400 font-mono flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              {successPct}% Success Viability
            </span>
            <span className="text-rose-400 font-mono flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
              {failurePct}% Failure Risk
            </span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10 flex">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-700 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
              style={{ width: `${successPct}%` }}
            />
            <div
              className="h-full bg-gradient-to-r from-rose-500 to-red-600 transition-all duration-700 shadow-[0_0_10px_rgba(244,63,94,0.5)]"
              style={{ width: `${failurePct}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
