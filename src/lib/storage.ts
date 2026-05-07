/**
 * 클라이언트 스토리지 (06 §20.4 — 로컬 우선).
 *
 * 저장 항목:
 *  - 카드 컬렉션 (오늘 새로 본 것)
 *  - 반응 (좋아요/별로예요/새로 알았어요/더 궁금해요/이 캐릭터/다른 캐릭터)
 *  - 본 이슈 기록 (재방문 표시 용)
 *
 * 추후 서버 동기화 시 동일 인터페이스로 교체할 수 있도록 함수 단위로 추상화.
 */

import type { CharacterId, InsightCard, Reaction, ReactionKind } from "./types";

const CARD_KEY = "issuecast.cards.v1";
const REACTION_KEY = "issuecast.reactions.v1";
const SEEN_KEY = "issuecast.seen.v1";

// ---------------------------------------------------------------------------
// CARDS
// ---------------------------------------------------------------------------

export function loadInsightCards(): InsightCard[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CARD_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as InsightCard[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveInsightCard(card: InsightCard): void {
  if (typeof window === "undefined") return;
  const list = loadInsightCards();
  // 동일 ID 중복 방지 (혹시라도)
  const next = [card, ...list.filter((c) => c.id !== card.id)].slice(0, 100);
  try {
    window.localStorage.setItem(CARD_KEY, JSON.stringify(next));
  } catch {
    // quota 초과 등은 무시 (MVP)
  }
}

export function deleteInsightCard(id: string): void {
  if (typeof window === "undefined") return;
  const next = loadInsightCards().filter((c) => c.id !== id);
  window.localStorage.setItem(CARD_KEY, JSON.stringify(next));
}

export function clearInsightCards(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(CARD_KEY);
}

// ---------------------------------------------------------------------------
// REACTIONS
// ---------------------------------------------------------------------------

export function loadReactions(): Reaction[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(REACTION_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Reaction[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * 같은 (issueId, characterId, kind) 조합은 토글 형태로 저장한다.
 * 이미 있으면 제거, 없으면 추가.
 */
export function toggleReaction(input: {
  issueId: string;
  characterId?: CharacterId;
  kind: ReactionKind;
}): Reaction[] {
  if (typeof window === "undefined") return [];
  const list = loadReactions();
  const exists = list.find(
    (r) =>
      r.issueId === input.issueId &&
      (r.characterId ?? null) === (input.characterId ?? null) &&
      r.kind === input.kind,
  );
  let next: Reaction[];
  if (exists) {
    next = list.filter((r) => r.id !== exists.id);
  } else {
    const created: Reaction = {
      id: `rx-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      issueId: input.issueId,
      characterId: input.characterId,
      kind: input.kind,
      createdAt: new Date().toISOString(),
    };
    next = [created, ...list].slice(0, 500);
  }
  window.localStorage.setItem(REACTION_KEY, JSON.stringify(next));
  return next;
}

export function reactionsFor(args: {
  issueId: string;
  characterId?: CharacterId;
  reactions?: Reaction[];
}): Set<ReactionKind> {
  const list = args.reactions ?? loadReactions();
  return new Set(
    list
      .filter(
        (r) =>
          r.issueId === args.issueId &&
          (r.characterId ?? null) === (args.characterId ?? null),
      )
      .map((r) => r.kind),
  );
}

// ---------------------------------------------------------------------------
// SEEN ISSUES
// ---------------------------------------------------------------------------

export function loadSeenIssues(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(SEEN_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as string[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function markIssueSeen(issueId: string): void {
  if (typeof window === "undefined") return;
  const list = loadSeenIssues();
  if (list.includes(issueId)) return;
  const next = [issueId, ...list].slice(0, 200);
  try {
    window.localStorage.setItem(SEEN_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
}
