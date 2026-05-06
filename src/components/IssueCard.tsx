"use client";

import {
  formatMention,
  getSentimentColor,
  getSentimentLabel,
} from "@/lib/services";
import type { TrendIssue } from "@/lib/types";

export function IssueCard({
  issue,
  onSelect,
  onStartChat,
  isSelected,
}: {
  issue: TrendIssue;
  onSelect: (issue: TrendIssue) => void;
  onStartChat: (issue: TrendIssue) => void;
  isSelected?: boolean;
}) {
  const growthPositive = issue.growthRate >= 0;
  return (
    <button
      type="button"
      onClick={() => onSelect(issue)}
      className={[
        "fade-up group w-full overflow-hidden rounded-2xl border p-3 text-left transition sm:p-4",
        "bg-[var(--background-card)]/80 backdrop-blur",
        isSelected
          ? "border-[var(--accent)]/60 ring-1 ring-[var(--accent)]/40"
          : "border-[var(--border)] hover:border-white/20 hover:bg-[var(--background-card)]",
      ].join(" ")}
    >
      <div className="flex items-stretch gap-3 sm:gap-4">
        <Thumb issue={issue} />

        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="rounded-md border border-[var(--border)] bg-white/5 px-2 py-0.5 text-[11px] text-[var(--muted)]">
              {issue.category}
            </span>
            <span
              className={[
                "rounded-md border px-2 py-0.5 text-[11px]",
                getSentimentColor(issue.sentiment),
              ].join(" ")}
            >
              {getSentimentLabel(issue.sentiment)}
            </span>
            {issue.audienceAge.map((a) => (
              <span
                key={a}
                className="rounded-md border border-fuchsia-400/30 bg-fuchsia-400/10 px-2 py-0.5 text-[11px] text-fuchsia-200"
              >
                {a}
              </span>
            ))}
          </div>

          <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug text-white sm:text-base">
            {issue.title}
          </h3>
          <p className="line-clamp-1 text-[12px] leading-relaxed text-[var(--muted)]">
            {issue.oneLine}
          </p>

          <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[var(--muted)]">
            <span className="inline-flex items-center gap-1">
              <span>지금</span>
              <span
                className={`font-medium ${growthPositive ? "text-emerald-400" : "text-rose-400"}`}
              >
                {growthPositive ? "▲" : "▼"} {Math.abs(issue.growthRate)}%
              </span>
            </span>
            <span className="inline-flex items-center gap-1">
              <span>언급</span>
              <span className="font-medium text-white/90">
                {formatMention(issue.mentionCount)}
              </span>
            </span>
          </div>
        </div>

        <div className="hidden flex-col items-end justify-between gap-2 sm:flex">
          <span
            className={[
              "font-mono text-2xl font-bold leading-none",
              issue.rank <= 3 ? "text-[var(--accent)]" : "text-white/80",
            ].join(" ")}
          >
            {String(issue.rank).padStart(2, "0")}
          </span>
          <span
            onClick={(e) => {
              e.stopPropagation();
              onStartChat(issue);
            }}
            className="cursor-pointer rounded-lg bg-[var(--accent)] px-3 py-2 text-xs font-semibold text-white shadow-[0_8px_24px_-8px_rgba(255,77,109,0.6)] transition group-hover:translate-y-[-1px] hover:bg-[#ff6680]"
            role="button"
          >
            같이 얘기 →
          </span>
        </div>
      </div>

      <div className="mt-3 flex sm:hidden">
        <span
          onClick={(e) => {
            e.stopPropagation();
            onStartChat(issue);
          }}
          className="w-full cursor-pointer rounded-lg bg-[var(--accent)] py-2 text-center text-sm font-semibold text-white"
          role="button"
        >
          이 주제로 같이 얘기
        </span>
      </div>
    </button>
  );
}

function Thumb({ issue }: { issue: TrendIssue }) {
  return (
    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-white/5 sm:h-28 sm:w-32">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://picsum.photos/seed/${encodeURIComponent(issue.imageSeed)}/320/240`}
        alt=""
        loading="lazy"
        className="h-full w-full object-cover"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"
        aria-hidden
      />
      <div className="absolute left-2 top-2 rounded-md bg-black/50 px-1.5 py-0.5 text-[10px] font-mono font-bold text-white">
        #{issue.rank}
      </div>
      <div className="absolute right-1.5 bottom-1.5 text-2xl drop-shadow-md">
        {issue.coverEmoji}
      </div>
    </div>
  );
}
