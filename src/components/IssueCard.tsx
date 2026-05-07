"use client";

import { CHARACTERS } from "@/lib/characters";
import type { Issue } from "@/lib/types";

interface Props {
  issue: Issue;
  onOpen: (issue: Issue) => void;
  seen?: boolean;
  size?: "compact" | "full";
}

/**
 * 홈/피드 카드.
 * 자극적이지 않은 톤. 30초·출처 수·캐릭터 4명 미리보기를 포함한다.
 */
export function IssueCard({ issue, onOpen, seen = false, size = "full" }: Props) {
  return (
    <button
      onClick={() => onOpen(issue)}
      className="group card-surface fade-up flex w-full flex-col gap-3 p-5 text-left transition hover:border-[var(--border-strong)] hover:shadow-[0_8px_28px_-16px_rgba(0,0,0,0.18)]"
    >
      <header className="flex items-start gap-3">
        <span
          aria-hidden
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--background)] text-2xl"
        >
          {issue.coverEmoji}
        </span>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-1.5">
            <span className="snack-30">⏱ 30초</span>
            <span className="rounded-full border border-[var(--border)] bg-[var(--background)] px-2 py-[2px] text-[10px] font-semibold text-[var(--muted)]">
              {issue.category}
            </span>
            {seen && (
              <span className="rounded-full bg-[var(--background)] px-2 py-[2px] text-[10px] text-[var(--muted-2)]">
                다시 보기
              </span>
            )}
          </div>
          <h3 className="truncate text-[16px] font-bold leading-tight text-[var(--foreground)] sm:text-[17px]">
            {issue.shortTitle}
          </h3>
          <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-[var(--muted)]">
            {issue.summary}
          </p>
        </div>
      </header>

      {size === "full" && (
        <div className="flex flex-wrap gap-1 pt-1">
          {issue.keywords.slice(0, 3).map((k) => (
            <span
              key={k}
              className="rounded-full bg-[var(--background)] px-2 py-[2px] text-[11px] text-[var(--muted)]"
            >
              #{k}
            </span>
          ))}
        </div>
      )}

      <footer className="mt-1 flex items-center justify-between border-t border-[var(--border)] pt-3">
        <div className="flex items-center gap-2">
          <CharacterRow />
          <span className="text-[11px] text-[var(--muted)]">
            4명의 시각으로 보기
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-[var(--muted)]">
          <span>출처 {issue.sources.length}건</span>
          <span aria-hidden>·</span>
          <span className="text-[var(--accent)] group-hover:underline">
            바로 보기 →
          </span>
        </div>
      </footer>
    </button>
  );
}

function CharacterRow() {
  return (
    <div className="flex -space-x-2">
      {CHARACTERS.map((c) => (
        <span
          key={c.id}
          aria-hidden
          className={`flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br text-[12px] ring-2 ring-white ${c.gradient}`}
        >
          <span className="rounded-full bg-white/85 px-[3px] py-[1px] text-[10px]">
            {c.emoji}
          </span>
        </span>
      ))}
    </div>
  );
}
