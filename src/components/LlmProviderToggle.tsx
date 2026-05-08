"use client";

import { useEffect, useState } from "react";
import {
  LLM_PROVIDER_LABELS,
  LLM_PROVIDERS,
  getClientProvider,
  setClientProvider,
  type LlmProvider,
} from "@/lib/llm-client";

/**
 * 헤더에 박는 LLM 프로바이더 토글.
 *  - 즉시 전환 (페이지 새로고침 불필요)
 *  - 다음 LLM 호출부터 선택된 프로바이더로 라우팅
 *  - 미설정 시 서버 환경 변수 LLM_PROVIDER 기본값 사용
 */
export function LlmProviderToggle({
  size = "md",
}: {
  size?: "sm" | "md";
}) {
  const [provider, setProvider] = useState<LlmProvider | undefined>(undefined);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setProvider(getClientProvider());
    setHydrated(true);
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<LlmProvider>).detail;
      setProvider(detail);
    };
    window.addEventListener(
      "issuecast:llm-provider-change",
      handler as EventListener,
    );
    return () =>
      window.removeEventListener(
        "issuecast:llm-provider-change",
        handler as EventListener,
      );
  }, []);

  const onPick = (next: LlmProvider) => {
    setClientProvider(next);
    setProvider(next);
  };

  const padding = size === "sm" ? "px-2 py-1" : "px-2.5 py-1";
  const textSize = size === "sm" ? "text-[10px]" : "text-[11px]";

  return (
    <div
      className={`inline-flex items-center gap-0.5 rounded-xl border border-[var(--border)] bg-white/80 p-0.5 ${textSize}`}
      title="LLM 프로바이더 (즉시 전환)"
    >
      <span className="px-1.5 font-semibold text-[var(--muted)]">LLM</span>
      {LLM_PROVIDERS.map((id) => {
        const active = hydrated && provider === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onPick(id)}
            aria-pressed={active}
            className={`rounded-lg ${padding} font-semibold transition ${
              active
                ? "bg-[var(--foreground)] text-white"
                : "text-[var(--foreground)] hover:bg-[var(--surface)]"
            }`}
          >
            {LLM_PROVIDER_LABELS[id]}
          </button>
        );
      })}
    </div>
  );
}
