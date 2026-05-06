"use client";

import type { DebateResult } from "@/lib/types";

export function HistoryView({
  history,
  onOpen,
  onClear,
  onDelete,
}: {
  history: DebateResult[];
  onOpen: (result: DebateResult) => void;
  onClear: () => void;
  onDelete: (id: string) => void;
}) {
  if (history.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--background-elev)]/50 p-10 text-center text-sm text-[var(--muted)]">
        아직 저장된 토론 기록이 없습니다.
        <br className="hidden sm:block" />
        지금 뜨는 이슈로 첫 토론을 시작해보세요.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--muted)]">
          최근 {history.length}건의 토론 기록 (브라우저 localStorage)
        </p>
        <button
          onClick={onClear}
          className="rounded-md border border-[var(--border)] bg-white/5 px-2.5 py-1 text-xs text-[var(--muted)] hover:text-white"
        >
          전체 지우기
        </button>
      </div>
      <ul className="space-y-2">
        {history.map((r) => {
          const total =
            r.scores.logic +
            r.scores.evidence +
            r.scores.rebuttal +
            r.scores.emotionalControl +
            r.scores.persuasion;
          const verdictColor =
            r.finalVerdict === "사용자 우세"
              ? "text-emerald-300"
              : r.finalVerdict === "AI 우세"
                ? "text-rose-300"
                : "text-amber-300";
          return (
            <li
              key={r.id}
              className="flex flex-wrap items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--background-card)] p-4"
            >
              <div className="min-w-0 flex-1">
                <div className="text-[11px] text-[var(--muted)]">
                  {new Date(r.createdAt).toLocaleString("ko-KR")} · 난이도{" "}
                  {r.difficulty} · {r.totalRounds}라운드
                </div>
                <div className="mt-0.5 truncate text-sm font-semibold text-white">
                  {r.issueTitle}
                </div>
                <div className="mt-1 text-[12px] text-[var(--muted)]">
                  vs <span className="text-white/85">{r.personaName}</span> ·
                  내 입장 {r.userStance} · AI 입장 {r.aiStance}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className={`text-sm font-semibold ${verdictColor}`}>
                    {r.finalVerdict}
                  </div>
                  <div className="font-mono text-xs text-white/70">
                    총점 {total}
                  </div>
                </div>
                <button
                  onClick={() => onOpen(r)}
                  className="rounded-md bg-white/10 px-3 py-1.5 text-xs text-white/90 hover:bg-white/15"
                >
                  다시 보기
                </button>
                <button
                  onClick={() => onDelete(r.id)}
                  aria-label="기록 삭제"
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
