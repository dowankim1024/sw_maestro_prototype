"use client";

import { useEffect, useState } from "react";
import { CharacterPicker } from "./CharacterPicker";
import { getCharacter } from "@/lib/characters";
import type { CharacterId, TrendIssue } from "@/lib/types";

export function ChatSetupModal({
  issue,
  open,
  initialCharacterId,
  onClose,
  onStart,
}: {
  issue: TrendIssue | null;
  open: boolean;
  initialCharacterId?: CharacterId;
  onClose: () => void;
  onStart: (config: { issue: TrendIssue; characterId: CharacterId }) => void;
}) {
  const [characterId, setCharacterId] = useState<CharacterId>(
    initialCharacterId ?? "kkang",
  );

  useEffect(() => {
    if (open) setCharacterId(initialCharacterId ?? "kkang");
  }, [open, issue?.id, initialCharacterId]);

  if (!open || !issue) return null;

  const character = getCharacter(characterId);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-6">
      <div className="fade-up w-full max-w-md overflow-hidden rounded-t-3xl border border-[var(--border)] bg-[var(--background-elev)] sm:rounded-2xl">
        <div className="border-b border-[var(--border)] p-5">
          <div className="text-[11px] uppercase tracking-widest text-[var(--muted)]">
            누구랑 얘기해볼까요?
          </div>
          <h3 className="mt-1 line-clamp-1 text-base font-semibold text-white sm:text-lg">
            {issue.title}
          </h3>
        </div>

        <div className="space-y-4 p-5">
          <CharacterPicker
            value={characterId}
            onChange={setCharacterId}
            variant="card"
          />

          <div className="rounded-xl border border-[var(--border)] bg-white/5 p-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">{character.emoji}</span>
              <div>
                <div className="text-sm font-semibold text-white">
                  {character.name}
                </div>
                <div className="text-[11px] text-[var(--muted)]">
                  {character.oneLiner}
                </div>
              </div>
            </div>
            <p className="mt-2 text-[12px] leading-relaxed text-white/75">
              {character.description}
            </p>
          </div>

          <p className="text-center text-[11px] text-[var(--muted)]">
            토론이 아니에요. 같이 짚어보는 5분짜리 대화예요.
          </p>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-[var(--border)] bg-[var(--background-card)]/60 p-4">
          <button
            onClick={onClose}
            className="rounded-lg border border-[var(--border)] bg-white/5 px-4 py-2 text-sm text-white/80 hover:text-white"
          >
            취소
          </button>
          <button
            onClick={() => onStart({ issue, characterId })}
            className="rounded-lg bg-[var(--accent)] px-5 py-2 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(255,77,109,0.7)] hover:bg-[#ff6680]"
          >
            대화 시작
          </button>
        </div>
      </div>
    </div>
  );
}
