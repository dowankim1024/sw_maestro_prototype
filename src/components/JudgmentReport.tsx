"use client";

import type { DebateResult } from "@/lib/types";

const SCORE_LABELS: { key: keyof DebateResult["scores"]; label: string }[] = [
  { key: "logic", label: "논리력" },
  { key: "evidence", label: "근거 활용" },
  { key: "rebuttal", label: "반박 대응" },
  { key: "emotionalControl", label: "감정 조절" },
  { key: "persuasion", label: "설득력" },
];

export function JudgmentReport({
  result,
  onClose,
  onRetry,
  onHome,
}: {
  result: DebateResult;
  onClose?: () => void;
  onRetry: () => void;
  onHome: () => void;
}) {
  const total = SCORE_LABELS.reduce(
    (acc, { key }) => acc + result.scores[key],
    0,
  );
  const avg = Math.round(total / SCORE_LABELS.length);

  const verdictColor =
    result.finalVerdict === "사용자 우세"
      ? "from-emerald-500/20 to-cyan-500/10 border-emerald-400/40 text-emerald-300"
      : result.finalVerdict === "AI 우세"
        ? "from-rose-500/20 to-orange-500/10 border-rose-400/40 text-rose-300"
        : "from-amber-500/15 to-amber-500/5 border-amber-400/40 text-amber-300";

  return (
    <div className="fade-up mx-auto max-w-3xl space-y-5">
      <header className="flex items-start justify-between gap-4">
        <div>
          <div className="text-[11px] uppercase tracking-widest text-[var(--muted)]">
            판단 AI 리포트
          </div>
          <h2 className="mt-1 text-xl font-semibold text-white sm:text-2xl">
            {result.issueTitle}
          </h2>
          <p className="mt-1 text-xs text-[var(--muted)]">
            상대 {result.personaName} · 난이도 {result.difficulty} · 총{" "}
            {result.totalRounds}라운드 ·{" "}
            {new Date(result.createdAt).toLocaleString("ko-KR")}
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="rounded-md border border-[var(--border)] bg-white/5 px-2 py-1 text-xs text-[var(--muted)] hover:text-white"
          >
            ✕
          </button>
        )}
      </header>

      {/* 최종 판정 */}
      <div
        className={`rounded-2xl border bg-gradient-to-br p-5 ${verdictColor}`}
      >
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="text-[11px] uppercase tracking-widest opacity-80">
              최종 판정
            </div>
            <div className="mt-1 text-2xl font-bold sm:text-3xl">
              {result.finalVerdict}
            </div>
            <div className="mt-1 text-xs opacity-80">
              내 입장: {result.userStance} · AI 입장: {result.aiStance}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[11px] uppercase tracking-widest opacity-80">
              종합 점수
            </div>
            <div className="font-mono text-3xl font-bold text-white sm:text-4xl">
              {avg}
              <span className="text-base font-medium opacity-70">/100</span>
            </div>
            <div className="text-xs opacity-80">합계 {total}점</div>
          </div>
        </div>
      </div>

      {/* 점수 카드들 */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {SCORE_LABELS.map(({ key, label }) => (
          <ScoreCard key={key} label={label} value={result.scores[key]} />
        ))}
      </div>

      {/* 요약 */}
      <Section title="전체 요약">
        <p className="text-sm leading-relaxed text-white/85">
          {result.feedback.summary}
        </p>
      </Section>

      <div className="grid gap-4 sm:grid-cols-2">
        <Section title="잘한 점">
          <FeedbackList items={result.feedback.strengths} tone="positive" />
        </Section>
        <Section title="보완할 점">
          <FeedbackList items={result.feedback.weaknesses} tone="negative" />
        </Section>
      </div>

      {result.feedback.fallacies.length > 0 && (
        <Section title="논리적 오류 가능성">
          <FeedbackList items={result.feedback.fallacies} tone="warn" />
        </Section>
      )}

      <Section title="다음 토론 팁">
        <FeedbackList items={result.feedback.nextTips} tone="info" />
      </Section>

      <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:justify-end">
        <button
          onClick={onHome}
          className="rounded-lg border border-[var(--border)] bg-white/5 px-4 py-2 text-sm text-white/80 hover:text-white"
        >
          홈으로
        </button>
        <button
          onClick={onRetry}
          className="rounded-lg bg-[var(--accent)] px-5 py-2 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(255,77,109,0.7)] hover:bg-[#ff6680]"
        >
          같은 주제로 다시 토론
        </button>
      </div>

      <p className="pt-2 text-center text-[11px] text-[var(--muted)]">
        판정은 자극적이지 않게 설계되었으며, 사용자의 논리적 성장을 돕는 코칭
        목적의 점수입니다.
      </p>
    </div>
  );
}

function ScoreCard({ label, value }: { label: string; value: number }) {
  const color =
    value >= 80
      ? "text-emerald-300"
      : value >= 60
        ? "text-cyan-300"
        : value >= 40
          ? "text-amber-300"
          : "text-rose-300";
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--background-card)] p-4">
      <div className="text-[10px] uppercase tracking-widest text-[var(--muted)]">
        {label}
      </div>
      <div className={`mt-1 font-mono text-2xl font-bold ${color}`}>
        {value}
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)]"
          style={{ width: `${value}%` }}
        />
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
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--background-card)] p-4 sm:p-5">
      <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-[var(--muted)]">
        {title}
      </h3>
      {children}
    </section>
  );
}

function FeedbackList({
  items,
  tone,
}: {
  items: string[];
  tone: "positive" | "negative" | "warn" | "info";
}) {
  const dot =
    tone === "positive"
      ? "bg-emerald-400"
      : tone === "negative"
        ? "bg-rose-400"
        : tone === "warn"
          ? "bg-amber-400"
          : "bg-cyan-400";
  return (
    <ul className="space-y-1.5 text-[13px] leading-relaxed text-white/85">
      {items.map((it, idx) => (
        <li key={idx} className="flex gap-2">
          <span
            className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${dot}`}
            aria-hidden
          />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}
