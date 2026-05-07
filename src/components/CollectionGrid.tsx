"use client";

import { CHARACTERS, getCharacter } from "@/lib/characters";
import type { CharacterId, InsightCard } from "@/lib/types";
import { useMemo, useState } from "react";

interface Props {
  cards: InsightCard[];
  onOpen: (card: InsightCard) => void;
  onClear: () => void;
  onDelete: (id: string) => void;
}

type Filter = "all" | CharacterId;

/**
 * 06 §15.5 — 카드 컬렉션.
 * 점수·등급 표현 없이 ‘누적된 관점’을 보여주는 데 집중한다.
 */
export function CollectionGrid({ cards, onOpen, onClear, onDelete }: Props) {
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = useMemo(
    () => (filter === "all" ? cards : cards.filter((c) => c.characterId === filter)),
    [cards, filter],
  );

  const stats = useMemo(() => collectStats(cards), [cards]);

  if (cards.length === 0) {
    return (
      <div className="card-surface p-10 text-center">
        <p className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--background)] text-2xl">
          📚
        </p>
        <h3 className="mt-3 text-base font-bold text-[var(--foreground)]">
          아직 모은 카드가 없어요
        </h3>
        <p className="mt-1 text-[12px] text-[var(--muted)]">
          이슈 하나를 골라 캐릭터와 30초 이야기 나눠보면, 여기 ‘오늘 새로 본 것’ 카드가 쌓여요.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <header className="card-surface flex flex-wrap items-center gap-3 p-4">
        <div className="flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--muted)]">
            누적
          </p>
          <p className="text-sm font-bold text-[var(--foreground)]">
            오늘까지 본 관점 {cards.length}개 · 다양한 캐릭터 {stats.uniqueCharacters}명 · 새로 본 키워드 {stats.uniqueKeywords}개
          </p>
        </div>
        <button
          onClick={onClear}
          className="rounded-xl border border-[var(--border)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--muted)] hover:border-rose-400 hover:text-rose-500"
        >
          모두 비우기
        </button>
      </header>

      {/* 필터 */}
      <div className="flex flex-wrap gap-1.5">
        <FilterChip
          active={filter === "all"}
          label={`전체 ${cards.length}`}
          onClick={() => setFilter("all")}
        />
        {CHARACTERS.map((c) => {
          const count = cards.filter((card) => card.characterId === c.id).length;
          if (count === 0) return null;
          return (
            <FilterChip
              key={c.id}
              active={filter === c.id}
              label={`${c.shortName} ${count}`}
              onClick={() => setFilter(c.id)}
            />
          );
        })}
      </div>

      {/* 카드 그리드 */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {filtered.map((card) => (
          <CardItem
            key={card.id}
            card={card}
            onOpen={() => onOpen(card)}
            onDelete={() => onDelete(card.id)}
          />
        ))}
      </div>
    </div>
  );
}

function FilterChip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "rounded-full border px-3 py-1 text-xs font-semibold transition",
        active
          ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
          : "border-[var(--border)] bg-white text-[var(--muted)] hover:border-[var(--border-strong)] hover:text-[var(--foreground)]",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

function CardItem({
  card,
  onOpen,
  onDelete,
}: {
  card: InsightCard;
  onOpen: () => void;
  onDelete: () => void;
}) {
  const character = getCharacter(card.characterId);
  return (
    <article className="card-surface flex flex-col gap-2 p-4 fade-up">
      <header className="flex items-center gap-2">
        <span
          aria-hidden
          className={`flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br shadow-sm ${character.gradient}`}
        >
          <span className="rounded-full bg-white/85 px-1 py-[1px] text-[12px]">
            {character.emoji}
          </span>
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[11px] text-[var(--muted)]">
            {character.name} · {formatDate(card.createdAt)} · {card.duration}
          </p>
          <p className="truncate text-[12px] font-semibold text-[var(--foreground)]">
            {card.issueTitle}
          </p>
        </div>
      </header>

      <h3 className="line-clamp-2 text-[15px] font-bold leading-snug text-[var(--foreground)]">
        {card.headline}
      </h3>

      <ul className="space-y-0.5 text-[12px] text-[var(--muted)]">
        {card.keyTakeaways.slice(0, 3).map((kt, i) => (
          <li key={`${i}-${kt.concept}`} className="truncate">
            <span className="font-semibold text-[var(--foreground)]">
              {kt.concept}
            </span>{" "}
            — {kt.explanation}
          </li>
        ))}
      </ul>

      <footer className="mt-1 flex items-center justify-between border-t border-[var(--border)] pt-2">
        <button
          onClick={onOpen}
          className="text-[12px] font-semibold text-[var(--accent)] hover:underline"
        >
          카드 다시 보기 →
        </button>
        <button
          onClick={onDelete}
          aria-label="카드 삭제"
          className="rounded-md px-2 py-1 text-[11px] text-[var(--muted)] hover:bg-rose-50 hover:text-rose-500"
        >
          삭제
        </button>
      </footer>
    </article>
  );
}

function collectStats(cards: InsightCard[]) {
  const characters = new Set(cards.map((c) => c.characterId));
  const keywords = new Set<string>();
  cards.forEach((c) => c.keyTakeaways.forEach((kt) => keywords.add(kt.concept)));
  return {
    uniqueCharacters: characters.size,
    uniqueKeywords: keywords.size,
  };
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const now = new Date();
  const sameDay =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();
  if (sameDay) return "오늘";
  return `${d.getMonth() + 1}/${d.getDate()}`;
}
