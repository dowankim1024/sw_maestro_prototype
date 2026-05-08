/**
 * 클라이언트 측 LLM 프로바이더 토글.
 *
 * - 사용자가 헤더 토글로 선택한 프로바이더를 localStorage 에 저장한다.
 * - 모든 LLM 요청 (`/api/chat/reply`, `/api/chat/insight`) 본문에 동봉돼
 *   서버가 해당 프로바이더로 호출하도록 만든다.
 * - 값이 없으면 서버의 `LLM_PROVIDER` 환경 변수가 기본값으로 사용된다.
 */

export type LlmProvider = "gemini" | "upstage";

export const LLM_PROVIDERS: LlmProvider[] = ["gemini", "upstage"];

const STORAGE_KEY = "issuecast.llmProvider.v1";

export function isLlmProvider(v: unknown): v is LlmProvider {
  return v === "gemini" || v === "upstage";
}

export function getClientProvider(): LlmProvider | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return isLlmProvider(raw) ? raw : undefined;
  } catch {
    return undefined;
  }
}

export function setClientProvider(provider: LlmProvider): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, provider);
    window.dispatchEvent(
      new CustomEvent<LlmProvider>("issuecast:llm-provider-change", {
        detail: provider,
      }),
    );
  } catch {
    // ignore
  }
}

export const LLM_PROVIDER_LABELS: Record<LlmProvider, string> = {
  gemini: "Gemini",
  upstage: "Upstage",
};
