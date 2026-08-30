import { computeAnalysis, type AnalysisResult, type Project } from "./analysis";

const SESSION_KEY = "smart_failure_live_session_project";
const EVENT_NAME = "smart-failure-session-change";

export function getActiveSessionProject(): Project | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setActiveSessionProject(p: Project): void {
  if (typeof window === "undefined") return;
  try {
    const withAnalysis = p.analysis_data ? p : { ...p, analysis_data: computeAnalysis(p) };
    localStorage.setItem(SESSION_KEY, JSON.stringify(withAnalysis));
    window.dispatchEvent(new Event(EVENT_NAME));
  } catch {
    // silence error
  }
}

export function subscribeSessionChange(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(EVENT_NAME, callback);
  return () => window.removeEventListener(EVENT_NAME, callback);
}
