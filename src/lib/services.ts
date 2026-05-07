/**
 * 이슈캐스트 서비스 레이어.
 *
 * 06-prototype.md §13 (LLM 호출 유형) 기준으로 다음 세 가지를 다룬다.
 *  1. 이슈 피드 / 상세 조회
 *  2. 캐릭터와의 이어지는 대화 (POST /api/chat/reply)
 *  3. 대화 종료 후 ‘오늘 새로 본 것’ 카드 생성 (POST /api/chat/insight)
 *
 * 모든 LLM 호출은 서버 라우트로 위임하여 API 키 노출을 막는다.
 * 실패 시 클라이언트 측 폴백 응답으로 자연스럽게 전환한다.
 */

import { getCharacter, otherCharacters } from "./characters";
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
 * 정책: 카테고리 비율은 06 §17.1 기준이지만 MVP에서는 mock 6건을
 * publishedAt 내림차순으로 단순 정렬해서 노출한다.
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
  const others = otherCharacters(args.currentCharacterId);
  // 가능한 한 issue.characterAngles 안에 있는 캐릭터를 우선 추천
  const withAngle = others.find((c) =>
    args.issue.characterAngles.some((a) => a.characterId === c.id),
  );
  return withAngle ?? others[0];
}

// ---------------------------------------------------------------------------
// DISCLAIMER
// ---------------------------------------------------------------------------

/** 06 §11.4 — 면책 고지. safetyLevel 별로 강도가 다르다. */
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
        return "아 오늘 얘기 좋았어 ㅋㅋ 또 궁금한 거 생기면 들고 와~";
      case "uncle":
        return "재밌었어~ 다음에 또 한 번 같이 짚어 보자고~";
      case "prof":
        return "오늘 함께 짚어주셔서 고마워요... 좋은 호기심이셨어요.";
      case "pm":
      default:
        return "오늘 말씀 감사합니다. 함께 짚은 시각이 의미가 있었습니다.";
    }
  }

  const factSnippet = issue.facts[0]?.statement ?? issue.summary;

  switch (characterId) {
    case "kkang":
      return `어 잠깐, 핵심만 다시 말하면 ${oneLiner} 결국 그런 얘기야 ㅋㅋ ${factSnippet} 너는 이 부분 어디가 제일 걸려??`;
    case "uncle":
      return `아니 그게 말이야~ ${oneLiner} 결국 분위기랑 같이 가는 얘기거든. ${factSnippet} 자네는 어느 결이 더 와닿어?`;
    case "prof":
      return `음... 정리하면 ${oneLiner} 정도가 핵심이에요. ${factSnippet} 한 단계 더 들어가면 ‘기대 심리’가 함께 작동한다는 점이 있죠. 어떤 결이 더 궁금하세요?`;
    case "pm":
    default:
      return `이 사안은 단순한 한 줄로 정리하기는 어렵습니다. 핵심은 ${oneLiner} 라는 점이에요. ${factSnippet} 어떤 측면을 더 살펴봤으면 하나요? — ${character.name}`;
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
      return "이거 결국 내 지갑 얘기더라 ㅋㅋ";
    case "uncle":
      return "분위기랑 같이 움직이는 얘기더라고";
    case "prof":
      return "기대 심리가 가격에 먼저 반영되는 구조였어요";
    case "pm":
    default:
      return "여러 이해관계가 함께 얽힌 사안이었습니다";
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
