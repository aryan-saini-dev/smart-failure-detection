import type { Project } from "@/lib/analysis";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8787";
const SESSION_KEY = "smart-failure-session-token";

export type LocalUser = {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  createdAt: string;
};

export type ProjectRecord = Project & {
  id: string;
  created_at: string;
  user_id: string;
};

type ApiError = {
  error: string;
};

export function getSessionToken() {
  return typeof window === "undefined" ? null : localStorage.getItem(SESSION_KEY);
}

export function setSessionToken(token: string) {
  localStorage.setItem(SESSION_KEY, token);
}

export function clearSessionToken() {
  localStorage.removeItem(SESSION_KEY);
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  headers.set("content-type", "application/json");
  const token = getSessionToken();
  if (token) headers.set("x-session-token", token);

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
  });

  const text = await response.text();
  const payload = text ? (JSON.parse(text) as T | ApiError) : ({} as T);
  if (!response.ok) {
    const error = payload as ApiError;
    throw new Error(error.error || `Request failed with status ${response.status}`);
  }

  return payload as T;
}

export async function registerUser(input: { name: string; email: string; password: string }) {
  return request<{ token: string; user: LocalUser }>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function loginUser(input: { email: string; password: string }) {
  return request<{ token: string; user: LocalUser }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function getCurrentUser() {
  return request<{ user: LocalUser | null }>("/api/auth/me");
}

export async function listProjects() {
  return request<{ projects: ProjectRecord[] }>("/api/projects");
}

export async function getProject(projectId: string) {
  return request<{ project: ProjectRecord | null }>(`/api/projects/${projectId}`);
}

export async function createProject(input: Project) {
  return request<{ project: ProjectRecord }>("/api/projects", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
