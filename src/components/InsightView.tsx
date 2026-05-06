"use client";

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
          </p>
        </div>
      </header>

      {/* 인사이트 카드 (점수 X) */}
      <div
        className={`relative overflow-hidden rounded-2xl border border-white/15 p-5 sm:p-6`}
      >
        <div
          className={`absolute inset-0 -z-10 bg-gradient-to-br opacity-90 ${character.gradient}`}
        />
        <div className="absolute inset-0 -z-10 bg-black/55" />

        <div className="space-y-5 text-white">
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

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <div className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-white/80">
                내가 잘 알고 있던 것
              </div>
              <ul className="space-y-1.5 text-[13px] leading-relaxed">
                {insight.alreadyKnew.map((s, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-300" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-white/80">
                더 보고 싶은 것
              </div>
              <ul className="space-y-1.5 text-[13px] leading-relaxed">
                {insight.wantToExplore.map((s, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-300" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-white/20 bg-black/30 p-3 backdrop-blur">
            <span className="text-2xl">{character.emoji}</span>
            <p className="text-[13px] leading-relaxed text-white/90">
              “{insight.characterClosing}”
            </p>
          </div>
        </div>
      </div>

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
