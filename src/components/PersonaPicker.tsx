"use client";

import { PERSONAS } from "@/lib/personas";
import type { PersonaId } from "@/lib/types";

export function PersonaPicker({
  value,
  onChange,
  variant = "compact",
}: {
  value: PersonaId;
  onChange: (id: PersonaId) => void;
  variant?: "compact" | "card";
}) {
  if (variant === "card") {
    return (
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {PERSONAS.map((p) => (
          <PersonaCard
            key={p.id}
            persona={p}
            active={p.id === value}
            onClick={() => onChange(p.id)}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {PERSONAS.map((p) => (
        <button
          key={p.id}
          type="button"
          onClick={() => onChange(p.id)}
          className={[
            "relative overflow-hidden rounded-xl border p-3 text-left transition",
            p.id === value
              ? "border-white/40 ring-1 ring-white/30"
              : "border-[var(--border)] hover:border-white/20",
          ].join(" ")}
        >
          <div
            className={`absolute inset-0 -z-10 bg-gradient-to-br opacity-80 ${p.gradient}`}
            aria-hidden
          />
          <div className="absolute inset-0 -z-10 bg-black/55" aria-hidden />
          <div className="flex items-center gap-2">
            <span className="text-xl">{p.emoji}</span>
            <div className="min-w-0">
              <div className="truncate text-xs font-semibold text-white">
                {p.shortName}
              </div>
              <div className="line-clamp-1 text-[10px] text-white/70">
                {p.tagline}
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

function PersonaCard({
  persona,
  active,
  onClick,
}: {
  persona: (typeof PERSONAS)[number];
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "relative flex h-[150px] flex-col justify-between overflow-hidden rounded-2xl border p-3 text-left transition",
        active
          ? "border-white/40 ring-1 ring-white/30"
          : "border-[var(--border)] hover:border-white/20",
      ].join(" ")}
    >
      <div
        className={`absolute inset-0 -z-10 bg-gradient-to-br opacity-90 ${persona.gradient}`}
        aria-hidden
      />
      <div className="absolute inset-0 -z-10 bg-black/45" aria-hidden />
      <div className="flex items-center justify-between">
        <span className="text-2xl drop-shadow-md">{persona.emoji}</span>
        <span className="rounded-full bg-black/40 px-2 py-0.5 text-[10px] font-medium text-white/85">
          {persona.recommendedDifficulty}
        </span>
      </div>
      <div>
        <div className="text-sm font-semibold text-white">
          {persona.shortName}
        </div>
        <div className="line-clamp-2 text-[11px] text-white/80">
          {persona.tagline}
        </div>
      </div>
    </button>
  );
}
