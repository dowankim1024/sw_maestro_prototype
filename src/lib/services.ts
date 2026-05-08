/**
 * 이슈캐스트 서비스 레이어.
 *
 * refactor 문서의 제품 구조 기준으로 다음 세 가지를 다룬다.
 *  1. 이슈 피드 / 상세 조회
 *  2. 캐릭터와의 이어지는 대화 (POST /api/chat/reply)
 *  3. 대화 종료 후 ‘오늘 새로 본 것’ 카드 생성 (POST /api/chat/insight)
 *
 * 모든 LLM 호출은 서버 라우트로 위임하여 API 키 노출을 막는다.
 * 실패 시 클라이언트 측 폴백 응답으로 자연스럽게 전환한다.
 */

import { getCharacter, otherCharacters } from "./characters";
import { getClientProvider } from "./llm-client";
import { getMockIssueById, mockIssues } from "./mock-data";
import type {
  Character,
  CharacterAngle,
  CharacterId,
  ChatTurn,
  FactLabel,
  InsightCard,
  Issue,
  KeyTakeaway,
} from "./types";

// ---------------------------------------------------------------------------
// ISSUE FEED
// ---------------------------------------------------------------------------

/**
 * 오늘의 이슈 피드.
 * 정책: MVP에서는 mock 이슈를 publishedAt 내림차순으로 단순 정렬해서 노출한다.
 */
export async function fetchTodayIssues(): Promise<Issue[]> {
  await delay(80);
  return [...mockIssues].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export async function fetchIssueById(id: string): Promise<Issue | undefined> {
  await delay(40);
  return getMockIssueById(id);
}

// ---------------------------------------------------------------------------
// FACT / SOURCE HELPERS
// ---------------------------------------------------------------------------

export function factLabelText(label: FactLabel): string {
  switch (label) {
    case "fact":
      return "팩트";
    case "reported":
      return "보도됨";
    case "uncertain":
      return "불확실";
  }
}

/** 출처 ID 배열 → 실제 Source 객체 배열 (이슈 내부에서만 매칭). */
export function resolveSources(issue: Issue, sourceIds: string[]) {
  return issue.sources.filter((s) => sourceIds.includes(s.id));
}

/** 캐릭터 관점이 가리키는 사실 본문을 펼쳐온다. */
export function resolveAngleFacts(issue: Issue, angle: CharacterAngle) {
  return issue.facts.filter((f) => angle.referencedFactIds.includes(f.id));
}

export function getAngle(
  issue: Issue,
  characterId: CharacterId,
): CharacterAngle | undefined {
  return issue.characterAngles.find((a) => a.characterId === characterId);
}

export function getRecommendedNextCharacter(args: {
  issue: Issue;
  currentCharacterId: CharacterId;
}): Character {
  const angleIds = args.issue.characterAngles.map((a) => a.characterId);
  const currentIndex = angleIds.indexOf(args.currentCharacterId);
  if (currentIndex >= 0 && angleIds.length > 1) {
    const nextId = angleIds[(currentIndex + 1) % angleIds.length];
    if (nextId !== args.currentCharacterId) return getCharacter(nextId);
  }

  const others = otherCharacters(args.currentCharacterId);
  return (
    others.find((c) => args.issue.characterAngles.some((a) => a.characterId === c.id)) ??
    others[0]
  );
}

// ---------------------------------------------------------------------------
// DISCLAIMER
// ---------------------------------------------------------------------------

/** 면책 고지. safetyLevel 별로 강도가 다르다. */
export function disclaimerFor(issue: Issue): string {
  switch (issue.safetyLevel) {
    case "highRisk":
      return "이 이슈는 사실관계가 빠르게 변할 수 있는 민감 사안입니다. 캐릭터의 발언은 단정이 아니며, 표시된 출처를 기준으로 직접 확인해 주세요.";
    case "sensitive":
      return "이 이슈는 민감한 사회적 쟁점을 포함합니다. 캐릭터의 표현은 특정 개인·집단에 대한 단정이 아니며, 확인된 출처와 구분해 제공됩니다.";
    case "normal":
    default:
      return "캐릭터의 발언은 이해를 돕기 위한 AI 생성 해설입니다. 사실 정보는 표시된 출처를 기준으로 확인하세요.";
  }
}

// ---------------------------------------------------------------------------
// CHAT REPLY
// ---------------------------------------------------------------------------

/**
 * 캐릭터의 다음 발언.
 * 1차: /api/chat/reply (Gemini)
 * 폴백: 캐릭터 톤의 사실 기반 한 줄
 */
export async function generateCharacterReply(args: {
  issue: Issue;
  characterId: CharacterId;
  userText: string;
  history: ChatTurn[];
}): Promise<{
  text: string;
  degraded?: boolean;
  degradedReason?: string;
}> {
  // 종료 신호인지 먼저 체크 — 종료는 ChatRoom 측에서 처리하지만,
  // 사용자가 "끝", "정리해줘" 등을 쳤을 때 캐릭터가 가벼운 마무리만 하도록 폴백 가능.
  const closingHint = isClosingSignal(args.userText);

  try {
    const response = await fetch("/api/chat/reply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        issue: args.issue,
        characterId: args.characterId,
        userText: args.userText,
        history: args.history.slice(-10),
        closingHint,
        provider: getClientProvider(),
      }),
    });

    if (response.ok) {
      const data = (await response.json()) as {
        text?: string;
        degraded?: boolean;
        reason?: string;
      };
      const text = data.text?.trim();
      if (text) {
        return {
          text,
          degraded: data.degraded,
          degradedReason: data.reason,
        };
      }
    }
  } catch {
    // 네트워크 에러 → 로컬 폴백
  }

  return {
    text: localFallbackReply(args.issue, args.characterId, closingHint),
    degraded: true,
    degradedReason: "network_error",
  };
}

function localFallbackReply(
  issue: Issue,
  characterId: CharacterId,
  closing: boolean,
): string {
  const character = getCharacter(characterId);
  const angle = getAngle(issue, characterId);
  const oneLiner = angle?.oneLiner ?? issue.summary;

  if (closing) {
    switch (characterId) {
      case "kkang":
        return "그래, 오늘은 여기까지 하자. 이 정도면 생활에 닿는 지점은 잡은 거야.";
      case "uncle":
        return "좋은 질문이었어요. 여기까지 짚어도 오늘 새로 본 관점은 충분히 생긴 것 같네요.";
      case "prof":
        return "오케이, 여기까지! 오늘 이슈 vibe는 꽤 잡힌 것 같아.";
      case "pm":
      default:
        return "좋아, 일단 여기까지 보자. 더 단정하기보다 이 정도로 정리하는 게 맞겠다.";
    }
  }

  const factSnippet = issue.facts[0]?.statement ?? issue.summary;

  switch (characterId) {
    case "kkang":
      return `쉽게 말하면 ${oneLiner} 이 얘기야. ${factSnippet} 내 생활로 오면 돈이든 시간이든 어딘가에서 바로 티가 나거든. 너한테는 어디가 제일 먼저 닿아?`;
    case "uncle":
      return `쉽게 말하면 ${oneLiner} 라는 뜻이에요. ${factSnippet} 한 가지 짚고 싶은 건, 이 일이 혼자 튀어나온 게 아니라 주변 흐름과 같이 움직인다는 점이에요.`;
    case "prof":
      return `쉽게 말하면 지금 사람들은 ${oneLiner} 쪽으로 받아들이고 있어. ${factSnippet} 다만 인터넷 반응이랑 실제 사실은 나눠서 봐야 해.`;
    case "pm":
    default:
      return `쉽게 말하면 ${oneLiner} 라고 바로 단정하긴 이르다는 거야. ${factSnippet} 확인할 것 하나는, 출처에 나온 사실과 그 위에 붙은 해석을 나눠 보는 거야. — ${character.name}`;
  }
}

function isClosingSignal(text: string): boolean {
  return /(끝|그만|정리해|오늘 여기까지|마무리|이만|충분해)/.test(text);
}

// ---------------------------------------------------------------------------
// INSIGHT CARD
// ---------------------------------------------------------------------------

export async function buildInsightCard(args: {
  issue: Issue;
  characterId: CharacterId;
  turns: ChatTurn[];
}): Promise<InsightCard> {
  const local = buildLocalInsight(args);

  try {
    const response = await fetch("/api/chat/insight", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        issue: args.issue,
        characterId: args.characterId,
        turns: args.turns,
        provider: getClientProvider(),
      }),
    });
    if (response.ok) {
      const data = (await response.json()) as {
        card?: {
          issueTitle: string;
          personaName: string;
          headline: string;
          keyTakeaways: KeyTakeaway[];
          userInsight: string;
          nextCuriosity: string;
          shareableQuote: string;
          duration: string;
        };
        degraded?: boolean;
      };
      const card = data.card;
      if (card) {
        return {
          ...local,
          headline: card.headline,
          keyTakeaways: card.keyTakeaways.slice(0, 3),
          userInsight: card.userInsight,
          nextCuriosity: card.nextCuriosity,
          shareableQuote: card.shareableQuote,
          duration: card.duration,
          degraded: data.degraded ?? false,
        };
      }
    }
  } catch {
    // ignore — 폴백 사용
  }

  return local;
}

function buildLocalInsight(args: {
  issue: Issue;
  characterId: CharacterId;
  turns: ChatTurn[];
}): InsightCard {
  const character = getCharacter(args.characterId);
  const angle = getAngle(args.issue, args.characterId);
  const turnCount = args.turns.filter((t) => t.role !== "system").length;

  const keyTakeaways: KeyTakeaway[] = args.issue.facts.slice(0, 3).map((f) => ({
    concept: pickConcept(args.issue.keywords, f.statement),
    explanation: trimStatement(f.statement),
    sourceFactIds: [f.id],
  }));

  const userInsight = pickUserInsight(args.turns);

  return {
    id: `card-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    issueId: args.issue.id,
    issueTitle: args.issue.title,
    characterId: args.characterId,
    characterName: character.name,
    headline: shortHeadline(args.issue.title),
    keyTakeaways,
    userInsight,
    nextCuriosity: nextCuriosity(args.issue),
    shareableQuote: angle?.oneLiner ?? characterDefaultQuote(args.characterId),
    duration: turnCount > 0 ? `${turnCount}턴` : "오늘의 대화",
    degraded: true,
    turns: args.turns,
    createdAt: new Date().toISOString(),
  };
}

function pickConcept(keywords: string[], fallback: string): string {
  if (keywords.length > 0) return keywords[0];
  return fallback.slice(0, 10);
}

function trimStatement(s: string): string {
  return s.length > 32 ? `${s.slice(0, 30)}…` : s;
}

function shortHeadline(title: string): string {
  const cleaned = title.replace(/[?.!]+$/, "").trim();
  return cleaned.length > 22 ? cleaned.slice(0, 22) : `${cleaned}, 이제 좀 알겠다`;
}

function pickUserInsight(turns: ChatTurn[]): string {
  const userTurns = turns.filter((t) => t.role === "user" && t.text.length > 8);
  if (userTurns.length === 0) {
    return "처음부터 끝까지 호기심을 놓지 않은 점이 좋았어요.";
  }
  const longest = [...userTurns].sort((a, b) => b.text.length - a.text.length)[0];
  const shortened =
    longest.text.length > 40 ? `${longest.text.slice(0, 38)}…` : longest.text;
  return `‘${shortened}’ 라는 질문이 핵심을 잘 짚었어요.`;
}

function nextCuriosity(issue: Issue): string {
  if (issue.keywords.length >= 2) {
    return `다음에는 ‘${issue.keywords[1]}’ 관점으로도 같은 이슈를 한 번 더 짚어보면 그림이 더 또렷해져요.`;
  }
  return "다음에는 다른 캐릭터로 같은 이슈를 한 번 더 짚어보면 좋아요.";
}

function characterDefaultQuote(id: CharacterId): string {
  switch (id) {
    case "kkang":
      return "결국 생활에 닿는 얘기였어";
    case "uncle":
      return "구조를 같이 봐야 보이는 이슈예요";
    case "prof":
      return "사람들이 소비하는 톤이 포인트였어";
    case "pm":
    default:
      return "출처와 해석을 나눠 봐야 돼";
  }
}

// ---------------------------------------------------------------------------
// QUICK HELPERS
// ---------------------------------------------------------------------------

export function shareTextFor(card: InsightCard): string {
  const lines = [
    `[이슈캐스트] ${card.issueTitle}`,
    `오늘 새로 본 것: ${card.headline}`,
    "",
    ...card.keyTakeaways.map(
      (kt, i) => `${i + 1}. ${kt.concept} — ${kt.explanation}`,
    ),
    "",
    `“${card.shareableQuote}” — ${card.characterName}`,
  ];
  return lines.join("\n");
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
