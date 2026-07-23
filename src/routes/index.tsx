import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, LineChart, Radar, ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Smart Failure Detection" },
      {
        name: "description",
        content: "Review a project and get a clear view of market, competitor, and execution risk.",
      },
      {
        property: "og:title",
        content: "Smart Failure Detection",
      },
      {
        property: "og:description",
        content: "Review a project and get a clear view of market, competitor, and execution risk.",
      },
    ],
  }),
  component: Index,
});

const features = [
  {
    icon: LineChart,
    title: "Revenue projections",
    body: "Rule-based forecasts calibrated against your budget, sector, and target market.",
  },
  {
    icon: Radar,
    title: "Competitor radar",
    body: "See who you're up against, where they're strong, and where the seams are open.",
  },
  {
    icon: ShieldAlert,
    title: "Risk analysis",
    body: "Signals across market, execution, and capital risk — surfaced before you burn runway.",
  },
];

function Index() {
  return (
    <main className="relative">
      <section className="mx-auto max-w-6xl px-6 py-24 md:px-10 md:py-32 lg:py-40">
        <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--accent)]/30 bg-[color:var(--accent)]/10 px-3 py-1 text-xs font-mono uppercase tracking-[0.18em] text-[color:var(--accent)] shadow-[0_0_24px_rgba(245,158,11,0.18)]">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[color:var(--accent)] opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[color:var(--accent)]" />
          </span>
          Workspace overview
        </div>
        <h1 className="mt-8 max-w-3xl font-display text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
          A quiet room for loud ideas.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-[color:var(--muted-foreground)]">
          Add your project details to generate a market read, competitor map, and risk breakdown in
          a single workspace.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            to="/project-input"
            className="group inline-flex items-center gap-2 rounded-lg bg-[color:var(--accent)] px-6 py-3 text-sm font-medium text-[color:var(--accent-foreground)] transition-all duration-200 hover:brightness-110 hover:shadow-[0_0_28px_rgba(245,158,11,0.45)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--background)]"
          >
            Start a new analysis
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              strokeWidth={1.75}
            />
          </Link>
          <Link
            to="/project-input"
            className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-transparent px-6 py-3 text-sm font-medium text-[color:var(--foreground)] transition-colors hover:border-white/30 hover:bg-white/5 active:scale-[0.98]"
          >
            See how it works
          </Link>
        </div>

        <div className="mt-20 grid gap-6 md:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="glass-card p-6 transition-all duration-300 hover:border-white/15 hover:scale-[1.02]"
            >
              <f.icon className="h-5 w-5 text-[color:var(--accent)]" strokeWidth={1.5} />
              <h3 className="mt-4 font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-[color:var(--muted-foreground)]">{f.body}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
