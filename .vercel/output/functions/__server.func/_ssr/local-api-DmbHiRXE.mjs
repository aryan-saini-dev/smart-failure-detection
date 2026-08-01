import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/local-api-DmbHiRXE.js
var API_BASE_URL = "http://localhost:8787";
var supabase = createClient("https://esghdonrtykryjhxlpqz.supabase.co", "sb_publishable_cTQ9MkOQrYnVVN1NxxMFEw_m3SaoKDt");
supabase.auth.onAuthStateChange(() => {
	if (typeof window !== "undefined") window.dispatchEvent(new Event("smart-failure-auth-change"));
});
async function registerUser(input) {
	const { data, error } = await supabase.auth.signUp({
		email: input.email,
		password: input.password,
		options: { data: { name: input.name } }
	});
	if (error) throw new Error(error.message);
	if (!data.user) throw new Error("User creation failed");
	return {
		token: data.session?.access_token ?? "",
		user: {
			id: data.user.id,
			email: data.user.email,
			name: data.user.user_metadata.name || input.name,
			createdAt: data.user.created_at
		}
	};
}
async function loginUser(input) {
	const { data, error } = await supabase.auth.signInWithPassword({
		email: input.email,
		password: input.password
	});
	if (error) throw new Error(error.message);
	if (!data.user) throw new Error("Login failed");
	return {
		token: data.session?.access_token ?? "",
		user: {
			id: data.user.id,
			email: data.user.email,
			name: data.user.user_metadata.name || input.email,
			createdAt: data.user.created_at
		}
	};
}
async function getCurrentUser() {
	const { data: { user }, error } = await supabase.auth.getUser();
	if (error || !user) return { user: null };
	return { user: {
		id: user.id,
		email: user.email,
		name: user.user_metadata.name || user.email,
		createdAt: user.created_at
	} };
}
async function clearSessionToken() {
	await supabase.auth.signOut();
}
async function listProjects() {
	const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
	if (error) throw new Error(error.message);
	return { projects: data };
}
async function getProject(projectId) {
	const { data, error } = await supabase.from("projects").select("*").eq("id", projectId).single();
	if (error) throw new Error(error.message);
	return { project: data };
}
async function createProject(input) {
	const { data: { session } } = await supabase.auth.getSession();
	const token = session?.access_token;
	const response = await fetch(`${API_BASE_URL}/api/projects`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			...token ? { "x-supabase-token": token } : {}
		},
		body: JSON.stringify(input)
	});
	if (!response.ok) {
		const err = await response.json().catch(() => ({ error: "Failed to create project" }));
		throw new Error(err.error || "Failed to create project");
	}
	return response.json();
}
async function analyzeProject(input) {
	const { data: { session } } = await supabase.auth.getSession();
	const token = session?.access_token;
	const response = await fetch(`${API_BASE_URL}/api/analyze`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			...token ? { "x-supabase-token": token } : {}
		},
		body: JSON.stringify(input)
	});
	if (!response.ok) {
		const err = await response.json().catch(() => ({ error: "Analysis failed" }));
		throw new Error(err.error || "Analysis failed");
	}
	return response.json();
}
//#endregion
export { getProject as a, registerUser as c, getCurrentUser as i, clearSessionToken as n, listProjects as o, createProject as r, loginUser as s, analyzeProject as t };
