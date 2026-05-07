"use client";

import { CHARACTERS } from "@/lib/characters";
import { factLabelText } from "@/lib/services";
import type { CharacterId, Issue } from "@/lib/types";
import { CharacterAngleCard } from "./CharacterAngleCard";
import { DisclaimerNotice } from "./DisclaimerNotice";
import { FactBadge } from "./FactBadge";
import { ReactionButtons } from "./ReactionButtons";
import { SourceList } from "./SourceList";

interface Props {
  issue: Issue;
  onChat: (characterId: CharacterId) => void;
  onBack: () => void;
}

/**
 * 이슈 상세 화면.
 * 화면 순서: 제목·요약 → 면책 → 핵심 팩트 → 왜 지금 → 캐릭터별 관점 → 빠른 반응 → 출처
 */
export function IssueDetail({ issue, onChat, onBack }: Props) {
  return (
    <section className="space-y-5 fade-up">
      <header className="flex items-start gap-3">
        <button
          onClick={onBack}
          aria-label="뒤로"
          className="rounded-full border border-[var(--border)] bg-white px-3 py-1.5 text-xs text-[var(--muted)] hover:border-[var(--border-strong)]"
        >
          ←
        </button>
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
            <span className="snack-30">⏱ 30초로 이해할 이슈</span>
            <span className="rounded-full border border-[var(--border)] bg-white px-2 py-[2px] text-[10px] font-semibold text-[var(--muted)]">
              {issue.category}
            </span>
            <time
              className="text-[11px] text-[var(--muted)]"
              dateTime={issue.updatedAt}
            >
              업데이트 {formatRelative(issue.updatedAt)}
            </time>
          </div>
          <h1 className="text-2xl font-extrabold leading-tight text-[var(--foreground)] sm:text-3xl">
            {issue.title}
          </h1>
          <p className="mt-2 text-[14px] leading-relaxed text-[var(--muted)]">
            {issue.summary}
          </p>
        </div>
      </header>

      <DisclaimerNotice issue={issue} />

      {/* 핵심 사실 */}
      <section className="card-surface space-y-3 p-5">
        <header className="flex items-baseline justify-between">
          <h2 className="text-sm font-bold text-[var(--foreground)]">핵심 사실</h2>
          <span className="text-[11px] text-[var(--muted)]">
            출처는 매 사실마다 라벨로 표시
          </span>
        </header>
        <ul className="space-y-2.5">
          {issue.facts.map((f, i) => {
            const sources = issue.sources.filter((s) =>
              f.sourceIds.includes(s.id),
            );
            return (
              <li key={f.id} className="flex gap-2.5">
                <span className="mt-[3px] inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--background)] text-[10px] font-bold text-[var(--muted)]">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-1">
                    <FactBadge kind={f.confidence} />
                    <span className="text-[10px] text-[var(--muted-2)]">
                      {factLabelText(f.confidence)} 라벨
                    </span>
                  </div>
                  <p className="text-[14px] leading-relaxed text-[var(--foreground)]">
                    {f.statement}
                  </p>
                  {sources.length > 0 && (
                    <p className="mt-1 text-[11px] text-[var(--muted)]">
                      출처: {sources.map((s) => s.publisher).join(" · ")}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {/* 왜 지금 뜨는지 */}
      <section className="card-surface p-5">
        <h2 className="text-sm font-bold text-[var(--foreground)]">왜 지금 뜨는지</h2>
        <p className="mt-2 text-[14px] leading-relaxed text-[var(--foreground)]/85">
          {issue.whyNow}
        </p>
      </section>

      {/* 캐릭터별 관점 카드 */}
      <section className="space-y-3">
        <header className="flex items-baseline justify-between px-1">
          <h2 className="text-base font-bold text-[var(--foreground)] sm:text-lg">
            같은 이슈, 4명의 시각
          </h2>
          <span className="text-[11px] text-[var(--muted)]">
            한 명만 빠르게 봐도 OK
          </span>
        </header>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {CHARACTERS.map((c) => {
            const angle = issue.characterAngles.find(
              (a) => a.characterId === c.id,
            );
            if (!angle) return null;
            return (
              <CharacterAngleCard
                key={c.id}
                issue={issue}
                angle={angle}
                onChat={() => onChat(c.id)}
              />
            );
          })}
        </div>
      </section>

      {/* 빠른 반응 */}
      <section className="card-surface space-y-3 p-5">
        <header>
          <h2 className="text-sm font-bold text-[var(--foreground)]">빠른 반응</h2>
          <p className="text-[11px] text-[var(--muted)]">
            댓글 대신 한 번 톡 — 이 이슈가 어땠어요?
          </p>
        </header>
        <ReactionButtons issueId={issue.id} />
      </section>

      {/* 출처 */}
      <section className="card-surface p-5">
        <SourceList sources={issue.sources} />
      </section>
    </section>
  );
}

function formatRelative(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const diff = Date.now() - d.getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "방금";
  if (min < 60) return `${min}분 전`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}시간 전`;
  return `${d.getMonth() + 1}/${d.getDate()}`;
}
