"use client";

import { useEffect, useRef, useState } from "react";
import {
  formatMention,
  getSentimentColor,
  getSentimentLabel,
} from "@/lib/services";
import type { TrendIssue } from "@/lib/types";

/**
 * 모바일 릴스 모드.
 * - 세로 스냅 스크롤로 이슈 슬라이드 탐색
 * - 각 슬라이드 내부에 가로 3패널(반대 / 이슈 / 찬성) — 좌우 스와이프
 * - 중앙 패널에서 ‘자세히’를 누르면 상세, ‘토론’을 누르면 토론 시작
 */
export function IssueStories({
  issues,
  onOpenDetail,
  onStartDebate,
  onClose,
}: {
  issues: TrendIssue[];
  onOpenDetail: (issue: TrendIssue) => void;
  onStartDebate: (issue: TrendIssue) => void;
  onClose: () => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = () => {
      const idx = Math.round(el.scrollTop / el.clientHeight);
      setActiveIdx(idx);
    };
    el.addEventListener("scroll", handler, { passive: true });
    return () => el.removeEventListener("scroll", handler);
  }, []);

  if (issues.length === 0) return null;

  return (
    <div className="fixed inset-0 z-40 bg-black">
      <button
        onClick={onClose}
        aria-label="닫기"
        className="absolute right-3 top-[max(env(safe-area-inset-top),0.75rem)] z-20 rounded-full border border-white/20 bg-black/60 px-3 py-1.5 text-xs font-medium text-white backdrop-blur"
      >
        ✕ 리스트로
      </button>
      <div className="absolute left-3 top-[max(env(safe-area-inset-top),0.75rem)] z-20 flex items-center gap-1.5 rounded-full border border-white/20 bg-black/60 px-3 py-1.5 text-[11px] font-medium text-white backdrop-blur">
        <span className="live-dot inline-block h-1.5 w-1.5 rounded-full bg-rose-400" />
        실시간 이슈 · {activeIdx + 1}/{issues.length}
      </div>

      <div
        ref={containerRef}
        className="h-full snap-y snap-mandatory overflow-y-auto"
      >
        {issues.map((issue) => (
          <StorySlide
            key={issue.id}
            issue={issue}
            onOpenDetail={onOpenDetail}
            onStartDebate={onStartDebate}
          />
        ))}
      </div>
    </div>
  );
}

function StorySlide({
  issue,
  onOpenDetail,
  onStartDebate,
}: {
  issue: TrendIssue;
  onOpenDetail: (issue: TrendIssue) => void;
  onStartDebate: (issue: TrendIssue) => void;
}) {
  const horizRef = useRef<HTMLDivElement | null>(null);
  const [activePane, setActivePane] = useState<0 | 1 | 2>(1);

  useEffect(() => {
    const el = horizRef.current;
    if (!el) return;
    // 시작 위치를 가운데 패널로
    requestAnimationFrame(() => {
      el.scrollLeft = el.clientWidth;
    });
    const handler = () => {
      const idx = Math.round(el.scrollLeft / el.clientWidth) as 0 | 1 | 2;
      setActivePane(idx);
    };
    el.addEventListener("scroll", handler, { passive: true });
    return () => el.removeEventListener("scroll", handler);
  }, []);

  return (
    <section className="relative h-screen w-full snap-start">
      {/* 배경 이미지 */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://picsum.photos/seed/${encodeURIComponent(issue.imageSeed)}/900/1600`}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/95"
        aria-hidden
      />

      {/* 좌우 가로 스냅 컨테이너 */}
      <div
        ref={horizRef}
        className="relative h-full snap-x snap-mandatory overflow-x-auto"
      >
        <div className="flex h-full w-[300%]">
          <SidePane tone="con" issue={issue} />
          <CenterPane
            issue={issue}
            onOpenDetail={onOpenDetail}
            onStartDebate={onStartDebate}
          />
          <SidePane tone="pro" issue={issue} />
        </div>
      </div>

      {/* 좌/우 힌트 인디케이터 */}
      <div className="pointer-events-none absolute inset-x-0 bottom-[max(env(safe-area-inset-bottom),1rem)] flex justify-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={[
              "h-1.5 rounded-full transition-all",
              i === activePane ? "w-6 bg-white" : "w-1.5 bg-white/40",
            ].join(" ")}
          />
        ))}
      </div>

      {activePane === 1 && (
        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-white/60">
          <span className="rounded-full bg-black/40 px-2 py-1 text-[10px] backdrop-blur">
            ← 반대 · 찬성 →
          </span>
        </div>
      )}
    </section>
  );
}

function CenterPane({
  issue,
  onOpenDetail,
  onStartDebate,
}: {
  issue: TrendIssue;
  onOpenDetail: (issue: TrendIssue) => void;
  onStartDebate: (issue: TrendIssue) => void;
}) {
  return (
    <div className="relative flex h-full w-1/3 shrink-0 snap-center flex-col px-5 pb-[max(env(safe-area-inset-bottom),1.5rem)] pt-[max(env(safe-area-inset-top),3.5rem)]">
      <div className="mt-auto space-y-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="rounded-full border border-white/30 bg-black/40 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur">
            #{issue.rank} · {issue.category}
          </span>
          <span
            className={`rounded-full border px-2 py-0.5 text-[10px] backdrop-blur ${getSentimentColor(issue.sentiment)}`}
          >
            {getSentimentLabel(issue.sentiment)}
          </span>
          {issue.targetAge.map((a) => (
            <span
              key={a}
              className="rounded-full border border-fuchsia-300/40 bg-fuchsia-300/15 px-2 py-0.5 text-[10px] text-fuchsia-100 backdrop-blur"
            >
              {a}
            </span>
          ))}
          <span className="rounded-full border border-amber-300/40 bg-amber-300/10 px-2 py-0.5 text-[10px] text-amber-200 backdrop-blur">
            ▲ {issue.growthRate}%
          </span>
        </div>

        <h1 className="text-2xl font-semibold leading-tight text-white drop-shadow-md">
          {issue.title}
        </h1>
        <p className="text-base leading-relaxed text-white/85 drop-shadow">
          {issue.oneLine}
        </p>
        <p className="line-clamp-3 text-sm leading-relaxed text-white/75">
          {issue.summary}
        </p>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/80">
          <span>
            언급량{" "}
            <span className="font-semibold text-white">
              {formatMention(issue.mentionCount)}
            </span>
          </span>
          <span>
            논쟁성{" "}
            <span className="font-semibold text-white">
              {issue.controversyScore}
            </span>
          </span>
          <span>출처 {issue.sources.length}건</span>
        </div>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {issue.keywords.slice(0, 4).map((k) => (
            <span
              key={k}
              className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] text-white/85 backdrop-blur"
            >
              #{k}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2">
          <button
            onClick={() => onOpenDetail(issue)}
            className="rounded-xl border border-white/30 bg-white/10 py-3 text-sm font-semibold text-white backdrop-blur hover:bg-white/20"
          >
            자세히 보기
          </button>
          <button
            onClick={() => onStartDebate(issue)}
            className="rounded-xl bg-[var(--accent)] py-3 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(255,77,109,0.7)] hover:bg-[#ff6680]"
          >
            AI와 토론
          </button>
        </div>
      </div>
    </div>
  );
}

function SidePane({
  tone,
  issue,
}: {
  tone: "pro" | "con";
  issue: TrendIssue;
}) {
  const isPro = tone === "pro";
  const items = isPro ? issue.proArguments : issue.conArguments;
  const accent = isPro
    ? "from-emerald-500/20 via-emerald-500/10 to-transparent"
    : "from-rose-500/20 via-rose-500/10 to-transparent";
  const dot = isPro ? "bg-emerald-400" : "bg-rose-400";
  return (
    <div
      className={`relative flex h-full w-1/3 shrink-0 snap-center flex-col px-5 pb-[max(env(safe-area-inset-bottom),1.5rem)] pt-[max(env(safe-area-inset-top),3.5rem)]`}
    >
      <div
        className={`absolute inset-0 -z-0 bg-gradient-to-b ${accent}`}
        aria-hidden
      />
      <div className="relative z-10 mt-auto space-y-3">
        <div className="inline-flex items-center gap-1.5">
          <span className={`h-2 w-2 rounded-full ${dot}`} />
          <span className="text-[11px] font-bold uppercase tracking-widest text-white/85">
            {isPro ? "찬성 측 논리" : "반대 측 논리"}
          </span>
        </div>
        <h2 className="text-lg font-semibold leading-snug text-white drop-shadow-md">
          {issue.title}
        </h2>
        <ul className="space-y-2 pt-1 text-[13px] leading-relaxed text-white/90">
          {items.map((it) => (
            <li
              key={it}
              className="rounded-xl border border-white/15 bg-black/40 p-3 backdrop-blur"
            >
              <span className={`mr-2 inline-block h-1.5 w-1.5 rounded-full ${dot}`} />
              {it}
            </li>
          ))}
        </ul>
        <p className="pt-1 text-[11px] text-white/60">
          ← 가운데로 돌아가기 / 반대편으로 →
        </p>
      </div>
    </div>
  );
}
