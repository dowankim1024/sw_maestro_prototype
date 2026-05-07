"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getCharacter } from "@/lib/characters";
import { disclaimerFor } from "@/lib/services";
import type {
  CharacterAngle,
  CharacterId,
  Issue,
} from "@/lib/types";
import { FactBadge } from "./FactBadge";

interface Props {
  issues: Issue[];
  initialIssueId?: string;
  onClose: () => void;
  onOpenDetail: (issue: Issue) => void;
  onStartChat: (issue: Issue, characterId: CharacterId) => void;
}

/**
 * 릴스 모드 — 실제 릴스/틱톡 같은 양축 스크롤 UI.
 *
 *  - 세로(↓): 다음 이슈로 이동       (CSS scroll-snap-y mandatory)
 *  - 가로(→): 같은 이슈의 다른 패널  (CSS scroll-snap-x mandatory)
 *
 * 한 이슈는 다음 패널들로 구성된다.
 *  0  표지        : 커버 이미지 + 짧은 제목 + 요약 + “왜 지금”
 *  1..N 캐릭터 시각: 4명의 캐릭터별 oneLiner / viewpoint / 더 대화하기 CTA
 *  N+1 핵심 사실  : 사실 라벨 + 출처 + 면책
 *
 * 데스크톱: 키보드(↑↓←→ Esc)로도 이동 가능. 트랙패드 양축 스크롤도 자연 동작.
 * 모바일 : 위/아래 스와이프 → 다음 이슈, 좌/우 스와이프 → 다른 패널.
 */
export function ReelsMode({
  issues,
  initialIssueId,
  onClose,
  onOpenDetail,
  onStartChat,
}: Props) {
  const verticalRef = useRef<HTMLDivElement>(null);
  const horizontalRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const initialIndex = useMemo(() => {
    if (!initialIssueId) return 0;
    const i = issues.findIndex((it) => it.id === initialIssueId);
    return i >= 0 ? i : 0;
  }, [issues, initialIssueId]);

  const [currentIssueIdx, setCurrentIssueIdx] = useState(initialIndex);
  const [pageByIssue, setPageByIssue] = useState<Record<string, number>>({});

  // ── 초기 위치 점프 ──────────────────────────────────────────────────────
  useEffect(() => {
    const v = verticalRef.current;
    if (!v) return;
    v.scrollTo({ top: initialIndex * v.clientHeight, behavior: "auto" });
  }, [initialIndex]);

  // ── 세로 스크롤 추적 ────────────────────────────────────────────────────
  function onVerticalScroll() {
    const v = verticalRef.current;
    if (!v) return;
    const idx = Math.round(v.scrollTop / v.clientHeight);
    if (idx !== currentIssueIdx) {
      setCurrentIssueIdx(idx);
    }
  }

  // ── 키보드 ───────────────────────────────────────────────────────────────
  const goVertical = useCallback(
    (dir: 1 | -1) => {
      const v = verticalRef.current;
      if (!v) return;
      const idx = Math.round(v.scrollTop / v.clientHeight);
      const next = Math.min(Math.max(idx + dir, 0), issues.length - 1);
      v.scrollTo({ top: next * v.clientHeight, behavior: "smooth" });
    },
    [issues.length],
  );

  const goHorizontal = useCallback(
    (dir: 1 | -1) => {
      const issue = issues[currentIssueIdx];
      if (!issue) return;
      const h = horizontalRefs.current.get(issue.id);
      if (!h) return;
      const idx = Math.round(h.scrollLeft / h.clientWidth);
      const total = issue.characterAngles.length + 2; // cover + chars + facts
      const next = Math.min(Math.max(idx + dir, 0), total - 1);
      h.scrollTo({ left: next * h.clientWidth, behavior: "smooth" });
    },
    [issues, currentIssueIdx],
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        goVertical(-1);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        goVertical(1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goHorizontal(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goHorizontal(1);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, goVertical, goHorizontal]);

  // ── body scroll lock ────────────────────────────────────────────────────
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="릴스 모드"
      className="fixed inset-0 z-50 bg-black"
      style={{ overscrollBehavior: "contain" }}
    >
      {/* 닫기 */}
      <button
        onClick={onClose}
        aria-label="닫기"
        className="absolute right-3 top-3 z-30 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-black/40 text-sm font-bold text-white backdrop-blur transition hover:bg-black/60 sm:right-5 sm:top-5"
      >
        ✕
      </button>

      {/* 진행 인디케이터 — 우측에 세로 dots */}
      <div
        aria-hidden
        className="absolute right-2 top-1/2 z-20 hidden -translate-y-1/2 flex-col items-center gap-1.5 sm:flex"
      >
        {issues.map((_, i) => (
          <span
            key={i}
            className={[
              "rounded-full transition-all",
              i === currentIssueIdx
                ? "h-6 w-1 bg-white"
                : "h-2 w-1 bg-white/35",
            ].join(" ")}
          />
        ))}
      </div>

      {/* 데스크톱 키보드 가이드 */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-3 left-1/2 z-20 hidden -translate-x-1/2 gap-3 rounded-full border border-white/20 bg-black/40 px-3.5 py-1 text-[11px] font-medium text-white/85 backdrop-blur md:flex"
      >
        <span>↑↓ 이슈</span>
        <span>←→ 시각·디테일</span>
        <span>Esc 닫기</span>
      </div>

      {/* 세로 스크롤러 */}
      <div
        ref={verticalRef}
        onScroll={onVerticalScroll}
        className="no-scrollbar h-[100dvh] w-screen snap-y snap-mandatory overflow-y-auto"
        style={{ overscrollBehavior: "contain" }}
      >
        {issues.map((issue) => (
          <ReelSection
            key={issue.id}
            issue={issue}
            registerRef={(el) => {
              if (el) horizontalRefs.current.set(issue.id, el);
              else horizontalRefs.current.delete(issue.id);
            }}
            page={pageByIssue[issue.id] ?? 0}
            onPageChange={(p) =>
              setPageByIssue((prev) => ({ ...prev, [issue.id]: p }))
            }
            onOpenDetail={() => onOpenDetail(issue)}
            onStartChat={(cid) => onStartChat(issue, cid)}
          />
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SECTION (한 이슈 = 한 세로 페이지)
// ---------------------------------------------------------------------------

interface SectionProps {
  issue: Issue;
  registerRef: (el: HTMLDivElement | null) => void;
  page: number;
  onPageChange: (p: number) => void;
  onOpenDetail: () => void;
  onStartChat: (characterId: CharacterId) => void;
}

function ReelSection({
  issue,
  registerRef,
  page,
  onPageChange,
  onOpenDetail,
  onStartChat,
}: SectionProps) {
  const totalPages = issue.characterAngles.length + 2; // cover + chars + facts

  function onHScroll(e: React.UIEvent<HTMLDivElement>) {
    const el = e.currentTarget;
    const idx = Math.round(el.scrollLeft / el.clientWidth);
    if (idx !== page) onPageChange(idx);
  }

  return (
    <section
      className="relative w-screen snap-start"
      style={{ height: "100dvh" }}
    >
      {/* 가로 스크롤러 */}
      <div
        ref={registerRef}
        onScroll={onHScroll}
        className="no-scrollbar flex h-full w-full snap-x snap-mandatory overflow-x-auto"
        style={{ overscrollBehaviorX: "contain" }}
      >
        <CoverPanel issue={issue} onOpenDetail={onOpenDetail} />
        {issue.characterAngles.map((angle) => (
          <CharacterPanel
            key={angle.characterId}
            issue={issue}
            angle={angle}
            onStartChat={() => onStartChat(angle.characterId)}
          />
        ))}
        <FactsPanel issue={issue} onOpenDetail={onOpenDetail} />
      </div>

      {/* 페이지 인디케이터 — 하단 가로 dots */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-14 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-black/35 px-3 py-1 backdrop-blur md:bottom-12"
      >
        {Array.from({ length: totalPages }).map((_, i) => (
          <span
            key={i}
            className={[
              "rounded-full transition-all",
              i === page ? "h-1.5 w-5 bg-white" : "h-1.5 w-1.5 bg-white/45",
            ].join(" ")}
          />
        ))}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// PANEL — 표지
// ---------------------------------------------------------------------------

function CoverPanel({
  issue,
  onOpenDetail,
}: {
  issue: Issue;
  onOpenDetail: () => void;
}) {
  return (
    <article
      className="relative w-screen shrink-0 snap-start overflow-hidden"
      style={{ height: "100dvh" }}
    >
      {/* 배경 이미지 */}
      {issue.coverImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={issue.coverImage}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#1f1d2e] to-[#3a2e4f]" />
      )}

      {/* 어둡게 깔리는 오버레이 */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/45 to-black/85" />

      {/* 큰 이모지 — 시각적 포인트 */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-6 top-20 select-none text-[150px] leading-none opacity-70 drop-shadow-[0_8px_24px_rgba(0,0,0,0.45)] sm:right-12 sm:top-28 sm:text-[220px]"
      >
        {issue.coverEmoji}
      </div>

      {/* 본문 */}
      <div className="relative flex h-full w-full flex-col p-6 pb-24 text-white sm:p-10 sm:pb-28">
        <header className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-[11px] font-semibold backdrop-blur">
            #{issue.category} · 30초로 이해하기
          </span>
          <button
            onClick={onOpenDetail}
            className="rounded-full border border-white/30 bg-white/15 px-3 py-1 text-[11px] font-semibold backdrop-blur transition hover:bg-white/25"
          >
            상세
          </button>
        </header>

        <div className="flex-1" />

        <div className="space-y-3">
          <h2 className="text-3xl font-extrabold leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)] sm:text-5xl">
            {issue.shortTitle}
          </h2>
          <p className="line-clamp-3 text-[14px] leading-relaxed text-white/90 sm:text-base">
            {issue.summary}
          </p>
          <p className="line-clamp-3 text-[12px] leading-relaxed text-white/75 sm:text-sm">
            왜 지금 — {issue.whyNow}
          </p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {issue.keywords.slice(0, 4).map((k) => (
              <span
                key={k}
                className="rounded-full bg-white/15 px-2 py-[2px] text-[11px] text-white/85 backdrop-blur"
              >
                #{k}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-5 flex items-center gap-2 text-[12px] text-white/85">
          <SwipeArrow />
          <span>옆으로 — 4명의 시각으로 30초 안에</span>
        </div>
      </div>
    </article>
  );
}

// ---------------------------------------------------------------------------
// PANEL — 캐릭터 시각
// ---------------------------------------------------------------------------

function CharacterPanel({
  issue,
  angle,
  onStartChat,
}: {
  issue: Issue;
  angle: CharacterAngle;
  onStartChat: () => void;
}) {
  const character = getCharacter(angle.characterId);

  return (
    <article
      className="relative w-screen shrink-0 snap-start overflow-hidden"
      style={{ height: "100dvh" }}
    >
      {/* 캐릭터 그라디언트 배경 */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${character.gradient}`}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/15 to-black/55" />

      {/* 큰 캐릭터 이모지 */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-6 right-2 select-none text-[200px] leading-none opacity-25 drop-shadow-2xl sm:right-10 sm:text-[280px]"
      >
        {character.emoji}
      </div>

      {/* 본문 */}
      <div className="relative flex h-full w-full flex-col p-6 pb-24 text-white sm:p-10 sm:pb-28">
        <header className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/40 bg-white/15 text-2xl backdrop-blur">
            {character.emoji}
          </span>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-white/80">
              {angle.lensLabel}
            </p>
            <p className="truncate text-base font-bold sm:text-lg">
              {character.name} · {character.tone}
            </p>
          </div>
          <span className="ml-auto rounded-full border border-white/30 bg-black/30 px-2 py-[2px] text-[11px] text-white/80 backdrop-blur">
            의견
          </span>
        </header>

        <p className="mt-3 line-clamp-2 text-[12px] text-white/70">
          이슈: {issue.shortTitle}
        </p>

        <div className="flex-1" />

        <blockquote className="text-2xl font-extrabold leading-snug drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)] sm:text-4xl">
          “{angle.oneLiner}”
        </blockquote>
        <p className="mt-4 max-h-[40vh] overflow-y-auto text-[14px] leading-relaxed text-white/95 sm:text-base no-scrollbar">
          {angle.viewpoint}
        </p>

        <p className="mt-4 text-[11px] italic text-white/75">
          ⚖ {angle.opinionDisclaimer}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <button
            onClick={onStartChat}
            className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-bold text-[var(--foreground)] shadow-lg transition hover:opacity-90"
          >
            <span aria-hidden>💬</span>
            {character.shortName}와 더 대화하기
          </button>
          <span className="text-[11px] text-white/75">
            ← 표지 / → 다른 시각
          </span>
        </div>
      </div>
    </article>
  );
}

// ---------------------------------------------------------------------------
// PANEL — 핵심 사실 & 출처
// ---------------------------------------------------------------------------

function FactsPanel({
  issue,
  onOpenDetail,
}: {
  issue: Issue;
  onOpenDetail: () => void;
}) {
  return (
    <article
      className="relative w-screen shrink-0 snap-start overflow-hidden bg-[#16171c]"
      style={{ height: "100dvh" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[var(--accent)]/15 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-16 bottom-0 h-72 w-72 rounded-full bg-[var(--accent-2)]/12 blur-3xl"
      />

      <div className="no-scrollbar relative flex h-full w-full flex-col gap-4 overflow-y-auto p-6 pb-24 text-white sm:p-10 sm:pb-28">
        <header>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-white/70">
            📋 핵심 사실 & 출처
          </p>
          <h3 className="mt-1 text-2xl font-bold">{issue.title}</h3>
        </header>

        <div className="space-y-2">
          {issue.facts.map((f) => (
            <div
              key={f.id}
              className="rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur"
            >
              <FactBadge kind={f.confidence} />
              <p className="mt-2 text-[13px] leading-relaxed text-white/95">
                {f.statement}
              </p>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <h4 className="text-xs font-semibold text-white/90">출처</h4>
            <span className="text-[11px] text-white/55">
              {issue.sources.length}건
            </span>
          </div>
          <ul className="space-y-2">
            {issue.sources.map((s) => (
              <li
                key={s.id}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 backdrop-blur"
              >
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block truncate text-[12px] font-medium text-white hover:text-[var(--accent-2)]"
                >
                  {s.title}
                </a>
                <p className="mt-[2px] text-[11px] text-white/60">
                  {s.publisher}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-[11px] leading-relaxed text-white/55">
          {disclaimerFor(issue)}
        </p>

        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <button
            onClick={onOpenDetail}
            className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur hover:bg-white/20"
          >
            전체 디테일 열기
          </button>
          <span className="text-[11px] text-white/65">
            ↓ 다음 이슈 / ← 캐릭터 시각
          </span>
        </div>
      </div>
    </article>
  );
}

// ---------------------------------------------------------------------------
// 작은 SVG: 옆으로 스와이프 화살표
// ---------------------------------------------------------------------------

function SwipeArrow() {
  return (
    <svg
      width="22"
      height="14"
      viewBox="0 0 22 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className="animate-pulse"
    >
      <path
        d="M1 7H20M20 7L14 1M20 7L14 13"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
