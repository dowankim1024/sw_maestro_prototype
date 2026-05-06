import type { ChatInsight } from "./types";

const STORAGE_KEY = "trendarena.chat.history.v3";

/**
 * 인사이트 저장 (localStorage).
 * 추후 saveChatInsight() 를 서버 API로 교체 가능.
 *   await fetch("/api/insights", { method: "POST", body: JSON.stringify(insight) });
 */
export function saveChatInsight(insight: ChatInsight): void {
  if (typeof window === "undefined") return;
  const list = loadChatInsights();
  const next = [insight, ...list].slice(0, 50);
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // 용량 초과 등은 무시 (MVP)
  }
}

export function loadChatInsights(): ChatInsight[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ChatInsight[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function clearChatInsights(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

export function deleteChatInsight(id: string): void {
  if (typeof window === "undefined") return;
  const next = loadChatInsights().filter((i) => i.id !== id);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}
