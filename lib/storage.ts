import type { ProjectBrief } from "@/app/types";

const STORAGE_KEY = "planner-brief-v1";

export function saveBrief(brief: ProjectBrief): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(brief));
  } catch {
    // Ignore storage errors
  }
}

export function loadBrief(): ProjectBrief | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ProjectBrief;
  } catch {
    return null;
  }
}

export function clearBrief(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage errors
  }
}
