import { i as __toESM } from "./_runtime.mjs";
import { i as hasDemoSession, n as getDemoProject } from "./_ssr/demo-session-DVUviNmp.mjs";
import { a as getProject } from "./_ssr/local-api-DmbHiRXE.mjs";
import { u as require_react } from "./_libs/@floating-ui/react-dom+[...].mjs";
import { g as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { d as require_jsx_runtime } from "./_libs/@radix-ui/react-avatar+[...].mjs";
import { t as Route } from "./_projectId-D7yZzP-3.mjs";
import { n as computeAnalysis } from "./_ssr/analysis-CB8tBAVp.mjs";
import { L as ArrowLeft, P as Building2, a as Target, d as Radar, i as TrendingUp, t as Users, w as CopyPlus, x as DollarSign } from "./_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_projectId--Em3Uxt2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SavedAnalysisPage() {
	const { projectId } = Route.useParams();
	const [project, setProject] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const [tab, setTab] = (0, import_react.useState)("overview");
	const analysis = (0, import_react.useMemo)(() => project ? computeAnalysis(project) : null, [project]);
	(0, import_react.useEffect)(() => {
		let active = true;
		const demoProject = hasDemoSession() ? getDemoProject(projectId) : null;
		if (demoProject) {
			setProject(demoProject);
			return () => {
				active = false;
			};
		}
		getProject(projectId).then(({ project: record }) => {
			if (!active) return;
			if (!record) setError("This analysis is unavailable. Sign in with the account that created it.");
			else setProject(record);
		}).catch((queryError) => {
			if (!active) return;
			setError(queryError instanceof Error ? queryError.message : "This analysis is unavailable.");
		});
		return () => {
			active = false;
		};
	}, [projectId]);
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-3xl px-6 py-16",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/profile",
			className: "text-sm text-[color:var(--accent)]",
			children: "Back to profile"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "glass-card mt-5 p-6 text-sm text-red-300",
			children: error
		})]
	});
	if (!project || !analysis) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "mx-auto max-w-6xl px-6 py-16",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "glass-card h-72 animate-pulse" })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-6xl px-6 py-12 md:px-8 md:py-16",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/profile",
					className: "inline-flex items-center gap-2 text-sm text-[color:var(--muted-foreground)] transition-colors hover:text-[color:var(--foreground)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), "Back to history"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/project-input",
					search: {
						name: project.name,
						industry: project.industry,
						business_model: project.business_model,
						target_market: project.target_market,
						budget: project.budget,
						description: project.description
					},
					className: "inline-flex items-center gap-2 rounded-md bg-white/5 px-3 py-1.5 text-sm font-medium text-[color:var(--foreground)] transition-colors hover:bg-white/10",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyPlus, { className: "h-4 w-4" }), "Duplicate & Edit"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "glass-card mt-5 p-6 md:p-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--accent)]",
					children: "Saved analysis"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex flex-wrap items-end justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-3xl font-semibold tracking-tight sm:text-4xl",
						children: project.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm text-[color:var(--muted-foreground)]",
						children: [
							project.industry,
							" / ",
							project.business_model || "Business model not set"
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-5 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
								label: "Growth",
								value: `${analysis.growth}%`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
								label: "Risk",
								value: `${analysis.overallRisk}/100`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
								label: "Budget",
								value: `$${project.budget.toLocaleString()}`
							})
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 flex overflow-x-auto rounded-lg border border-white/10 bg-white/[0.03] p-1",
				children: [
					"overview",
					"competitors",
					"risk",
					"market"
				].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setTab(item),
					className: `min-w-max flex-1 rounded-md px-4 py-2 text-sm font-medium capitalize transition-colors ${tab === item ? "bg-[color:var(--accent)]/15 text-[color:var(--foreground)]" : "text-[color:var(--muted-foreground)]"}`,
					children: item === "risk" ? "Risk breakdown" : item
				}, item))
			}),
			tab === "overview" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Overview, {
				project,
				analysis
			}),
			tab === "competitors" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Competitors, { analysis }),
			tab === "risk" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Risks, { analysis }),
			tab === "market" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Market, {
				project,
				analysis
			})
		]
	});
}
function Overview({ project, analysis }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-6 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass-card p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-lg font-semibold",
					children: "Revenue projection"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-5 space-y-4",
					children: analysis.projections.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.month }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-[color:var(--accent)]",
							children: ["$", item.revenue.toLocaleString()]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 h-2 overflow-hidden rounded-full bg-white/5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full rounded-full bg-[color:var(--accent)]",
							style: { width: `${Math.min(100, item.revenue / Math.max(...analysis.projections.map((row) => row.revenue)) * 100)}%` }
						})
					})] }, item.month))
				})]
			}), analysis.mlPrediction && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass-card p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-lg font-semibold",
							children: "Quantitative Verdict (ML Model)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `font-mono text-xs font-semibold px-2 py-0.5 rounded ${analysis.mlPrediction.prediction === "Success" ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`,
							children: analysis.mlPrediction.prediction
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex items-center justify-between text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[color:var(--muted-foreground)]",
							children: "Model Success Confidence"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-mono font-bold text-[color:var(--foreground)]",
							children: [Math.round(analysis.mlPrediction.successProbability), "%"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 h-2 overflow-hidden rounded-full bg-white/5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `h-full rounded-full ${analysis.mlPrediction.prediction === "Success" ? "bg-emerald-500" : "bg-red-500"}`,
							style: { width: `${analysis.mlPrediction.successProbability}%` }
						})
					})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "glass-card p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-lg font-semibold",
					children: "Project brief"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm leading-6 text-[color:var(--muted-foreground)]",
					children: project.description
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "mt-5 space-y-3 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
							icon: Target,
							label: "Target market",
							value: project.target_market || "Not specified"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
							icon: DollarSign,
							label: "Budget",
							value: `$${project.budget.toLocaleString()}`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
							icon: TrendingUp,
							label: "Sector growth",
							value: `${analysis.growth}% projected`
						})
					]
				})
			]
		})]
	});
}
function Competitors({ analysis }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-6 grid gap-4 md:grid-cols-2",
		children: analysis.competitors.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "glass-card p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg font-semibold",
						children: item.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-mono text-xs text-[color:var(--accent)]",
						children: [item.overlap, "% overlap"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 text-sm text-emerald-300/85",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-[10px] uppercase tracking-widest",
							children: "Strength"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						item.strength
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 text-sm text-red-300/85",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-[10px] uppercase tracking-widest",
							children: "Weakness"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						item.weakness
					]
				})
			]
		}, item.name))
	});
}
function Risks({ analysis }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-6 grid gap-4 md:grid-cols-2",
		children: analysis.risks.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "glass-card p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg font-semibold",
						children: item.category
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-mono text-sm text-[color:var(--accent)]",
						children: [item.score, "/100"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 h-2 overflow-hidden rounded-full bg-white/5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `h-full rounded-full ${item.score > 65 ? "bg-red-500" : item.score > 45 ? "bg-[color:var(--accent)]" : "bg-emerald-500"}`,
						style: { width: `${item.score}%` }
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-sm text-[color:var(--muted-foreground)]",
					children: item.note
				})
			]
		}, item.category))
	});
}
function Market({ project, analysis }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-6 grid gap-5 md:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "glass-card p-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-lg font-semibold",
				children: "Market segments"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 space-y-4",
				children: analysis.marketSegments.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-between text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [item.value, "%"] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 h-2 overflow-hidden rounded-full bg-white/5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-full rounded-full bg-[color:var(--accent)]",
						style: { width: `${item.value}%` }
					})
				})] }, item.name))
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "glass-card p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-lg font-semibold",
					children: "Positioning"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
					icon: Users,
					label: "Target market",
					value: project.target_market || "Not specified"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
					icon: Building2,
					label: "Industry",
					value: project.industry
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
					icon: Radar,
					label: "Recommended focus",
					value: analysis.overallRisk > 60 ? "De-risk demand and unit economics" : "Sharpen the wedge and distribution"
				})
			]
		})]
	});
}
function Metric({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "font-mono text-[10px] uppercase tracking-widest text-[color:var(--muted-foreground)]",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mt-1 font-display font-semibold",
		children: value
	})] });
}
function Fact({ icon: Icon, label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-4 flex gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
			className: "mt-0.5 h-4 w-4 shrink-0 text-[color:var(--accent)]",
			strokeWidth: 1.5
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-mono text-[10px] uppercase tracking-widest text-[color:var(--muted-foreground)]",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm text-[color:var(--foreground)]/90",
			children: value
		})] })]
	});
}
//#endregion
export { SavedAnalysisPage as component };
