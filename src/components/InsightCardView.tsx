"use client";

import { useState } from "react";
import { getCharacter } from "@/lib/characters";
import { shareTextFor } from "@/lib/services";
import type { InsightCard } from "@/lib/types";

interface Props {
  card: InsightCard;
  onHome: () => void;
  onAnotherCharacter?: () => void;
  showHeader?: boolean;
}

/**
 * ‘오늘 새로 본 것’ 카드.
 *  - 헤드라인을 가장 크게
 *  - keyTakeaways 3개를 카드로 분리
 *  - userInsight 인용구
 *  - shareableQuote 캐릭터 클로징
 *  - 같은 이슈 다른 캐릭터로 보기
 */
export function InsightCardView({
  card,
  onHome,
  onAnotherCharacter,
  showHeader = true,
}: Props) {
  const character = getCharacter(card.characterId);
  const [copied, setCopied] = useState(false);

  async function copyShare() {
    try {
      await navigator.clipboard.writeText(shareTextFor(card));
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // ignore
    }
  }

  return (
    <section className="space-y-5 fade-up">
      {showHeader && (
        <header className="flex items-center justify-between gap-2">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--accent)]">
              오늘 새로 본 것
            </p>
            <h1 className="mt-0.5 text-lg font-bold text-[var(--foreground)] sm:text-xl">
              {card.issueTitle}
            </h1>
          </div>
          <button
            onClick={onHome}
            className="rounded-xl border border-[var(--border)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--muted)] hover:border-[var(--border-strong)] hover:text-[var(--foreground)]"
          >
            홈으로
          </button>
        </header>
      )}

      {/* 헤드라인 카드 */}
      <article
        className={`relative overflow-hidden rounded-3xl border border-[var(--border)] p-6 sm:p-8 ${character.gradient.includes("rose") ? "bg-gradient-to-br from-rose-50 via-white to-orange-50" : ""}`}
      >
        <div className="relative flex items-center gap-3">
          <span
            aria-hidden
            className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br shadow-sm ${character.gradient}`}
          >
            <span className="rounded-full bg-white/85 px-1.5 py-[2px] text-lg">
              {character.emoji}
            </span>
          </span>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--muted)]">
              {character.name}
            </p>
            <p className="text-[11px] text-[var(--muted)]">{card.duration}</p>
          </div>
        </div>

        <h2 className="relative mt-4 text-2xl font-extrabold leading-tight text-[var(--foreground)] sm:text-3xl">
          {card.headline}
        </h2>

        {card.degraded && (
          <p className="relative mt-3 inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-[2px] text-[11px] text-amber-800">
            ⚠️ 일부 내용이 임시 카드로 채워졌어요
          </p>
        )}
      </article>

      {/* 핵심 3가지 */}
      <div className="space-y-2">
        <h3 className="px-1 text-sm font-semibold text-[var(--foreground)]">
          오늘 새로 본 핵심 3가지
        </h3>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {card.keyTakeaways.map((kt, i) => (
            <div
              key={`${i}-${kt.concept}`}
              className="card-surface space-y-1 p-4"
            >
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--accent)]">
                #{i + 1}
              </p>
              <p className="text-[14px] font-bold text-[var(--foreground)]">
                {kt.concept}
              </p>
              <p className="text-[12px] leading-relaxed text-[var(--muted)]">
                {kt.explanation}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 사용자 관찰 */}
      <div className="card-surface p-5">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--muted)]">
          오늘 당신이 잘 짚은 한 가지
        </p>
        <blockquote className="mt-2 border-l-2 border-[var(--accent)] pl-3 text-[14px] leading-relaxed text-[var(--foreground)]">
          {card.userInsight}
        </blockquote>
      </div>

      {/* 다음 호기심 */}
      <div className="card-surface p-5">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--muted)]">
          다음에 더 궁금해질 만한 지점
        </p>
        <p className="mt-1.5 text-[14px] leading-relaxed text-[var(--foreground)]">
          {card.nextCuriosity}
        </p>
      </div>

      {/* 공유 인용 */}
      <div className="rounded-3xl border border-[var(--border-strong)] bg-[var(--accent-soft)] p-5">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--accent)]">
          공유용 한 줄
        </p>
        <p className="mt-2 text-[16px] font-bold leading-snug text-[var(--foreground)]">
          “{card.shareableQuote}” — {character.name}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            onClick={copyShare}
            className="rounded-xl bg-[var(--foreground)] px-3 py-2 text-xs font-semibold text-white hover:bg-black"
          >
            {copied ? "복사 완료" : "공유 텍스트 복사"}
          </button>
          {onAnotherCharacter && (
            <button
              onClick={onAnotherCharacter}
              className="rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-xs font-semibold text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              같은 이슈, 다른 캐릭터로 보기
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
