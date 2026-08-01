import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { d as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { I as ArrowRight, M as ChartLine, c as ShieldAlert, d as Radar } from "../_libs/lucide-react.mjs";
import { t as Aurora } from "./Aurora-BCwBCWC9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-B-rl4v59.js
var import_jsx_runtime = require_jsx_runtime();
var features = [
	{
		icon: ChartLine,
		title: "Revenue projections",
		body: "Rule-based forecasts calibrated against your budget, sector, and target market."
	},
	{
		icon: Radar,
		title: "Competitor radar",
		body: "See who you're up against, where they're strong, and where the seams are open."
	},
	{
		icon: ShieldAlert,
		title: "Risk analysis",
		body: "Signals across market, execution, and capital risk — surfaced before you burn runway."
	}
];
function Index() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "relative min-h-[calc(100vh-64px)] w-full overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "fixed inset-0 z-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Aurora, {
				colorStops: [
					"#F97316",
					"#ffc1ab",
					"#ff5d00"
				],
				blend: .67,
				amplitude: 1,
				speed: 1
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-background/40 backdrop-blur-[2px]" })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "relative z-10 mx-auto max-w-5xl px-6 py-24 md:px-10 md:py-32 lg:py-40 text-center flex flex-col items-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "mt-8 max-w-4xl font-display text-5xl font-medium tracking-tight sm:text-6xl lg:text-7xl leading-tight",
					children: ["A quiet room for ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "italic text-[color:var(--foreground)]",
						children: "loud ideas."
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-8 max-w-2xl text-lg text-[color:var(--muted-foreground)] font-sans font-medium",
					children: "Quantify market friction, competitor overlap, and execution risk before you commit capital. A purely analytical workspace for founders."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-12 flex flex-wrap justify-center gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/project-input",
						className: "group inline-flex items-center gap-2 rounded-full bg-[color:var(--foreground)] px-8 py-3.5 text-sm font-semibold text-[color:var(--background)] transition-all duration-200 hover:scale-105 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]",
						children: ["Evaluate a startup", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
							className: "h-4 w-4 transition-transform group-hover:translate-x-1",
							strokeWidth: 2
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/project-input",
						className: "inline-flex items-center gap-2 rounded-full border border-white/20 bg-transparent px-8 py-3.5 text-sm font-medium text-[color:var(--foreground)] transition-colors hover:bg-white/5 active:scale-[0.98]",
						children: "See how it works"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-24 grid gap-8 md:grid-cols-3 text-left",
					children: features.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-6 transition-all duration-300 border-l border-white/10 hover:border-white/30",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(f.icon, {
								className: "h-5 w-5 text-[color:var(--foreground)] opacity-70",
								strokeWidth: 1.5
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mt-5 font-display text-xl font-medium tracking-wide",
								children: f.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-sm leading-relaxed text-[color:var(--muted-foreground)]",
								children: f.body
							})
						]
					}, f.title))
				})
			]
		})]
	});
}
//#endregion
export { Index as component };
