"use client";

import {
  formatMention,
  getSentimentColor,
  getSentimentLabel,
} from "@/lib/services";
import type { IssueSource, Perspective, TrendIssue } from "@/lib/types";

export function IssueDetailPanel({
  issue,
  onClose,
  onStartChat,
}: {
  issue: TrendIssue | null;
  onClose: () => void;
  onStartChat: (issue: TrendIssue) => void;
}) {
  if (!issue) {
    return (
      <aside className="hidden h-full min-h-[60vh] flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border)] bg-[var(--background-elev)]/50 p-8 text-center text-[var(--muted)] lg:flex">
        <div className="text-5xl">🗞️</div>
        <p className="mt-3 text-sm">
          왼쪽에서 이슈를 골라주세요. 여기에 한눈에 정리됩니다.
        </p>
      </aside>
    );
  }

  return (
    <>
      {/* 모바일: 모달 */}
      <div className="fixed inset-0 z-40 flex items-end bg-black/60 backdrop-blur-sm lg:hidden">
        <div className="fade-up max-h-[88vh] w-full overflow-y-auto rounded-t-3xl border-t border-[var(--border)] bg-[var(--background-elev)] p-5">
          <DetailContent
            issue={issue}
            onStartChat={onStartChat}
            onClose={onClose}
            mobile
          />
        </div>
      </div>

      {/* 데스크탑: 우측 패널 */}
      <aside className="hidden h-full lg:block">
        <div className="fade-up sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--background-card)] p-5">
          <DetailContent
            issue={issue}
            onStartChat={onStartChat}
            onClose={onClose}
          />
        </div>
      </aside>
    </>
  );
}

function DetailContent({
  issue,
  onStartChat,
  onClose,
  mobile,
}: {
  issue: TrendIssue;
  onStartChat: (issue: TrendIssue) => void;
  onClose: () => void;
  mobile?: boolean;
}) {
  return (
    <div className="space-y-5">
      {/* 이미지 배너 */}
      <div className="relative -mx-1 -mt-1 overflow-hidden rounded-xl border border-white/10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://picsum.photos/seed/${encodeURIComponent(issue.imageSeed)}/720/360`}
          alt=""
          loading="lazy"
          className="h-32 w-full object-cover sm:h-40"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent"
          aria-hidden
        />
        <div className="absolute left-3 top-3 text-3xl drop-shadow-md sm:text-4xl">
          {issue.coverEmoji}
        </div>
        <button
          onClick={onClose}
          aria-label="닫기"
          className="absolute right-3 top-3 rounded-md border border-white/20 bg-black/50 px-2 py-1 text-xs text-white/90 hover:bg-black/70"
        >
          ✕
        </button>
        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
            <span className="rounded-md border border-white/20 bg-black/50 px-2 py-0.5 text-white/90">
              #{issue.rank} · {issue.category}
            </span>
            <span
              className={[
                "rounded-md border px-2 py-0.5",
                getSentimentColor(issue.sentiment),
              ].join(" ")}
            >
              {getSentimentLabel(issue.sentiment)}
            </span>
          </div>
        </div>
      </div>

      <h2 className="text-lg font-semibold leading-snug text-white">
        {issue.title}
      </h2>
      <p className="text-sm leading-relaxed text-white/80">{issue.oneLine}</p>

      <div className="grid grid-cols-3 gap-2">
        <Metric label="언급" value={formatMention(issue.mentionCount)} />
        <Metric
          label="지금"
          value={`${issue.growthRate >= 0 ? "▲" : "▼"} ${Math.abs(issue.growthRate)}%`}
          tone={issue.growthRate >= 0 ? "positive" : "negative"}
        />
        <Metric label="이야깃거리" value={String(issue.buzzScore)} />
      </div>

      <Section title="요약">
        <p className="text-sm leading-relaxed text-white/85">{issue.summary}</p>
      </Section>

      <Section title="왜 지금 떠오르나">
        <p className="text-sm leading-relaxed text-white/80">
          {issue.whyTrending}
        </p>
      </Section>

      <Section title="시각 두 갈래">
        <div className="grid gap-3 sm:grid-cols-2">
          <PerspectiveCard
            perspective={issue.perspectives[0]}
            tone="left"
          />
          <PerspectiveCard
            perspective={issue.perspectives[1]}
            tone="right"
          />
        </div>
      </Section>

      <Section title="키워드">
        <div className="flex flex-wrap gap-1.5">
          {issue.keywords.map((k) => (
            <span
              key={k}
              className="rounded-full border border-[var(--border)] bg-white/5 px-2.5 py-1 text-xs text-white/80"
            >
              #{k}
            </span>
          ))}
        </div>
      </Section>

      <Section title={`출처 분포 (${issue.sources.length}건)`}>
        <SourceBreakdown sources={issue.sources} />
        <p className="mt-2 text-[11px] text-[var(--muted)]">
          매체명·링크는 노출하지 않아요. 종류와 시점만 보여드려요.
        </p>
      </Section>

      <div
        className={
          mobile
            ? "sticky bottom-0 -mx-5 border-t border-[var(--border)] bg-[var(--background-elev)] p-5"
            : ""
        }
      >
        <button
          type="button"
          onClick={() => onStartChat(issue)}
          className="w-full rounded-xl bg-[var(--accent)] py-3 text-sm font-semibold text-white shadow-[0_12px_32px_-12px_rgba(255,77,109,0.7)] transition hover:bg-[#ff6680]"
        >
          이 주제로 캐릭터와 같이 얘기
        </button>
        <p className="mt-2 text-center text-[11px] text-[var(--muted)]">
          5분이면 충분해요. 토론이 아니라 가볍게 짚어보는 대화예요.
        </p>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-[var(--muted)]">
        {title}
      </h3>
      {children}
    </section>
  );
}

function Metric({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "positive" | "negative";
}) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-white/5 p-3">
      <div className="text-[10px] uppercase tracking-widest text-[var(--muted)]">
        {label}
      </div>
      <div
        className={[
          "mt-1 text-base font-semibold",
          tone === "positive"
            ? "text-emerald-400"
            : tone === "negative"
              ? "text-rose-400"
              : "text-white",
        ].join(" ")}
      >
        {value}
      </div>
    </div>
  );
}

function PerspectiveCard({
  perspective,
  tone,
}: {
  perspective: Perspective;
  tone: "left" | "right";
}) {
  const color =
    tone === "left"
      ? "border-emerald-400/30 bg-emerald-400/5"
      : "border-cyan-400/30 bg-cyan-400/5";
  const dot = tone === "left" ? "bg-emerald-400" : "bg-cyan-400";
  return (
    <div className={`rounded-xl border ${color} p-3`}>
      <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-white/90">
        <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
        {perspective.label}
      </div>
      <ul className="space-y-1.5 text-[13px] leading-relaxed text-white/80">
        {perspective.points.map((it) => (
          <li key={it} className="flex gap-1.5">
            <span className="text-[var(--muted)]">·</span>
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SourceBreakdown({ sources }: { sources: IssueSource[] }) {
  const counts = sources.reduce<Record<string, number>>((acc, s) => {
    acc[s.type] = (acc[s.type] ?? 0) + 1;
    return acc;
  }, {});
  const latest = sources
    .map((s) => new Date(s.publishedAt).getTime())
    .sort((a, b) => b - a)[0];
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {Object.entries(counts).map(([t, c]) => (
          <span
            key={t}
            className="rounded-full border border-[var(--border)] bg-white/5 px-2.5 py-1 text-[11px] text-white/85"
          >
            {sourceTypeLabel(t)} <span className="text-white/60">·</span>{" "}
            <span className="font-semibold">{c}</span>
          </span>
        ))}
      </div>
      {latest && (
        <div className="text-[11px] text-[var(--muted)]">
          최근 보도/게시:{" "}
          {new Date(latest).toLocaleString("ko-KR", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      )}
    </div>
  );
}

function sourceTypeLabel(type: string): string {
  switch (type) {
    case "news":
      return "뉴스";
    case "community":
      return "커뮤니티";
    case "social":
      return "소셜";
    case "search":
      return "검색";
    case "rss":
      return "RSS";
    default:
      return type;
  }
}
