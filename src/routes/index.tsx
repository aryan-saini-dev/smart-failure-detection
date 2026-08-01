import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, TrendingUp, Target, ShieldCheck } from "lucide-react";
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
    icon: TrendingUp,
    title: "Revenue projections",
    body: "Rule-based forecasts calibrated against your budget, sector, and target market.",
  },
  {
    icon: Target,
    title: "Competitor radar",
    body: "See who you're up against, where they're strong, and where the seams are open.",
  },
  {
    icon: ShieldCheck,
    title: "Risk analysis",
    body: "Signals across market, execution, and capital risk — surfaced before you burn runway.",
  },
];

function Index() {
  return (
    <main className="relative min-h-[calc(100vh-64px)] w-full flex flex-col">
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
      <section className="relative z-10 mx-auto max-w-5xl w-full flex-1 px-6 py-8 sm:py-12 md:py-16 text-center flex flex-col justify-between items-center">
        {/* Hero Top Section */}
        <div className="flex flex-col items-center my-auto">
          {/* Prominent Hero Logo */}
          <div className="relative mb-3 sm:mb-4 flex items-center justify-center">
            <div className="absolute inset-0 -z-10 rounded-full bg-amber-500/15 blur-2xl scale-125" />
            <img
              src="/smart-logo-white.png"
              alt="Smart Failure Detection Logo"
              className="h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 object-contain drop-shadow-[0_0_25px_rgba(245,158,11,0.35)] transition-transform duration-300 hover:scale-105 select-none pointer-events-none"
            />
          </div>

          <h1 className="max-w-4xl font-display text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight leading-tight">
            A quiet room for <span className="italic text-[color:var(--foreground)]">loud ideas.</span>
          </h1>
          <p className="mt-3 sm:mt-4 max-w-2xl text-sm sm:text-base text-[color:var(--muted-foreground)] font-sans font-normal leading-relaxed">
            Quantify market friction, competitor overlap, and execution risk before you commit capital. A purely analytical workspace for founders.
          </p>
          <div className="mt-5 sm:mt-6 flex flex-wrap justify-center gap-3.5">
            <Link
              to="/project-input"
              className="group inline-flex items-center gap-2 rounded-full bg-[color:var(--foreground)] px-7 py-3 text-sm font-semibold text-[color:var(--background)] transition-all duration-200 hover:scale-105 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
            >
              Evaluate a startup
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                strokeWidth={2}
              />
            </Link>
            <Link
              to="/project-input"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-transparent px-7 py-3 text-sm font-medium text-[color:var(--foreground)] transition-colors hover:bg-white/5 active:scale-[0.98]"
            >
              See how it works
            </Link>
          </div>
        </div>

        {/* Feature Columns Bottom Row */}
        <div className="w-full grid gap-0 md:grid-cols-3 text-left">
          {features.map((f) => (
            <div
              key={f.title}
              className="p-3.5 sm:p-4 md:p-5 transition-all duration-300 border-l border-white/10 md:last:border-r md:last:border-white/10 hover:border-white/30"
            >
              <f.icon className="h-4.5 w-4.5 text-[color:var(--foreground)] opacity-75" strokeWidth={1.5} />
              <h3 className="mt-2.5 font-display text-base sm:text-lg font-medium tracking-wide text-[color:var(--foreground)]">
                {f.title}
              </h3>
              <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-[color:var(--muted-foreground)]">
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
