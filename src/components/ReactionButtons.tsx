"use client";

import {
  REACTION_LABELS,
  type CharacterId,
  type ReactionKind,
} from "@/lib/types";
import { reactionsFor, toggleReaction, loadReactions } from "@/lib/storage";
import { useEffect, useState } from "react";

interface Props {
  issueId: string;
  characterId?: CharacterId;
  /** 어떤 반응만 노출할지 제한 (선택) */
  allowed?: ReactionKind[];
  size?: "sm" | "md";
  className?: string;
}

const ICON: Record<ReactionKind, string> = {
  like: "👍",
  dislike: "👎",
  newToMe: "🆕",
  moreCurious: "🔍",
  loveCharacter: "💛",
  tryAnother: "🔄",
};

const DEFAULT_KINDS: ReactionKind[] = [
  "like",
  "newToMe",
  "moreCurious",
  "dislike",
];

/**
 * 자유 텍스트 댓글 대신 빠른 반응 버튼.
 * 단순 토글 저장 (localStorage).
 */
export function ReactionButtons({
  issueId,
  characterId,
  allowed = DEFAULT_KINDS,
  size = "md",
  className = "",
}: Props) {
  const [active, setActive] = useState<Set<ReactionKind>>(new Set());

  useEffect(() => {
    let mounted = true;
    queueMicrotask(() => {
      if (!mounted) return;
      const list = loadReactions();
      setActive(reactionsFor({ issueId, characterId, reactions: list }));
    });
    return () => {
      mounted = false;
    };
  }, [issueId, characterId]);

  const onClick = (kind: ReactionKind) => {
    const next = toggleReaction({ issueId, characterId, kind });
    setActive(reactionsFor({ issueId, characterId, reactions: next }));
  };

  const padding = size === "sm" ? "px-2.5 py-1 text-[11px]" : "px-3 py-1.5 text-xs";

  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {allowed.map((kind) => {
        const isOn = active.has(kind);
        return (
          <button
            key={kind}
            type="button"
            onClick={() => onClick(kind)}
            className={[
              "inline-flex items-center gap-1.5 rounded-full border font-medium transition",
              padding,
              isOn
                ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
                : "border-[var(--border)] bg-white text-[var(--muted)] hover:border-[var(--border-strong)] hover:text-[var(--foreground)]",
            ].join(" ")}
            aria-pressed={isOn}
          >
            <span aria-hidden>{ICON[kind]}</span>
            {REACTION_LABELS[kind]}
          </button>
        );
      })}
    </div>
  );
}
