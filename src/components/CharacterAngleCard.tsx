import { getCharacter } from "@/lib/characters";
import { resolveAngleFacts } from "@/lib/services";
import type { CharacterAngle, Issue } from "@/lib/types";
import { FactBadge } from "./FactBadge";

interface Props {
  issue: Issue;
  angle: CharacterAngle;
  onChat?: () => void;
  compact?: boolean;
}

/**
 * 같은 이슈를 캐릭터별 시각으로 보여주는 30초 카드.
 * 캐릭터 관점 카드.
 */
export function CharacterAngleCard({ issue, angle, onChat, compact = false }: Props) {
  const character = getCharacter(angle.characterId);
  const facts = resolveAngleFacts(issue, angle);

  return (
    <article className="card-surface flex h-full flex-col gap-3 overflow-hidden p-4 sm:p-5 fade-up">
      <header className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br text-lg shadow-sm ${character.gradient}`}
          aria-hidden
        >
          <span className="rounded-full bg-white/85 px-1.5 py-[2px] text-base">
            {character.emoji}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-sm font-bold text-[var(--foreground)]">
              {character.name}
            </h3>
            <span className="rounded-full border border-[var(--border-strong)] bg-[var(--background)] px-2 py-[1px] text-[10px] font-semibold text-[var(--muted)]">
              {character.tone}
            </span>
          </div>
          <p className="text-[11px] text-[var(--muted)]">{angle.lensLabel}</p>
        </div>
        <span className="snack-30">⏱ 30초</span>
      </header>

      <p className="text-[15px] font-semibold leading-snug text-[var(--foreground)]">
        “{angle.oneLiner}”
      </p>

      {!compact && (
        <p className="whitespace-pre-line text-[13px] leading-relaxed text-[var(--foreground)]/90">
          {angle.viewpoint}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-1.5">
        <FactBadge kind="opinion" />
        {facts.slice(0, 2).map((f) => (
          <FactBadge key={f.id} kind={f.confidence} />
        ))}
        {facts.length > 0 && (
          <span className="text-[11px] text-[var(--muted)]">
            사실 {facts.length}건 위에 얹은 시각
          </span>
        )}
      </div>

      <p className="text-[11px] italic text-[var(--muted)]">
        {angle.opinionDisclaimer}
      </p>

      {onChat && (
        <button
          onClick={onChat}
          className="mt-auto inline-flex items-center justify-center gap-1 rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#d44141]"
        >
          {character.shortName}와 더 대화하기 →
        </button>
      )}
    </article>
  );
}
