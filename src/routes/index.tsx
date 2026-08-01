import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, LineChart, Radar, ShieldAlert } from "lucide-react";
import Aurora from "@/components/Aurora";

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
    <main className="relative min-h-[calc(100vh-64px)] w-full overflow-hidden">
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

      {/* Main Content */}
      <section className="relative z-10 mx-auto max-w-5xl px-6 py-24 md:px-10 md:py-32 lg:py-40 text-center flex flex-col items-center">
        <h1 className="mt-8 max-w-4xl font-display text-5xl font-medium tracking-tight sm:text-6xl lg:text-7xl leading-tight">
          A quiet room for <span className="italic text-[color:var(--foreground)]">loud ideas.</span>
        </h1>
        <p className="mt-8 max-w-2xl text-lg text-[color:var(--muted-foreground)] font-sans font-medium">
          Quantify market friction, competitor overlap, and execution risk before you commit capital. A purely analytical workspace for founders.
        </p>
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <Link
            to="/project-input"
            className="group inline-flex items-center gap-2 rounded-full bg-[color:var(--foreground)] px-8 py-3.5 text-sm font-semibold text-[color:var(--background)] transition-all duration-200 hover:scale-105 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
          >
            Evaluate a startup
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              strokeWidth={2}
            />
          </Link>
          <Link
            to="/project-input"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-transparent px-8 py-3.5 text-sm font-medium text-[color:var(--foreground)] transition-colors hover:bg-white/5 active:scale-[0.98]"
          >
            See how it works
          </Link>
        </div>

        <div className="mt-24 grid gap-8 md:grid-cols-3 text-left">
          {features.map((f) => (
            <div
              key={f.title}
              className="p-6 transition-all duration-300 border-l border-white/10 hover:border-white/30"
            >
              <f.icon className="h-5 w-5 text-[color:var(--foreground)] opacity-70" strokeWidth={1.5} />
              <h3 className="mt-5 font-display text-xl font-medium tracking-wide">{f.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[color:var(--muted-foreground)]">{f.body}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
