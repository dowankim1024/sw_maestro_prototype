"use client";

import { useEffect, useMemo, useState } from "react";
import { Brand } from "@/components/Brand";
import { CategoryChips } from "@/components/CategoryChips";
import { ChatRoom } from "@/components/ChatRoom";
import { CollectionGrid } from "@/components/CollectionGrid";
import { InsightCardView } from "@/components/InsightCardView";
import { IssueCard } from "@/components/IssueCard";
import { IssueDetail } from "@/components/IssueDetail";
import { ReelsMode } from "@/components/ReelsMode";
import {
  buildInsightCard,
  fetchTodayIssues,
  getRecommendedNextCharacter,
} from "@/lib/services";
import {
  clearInsightCards,
  deleteInsightCard,
  loadInsightCards,
  loadSeenIssues,
  markIssueSeen,
  saveInsightCard,
} from "@/lib/storage";
import {
  ISSUE_CATEGORIES,
  type CharacterId,
  type ChatTurn,
  type InsightCard,
  type Issue,
  type IssueCategory,
} from "@/lib/types";

// ---------------------------------------------------------------------------
// View state
// ---------------------------------------------------------------------------

type View =
  | { kind: "home" }
  | { kind: "issue"; issue: Issue }
  | { kind: "chat"; issue: Issue; characterId: CharacterId }
  | { kind: "insight"; card: InsightCard }
  | { kind: "collection" };

type Tab = "home" | "collection";

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function Page() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>({ kind: "home" });
  const [activeCategory, setActiveCategory] = useState<IssueCategory | "전체">(
    "전체",
  );
  const [cards, setCards] = useState<InsightCard[]>([]);
  const [seenIssueIds, setSeenIssueIds] = useState<string[]>([]);
  const [reelsState, setReelsState] = useState<{
    open: boolean;
    initialIssueId?: string;
  }>({ open: false });

  // 초기 로딩
  useEffect(() => {
    let active = true;
    fetchTodayIssues().then((data) => {
      if (!active) return;
      setIssues(data);
      setLoading(false);
    });
    queueMicrotask(() => {
      if (!active) return;
      setCards(loadInsightCards());
      setSeenIssueIds(loadSeenIssues());
    });
    return () => {
      active = false;
    };
  }, []);

  // 필터된 이슈 + 카테고리별 카운트
  const counts = useMemo(() => {
    const c: Partial<Record<IssueCategory | "전체", number>> = {
      전체: issues.length,
    };
    for (const cat of ISSUE_CATEGORIES) {
      c[cat] = issues.filter((i) => i.category === cat).length;
    }
    return c;
  }, [issues]);

  const filtered = useMemo(() => {
    if (activeCategory === "전체") return issues;
    return issues.filter((i) => i.category === activeCategory);
  }, [issues, activeCategory]);

  // 현재 활성 탭 (홈 vs 컬렉션)
  const tab: Tab = view.kind === "collection" ? "collection" : "home";

  // ── 핸들러 ───────────────────────────────────────────────────────────────

  function openIssue(issue: Issue) {
    markIssueSeen(issue.id);
    setSeenIssueIds(loadSeenIssues());
    setView({ kind: "issue", issue });
  }

  function startChat(issue: Issue, characterId: CharacterId) {
    setView({ kind: "chat", issue, characterId });
  }

  async function finishChat(turns: ChatTurn[]) {
    if (view.kind !== "chat") return;
    const card = await buildInsightCard({
      issue: view.issue,
      characterId: view.characterId,
      turns,
    });
    saveInsightCard(card);
    setCards(loadInsightCards());
    setView({ kind: "insight", card });
  }

  function openCard(card: InsightCard) {
    setView({ kind: "insight", card });
  }

  function tryAnotherCharacter(card: InsightCard) {
    const issue = issues.find((i) => i.id === card.issueId);
    if (!issue) {
      setView({ kind: "home" });
      return;
    }
    const next = getRecommendedNextCharacter({
      issue,
      currentCharacterId: card.characterId,
    });
    setView({ kind: "chat", issue, characterId: next.id });
  }

  // ── 렌더 ─────────────────────────────────────────────────────────────────

  const showShell = view.kind !== "chat"; // 채팅은 풀스크린 느낌

  return (
    <div className="flex min-h-screen flex-col">
      {showShell && (
        <Header
          tab={tab}
          collectionCount={cards.length}
          onHome={() => setView({ kind: "home" })}
          onCollection={() => setView({ kind: "collection" })}
          onOpenReels={() => setReelsState({ open: true })}
        />
      )}

      <main
        className={
          view.kind === "chat"
            ? "mx-auto w-full max-w-3xl flex-1 px-3 pb-3 pt-3 sm:px-4"
            : "mx-auto w-full max-w-5xl flex-1 px-4 pb-16 pt-4 sm:px-6"
        }
      >
        {view.kind === "home" && (
          <HomeView
            loading={loading}
            issues={filtered}
            allIssues={issues}
            counts={counts}
            activeCategory={activeCategory}
            seenIssueIds={seenIssueIds}
            onCategoryChange={setActiveCategory}
            onOpenIssue={openIssue}
            onOpenReels={() => setReelsState({ open: true })}
          />
        )}

        {view.kind === "issue" && (
          <IssueDetail
            issue={view.issue}
            onBack={() => setView({ kind: "home" })}
            onChat={(cid) => startChat(view.issue, cid)}
          />
        )}

        {view.kind === "chat" && (
          <ChatRoom
            issue={view.issue}
            characterId={view.characterId}
            onExit={() => setView({ kind: "issue", issue: view.issue })}
            onFinish={finishChat}
          />
        )}

        {view.kind === "insight" && (
          <InsightCardView
            card={view.card}
            onHome={() => setView({ kind: "home" })}
            onAnotherCharacter={() => tryAnotherCharacter(view.card)}
          />
        )}

        {view.kind === "collection" && (
          <CollectionGrid
            cards={cards}
            onOpen={openCard}
            onClear={() => {
              clearInsightCards();
              setCards([]);
            }}
            onDelete={(id) => {
              deleteInsightCard(id);
              setCards(loadInsightCards());
            }}
          />
        )}
      </main>

      {showShell && <Footer />}

      {reelsState.open && issues.length > 0 && (
        <ReelsMode
          issues={issues}
          initialIssueId={reelsState.initialIssueId}
          onClose={() => setReelsState({ open: false })}
          onOpenDetail={(i) => {
            setReelsState({ open: false });
            openIssue(i);
          }}
          onStartChat={(i, cid) => {
            setReelsState({ open: false });
            startChat(i, cid);
          }}
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Header
// ---------------------------------------------------------------------------

function Header({
  tab,
  collectionCount,
  onHome,
  onCollection,
  onOpenReels,
}: {
  tab: Tab;
  collectionCount: number;
  onHome: () => void;
  onCollection: () => void;
  onOpenReels: () => void;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--background)]/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <button onClick={onHome} className="flex items-center gap-2">
          <Brand />
        </button>
        <nav className="flex items-center gap-1.5">
          <NavButton active={tab === "home"} onClick={onHome} label="오늘의 이슈" />
          <NavButton
            active={tab === "collection"}
            onClick={onCollection}
            label={`내 카드${collectionCount > 0 ? ` ${collectionCount}` : ""}`}
          />
          <button
            onClick={onOpenReels}
            className="inline-flex items-center gap-1 rounded-xl border border-[var(--border)] bg-white px-3 py-1.5 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            title="릴스로 빠르게 넘겨보기"
          >
            <span aria-hidden>▶</span>
            <span className="hidden sm:inline">릴스</span>
            <span className="sm:hidden">릴스</span>
          </button>
        </nav>
      </div>
    </header>
  );
}

function NavButton({
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
        "rounded-xl px-3 py-1.5 text-sm font-semibold transition",
        active
          ? "bg-[var(--foreground)] text-white"
          : "text-[var(--muted)] hover:bg-[var(--background-elev)] hover:text-[var(--foreground)]",
      ].join(" ")}
      aria-pressed={active}
    >
      {label}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Home View
// ---------------------------------------------------------------------------

function HomeView({
  loading,
  issues,
  allIssues,
  counts,
  activeCategory,
  seenIssueIds,
  onCategoryChange,
  onOpenIssue,
  onOpenReels,
}: {
  loading: boolean;
  issues: Issue[];
  allIssues: Issue[];
  counts: Partial<Record<IssueCategory | "전체", number>>;
  activeCategory: IssueCategory | "전체";
  seenIssueIds: string[];
  onCategoryChange: (next: IssueCategory | "전체") => void;
  onOpenIssue: (issue: Issue) => void;
  onOpenReels: () => void;
}) {
  const top = issues.slice(0, 3);
  const rest = issues.slice(3);

  return (
    <div className="space-y-6">
      <Hero issueCount={allIssues.length} onOpenReels={onOpenReels} />

      <section className="space-y-3">
        <header className="flex items-baseline justify-between px-1">
          <div>
            <h2 className="text-base font-bold text-[var(--foreground)] sm:text-lg">
              관심사로 골라보기
            </h2>
            <p className="text-[11px] text-[var(--muted)]">
              30초만 보고 닫아도 OK
            </p>
          </div>
          <span className="text-[11px] text-[var(--muted)]">
            매일 새 이슈 업데이트
          </span>
        </header>
        <CategoryChips
          active={activeCategory}
          onChange={onCategoryChange}
          counts={counts}
        />
      </section>

      <section className="space-y-3">
        {loading ? (
          <SkeletonList />
        ) : issues.length === 0 ? (
          <Empty />
        ) : (
          <>
            {top.length > 0 && (
              <div className="space-y-2">
                <Section title="오늘 가장 먼저 볼 만한 이슈" />
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {top.map((issue) => (
                    <IssueCard
                      key={issue.id}
                      issue={issue}
                      onOpen={onOpenIssue}
                      seen={seenIssueIds.includes(issue.id)}
                    />
                  ))}
                </div>
              </div>
            )}
            {rest.length > 0 && (
              <div className="space-y-2 pt-3">
                <Section title="이어지는 이슈" subtitle="더 둘러보기" />
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.map((issue) => (
                    <IssueCard
                      key={issue.id}
                      issue={issue}
                      onOpen={onOpenIssue}
                      seen={seenIssueIds.includes(issue.id)}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}

function Hero({
  issueCount,
  onOpenReels,
}: {
  issueCount: number;
  onOpenReels: () => void;
}) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-gradient-to-br from-white via-[#fdfaf3] to-[var(--accent-soft)] p-6 sm:p-8">
      <span className="snack-30">⏱ 30초 스낵 컬처</span>
      <h1 className="mt-3 text-2xl font-extrabold leading-tight text-[var(--foreground)] sm:text-4xl">
        오늘 사람들이 말할 이슈,
        <br />
        <span className="bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] bg-clip-text text-transparent">
          4명의 시각으로 30초 안에.
        </span>
      </h1>
      <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-[var(--muted)]">
        민철·수진 교수·지오·도윤. 같은 이슈를 생활자, 전문가, 트렌드, 회의주의자 렌즈로 빠르게 짚어보고, 더 궁금하면 그 캐릭터와 이어서 대화해요. 점수도, 댓글 싸움도, 찬반 싸움도 없어요.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          onClick={onOpenReels}
          className="inline-flex items-center gap-1.5 rounded-full bg-[var(--foreground)] px-4 py-2 text-[13px] font-semibold text-white shadow-sm transition hover:opacity-90"
          title="릴스로 빠르게 넘겨보기"
        >
          <span aria-hidden>▶</span>
          릴스로 30초 훑어보기
        </button>
        <span className="inline-flex items-center gap-1 rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-semibold text-[var(--muted)]">
          오늘 도착한 이슈 {issueCount}건
        </span>
        <span className="hidden items-center gap-1 rounded-full border border-[var(--border)] bg-white/60 px-2.5 py-1 text-[11px] text-[var(--muted)] sm:inline-flex">
          데스크톱은 ↑↓ 이슈, ←→ 시각, Esc 닫기
        </span>
      </div>
    </section>
  );
}

function Section({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="flex items-baseline gap-2 px-1">
      <h3 className="text-sm font-bold text-[var(--foreground)]">{title}</h3>
      {subtitle && (
        <span className="text-[11px] text-[var(--muted)]">{subtitle}</span>
      )}
    </div>
  );
}

function SkeletonList() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="card-surface h-44 animate-pulse"
          style={{ animationDelay: `${i * 60}ms` }}
        />
      ))}
    </div>
  );
}

function Empty() {
  return (
    <div className="card-surface p-10 text-center">
      <p className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--background)] text-2xl">
        🗞️
      </p>
      <h3 className="mt-3 text-base font-bold text-[var(--foreground)]">
        이 카테고리에 아직 이슈가 없어요
      </h3>
      <p className="mt-1 text-[12px] text-[var(--muted)]">
        다른 카테고리로 바꿔서 둘러보세요.
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Footer
// ---------------------------------------------------------------------------

function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--background)]">
      <div className="mx-auto w-full max-w-5xl px-4 py-6 text-[11px] text-[var(--muted)] sm:px-6">
        <p className="leading-relaxed">
          이슈캐스트의 캐릭터 발언은 AI가 생성한 해설이며, 모든 사실은 표시된
          출처를 기준으로 확인해 주세요. 점수·등급·댓글 시스템은 두지 않습니다.
        </p>
        <p className="mt-1">© Issuecast prototype</p>
      </div>
    </footer>
  );
}
