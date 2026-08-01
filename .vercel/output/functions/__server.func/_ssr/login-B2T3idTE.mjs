import { i as __toESM } from "../_runtime.mjs";
import { a as startDemoSession } from "./demo-session-DVUviNmp.mjs";
import { c as registerUser, n as clearSessionToken, s as loginUser } from "./local-api-DmbHiRXE.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { d as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { I as ArrowRight, b as Eye, h as LockKeyhole, n as UserRound, o as Sparkles, p as Mail } from "../_libs/lucide-react.mjs";
import { t as Logo } from "./logo-Cg2hbyy3.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-B2T3idTE.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LoginPage() {
	const navigate = useNavigate();
	const [mode, setMode] = (0, import_react.useState)("sign-in");
	const [name, setName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)(null);
	const [notice, setNotice] = (0, import_react.useState)(null);
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	async function submit(event) {
		event.preventDefault();
		setError(null);
		setNotice(null);
		setSubmitting(true);
		try {
			clearSessionToken();
			mode === "sign-in" ? await loginUser({
				email,
				password
			}) : await registerUser({
				name: name.trim(),
				email,
				password
			});
			setSubmitting(false);
			navigate({ to: "/profile" });
			return;
		} catch (error) {
			setSubmitting(false);
			setError(error instanceof Error ? error.message : "Something went wrong.");
			return;
		}
	}
	function joinDemo() {
		setError(null);
		setNotice(null);
		startDemoSession();
		navigate({ to: "/project-input" });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-10 px-6 py-12 md:grid-cols-[1.1fr_0.9fr] md:px-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, { size: "lg" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "max-w-xl font-display text-4xl font-semibold tracking-tight sm:text-5xl",
				children: "Keep every decision within reach."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-5 max-w-lg text-base text-[color:var(--muted-foreground)]",
				children: "Sign in to keep a private history of your project analyses, risks, market signals, and next moves."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 space-y-4 text-sm text-[color:var(--muted-foreground)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Feature, {
						icon: UserRound,
						text: "A personal workspace for every account"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Feature, {
						icon: Eye,
						text: "Reopen completed analyses anytime"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Feature, {
						icon: LockKeyhole,
						text: "History protected by a local session token"
					})
				]
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "glass-card p-6 sm:p-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex rounded-lg border border-white/10 bg-white/[0.03] p-1",
					children: ["sign-in", "sign-up"].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							setMode(item);
							setError(null);
							setNotice(null);
						},
						className: `flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${mode === item ? "bg-[color:var(--accent)] text-[color:var(--accent-foreground)]" : "text-[color:var(--muted-foreground)]"}`,
						children: item === "sign-in" ? "Sign in" : "Create account"
					}, item))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-6 space-y-4",
					onSubmit: (event) => void submit(event),
					children: [
						mode === "sign-up" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthField, {
							label: "Your name",
							icon: UserRound,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: name,
								onChange: (event) => setName(event.target.value),
								required: true,
								className: inputClass,
								placeholder: "Your name"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthField, {
							label: "Email",
							icon: Mail,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: email,
								onChange: (event) => setEmail(event.target.value),
								required: true,
								type: "email",
								className: inputClass,
								placeholder: "you@example.com"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthField, {
							label: "Password",
							icon: LockKeyhole,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: password,
								onChange: (event) => setPassword(event.target.value),
								required: true,
								minLength: 6,
								type: "password",
								className: inputClass,
								placeholder: "At least 6 characters"
							})
						}),
						error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300",
							children: error
						}),
						notice && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200",
							children: notice
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							disabled: submitting,
							className: "inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[color:var(--accent)] px-4 py-3 text-sm font-medium text-[color:var(--accent-foreground)] transition-all hover:brightness-110 disabled:opacity-60",
							children: [submitting ? "Please wait..." : mode === "sign-in" ? "Sign in" : "Create account", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "my-6 flex items-center gap-3 text-xs text-[color:var(--muted-foreground)] before:h-px before:flex-1 before:bg-white/10 after:h-px after:flex-1 after:bg-white/10",
					children: "or"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					disabled: submitting,
					onClick: joinDemo,
					className: "inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[color:var(--accent)]/40 bg-[color:var(--accent)]/10 px-4 py-3 text-sm font-medium text-[color:var(--accent)] transition-colors hover:bg-[color:var(--accent)]/15 disabled:opacity-60",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4" }), "Join as demo guest"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-4 text-center text-xs text-[color:var(--muted-foreground)]",
					children: ["A demo guest keeps history in this browser session. ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "text-[color:var(--accent)] hover:underline",
						children: "Back to overview"
					})]
				})
			]
		})]
	});
}
var inputClass = "w-full rounded-lg border border-white/10 bg-[color:var(--card-solid)]/60 px-3.5 py-2.5 text-sm text-[color:var(--foreground)] outline-none transition focus:border-[color:var(--accent)]/50 focus:ring-2 focus:ring-[color:var(--accent)]/20";
function AuthField({ label, icon: Icon, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "mb-1.5 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-[color:var(--muted-foreground)]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-3.5 w-3.5" }), label]
		}), children]
	});
}
function Feature({ icon: Icon, text }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "flex h-8 w-8 items-center justify-center rounded-md bg-[color:var(--accent)]/10",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
				className: "h-4 w-4 text-[color:var(--accent)]",
				strokeWidth: 1.5
			})
		}), text]
	});
}
//#endregion
export { LoginPage as component };
