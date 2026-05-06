"use client";

import {
  formatMention,
  getSentimentColor,
  getSentimentLabel,
} from "@/lib/services";
import type { TrendIssue } from "@/lib/types";

export function IssueDetailPanel({
  issue,
  onClose,
  onStartDebate,
}: {
  issue: TrendIssue | null;
  onClose: () => void;
  onStartDebate: (issue: TrendIssue) => void;
}) {
  if (!issue) {
    return (
      <aside className="hidden h-full min-h-[60vh] flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border)] bg-[var(--background-elev)]/50 p-8 text-center text-[var(--muted)] lg:flex">
        <div className="text-5xl">🗞️</div>
        <p className="mt-3 text-sm">
          왼쪽에서 이슈를 선택하면 상세 정보가 여기에 표시됩니다.
        </p>
        <p className="mt-1 text-xs text-white/40">
          이슈 카드의 ‘토론 시작’ 버튼으로 바로 토론에 진입할 수도 있어요.
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
            onStartDebate={onStartDebate}
            onClose={onClose}
            mobile
          />
        </div>
      </div>

      {/* 데스크탑: 우측 패널 */}
      <aside className="hidden h-full lg:block">
        <div className="fade-up sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--background-card)] p-6">
          <DetailContent
            issue={issue}
            onStartDebate={onStartDebate}
            onClose={onClose}
          />
        </div>
      </aside>
    </>
  );
}

function DetailContent({
  issue,
  onStartDebate,
  onClose,
  mobile,
}: {
  issue: TrendIssue;
  onStartDebate: (issue: TrendIssue) => void;
  onClose: () => void;
  mobile?: boolean;
}) {
  return (
    <div className="space-y-6">
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
          className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent"
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
            <span className="rounded-md border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 text-amber-300">
              논쟁성 {issue.controversyScore}
            </span>
          </div>
        </div>
      </div>

      <h2 className="text-lg font-semibold leading-snug text-white sm:text-xl">
        {issue.title}
      </h2>

      <div className="grid grid-cols-3 gap-2">
        <Metric label="언급량" value={formatMention(issue.mentionCount)} />
        <Metric
          label="상승률"
          value={`${issue.growthRate >= 0 ? "▲" : "▼"} ${Math.abs(issue.growthRate)}%`}
          tone={issue.growthRate >= 0 ? "positive" : "negative"}
        />
        <Metric label="트렌드 점수" value={String(issue.trendScore)} />
      </div>

      <Section title="이슈 요약">
        <p className="text-sm leading-relaxed text-white/85">{issue.summary}</p>
      </Section>

      <Section title="왜 지금 뜨는가">
        <p className="text-sm leading-relaxed text-white/80">
          {issue.whyTrending}
        </p>
      </Section>

      <Section title="핵심 쟁점 · 찬반 논리">
        <div className="grid gap-3 sm:grid-cols-2">
          <ArgList title="찬성 측" tone="positive" items={issue.proArguments} />
          <ArgList title="반대 측" tone="negative" items={issue.conArguments} />
        </div>
      </Section>

      <Section title="관련 키워드">
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

      <Section title={`출처 분포 (${issue.sources.length}건, 매체명 비공개)`}>
        <SourceBreakdown sources={issue.sources} />
        <p className="mt-2 text-[11px] text-[var(--muted)]">
          편향을 줄이기 위해 매체명·링크는 직접 노출하지 않고 종류와 시점만
          요약합니다.
        </p>
      </Section>

      <div className={mobile ? "sticky bottom-0 -mx-5 border-t border-[var(--border)] bg-[var(--background-elev)] p-5" : ""}>
        <button
          type="button"
          onClick={() => onStartDebate(issue)}
          className="w-full rounded-xl bg-[var(--accent)] py-3 text-sm font-semibold text-white shadow-[0_12px_32px_-12px_rgba(255,77,109,0.7)] transition hover:bg-[#ff6680]"
        >
          이 주제로 AI와 토론 시작
        </button>
        <p className="mt-2 text-center text-[11px] text-[var(--muted)]">
          난이도와 라운드 수를 고를 수 있어요. 토론은 언제든 종료 가능합니다.
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

function ArgList({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "positive" | "negative";
}) {
  const color =
    tone === "positive"
      ? "border-emerald-400/30 bg-emerald-400/5"
      : "border-rose-400/30 bg-rose-400/5";
  const dot = tone === "positive" ? "bg-emerald-400" : "bg-rose-400";
  return (
    <div className={`rounded-xl border ${color} p-3`}>
      <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-white/90">
        <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
        {title}
      </div>
      <ul className="space-y-1.5 text-[13px] leading-relaxed text-white/80">
        {items.map((it) => (
          <li key={it} className="flex gap-1.5">
            <span className="text-[var(--muted)]">·</span>
            <span>{it}</span>
          </li>
        ))}
      </ul>
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

function SourceBreakdown({
  sources,
}: {
  sources: import("@/lib/types").IssueSource[];
}) {
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
