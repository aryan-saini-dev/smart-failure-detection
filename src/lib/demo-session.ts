import type { Project } from "@/lib/analysis";

const demoUserKey = "smart-failure-demo-user";
const demoProjectsKey = "smart-failure-demo-projects";

export type DemoProject = Project & { id: string; created_at: string };

export function startDemoSession() {
  localStorage.setItem(demoUserKey, "true");
  window.dispatchEvent(new Event("smart-failure-demo-change"));
}

export function hasDemoSession() {
  return typeof window !== "undefined" && localStorage.getItem(demoUserKey) === "true";
}

export function clearDemoSession() {
  localStorage.removeItem(demoUserKey);
  localStorage.removeItem(demoProjectsKey);
  window.dispatchEvent(new Event("smart-failure-demo-change"));
}

export function getDemoProjects(): DemoProject[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(demoProjectsKey) ?? "[]") as DemoProject[];
  } catch {
    return [];
  }
}

export function saveDemoProject(project: Project): DemoProject {
  const saved = { ...project, id: createDemoId(), created_at: new Date().toISOString() };
  localStorage.setItem(demoProjectsKey, JSON.stringify([saved, ...getDemoProjects()]));
  return saved;
}

export function getDemoProject(id: string) {
  return getDemoProjects().find((project) => project.id === id) ?? null;
}

function createDemoId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `demo-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
