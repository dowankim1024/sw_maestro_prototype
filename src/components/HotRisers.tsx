"use client";

import type { TrendIssue } from "@/lib/types";

export function HotRisers({
  issues,
  onSelect,
  onStartChat,
}: {
  issues: TrendIssue[];
  onSelect: (issue: TrendIssue) => void;
  onStartChat: (issue: TrendIssue) => void;
}) {
  if (issues.length === 0) return null;

  return (
    <section className="space-y-3">
      <div className="flex items-baseline justify-between">
        <div className="flex items-baseline gap-2">
          <span className="rounded-md bg-gradient-to-r from-rose-500 to-amber-400 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white">
            🔥 HOT
          </span>
          <h2 className="text-base font-semibold text-white sm:text-lg">
            급상승 이슈
          </h2>
          <p className="text-[11px] text-[var(--muted)]">
            지금 가장 빠르게 떠오르는 주제
          </p>
        </div>
      </div>

      <div className="-mx-4 overflow-x-auto pb-1 sm:-mx-6 lg:-mx-8">
        <div className="flex w-max gap-3 px-4 sm:px-6 lg:px-8">
          {issues.map((issue, idx) => (
            <RiserCard
              key={issue.id}
              issue={issue}
              hotRank={idx + 1}
              onSelect={onSelect}
              onStartChat={onStartChat}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function RiserCard({
  issue,
  hotRank,
  onSelect,
  onStartChat,
}: {
  issue: TrendIssue;
  hotRank: number;
  onSelect: (issue: TrendIssue) => void;
  onStartChat: (issue: TrendIssue) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(issue)}
      className="group relative flex h-[260px] w-[260px] shrink-0 flex-col overflow-hidden rounded-2xl border border-[var(--border)] text-left transition hover:border-white/20 sm:h-[280px] sm:w-[300px]"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://picsum.photos/seed/${encodeURIComponent(issue.imageSeed)}/600/400`}
        alt=""
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-black/15"
        aria-hidden
      />
      <div className="relative z-10 flex h-full flex-col p-4">
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-gradient-to-r from-rose-500 to-amber-400 px-2 py-0.5 text-[11px] font-bold text-white">
            HOT #{hotRank}
          </span>
          <span className="font-mono text-base font-bold text-white/90">
            ▲ {issue.growthRate}%
          </span>
        </div>

        <div className="mt-auto space-y-2">
          <div className="flex flex-wrap gap-1.5">
            <span className="rounded-md border border-white/20 bg-black/40 px-2 py-0.5 text-[10px] text-white/90">
              {issue.category}
            </span>
            {issue.audienceAge.map((a) => (
              <span
                key={a}
                className="rounded-md border border-fuchsia-300/40 bg-fuchsia-300/15 px-2 py-0.5 text-[10px] text-fuchsia-100"
              >
                {a}
              </span>
            ))}
          </div>
          <h3 className="line-clamp-2 text-base font-semibold leading-snug text-white">
            {issue.title}
          </h3>
          <p className="line-clamp-2 text-[12px] leading-relaxed text-white/75">
            {issue.oneLine}
          </p>
          <div
            onClick={(e) => {
              e.stopPropagation();
              onStartChat(issue);
            }}
            className="mt-1 inline-flex w-full cursor-pointer items-center justify-center rounded-lg bg-white/15 py-2 text-xs font-semibold text-white backdrop-blur transition hover:bg-white/25"
            role="button"
          >
            지금 같이 얘기 →
          </div>
        </div>
      </div>
    </button>
  );
}
