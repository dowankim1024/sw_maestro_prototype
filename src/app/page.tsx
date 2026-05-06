"use client";

import { useEffect, useMemo, useState } from "react";
import { Brand } from "@/components/Brand";
import { CategoryTabs } from "@/components/CategoryTabs";
import { DebateRoom } from "@/components/DebateRoom";
import { DebateSetupModal } from "@/components/DebateSetupModal";
import { HistoryView } from "@/components/HistoryView";
import { HotRisers } from "@/components/HotRisers";
import { IssueCard } from "@/components/IssueCard";
import { IssueDetailPanel } from "@/components/IssueDetailPanel";
import { IssueStories } from "@/components/IssueStories";
import { JudgmentReport } from "@/components/JudgmentReport";
import { PERSONAS } from "@/lib/personas";
// Note: PersonaPreview defined inline below uses PERSONAS directly.
import { fetchTrends } from "@/lib/services";
import {
  deleteDebateHistory,
  clearDebateHistory,
  loadDebateHistory,
  saveDebateHistory,
} from "@/lib/storage";
import type {
  Category,
  DebateResult,
  Difficulty,
  PersonaId,
  TrendIssue,
  UserStance,
} from "@/lib/types";

type View =
  | { kind: "dashboard" }
  | { kind: "history" }
  | {
      kind: "debate";
      issue: TrendIssue;
      stance: UserStance;
      difficulty: Difficulty;
      rounds: 3 | 5 | 7;
      personaId: PersonaId;
    }
  | { kind: "report"; result: DebateResult };

export default function HomePage() {
  const [issues, setIssues] = useState<TrendIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<Category>("전체");
  const [selectedIssue, setSelectedIssue] = useState<TrendIssue | null>(null);
  const [setupIssue, setSetupIssue] = useState<TrendIssue | null>(null);
  const [setupPersona, setSetupPersona] = useState<PersonaId>("sohn");
  const [view, setView] = useState<View>({ kind: "dashboard" });
  const [history, setHistory] = useState<DebateResult[]>([]);
  const [storiesOpen, setStoriesOpen] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchTrends().then((data) => {
      if (!active) return;
      setIssues(data);
      setLoading(false);
    });
    setHistory(loadDebateHistory());
    return () => {
      active = false;
    };
  }, []);

  const counts = useMemo(() => {
    const map: Partial<Record<Category, number>> = {
      전체: issues.length,
      "10대": issues.filter((i) => i.targetAge.includes("10대")).length,
      "20대": issues.filter((i) => i.targetAge.includes("20대")).length,
    };
    for (const i of issues) {
      map[i.category] = (map[i.category] ?? 0) + 1;
    }
    return map;
  }, [issues]);

  const filtered = useMemo(() => {
    if (activeCategory === "전체") return issues;
    if (activeCategory === "10대" || activeCategory === "20대") {
      return issues.filter((i) => i.targetAge.includes(activeCategory));
    }
    return issues.filter((i) => i.category === activeCategory);
  }, [activeCategory, issues]);

  const top = filtered.slice(0, 3);
  const rest = filtered.slice(3);

  const hotRisers = useMemo(
    () => [...issues].sort((a, b) => b.growthRate - a.growthRate).slice(0, 6),
    [issues],
  );

  function openSetup(issue: TrendIssue, persona?: PersonaId) {
    setSetupIssue(issue);
    if (persona) setSetupPersona(persona);
    setStoriesOpen(false);
  }

  function startDebate(args: {
    issue: TrendIssue;
    userStance: UserStance;
    difficulty: Difficulty;
    totalRounds: 3 | 5 | 7;
    personaId: PersonaId;
  }) {
    setSetupIssue(null);
    setView({
      kind: "debate",
      issue: args.issue,
      stance: args.userStance,
      difficulty: args.difficulty,
      rounds: args.totalRounds,
      personaId: args.personaId,
    });
  }

  function handleFinishDebate(result: DebateResult) {
    saveDebateHistory(result);
    setHistory(loadDebateHistory());
    setView({ kind: "report", result });
  }

  return (
    <div className="min-h-screen">
      <Header
        currentView={view.kind}
        historyCount={history.length}
        onHome={() => setView({ kind: "dashboard" })}
        onHistory={() => setView({ kind: "history" })}
      />

      <main className="mx-auto w-full max-w-7xl px-4 pb-24 pt-6 sm:px-6 lg:px-8">
        {view.kind === "dashboard" && (
          <Dashboard
            loading={loading}
            counts={counts}
            top={top}
            rest={rest}
            hotRisers={hotRisers}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            selectedIssue={selectedIssue}
            onSelect={setSelectedIssue}
            onStartDebate={(i, p) => openSetup(i, p)}
            onOpenStories={() => setStoriesOpen(true)}
          />
        )}

        {view.kind === "history" && (
          <section className="space-y-4">
            <h1 className="text-xl font-semibold text-white">내 토론 기록</h1>
            <HistoryView
              history={history}
              onOpen={(r) => setView({ kind: "report", result: r })}
              onClear={() => {
                clearDebateHistory();
                setHistory([]);
              }}
              onDelete={(id) => {
                deleteDebateHistory(id);
                setHistory(loadDebateHistory());
              }}
            />
          </section>
        )}

        {view.kind === "debate" && (
          <DebateRoom
            issue={view.issue}
            initialUserStance={view.stance}
            initialDifficulty={view.difficulty}
            initialRounds={view.rounds}
            initialPersonaId={view.personaId}
            onExit={() => setView({ kind: "dashboard" })}
            onFinish={handleFinishDebate}
          />
        )}

        {view.kind === "report" && (
          <JudgmentReport
            result={view.result}
            onHome={() => setView({ kind: "dashboard" })}
            onRetry={() => {
              const issue = issues.find((i) => i.id === view.result.issueId);
              if (issue) openSetup(issue, view.result.personaId);
              setView({ kind: "dashboard" });
            }}
          />
        )}
      </main>

      <DebateSetupModal
        issue={setupIssue}
        open={!!setupIssue}
        initialPersonaId={setupPersona}
        onClose={() => setSetupIssue(null)}
        onStart={startDebate}
      />

      {storiesOpen && (
        <IssueStories
          issues={issues}
          onClose={() => setStoriesOpen(false)}
          onOpenDetail={(i) => {
            setSelectedIssue(i);
            setStoriesOpen(false);
          }}
          onStartDebate={(i) => openSetup(i)}
        />
      )}
    </div>
  );
}

function Header({
  currentView,
  historyCount,
  onHome,
  onHistory,
}: {
  currentView: View["kind"];
  historyCount: number;
  onHome: () => void;
  onHistory: () => void;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <button onClick={onHome} className="flex items-center gap-2">
          <Brand />
          <span className="hidden text-xs text-[var(--muted)] sm:inline">
            · 실시간 이슈와 AI 1:1 토론
          </span>
        </button>

        <nav className="flex items-center gap-1.5">
          <NavBtn
            active={currentView === "dashboard"}
            onClick={onHome}
            label="대시보드"
          />
          <NavBtn
            active={currentView === "history"}
            onClick={onHistory}
            label={`기록 ${historyCount > 0 ? `(${historyCount})` : ""}`}
          />
        </nav>
      </div>
    </header>
  );
}

function NavBtn({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "rounded-lg px-3 py-1.5 text-sm transition",
        active
          ? "bg-white/10 text-white"
          : "text-[var(--muted)] hover:bg-white/5 hover:text-white",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

function Dashboard({
  loading,
  counts,
  top,
  rest,
  hotRisers,
  activeCategory,
  onCategoryChange,
  selectedIssue,
  onSelect,
  onStartDebate,
  onOpenStories,
}: {
  loading: boolean;
  counts: Partial<Record<Category, number>>;
  top: TrendIssue[];
  rest: TrendIssue[];
  hotRisers: TrendIssue[];
  activeCategory: Category;
  onCategoryChange: (c: Category) => void;
  selectedIssue: TrendIssue | null;
  onSelect: (issue: TrendIssue) => void;
  onStartDebate: (issue: TrendIssue, persona?: PersonaId) => void;
  onOpenStories: () => void;
}) {
  return (
    <>
      <Hero
        onStartRandom={() => {
          if (hotRisers[0]) onStartDebate(hotRisers[0]);
        }}
        onOpenStories={onOpenStories}
      />

      <div className="mt-6 sm:mt-8">
        <HotRisers
          issues={hotRisers}
          onSelect={onSelect}
          onStartDebate={onStartDebate}
        />
      </div>

      <section className="mt-8 space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-white sm:text-xl">
              관심사로 골라보기
            </h2>
            <p className="text-xs text-[var(--muted)]">
              10대·20대 관심사부터 도메인까지 — 카드를 눌러 필터링
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-white/5 px-3 py-1 text-[11px] text-[var(--muted)]">
            <span className="live-dot inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
            LIVE · 매분 갱신
          </span>
        </div>

        <CategoryTabs
          active={activeCategory}
          onChange={onCategoryChange}
          counts={counts}
        />

        {/* 모바일 전용: 릴스 진입 */}
        <button
          onClick={onOpenStories}
          className="flex w-full items-center justify-between rounded-2xl border border-[var(--border)] bg-gradient-to-r from-rose-500/15 via-fuchsia-500/10 to-amber-500/15 p-4 text-left transition hover:border-white/20 sm:hidden"
        >
          <div>
            <div className="text-[11px] font-bold uppercase tracking-widest text-white/85">
              모바일 전용
            </div>
            <div className="text-sm font-semibold text-white">
              릴스처럼 슈슉 넘겨보기
            </div>
            <div className="text-[11px] text-white/70">
              위/아래로 이슈 이동, 좌/우로 찬반 보기
            </div>
          </div>
          <span className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold text-white">
            시작 →
          </span>
        </button>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_400px]">
        <div className="space-y-3">
          {loading ? (
            <SkeletonList />
          ) : top.length + rest.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              {top.length > 0 && (
                <div className="space-y-3">
                  <SectionLabel
                    title="TOP 3"
                    desc="이 필터에서 가장 뜨거운 이슈"
                  />
                  {top.map((issue) => (
                    <IssueCard
                      key={issue.id}
                      issue={issue}
                      onSelect={onSelect}
                      onStartDebate={onStartDebate}
                      isSelected={selectedIssue?.id === issue.id}
                    />
                  ))}
                </div>
              )}
              {rest.length > 0 && (
                <div className="space-y-3 pt-2">
                  <SectionLabel
                    title="이어지는 이슈"
                    desc="더 둘러보기"
                  />
                  {rest.map((issue) => (
                    <IssueCard
                      key={issue.id}
                      issue={issue}
                      onSelect={onSelect}
                      onStartDebate={onStartDebate}
                      isSelected={selectedIssue?.id === issue.id}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        <IssueDetailPanel
          issue={selectedIssue}
          onClose={() => onSelect(null as unknown as TrendIssue)}
          onStartDebate={onStartDebate}
        />
      </div>
    </>
  );
}

function Hero({
  onStartRandom,
  onOpenStories,
}: {
  onStartRandom: () => void;
  onOpenStories: () => void;
}) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-gradient-to-br from-[#171c2a] via-[#0f1320] to-[#0a0c14]">
      <div className="grid gap-6 p-6 sm:p-8 md:grid-cols-[1.1fr_0.9fr] md:items-center md:gap-10">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/10 px-3 py-1 text-[11px] font-medium text-[var(--accent)]">
            <span className="live-dot h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
            오늘의 시사 토론 아레나
          </div>
          <h1 className="text-2xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
            궁금한 이슈, 그냥 보지 말고
            <br />
            <span className="bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] bg-clip-text text-transparent">
              AI랑 한 판 붙어보세요.
            </span>
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-white/75 sm:text-base">
            실시간 트렌드를 한눈에 보고, 마음에 드는 봇을 골라 1:1로 토론합니다.
            점잖은 진행자부터 직설적인 형까지, 4명의 AI가 당신의 논리력을
            마주합니다.
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={onStartRandom}
              className="rounded-xl bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_32px_-12px_rgba(255,77,109,0.7)] transition hover:bg-[#ff6680]"
            >
              지금 뜨는 이슈로 토론 시작 →
            </button>
            <button
              onClick={onOpenStories}
              className="rounded-xl border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white/90 transition hover:border-white/30 hover:text-white sm:hidden"
            >
              릴스로 탐색
            </button>
          </div>
        </div>

        <PersonaPreview />
      </div>

      <div
        className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[var(--accent)]/20 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-24 right-1/4 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl"
        aria-hidden
      />
    </section>
  );
}

function PersonaPreview() {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-4 backdrop-blur">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-white/70">
          오늘의 토론 상대
        </span>
        <span className="text-[11px] text-white/50">4명 중 골라요</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {PERSONAS.map((p) => (
          <div
            key={p.id}
            className="relative flex h-[88px] flex-col justify-between overflow-hidden rounded-xl border border-white/10 p-2.5"
          >
            <div
              className={`absolute inset-0 -z-10 bg-gradient-to-br opacity-90 ${p.gradient}`}
            />
            <div className="absolute inset-0 -z-10 bg-black/45" />
            <div className="flex items-center justify-between">
              <span className="text-xl drop-shadow">{p.emoji}</span>
              <span className="rounded-full bg-black/40 px-1.5 py-0.5 text-[9px] font-medium text-white/80">
                {p.recommendedDifficulty}
              </span>
            </div>
            <div>
              <div className="text-[12px] font-semibold text-white">
                {p.shortName}
              </div>
              <div className="line-clamp-1 text-[10px] text-white/75">
                {p.tagline}
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[11px] leading-relaxed text-white/60">
        이슈에서 ‘토론 시작’을 누르면 봇·난이도·라운드를 정해 토론방으로
        들어갑니다.
      </p>
    </div>
  );
}

function SectionLabel({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="rounded-md bg-white/10 px-2 py-0.5 text-[11px] font-semibold text-white">
        {title}
      </span>
      <span className="text-[11px] text-[var(--muted)]">{desc}</span>
    </div>
  );
}

function SkeletonList() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="h-32 animate-pulse rounded-2xl border border-[var(--border)] bg-white/5"
        />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--background-elev)]/40 p-10 text-center text-sm text-[var(--muted)]">
      해당 카테고리의 이슈가 아직 없습니다. 다른 카테고리를 둘러보세요.
    </div>
  );
}
