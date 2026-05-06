import type { DebateResult } from "./types";

const STORAGE_KEY = "trendarena.debate.history.v1";

/**
 * 토론 결과 저장 (localStorage 기반).
 * 추후 saveDebateHistory()를 서버 API로 교체할 수 있음.
 *   await fetch("/api/history", { method: "POST", body: JSON.stringify(result) });
 */
export function saveDebateHistory(result: DebateResult): void {
  if (typeof window === "undefined") return;
  const list = loadDebateHistory();
  const next = [result, ...list].slice(0, 50);
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // 용량 초과 등 실패 시 무시 (MVP)
  }
}

export function loadDebateHistory(): DebateResult[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as DebateResult[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function clearDebateHistory(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

export function deleteDebateHistory(id: string): void {
  if (typeof window === "undefined") return;
  const next = loadDebateHistory().filter((r) => r.id !== id);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}
