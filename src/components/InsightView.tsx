"use client";

import { useState } from "react";
import { getCharacter } from "@/lib/characters";
import type { ChatInsight } from "@/lib/types";

export function InsightView({
  insight,
  onHome,
  onRetry,
  onAnother,
}: {
  insight: ChatInsight;
  onHome: () => void;
  /** 같은 이슈로 다시 대화 시작 */
  onRetry: () => void;
  /** 다른 캐릭터와 같은 이슈 */
  onAnother: () => void;
}) {
  const character = getCharacter(insight.characterId);
  const hasLLMCard = !!insight.headline && !!insight.keyTakeaways?.length;

  return (
    <div className="fade-up mx-auto max-w-3xl space-y-5">
      <header className="flex items-start justify-between gap-4">
        <div>
          <div className="text-[11px] uppercase tracking-widest text-[var(--muted)]">
            오늘의 인사이트
          </div>
          <h2 className="mt-1 text-xl font-semibold leading-snug text-white sm:text-2xl">
            {insight.issueTitle}
          </h2>
          <p className="mt-1 text-xs text-[var(--muted)]">
            {character.emoji} {character.name}와 함께 ·{" "}
            {new Date(insight.createdAt).toLocaleString("ko-KR")}
            {insight.duration ? ` · ${insight.duration}` : null}
          </p>
        </div>
      </header>

      {/* 메인 인사이트 카드 (LLM 생성 우선) */}
      <div className="relative overflow-hidden rounded-2xl border border-white/15 p-5 sm:p-6">
        <div
          className={`absolute inset-0 -z-10 bg-gradient-to-br opacity-90 ${character.gradient}`}
        />
        <div className="absolute inset-0 -z-10 bg-black/55" />

        <div className="space-y-5 text-white">
          {/* 헤드라인 */}
          {hasLLMCard && (
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-widest text-white/70">
                ✨ 오늘 알게 된 것
              </div>
              <h3 className="mt-1.5 text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
                {insight.headline}
              </h3>
            </div>
          )}

          {/* 핵심 3가지 */}
          {insight.keyTakeaways && insight.keyTakeaways.length > 0 ? (
            <div>
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-white/70">
                핵심 3가지
              </div>
              <div className="grid gap-2 sm:grid-cols-3">
                {insight.keyTakeaways.map((it, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-white/15 bg-black/30 p-3 backdrop-blur"
                  >
                    <div className="text-[11px] font-semibold text-white/70">
                      #{i + 1}
                    </div>
                    <div className="mt-0.5 text-sm font-semibold text-white">
                      {it.concept}
                    </div>
                    <p className="mt-1 text-[12px] leading-relaxed text-white/80">
                      {it.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-white/80">
                ✨ 새로 알게 된 것
              </div>
              <ul className="space-y-1.5 text-[14px] leading-relaxed">
                {insight.newlyLearned.map((s, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 사용자 관찰 (인용구) */}
          {insight.userInsight && (
            <blockquote className="rounded-xl border-l-2 border-white/40 bg-black/25 px-4 py-3 text-[13px] italic leading-relaxed text-white/90">
              “{insight.userInsight}”
              <div className="not-italic mt-1 text-[10px] font-semibold uppercase tracking-widest text-white/50">
                — 오늘 사용자가 던진 관찰
              </div>
            </blockquote>
          )}

          {/* 다음 호기심 */}
          {insight.nextCuriosity && (
            <div className="rounded-xl border border-white/15 bg-black/25 p-3">
              <div className="text-[11px] font-semibold uppercase tracking-widest text-amber-200/90">
                다음에 더 궁금해질 것
              </div>
              <p className="mt-1 text-[13px] leading-relaxed text-white/90">
                {insight.nextCuriosity}
              </p>
            </div>
          )}

          {/* 캐릭터 클로징 / 공유 인용 */}
          <div className="flex items-start gap-3 rounded-xl border border-white/20 bg-black/30 p-3 backdrop-blur">
            <span className="text-2xl">{character.emoji}</span>
            <p className="text-[13px] leading-relaxed text-white/90">
              “{insight.shareableQuote || insight.characterClosing}”
            </p>
          </div>
        </div>
      </div>

      {/* 보조: 기존 칸 (이미 알고 있던 것 / 더 보고 싶은 것) */}
      {(insight.alreadyKnew.length > 0 || insight.wantToExplore.length > 0) && (
        <div className="grid gap-4 sm:grid-cols-2">
          {insight.alreadyKnew.length > 0 && (
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-card)] p-4">
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-emerald-300">
                이미 잘 알고 있던 것
              </div>
              <ul className="space-y-1.5 text-[13px] leading-relaxed text-white/85">
                {insight.alreadyKnew.map((s, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-300" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {insight.wantToExplore.length > 0 && (
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-card)] p-4">
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-amber-300">
                더 보고 싶은 것
              </div>
              <ul className="space-y-1.5 text-[13px] leading-relaxed text-white/85">
                {insight.wantToExplore.map((s, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-300" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <ShareRow insight={insight} />

      <div className="flex flex-col gap-2 pt-1 sm:flex-row sm:justify-end">
        <button
          onClick={onHome}
          className="rounded-lg border border-[var(--border)] bg-white/5 px-4 py-2 text-sm text-white/80 hover:text-white"
        >
          홈으로
        </button>
        <button
          onClick={onAnother}
          className="rounded-lg border border-[var(--border)] bg-white/10 px-4 py-2 text-sm text-white/90 hover:bg-white/15"
        >
          다른 캐릭터와 같은 주제
        </button>
        <button
          onClick={onRetry}
          className="rounded-lg bg-[var(--accent)] px-5 py-2 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(255,77,109,0.7)] hover:bg-[#ff6680]"
        >
          이 캐릭터와 더 얘기
        </button>
      </div>

      <p className="pt-2 text-center text-[11px] text-[var(--muted)]">
        점수도 우열도 없습니다. 오늘은 조금 더 깊게 이 주제를 짚어봤어요.
      </p>
    </div>
  );
}

function ShareRow({ insight }: { insight: ChatInsight }) {
  const [copied, setCopied] = useState(false);

  const lines = [
    insight.headline ? `📌 ${insight.headline}` : null,
    insight.shareableQuote ? `“${insight.shareableQuote}”` : null,
    insight.keyTakeaways && insight.keyTakeaways.length > 0
      ? insight.keyTakeaways
          .slice(0, 3)
          .map((t, i) => `${i + 1}. ${t.concept} — ${t.explanation}`)
          .join("\n")
      : null,
    `— TrendArena · ${insight.characterName}`,
  ].filter(Boolean) as string[];
  const shareText = lines.join("\n");

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // ignore
    }
  }

  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-[var(--border)] bg-[var(--background-card)] p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-widest text-[var(--muted)]">
          공유 카드
        </div>
        <p className="mt-0.5 text-xs text-white/75">
          핵심 3가지 + 캐릭터 한 줄을 자동으로 묶어서 복사해요.
        </p>
      </div>
      <button
        onClick={handleCopy}
        className="self-start rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15 sm:self-auto"
      >
        {copied ? "복사 완료!" : "공유 텍스트 복사"}
      </button>
    </div>
  );
}
