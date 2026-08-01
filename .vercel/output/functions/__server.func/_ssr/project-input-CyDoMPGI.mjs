import { i as __toESM } from "../_runtime.mjs";
import { i as getCurrentUser, r as createProject, t as analyzeProject } from "./local-api-DmbHiRXE.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { d as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { a as getRandomDemoProject, i as generateStartupSuggestions, r as formatCurrency, t as CURRENCY_MAP } from "./analysis-CB8tBAVp.mjs";
import { A as ChevronDown, C as Cpu, D as CircleCheck, F as BookmarkCheck, O as ChevronUp, P as Building2, S as Dice5, _ as Lightbulb, a as Target, d as Radar, g as LoaderCircle, i as TrendingUp, j as Check, l as Search, o as Sparkles, r as TriangleAlert, t as Users, u as RotateCcw, v as Globe, x as DollarSign, y as FileText } from "../_libs/lucide-react.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { t as Route } from "./project-input-4tLoP7fa.mjs";
import { t as Aurora } from "./Aurora-BCwBCWC9.mjs";
import { a as XAxis, c as Bar, d as ResponsiveContainer, f as Tooltip, i as YAxis, l as Pie, n as BarChart, o as Line, p as Legend, r as LineChart, s as CartesianGrid, t as PieChart, u as Cell } from "../_libs/recharts+[...].mjs";
import { a as SelectItemIndicator, c as SelectPortal, d as SelectSeparator$1, f as SelectTrigger$1, i as SelectItem$1, l as SelectScrollDownButton$1, m as SelectViewport, n as SelectContent$1, o as SelectItemText, p as SelectValue$1, r as SelectIcon, s as SelectLabel$1, t as Select$1, u as SelectScrollUpButton$1 } from "../_libs/@radix-ui/react-select+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/project-input-CyDoMPGI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Select = Select$1;
var SelectValue = SelectValue$1;
var SelectTrigger = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectTrigger$1, {
	ref,
	className: cn("flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background cursor-pointer data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectIcon, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4 opacity-50" })
	})]
}));
SelectTrigger.displayName = SelectTrigger$1.displayName;
var SelectScrollUpButton = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollUpButton$1, {
	ref,
	className: cn("flex cursor-default items-center justify-center py-1", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "h-4 w-4" })
}));
SelectScrollUpButton.displayName = SelectScrollUpButton$1.displayName;
var SelectScrollDownButton = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollDownButton$1, {
	ref,
	className: cn("flex cursor-default items-center justify-center py-1", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4" })
}));
SelectScrollDownButton.displayName = SelectScrollDownButton$1.displayName;
var SelectContent = import_react.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectPortal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent$1, {
	ref,
	className: cn("relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-select-content-transform-origin)", position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", className),
	position,
	...props,
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollUpButton, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectViewport, {
			className: cn("p-1", position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"),
			children
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollDownButton, {})
	]
}) }));
SelectContent.displayName = SelectContent$1.displayName;
var SelectLabel = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectLabel$1, {
	ref,
	className: cn("px-2 py-1.5 text-sm font-semibold", className),
	...props
}));
SelectLabel.displayName = SelectLabel$1.displayName;
var SelectItem = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem$1, {
	ref,
	className: cn("relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute right-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemIndicator, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }) })
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemText, { children })]
}));
SelectItem.displayName = SelectItem$1.displayName;
var SelectSeparator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectSeparator$1, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-muted", className),
	...props
}));
SelectSeparator.displayName = SelectSeparator$1.displayName;
var INDUSTRIES = [
	"SaaS",
	"Fintech",
	"Healthtech",
	"Edtech",
	"E-commerce",
	"AI",
	"Marketplace",
	"Consumer",
	"Hardware",
	"Cybersecurity",
	"Other"
];
var MODELS = [
	"B2B Subscription",
	"B2C Subscription",
	"Usage-based",
	"Marketplace",
	"Freemium",
	"Enterprise licensing",
	"Transactional",
	"Ads"
];
var empty = {
	name: "",
	industry: "",
	business_model: "",
	target_market: "",
	budget: 0,
	currency: "USD",
	description: ""
};
function ProjectInputPage() {
	const searchParams = Route.useSearch();
	const [form, setForm] = (0, import_react.useState)({
		...empty,
		name: searchParams.name || "",
		industry: searchParams.industry || "",
		business_model: searchParams.business_model || "",
		target_market: searchParams.target_market || "",
		budget: searchParams.budget || 0,
		description: searchParams.description || ""
	});
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const [runningAnalysis, setRunningAnalysis] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [saved, setSaved] = (0, import_react.useState)(null);
	const [currentUser, setCurrentUser] = (0, import_react.useState)(null);
	const [tab, setTab] = (0, import_react.useState)("overview");
	const [liveAnalysis, setLiveAnalysis] = (0, import_react.useState)(null);
	const [analyzedForm, setAnalyzedForm] = (0, import_react.useState)(null);
	const [isAiSearching, setIsAiSearching] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		getCurrentUser().then(({ user }) => setCurrentUser(user));
	}, []);
	const activeAnalysis = saved?.analysis_data || liveAnalysis;
	const activeProjectName = saved?.name || analyzedForm?.name || form.name.trim() || "Live Analysis";
	function update(key, value) {
		setForm((f) => ({
			...f,
			[key]: value
		}));
	}
	function fillDemo() {
		setForm(getRandomDemoProject());
		setError(null);
	}
	function resetForm() {
		setForm(empty);
		setError(null);
		setSaved(null);
		setLiveAnalysis(null);
		setAnalyzedForm(null);
	}
	async function handleRunAnalysis(e) {
		e.preventDefault();
		setError(null);
		if (!form.name.trim() || !form.industry.trim() || !form.description.trim()) {
			setError("Please complete name, industry, and description.");
			return;
		}
		if (form.budget < 0 || Number.isNaN(form.budget)) {
			setError("Budget must be a positive number.");
			return;
		}
		setRunningAnalysis(true);
		setIsAiSearching(true);
		try {
			const { analysis: aiResult } = await analyzeProject(form);
			if (aiResult) {
				setLiveAnalysis(aiResult);
				setAnalyzedForm(form);
			}
		} catch (err) {
			console.warn("Manual AI analysis error:", err);
		} finally {
			setRunningAnalysis(false);
			setIsAiSearching(false);
		}
	}
	async function handleSaveAnalysis(e) {
		e.preventDefault();
		setError(null);
		if (!currentUser) {
			setError("Sign in to save this analysis to your account database.");
			return;
		}
		if (!activeAnalysis) {
			setError("Run an analysis first before saving.");
			return;
		}
		if (!form.name.trim() || !form.industry.trim() || !form.description.trim()) {
			setError("Please complete name, industry, and description.");
			return;
		}
		setSubmitting(true);
		try {
			const { project } = await createProject({
				name: form.name.trim(),
				industry: form.industry.trim(),
				business_model: form.business_model.trim(),
				target_market: form.target_market.trim(),
				budget: form.budget,
				currency: form.currency || "USD",
				description: form.description.trim()
			});
			setSubmitting(false);
			setSaved(project || {
				...form,
				analysis_data: activeAnalysis
			});
		} catch (error) {
			setSubmitting(false);
			setError(error instanceof Error ? error.message : "Unable to save analysis to database.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "relative z-10 mx-auto max-w-[95%] px-6 py-4 md:px-10 md:py-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl",
					children: "Startup Submission"
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-8 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleRunAnalysis,
					className: "glass-card p-6 md:p-7 h-fit sticky top-20",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-xl font-semibold",
								children: "Details"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: fillDemo,
									className: "inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-xs font-medium text-[color:var(--foreground)] transition-colors hover:border-white/25 hover:bg-white/5 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dice5, {
										className: "h-3.5 w-3.5",
										strokeWidth: 1.75
									}), "Fill demo"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: resetForm,
									className: "inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-xs font-medium text-[color:var(--muted-foreground)] transition-colors hover:border-white/25 hover:bg-white/5 hover:text-[color:var(--foreground)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, {
										className: "h-3.5 w-3.5",
										strokeWidth: 1.75
									}), "Reset"]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 space-y-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Startup / Project name",
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, {
										className: "h-3.5 w-3.5",
										strokeWidth: 1.5
									}),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: form.name,
										onChange: (e) => update("name", e.target.value),
										placeholder: "Ember Analytics",
										className: inputCls
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Industry",
										icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radar, {
											className: "h-3.5 w-3.5",
											strokeWidth: 1.5
										}),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: form.industry,
											onValueChange: (val) => update("industry", val),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
												className: inputCls,
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select industry" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, {
												className: "border border-white/10 bg-[#12121a] text-[color:var(--foreground)] z-50",
												children: INDUSTRIES.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: i,
													className: "hover:bg-white/10 cursor-pointer",
													children: i
												}, i))
											})]
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Business model",
										icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, {
											className: "h-3.5 w-3.5",
											strokeWidth: 1.5
										}),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: form.business_model,
											onValueChange: (val) => update("business_model", val),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
												className: inputCls,
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select model" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, {
												className: "border border-white/10 bg-[#12121a] text-[color:var(--foreground)] z-50",
												children: MODELS.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: i,
													className: "hover:bg-white/10 cursor-pointer",
													children: i
												}, i))
											})]
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Target market",
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, {
										className: "h-3.5 w-3.5",
										strokeWidth: 1.5
									}),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: form.target_market,
										onChange: (e) => update("target_market", e.target.value),
										placeholder: "Mid-market RevOps teams in North America",
										className: inputCls
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Budget & Currency",
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DollarSign, {
										className: "h-3.5 w-3.5",
										strokeWidth: 1.5
									}),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-[1fr_auto] gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "number",
											min: 0,
											value: form.budget || "",
											onChange: (e) => update("budget", Number(e.target.value)),
											placeholder: "120000",
											className: inputCls
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: form.currency || "USD",
											onValueChange: (val) => update("currency", val),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
												className: "w-28 rounded-lg border border-white/10 bg-[color:var(--card-solid)]/60 px-3 py-2.5 text-sm text-[color:var(--foreground)] backdrop-blur",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Currency" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, {
												className: "border border-white/10 bg-[#12121a] text-[color:var(--foreground)] z-50",
												children: Object.entries(CURRENCY_MAP).map(([code, meta]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: code,
													className: "hover:bg-white/10 cursor-pointer",
													children: meta.label
												}, code))
											})]
										})]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Project description",
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, {
										className: "h-3.5 w-3.5",
										strokeWidth: 1.5
									}),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										value: form.description,
										onChange: (e) => update("description", e.target.value),
										placeholder: "Describe the product, the wedge, and why now…",
										rows: 4,
										className: `${inputCls} resize-none`
									})
								})
							]
						}),
						error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex items-start gap-2 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
								className: "mt-0.5 h-4 w-4 shrink-0",
								strokeWidth: 1.75
							}), error]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 flex flex-col gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: handleRunAnalysis,
									disabled: runningAnalysis || isAiSearching,
									className: "inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[color:var(--accent)] px-6 py-3 text-sm font-medium text-[color:var(--accent-foreground)] transition-all duration-200 hover:brightness-110 hover:shadow-[0_0_28px_rgba(245,158,11,0.45)] active:scale-[0.98] disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]",
									children: runningAnalysis || isAiSearching ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), " Analyzing market data…"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4" }), " Run analysis"] })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: handleSaveAnalysis,
									disabled: submitting || !currentUser || !activeAnalysis,
									className: "inline-flex w-full items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/[0.05] px-6 py-2.5 text-sm font-medium text-[color:var(--foreground)] transition-all duration-200 hover:border-white/30 hover:bg-white/10 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]",
									children: submitting ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), " Saving to database…"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookmarkCheck, { className: "h-4 w-4 text-emerald-400" }), " Save analysis"] })
								}),
								!currentUser ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-center font-mono text-[10px] text-[color:var(--muted-foreground)]",
									children: "🔒 Sign in to save analyses to database workspace"
								}) : !activeAnalysis ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-center font-mono text-[10px] text-[color:var(--muted-foreground)]",
									children: "⚡ Run an analysis first to enable saving"
								}) : null
							]
						}),
						saved && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex items-center gap-2 text-xs text-emerald-300/80",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, {
								className: "h-3.5 w-3.5",
								strokeWidth: 1.75
							}), "Analysis completed & saved to workspace database"]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", { children: isAiSearching ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreativeAiRadarLoader, {
					projectName: activeProjectName,
					industry: form.industry || saved?.industry || ""
				}) : !activeAnalysis ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyAnalysis, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
							className: "glass-card px-5 py-3.5 flex flex-wrap items-center justify-between gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display text-xl font-semibold tracking-tight",
									children: activeProjectName
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-medium text-amber-300",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3 w-3 text-amber-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Live Market Research Active" })]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-5 text-xs text-[color:var(--muted-foreground)]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
										label: "Growth",
										value: `${activeAnalysis.growth}%`,
										accent: true
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 w-px bg-white/10 hidden sm:block" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
										label: "Risk",
										value: `${activeAnalysis.overallRisk}/100`
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 w-px bg-white/10 hidden sm:block" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
										label: "Budget",
										value: formatCurrency(saved?.budget || analyzedForm?.budget || 0, saved?.currency || analyzedForm?.currency || "USD")
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex gap-1 p-1 glass-card",
							children: [
								{
									id: "overview",
									label: "Revenue & Risk"
								},
								{
									id: "competitors",
									label: "Competitors"
								},
								{
									id: "risk",
									label: "Risk breakdown"
								},
								{
									id: "market",
									label: "Market segments"
								},
								{
									id: "suggestions",
									label: "Suggestions"
								}
							].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setTab(t.id),
								className: `flex-1 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] ${tab === t.id ? "bg-[color:var(--accent)]/15 text-[color:var(--foreground)] shadow-[0_0_20px_rgba(245,158,11,0.15)]" : "text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)]"}`,
								children: t.label
							}, t.id))
						}),
						tab === "overview" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-6 md:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartCard, {
								title: "6-month revenue projection",
								icon: TrendingUp,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
									width: "100%",
									height: 320,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
										data: activeAnalysis.projections,
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, { stroke: "rgba(255,255,255,0.05)" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
												dataKey: "month",
												stroke: "#71717A",
												fontSize: 11
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
												stroke: "#71717A",
												fontSize: 11
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
												contentStyle: tooltipStyle,
												itemStyle: tooltipItemStyle,
												labelStyle: tooltipLabelStyle
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
												type: "monotone",
												dataKey: "revenue",
												stroke: "#F59E0B",
												strokeWidth: 2,
												dot: {
													r: 3,
													fill: "#F59E0B"
												}
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
												type: "monotone",
												dataKey: "cost",
												stroke: "#71717A",
												strokeWidth: 1.5,
												strokeDasharray: "4 4",
												dot: false
											})
										]
									})
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col gap-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartCard, {
									title: "Risk profile",
									icon: TriangleAlert,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
										width: "100%",
										height: 220,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
											data: activeAnalysis.risks,
											layout: "vertical",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, { stroke: "rgba(255,255,255,0.05)" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
													type: "number",
													domain: [0, 100],
													stroke: "#71717A",
													fontSize: 11
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
													type: "category",
													dataKey: "category",
													stroke: "#71717A",
													fontSize: 11,
													width: 90
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
													contentStyle: tooltipStyle,
													itemStyle: tooltipItemStyle,
													labelStyle: tooltipLabelStyle
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
													dataKey: "score",
													radius: [
														0,
														6,
														6,
														0
													],
													children: activeAnalysis.risks.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: r.score > 65 ? "#ef4444" : r.score > 45 ? "#F59E0B" : "#10b981" }, i))
												})
											]
										})
									})
								}), activeAnalysis.mlPrediction && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartCard, {
									title: "Quantitative Verdict",
									icon: Cpu,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-col justify-center",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-end justify-between mb-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-mono text-[10px] uppercase tracking-widest text-[color:var(--muted-foreground)]",
												children: "Model Verdict"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: `font-display text-2xl font-bold leading-none mt-1 ${activeAnalysis.mlPrediction.prediction === "Success" ? "text-emerald-400" : "text-red-400"}`,
												children: activeAnalysis.mlPrediction.prediction
											})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-right",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "font-mono text-[10px] uppercase tracking-widest text-[color:var(--muted-foreground)]",
													children: "Success Probability"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "font-display text-xl font-semibold leading-none mt-1 text-[color:var(--foreground)]",
													children: [Math.round(activeAnalysis.mlPrediction.successProbability), "%"]
												})]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-1.5 w-full overflow-hidden rounded-full bg-white/5",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: `h-full rounded-full transition-all duration-1000 ${activeAnalysis.mlPrediction.prediction === "Success" ? "bg-emerald-500" : "bg-red-500"}`,
												style: { width: `${activeAnalysis.mlPrediction.successProbability}%` }
											})
										})]
									})
								})]
							})]
						}),
						tab === "competitors" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "glass-card p-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-display text-lg font-semibold",
									children: "Competitor landscape"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-sm text-[color:var(--muted-foreground)]",
									children: [
										"Estimated positioning against",
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[color:var(--foreground)]",
											children: form.industry || saved?.industry || "the sector"
										}),
										" ",
										"incumbents."
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-6 divide-y divide-white/5",
									children: activeAnalysis.competitors.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid gap-4 py-4 md:grid-cols-[1fr_2fr_auto] md:items-center",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-display font-semibold",
												children: c.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "mt-1 font-mono text-[10px] uppercase tracking-widest text-[color:var(--muted-foreground)]",
												children: [
													c.marketShare,
													"% market · ",
													c.overlap,
													"% overlap"
												]
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "grid gap-2 text-sm md:grid-cols-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-[10px] font-mono uppercase tracking-widest text-emerald-400/70",
													children: "Strength"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-[color:var(--foreground)]/90",
													children: c.strength
												})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-[10px] font-mono uppercase tracking-widest text-red-400/70",
													children: "Weakness"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-[color:var(--foreground)]/90",
													children: c.weakness
												})] })]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "h-2 w-32 overflow-hidden rounded-full bg-white/5",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "h-full rounded-full bg-gradient-to-r from-[color:var(--accent)] to-amber-300",
													style: { width: `${c.overlap}%` }
												})
											})
										]
									}, c.name))
								})
							]
						}),
						tab === "risk" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid gap-4 md:grid-cols-2",
							children: activeAnalysis.risks.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "glass-card p-6",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-display text-lg font-semibold",
											children: r.category
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: `rounded-md px-2 py-0.5 font-mono text-xs ${r.score > 65 ? "bg-red-500/15 text-red-300" : r.score > 45 ? "bg-amber-500/15 text-amber-300" : "bg-emerald-500/15 text-emerald-300"}`,
											children: [r.score, "/100"]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-4 h-2 overflow-hidden rounded-full bg-white/5",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: `h-full rounded-full ${r.score > 65 ? "bg-red-500" : r.score > 45 ? "bg-[color:var(--accent)]" : "bg-emerald-500"}`,
											style: { width: `${r.score}%` }
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-4 text-sm text-[color:var(--muted-foreground)]",
										children: r.note
									})
								]
							}, r.category))
						}),
						tab === "market" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-6 md:grid-cols-[1fr_1fr]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartCard, {
								title: "Adoption segments",
								icon: Users,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
									width: "100%",
									height: 320,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, {
										margin: {
											top: 10,
											right: 10,
											bottom: 10,
											left: 10
										},
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
												data: activeAnalysis.marketSegments,
												dataKey: "value",
												nameKey: "name",
												cx: "50%",
												cy: "40%",
												innerRadius: 42,
												outerRadius: 72,
												paddingAngle: 4,
												children: activeAnalysis.marketSegments.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: [
													"#F59E0B",
													"#fbbf24",
													"#71717A",
													"#3f3f46"
												][i % 4] }, i))
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
												contentStyle: tooltipStyle,
												itemStyle: tooltipItemStyle,
												labelStyle: tooltipLabelStyle
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {
												verticalAlign: "bottom",
												align: "center",
												wrapperStyle: {
													paddingTop: "16px",
													fontSize: 11,
													color: "#A1A1AA"
												}
											})
										]
									})
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "glass-card p-6",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-display text-lg font-semibold",
										children: "Positioning summary"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-sm text-[color:var(--muted-foreground)]",
										children: form.description || saved?.description || "Startup assessment"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
										className: "mt-5 space-y-3 text-sm",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
												label: "Target market",
												value: form.target_market || saved?.target_market || "—"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
												label: "Model",
												value: form.business_model || saved?.business_model || "—"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
												label: "Industry growth",
												value: `${activeAnalysis.growth}% projected annual`
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
												label: "Recommended focus",
												value: activeAnalysis.overallRisk > 60 ? "De-risk before scaling — validate demand and unit economics" : "Sharpen wedge and accelerate distribution"
											})
										]
									})
								]
							})]
						}),
						tab === "suggestions" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "glass-card p-6",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between border-b border-white/5 pb-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lightbulb, { className: "h-5 w-5 text-[color:var(--accent)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
												className: "font-display text-lg font-semibold",
												children: "Strategic Recommendations"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono text-[10px] uppercase tracking-widest text-[color:var(--accent)] bg-[color:var(--accent)]/10 px-2.5 py-1 rounded-full border border-[color:var(--accent)]/30",
											children: "Actionable Insights"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-3 text-xs text-[color:var(--muted-foreground)]",
										children: "Concise, rule-based startup guidance calculated from your budget, business model, and risk profile."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-6 grid gap-4 md:grid-cols-2",
										children: (activeAnalysis.suggestions || generateStartupSuggestions(form, activeAnalysis)).map((item, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "group relative rounded-xl border border-white/10 bg-white/[0.02] p-4 backdrop-blur transition-all duration-200 hover:border-white/20 hover:bg-white/[0.04]",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-display text-sm font-semibold text-[color:var(--foreground)]",
													children: item.title
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: `rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${item.priority === "high" ? "border border-red-500/30 bg-red-500/10 text-red-300" : item.priority === "medium" ? "border border-amber-500/30 bg-amber-500/10 text-amber-300" : "border border-emerald-500/30 bg-emerald-500/10 text-emerald-300"}`,
													children: [item.priority, " priority"]
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-2 text-xs leading-relaxed text-[color:var(--muted-foreground)] group-hover:text-[color:var(--foreground)]/90",
												children: item.advice
											})]
										}, idx))
									})
								]
							})
						})
					]
				}) })]
			})]
		})]
	});
}
var inputCls = "w-full rounded-lg border border-white/10 bg-[color:var(--card-solid)]/60 px-3.5 py-2.5 text-sm text-[color:var(--foreground)] placeholder:text-[color:var(--muted-foreground)] backdrop-blur transition-all focus:border-[color:var(--accent)]/50 focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]/20 focus:shadow-[0_0_20px_rgba(245,158,11,0.12)]";
function Field({ label, icon, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "mb-1.5 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-[color:var(--muted-foreground)]",
			children: [icon, label]
		}), children]
	});
}
function Stat({ label, value, accent }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: `mt-0.5 font-display text-lg font-semibold ${accent ? "text-[color:var(--accent)]" : ""}`,
		children: value
	})] });
}
function ChartCard({ title, icon: Icon, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "glass-card p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
				className: "h-4 w-4 text-[color:var(--accent)]",
				strokeWidth: 1.5
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-display text-sm font-semibold uppercase tracking-widest text-[color:var(--muted-foreground)]",
				children: title
			})]
		}), children]
	});
}
function Row({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-start justify-between gap-4 border-b border-white/5 pb-2 last:border-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "font-mono text-[10px] uppercase tracking-widest text-[color:var(--muted-foreground)]",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: "max-w-[60%] text-right text-[color:var(--foreground)]/90",
			children: value
		})]
	});
}
function EmptyAnalysis() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "glass-card flex min-h-[520px] flex-col items-center justify-center gap-4 p-12 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex h-16 w-16 items-center justify-center rounded-2xl bg-[color:var(--accent)]/10 ring-1 ring-[color:var(--accent)]/30",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radar, {
					className: "h-7 w-7 text-[color:var(--accent)]",
					strokeWidth: 1.5
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inset-0 rounded-2xl shadow-[0_0_40px_rgba(245,158,11,0.3)]" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-display text-xl font-semibold",
				children: "Awaiting your project"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "max-w-md text-sm text-[color:var(--muted-foreground)]",
				children: [
					"Complete the form on the left and hit",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[color:var(--foreground)]",
						children: "Run analysis"
					}),
					". Your revenue projection, competitor map, and risk breakdown appear here."
				]
			})
		]
	});
}
var tooltipStyle = {
	background: "rgba(18, 18, 26, 0.95)",
	border: "1px solid rgba(255, 255, 255, 0.15)",
	borderRadius: 8,
	fontSize: 12,
	color: "#FFFFFF",
	boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)"
};
var tooltipItemStyle = {
	color: "#FFFFFF",
	fontSize: 12
};
var tooltipLabelStyle = {
	color: "#F59E0B",
	fontWeight: 600,
	fontSize: 12,
	marginBottom: 4
};
function CreativeAiRadarLoader({ projectName, industry }) {
	const [stepIndex, setStepIndex] = (0, import_react.useState)(0);
	const steps = [
		"Connecting to AI Live Search Grid…",
		`Scanning online competitor signals for ${industry || "the sector"}…`,
		"Evaluating market density & revenue trajectory…",
		"Analyzing capital runway & execution risk vectors…",
		"Synthesizing competitive advantage & market segments…"
	];
	(0, import_react.useEffect)(() => {
		const interval = setInterval(() => {
			setStepIndex((prev) => (prev + 1) % steps.length);
		}, 1200);
		return () => clearInterval(interval);
	}, [steps.length]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "glass-card relative overflow-hidden p-10 text-center flex flex-col items-center justify-center min-h-[500px]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "ambient-orb -top-12 -left-12 h-64 w-64 bg-amber-500/20" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "ambient-orb -bottom-12 -right-12 h-64 w-64 bg-amber-600/15" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex h-48 w-48 items-center justify-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 rounded-full border border-amber-500/20 animate-pulse-ring" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-4 rounded-full border border-amber-500/30" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-10 rounded-full border border-amber-500/40" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 rounded-full animate-radar opacity-60 bg-[conic-gradient(from_0deg,transparent_0deg_280deg,rgba(245,158,11,0.5)_360deg)]" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute -top-2 right-4 animate-float text-amber-400/80",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "h-5 w-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute bottom-2 left-3 animate-float text-amber-300/80",
						style: { animationDelay: "1s" },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cpu, { className: "h-5 w-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute top-10 left-1 animate-float text-amber-400/90",
						style: { animationDelay: "2s" },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-5 w-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "relative flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/15 border border-amber-500/40 shadow-[0_0_30px_rgba(245,158,11,0.35)] backdrop-blur",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-8 w-8 text-amber-400 animate-pulse" })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display text-xl font-semibold tracking-tight text-[color:var(--foreground)]",
					children: "AI Online Intelligence Research"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-mono text-xs uppercase tracking-widest text-[color:var(--accent)]",
					children: ["Searching market data for ", projectName || "your submission"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-xs font-medium text-amber-200 backdrop-blur transition-all duration-300",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin text-amber-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "animate-pulse",
					children: steps[stepIndex]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 h-1.5 w-48 overflow-hidden rounded-full bg-white/5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-full rounded-full bg-gradient-to-r from-amber-500 via-amber-300 to-amber-500 animate-pulse",
					style: { width: "70%" }
				})
			})
		]
	});
}
//#endregion
export { ProjectInputPage as component };
