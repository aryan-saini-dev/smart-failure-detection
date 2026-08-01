import { i as __toESM } from "../_runtime.mjs";
import { i as hasDemoSession, r as getDemoProjects } from "./demo-session-DVUviNmp.mjs";
import { i as getCurrentUser, o as listProjects } from "./local-api-DmbHiRXE.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { d as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { I as ArrowRight, N as CalendarDays, T as ClipboardList, f as Plus, o as Sparkles, p as Mail } from "../_libs/lucide-react.mjs";
import { n as AvatarFallback, r as AvatarImage, t as Avatar } from "./avatar-gunzrkKA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile-DXduFqua.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProfilePage() {
	const [profile, setProfile] = (0, import_react.useState)(null);
	const [history, setHistory] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		let active = true;
		async function loadProfile() {
			const { user } = await getCurrentUser();
			if (!active) return;
			if (!user) {
				if (hasDemoSession()) {
					setProfile({
						name: "Demo User",
						email: "demo@smartfailure.local",
						initials: "DU",
						createdAt: (/* @__PURE__ */ new Date()).toISOString(),
						isDemo: true
					});
					setHistory(getDemoProjects());
				}
				setLoading(false);
				return;
			}
			if (user) {
				const email = user.email ?? "";
				const name = user.name || email || "Workspace member";
				const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "SF";
				setProfile({
					name,
					email,
					initials,
					avatarUrl: user.avatarUrl,
					createdAt: user.createdAt
				});
			}
			const { projects } = await listProjects();
			setHistory(projects.slice(0, 8));
			setLoading(false);
		}
		loadProfile();
		return () => {
			active = false;
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-6xl px-6 py-12 md:px-8 md:py-16",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "glass-card overflow-hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative border-b border-white/8 px-6 py-8 md:px-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.18),transparent_42%)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex flex-col gap-6 sm:flex-row sm:items-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Avatar, {
							className: "h-20 w-20 border-2 border-[color:var(--accent)]/40 shadow-[0_0_32px_rgba(245,158,11,0.2)]",
							children: [profile?.avatarUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarImage, {
								src: profile.avatarUrl,
								alt: profile.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
								className: "bg-[color:var(--accent)]/15 font-display text-xl font-semibold text-[color:var(--accent)]",
								children: profile?.initials ?? "SF"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--accent)]",
									children: "Workspace profile"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "mt-2 truncate font-display text-3xl font-semibold tracking-tight sm:text-4xl",
									children: profile?.name ?? "Your profile"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-2 flex items-center gap-2 text-sm text-[color:var(--muted-foreground)]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-3.5 w-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate",
										children: profile?.email || "Sign in to personalise your workspace"
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/project-input",
							className: "inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-lg bg-[color:var(--accent)] px-4 py-2.5 text-sm font-medium text-[color:var(--accent-foreground)] transition-all hover:brightness-110 hover:shadow-[0_0_24px_rgba(245,158,11,0.35)]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), "New analysis"]
						})
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid divide-y divide-white/8 sm:grid-cols-3 sm:divide-x sm:divide-y-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileStat, {
						icon: ClipboardList,
						label: "Saved analyses",
						value: loading ? "..." : String(history.length)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileStat, {
						icon: CalendarDays,
						label: "Member since",
						value: profile?.createdAt ? formatMonth(profile.createdAt) : "Not signed in"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileStat, {
						icon: Sparkles,
						label: "Workspace status",
						value: profile ? "Active" : "Guest",
						accent: true
					})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--accent)]",
					children: "Analysis history"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-2 font-display text-2xl font-semibold tracking-tight",
					children: profile?.isDemo ? "Your demo analyses" : "Your saved analyses"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "max-w-md text-sm text-[color:var(--muted-foreground)]",
					children: profile?.isDemo ? "Demo history is saved in this browser only." : "Your latest saved project assessments."
				})]
			}), !profile && !loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass-card mt-5 flex min-h-48 flex-col items-center justify-center px-6 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
						className: "h-7 w-7 text-[color:var(--accent)]",
						strokeWidth: 1.5
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-3 font-display text-lg font-semibold",
						children: "Make this workspace yours"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 max-w-sm text-sm text-[color:var(--muted-foreground)]",
						children: "Sign in to keep your analyses private and return to them whenever you need."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/login",
						className: "mt-4 inline-flex items-center gap-2 rounded-lg bg-[color:var(--accent)] px-4 py-2 text-sm font-medium text-[color:var(--accent-foreground)]",
						children: ["Sign in ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
					})
				]
			}) : loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 grid gap-3",
				children: [
					1,
					2,
					3
				].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "glass-card h-20 animate-pulse bg-white/[0.03]" }, item))
			}) : error ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass-card mt-5 px-5 py-4 text-sm text-red-300",
				children: ["Could not load history: ", error]
			}) : history.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 overflow-hidden rounded-xl border border-white/8",
				children: history.map((project) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/projects/$projectId",
					params: { projectId: project.id },
					className: "grid gap-3 border-b border-white/8 bg-[color:var(--card)]/60 px-5 py-4 transition-colors last:border-0 hover:bg-white/[0.04] sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "truncate font-display text-base font-semibold",
							children: project.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 truncate text-sm text-[color:var(--muted-foreground)]",
							children: [
								project.industry,
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "px-1 text-white/20",
									children: "/"
								}),
								" ",
								project.business_model || "Model not set"
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-4 sm:block sm:text-right",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-[10px] uppercase tracking-[0.14em] text-[color:var(--accent)]",
							children: formatDate(project.created_at)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-xs text-[color:var(--muted-foreground)]",
							children: [
								"$",
								project.budget.toLocaleString(),
								" budget"
							]
						})]
					})]
				}, project.id))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass-card mt-5 flex min-h-48 flex-col items-center justify-center px-6 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardList, {
						className: "h-7 w-7 text-[color:var(--accent)]",
						strokeWidth: 1.5
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-3 font-display text-lg font-semibold",
						children: "No analyses yet"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 max-w-sm text-sm text-[color:var(--muted-foreground)]",
						children: "Start with a project submission and your saved analysis will appear here."
					})
				]
			})]
		})]
	});
}
function ProfileStat({ icon: Icon, label, value, accent }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-3 px-5 py-4 md:px-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
			className: "h-4 w-4 text-[color:var(--accent)]",
			strokeWidth: 1.5
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-mono text-[10px] uppercase tracking-[0.14em] text-[color:var(--muted-foreground)]",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: `mt-0.5 font-display text-base font-semibold ${accent ? "text-[color:var(--accent)]" : ""}`,
			children: value
		})] })]
	});
}
function formatDate(value) {
	return new Intl.DateTimeFormat("en", {
		day: "numeric",
		month: "short",
		year: "numeric"
	}).format(new Date(value));
}
function formatMonth(value) {
	return new Intl.DateTimeFormat("en", {
		month: "long",
		year: "numeric"
	}).format(new Date(value));
}
//#endregion
export { ProfilePage as component };
