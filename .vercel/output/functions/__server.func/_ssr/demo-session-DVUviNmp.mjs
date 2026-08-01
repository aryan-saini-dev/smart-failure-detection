//#region node_modules/.nitro/vite/services/ssr/assets/demo-session-DVUviNmp.js
var demoUserKey = "smart-failure-demo-user";
var demoProjectsKey = "smart-failure-demo-projects";
function startDemoSession() {
	localStorage.setItem(demoUserKey, "true");
	window.dispatchEvent(new Event("smart-failure-demo-change"));
}
function hasDemoSession() {
	return typeof window !== "undefined" && localStorage.getItem(demoUserKey) === "true";
}
function clearDemoSession() {
	localStorage.removeItem(demoUserKey);
	localStorage.removeItem(demoProjectsKey);
	window.dispatchEvent(new Event("smart-failure-demo-change"));
}
function getDemoProjects() {
	if (typeof window === "undefined") return [];
	try {
		return JSON.parse(localStorage.getItem(demoProjectsKey) ?? "[]");
	} catch {
		return [];
	}
}
function getDemoProject(id) {
	return getDemoProjects().find((project) => project.id === id) ?? null;
}
//#endregion
export { startDemoSession as a, hasDemoSession as i, getDemoProject as n, getDemoProjects as r, clearDemoSession as t };
