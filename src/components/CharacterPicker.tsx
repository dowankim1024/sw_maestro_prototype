"use client";

import { CHARACTERS } from "@/lib/characters";
import type { Character, CharacterId } from "@/lib/types";

export function CharacterPicker({
  value,
  onChange,
  variant = "card",
}: {
  value: CharacterId;
  onChange: (id: CharacterId) => void;
  variant?: "compact" | "card";
}) {
  if (variant === "compact") {
    return (
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {CHARACTERS.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => onChange(c.id)}
            className={[
              "relative overflow-hidden rounded-xl border p-2.5 text-left transition",
              c.id === value
                ? "border-white/40 ring-1 ring-white/30"
                : "border-[var(--border)] hover:border-white/20",
            ].join(" ")}
          >
            <div
              className={`absolute inset-0 -z-10 bg-gradient-to-br opacity-80 ${c.gradient}`}
              aria-hidden
            />
            <div className="absolute inset-0 -z-10 bg-black/55" aria-hidden />
            <div className="flex items-center gap-2">
              <span className="text-xl">{c.emoji}</span>
              <div className="min-w-0">
                <div className="truncate text-xs font-semibold text-white">
                  {c.shortName}
                </div>
                <div className="line-clamp-1 text-[10px] text-white/70">
                  {c.oneLiner}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {CHARACTERS.map((c) => (
        <CharacterCard
          key={c.id}
          character={c}
          active={c.id === value}
          onClick={() => onChange(c.id)}
        />
      ))}
    </div>
  );
}

function CharacterCard({
  character,
  active,
  onClick,
}: {
  character: Character;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "relative flex h-[148px] flex-col justify-between overflow-hidden rounded-2xl border p-3 text-left transition",
        active
          ? "border-white/50 ring-2 ring-white/40"
          : "border-[var(--border)] hover:border-white/20",
      ].join(" ")}
    >
      <div
        className={`absolute inset-0 -z-10 bg-gradient-to-br opacity-95 ${character.gradient}`}
        aria-hidden
      />
      <div className="absolute inset-0 -z-10 bg-black/40" aria-hidden />
      <div className="flex items-center justify-between">
        <span className="text-3xl drop-shadow-md">{character.emoji}</span>
      </div>
      <div>
        <div className="text-sm font-semibold text-white drop-shadow">
          {character.name}
        </div>
        <div className="line-clamp-2 text-[11px] text-white/85 drop-shadow">
          {character.oneLiner}
        </div>
      </div>
    </button>
  );
}
