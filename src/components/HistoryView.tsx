"use client";

import { getCharacter } from "@/lib/characters";
import type { ChatInsight } from "@/lib/types";

export function HistoryView({
  insights,
  onOpen,
  onClear,
  onDelete,
}: {
  insights: ChatInsight[];
  onOpen: (i: ChatInsight) => void;
  onClear: () => void;
  onDelete: (id: string) => void;
}) {
  if (insights.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--background-elev)]/50 p-10 text-center text-sm text-[var(--muted)]">
        아직 저장된 대화가 없어요.
        <br className="hidden sm:block" />
        지금 뜨는 이슈로 첫 대화를 가볍게 시작해보세요.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--muted)]">
          최근 {insights.length}건의 대화 (브라우저 localStorage)
        </p>
        <button
          onClick={onClear}
          className="rounded-md border border-[var(--border)] bg-white/5 px-2.5 py-1 text-xs text-[var(--muted)] hover:text-white"
        >
          전체 지우기
        </button>
      </div>
      <ul className="space-y-2">
        {insights.map((i) => {
          const c = getCharacter(i.characterId);
          const headline = i.newlyLearned[0];
          return (
            <li
              key={i.id}
              className="flex flex-wrap items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--background-card)] p-4"
            >
              <div
                className={`grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br text-base ${c.gradient}`}
              >
                {c.emoji}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[11px] text-[var(--muted)]">
                  {new Date(i.createdAt).toLocaleString("ko-KR")} · {c.name}
                </div>
                <div className="mt-0.5 truncate text-sm font-semibold text-white">
                  {i.issueTitle}
                </div>
                {headline && (
                  <div className="mt-1 line-clamp-1 text-[12px] text-white/75">
                    ✨ {headline}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpen(i)}
                  className="rounded-md bg-white/10 px-3 py-1.5 text-xs text-white/90 hover:bg-white/15"
                >
                  다시 펼치기
                </button>
                <button
                  onClick={() => onDelete(i.id)}
                  aria-label="삭제"
                  className="rounded-md border border-[var(--border)] bg-white/5 px-2 py-1.5 text-xs text-[var(--muted)] hover:text-rose-300"
                >
                  삭제
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
