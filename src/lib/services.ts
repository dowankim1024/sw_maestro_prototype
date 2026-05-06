import { CHARACTERS, getCharacter } from "./characters";
import { mockTrendData } from "./mock-data";
import type {
  Character,
  CharacterId,
  ChatInsight,
  ChatTurn,
  Mood,
  QuickReaction,
  Sentiment,
  TrendIssue,
} from "./types";

// ============================================================================
// TREND
// ============================================================================

export async function fetchTrends(): Promise<TrendIssue[]> {
  // TODO: 실제 백엔드 연결 시 fetch("/api/trends") 등으로 교체
  await delay(120);
  return [...mockTrendData].sort((a, b) => a.rank - b.rank);
}

export function getSentimentLabel(sentiment: Sentiment): string {
  switch (sentiment) {
    case "positive":
      return "긍정";
    case "negative":
      return "부정";
    case "controversial":
      return "이야깃거리 많음";
    case "neutral":
    default:
      return "중립";
  }
}

export function getSentimentColor(sentiment: Sentiment): string {
  switch (sentiment) {
    case "positive":
      return "text-emerald-400 bg-emerald-400/10 border-emerald-400/30";
    case "negative":
      return "text-rose-400 bg-rose-400/10 border-rose-400/30";
    case "controversial":
      return "text-amber-400 bg-amber-400/10 border-amber-400/30";
    case "neutral":
    default:
      return "text-slate-300 bg-slate-300/10 border-slate-300/30";
  }
}

export function formatMention(count: number): string {
  if (count >= 10_000) return `${(count / 10_000).toFixed(1)}만`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}천`;
  return count.toString();
}

// ============================================================================
// CHAT
// ============================================================================

export interface StartChatResult {
  sessionId: string;
  openingTurns: ChatTurn[];
}

/**
 * 대화 시작.
 * 토론이 아니라 대화이므로 라운드/난이도 없음. 사용자가 끝낼 때까지 자유 흐름.
 *
 * 추후 LLM 연결:
 *   const res = await fetch("/api/chat/start", { method: "POST", body: JSON.stringify({ issueId, characterId }) });
 *   return res.json();
 */
export function startChat(input: {
  issue: TrendIssue;
  characterId: CharacterId;
}): StartChatResult {
  const { issue, characterId } = input;
  const character = getCharacter(characterId);
  const now = new Date().toISOString();

  const openingTurns: ChatTurn[] = [
    {
      id: `sys-${Date.now()}`,
      role: "system",
      text: `‘${issue.title}’에 대해 ${character.name}님과 5분 대화. 토론이 아니라 같이 짚어보는 시간.`,
      createdAt: now,
    },
    {
      id: `c-open-${Date.now()}`,
      role: "character",
      mood: "공감",
      text: openingLine(issue, character),
      createdAt: now,
    },
  ];

  return {
    sessionId: `sess-${Date.now()}`,
    openingTurns,
  };
}

function openingLine(issue: TrendIssue, character: Character): string {
  const oneLineNoTail = issue.oneLine.replace(/[?.!]+$/, "");
  switch (character.id) {
    case "kkang":
      return [
        `어 이거~ "${issue.title}"`,
        `요즘 SNS에 ${oneLineNoTail} 라는 얘기 진짜 많더라 ㅋㅋ`,
        `너는 이거 어떻게 들었어?? 편하게 던져봐~`,
      ].join(" ");
    case "uncle":
      return [
        `아~ 그거 말이야~ "${issue.title}".`,
        `단톡방에서도 다들 그 얘기더라고~ ${issue.oneLine}`,
        `자네는 이 얘기 어디서 처음 들었어?`,
      ].join(" ");
    case "prof":
      return [
        `음... 오늘 같이 살펴볼 주제는 "${issue.title}" 인데요...`,
        `한 줄로 정리하면 ${oneLineNoTail} 정도예요.`,
        `이 주제에서 가장 먼저 걸리는 부분이 어디인지 자유롭게 말씀해 주실래요?`,
      ].join(" ");
    case "pm":
    default:
      return [
        `어... "${issue.title}" 이거 보시는 거죠? ㅋㅋ`,
        `트위터·레딧에서도 ${oneLineNoTail} 분위기로 도는 거 같더라고요.`,
        `어디부터 궁금하신지 던져주시면 같이 정리해볼게요.`,
      ].join(" ");
  }
}

/**
 * 사용자 메시지에 대한 캐릭터 응답.
 * - 토론/반박 금지. 공감(empathy) / 시각 공유(lens) / 지식 체크(reality) 셋 중 자연스럽게.
 * - 평균 2~3문장.
 *
 * LLM 연결 위치:
 *   const res = await fetch("/api/chat/reply", { method: "POST", body: JSON.stringify({ ... }) });
 *   return res.json().reply as { mood, text, capturedFact? };
 */
export async function generateCharacterReply(args: {
  issue: TrendIssue;
  characterId: CharacterId;
  userText: string;
  history: ChatTurn[];
}): Promise<{
  mood: Mood;
  text: string;
  capturedFact?: string;
  /** LLM 호출이 실패해 폴백/임시 답변이 쓰인 경우 true. */
  degraded?: boolean;
  /** 폴백 사유 (예: 'request_failed', 'incomplete_response', 'network_error'). */
  degradedReason?: string;
}> {
  const { issue, characterId, userText, history } = args;
  const character = getCharacter(characterId);

  const aggressive = detectAggression(userText);
  const isAgreeMode = leansToward(userText, "agree");
  const isDifferent = leansToward(userText, "different");
  const lacksDetail = userText.trim().length < 16;

  // 안전: 공격적 표현 → 흐름 부드럽게 돌리기 (반박 X)
  if (aggressive) {
    return {
      mood: "공감",
      text: deescalate(character),
    };
  }

  const charTurnCount = history.filter((t) => t.role === "character").length;

  // 캡처: 사용자가 사실/관점/예시를 말했으면 인사이트로 누적
  const capturedFact = capturePoint(userText);

  // 톤 분기
  let mood: Mood;
  if (isDifferent) mood = "시각공유";
  else if (lacksDetail) mood = "지식체크";
  else if (isAgreeMode) mood = "공감";
  else mood = charTurnCount % 2 === 0 ? "시각공유" : "공감";

  const fallbackText = composeReply({
    issue,
    character,
    userText,
    mood,
    isFirstResponse: charTurnCount <= 1,
  });

  // 실제 Gemini 연동: 서버 Route Handler를 통해 호출 (키 노출 방지)
  try {
    const response = await fetch("/api/chat/reply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        issue,
        characterId,
        userText,
        history: history.slice(-10),
        moodHint: mood,
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
          mood,
          text,
          capturedFact,
          degraded: data.degraded,
          degradedReason: data.reason,
        };
      }
    }
  } catch {
    // 네트워크/서버 오류 시 로컬 mock 응답으로 폴백
  }

  return {
    mood,
    text: fallbackText,
    capturedFact,
    degraded: true,
    degradedReason: "network_error",
  };
}

function composeReply(args: {
  issue: TrendIssue;
  character: Character;
  userText: string;
  mood: Mood;
  isFirstResponse: boolean;
}): string {
  const { issue, character, mood, isFirstResponse } = args;
  const [view1, view2] = issue.perspectives;
  const lensPoint = pick([...view1.points, ...view2.points]);

  switch (character.id) {
    case "kkang":
      if (mood === "공감") {
        return [
          isFirstResponse ? "어, 그 마음 알지." : "그 부분 진짜 공감.",
          `근데 한 가지만 같이 짚어보자. ${lensPoint}.`,
          `이 결도 끄덕여지는 거 있어?`,
        ].join(" ");
      }
      if (mood === "시각공유") {
        return [
          "오케이 네 말도 일리 있어.",
          `나는 좀 다르게 보는 결도 있어. — ${lensPoint}.`,
          `이건 어떻게 느껴져?`,
        ].join(" ");
      }
      return [
        "잠깐, 거기 한 줄 더 채워볼까?",
        `‘${truncate(args.userText, 24)}’ — 이거 들었을 때 같이 말해주는 사람들이 ‘${lensPoint}’ 같은 디테일도 얹더라.`,
        "어떤 느낌이야?",
      ].join(" ");
    case "uncle":
      if (mood === "공감") {
        return [
          isFirstResponse ? "그렇지, 그 감정 충분히 이해돼." : "맞아, 나도 비슷하게 느꼈었어.",
          `우리 회사에서도 ${pickAnecdote(issue)} 그런 거 있었거든. 그때는 ${lensPoint} 이게 의외로 컸지.`,
          `자네는 주변에서 어떤 반응이야?`,
        ].join(" ");
      }
      if (mood === "시각공유") {
        return [
          "음, 자네 말도 맞아. 다만 다른 결도 있어서 한 번 같이 볼까.",
          `현장에서 보면 ${lensPoint} 이게 꽤 자주 나오는 얘기였어.`,
          "이 결은 어떻게 들려?",
        ].join(" ");
      }
      return [
        "잠깐 한 가지만. 그 부분은 좀 헷갈릴 수 있어.",
        `‘${lensPoint}’ — 이런 얘기도 같이 떠도는데, 같이 살펴볼까?`,
      ].join(" ");
    case "prof":
      if (mood === "공감") {
        return [
          isFirstResponse
            ? "좋은 출발입니다. 그 감각, 충분히 근거가 있는 인식이에요."
            : "말씀하신 부분, 직관적으로 매우 합리적입니다.",
          `관련해서 한 가지 디테일을 같이 보면 좋겠어요 — ${lensPoint}.`,
          `이 결은 어떻게 받아들여지시나요?`,
        ].join(" ");
      }
      if (mood === "시각공유") {
        return [
          "충분히 그렇게 보실 수 있어요.",
          `학계에서는 ${lensPoint} 같은 결도 함께 다뤄집니다. 평가가 아니라 한 가지 가능한 시각으로요.`,
          "이 시각은 어떻게 느껴지시나요?",
        ].join(" ");
      }
      return [
        "방금 말씀 주신 부분은 살짝 다르게 알려져 있기도 해요.",
        `정리하자면 — ${lensPoint}.`,
        "이 정도 보정해도 본인 관점이 더 단단해질 거예요.",
      ].join(" ");
    case "pm":
    default:
      if (mood === "공감") {
        return [
          isFirstResponse
            ? "어 그 감각 ㄹㅇ이에요."
            : "ㅇㅇ 그거 저도 비슷하게 봤어요.",
          `근데 한 발 떨어져서 보면 ${lensPoint} 이런 결도 같이 도는 얘기더라고요.`,
          "이 부분은 어떻게 들리세요?",
        ].join(" ");
      }
      if (mood === "시각공유") {
        return [
          "어... 그렇게 보실 수도 있긴 해요.",
          `근데 트위터·레딧 보면 ${lensPoint} 이런 결도 꽤 도더라고요. 평가는 아니고 그냥 다른 패턴이에요.`,
          "이쪽 결은 어떻게 느껴지세요?",
        ].join(" ");
      }
      return [
        "어 그건 좀 헷갈리실 수 있는데요.",
        `결국 ${lensPoint} 이게 핵심에 가까워요.`,
        "이 정도 보정해두면 다음 얘기 풀기 쉬울 거 같아요.",
      ].join(" ");
  }
}

function pickAnecdote(issue: TrendIssue): string {
  const k = issue.keywords[0] ?? "그거";
  return `‘${k}’ 관련된 비슷한 일`;
}

function deescalate(character: Character): string {
  switch (character.id) {
    case "kkang":
      return "야 잠깐 ㅠㅠ 욕은 좀 빼고~ 네 결은 알겠는데 진짜 짚고 싶은 거 한 줄로 다시 말해봐~ 같이 갈게 ㅋㅋ";
    case "uncle":
      return "어어 잠깐~ 흥분 좀 내려놓고 가자고~ 자네가 진짜 답답했던 포인트가 어디였어?";
    case "prof":
      return "음... 표현은 잠시 내려두시고요... 가장 마음에 걸리는 지점 하나만 정리해 주시겠어요?";
    case "pm":
    default:
      return "어... 일단 한 발 떨어져서 보시죠 ㅋㅋ 가장 답답한 포인트 하나만 짧게 던져주시면 같이 정리해볼게요.";
  }
}

/** 퀵 리액션 → 텍스트로 변환 (입력창에 그대로 채워넣어도 되고, 즉시 전송도 가능) */
export function quickReactionToText(qr: QuickReaction): string {
  switch (qr) {
    case "좀 더 쉽게":
      return "좀 더 쉽게 풀어줄 수 있어?";
    case "예시 하나만":
      return "예시 하나만 들어줘.";
    case "한 줄로 요약":
      return "한 줄로 요약해줘.";
    case "나는 좀 다르게 봐":
      return "나는 좀 다르게 보는데, 너 시각도 듣고 싶어.";
    case "공감돼":
      return "그 부분 공감돼.";
  }
}

/**
 * 대화 종료 시 인사이트 카드 생성.
 * 1순위: /api/chat/insight 라우트 호출 (Gemini가 04-prototype 카드 스키마로 생성)
 * 2순위: 실패 시 로컬 휴리스틱으로 폴백 ('오늘 새로 본 것' 형태)
 */
export async function buildInsight(args: {
  issue: TrendIssue;
  characterId: CharacterId;
  turns: ChatTurn[];
}): Promise<ChatInsight> {
  const { issue, characterId, turns } = args;
  const character = getCharacter(characterId);

  const local = buildLocalInsight(issue, characterId, turns);

  try {
    const response = await fetch("/api/chat/insight", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ issue, characterId, turns }),
    });
    if (response.ok) {
      const data = (await response.json()) as {
        card?: {
          issueTitle: string;
          personaName: string;
          headline: string;
          keyTakeaways: { concept: string; explanation: string }[];
          userInsight: string;
          nextCuriosity: string;
          shareableQuote: string;
          duration: string;
        };
      };
      const card = data.card;
      if (card) {
        return {
          ...local,
          headline: card.headline,
          keyTakeaways: card.keyTakeaways,
          userInsight: card.userInsight,
          nextCuriosity: card.nextCuriosity,
          shareableQuote: card.shareableQuote,
          duration: card.duration,
          issueTitle: card.issueTitle ?? local.issueTitle,
          characterName: card.personaName ?? character.name,
        };
      }
    }
  } catch {
    // ignore — 로컬 폴백 사용
  }

  return local;
}

function buildLocalInsight(
  issue: TrendIssue,
  characterId: CharacterId,
  turns: ChatTurn[],
): ChatInsight {
  const character = getCharacter(characterId);

  const captured = turns
    .map((t) => t.capturedFact)
    .filter((s): s is string => !!s);

  const userTurns = turns.filter((t) => t.role === "user");
  const alreadyKnew = userTurns
    .map((t) => firstSentence(t.text))
    .filter(Boolean)
    .slice(0, 2);

  const lensPoints = turns
    .filter((t) => t.role === "character" && t.mood !== "공감")
    .map((t) => firstSentence(t.text))
    .filter(Boolean);
  const newlyLearned = ensureNonEmpty(
    [...captured, ...lensPoints].slice(0, 3),
    [
      issue.perspectives[0].points[0],
      issue.perspectives[1].points[0],
    ].filter(Boolean) as string[],
  );

  const wantToExplore = ensureNonEmpty(
    [
      issue.keywords[0] ? `${issue.keywords[0]} 키워드 더 찾아보기` : "",
      issue.perspectives[1]?.points[1]
        ? `‘${issue.perspectives[1].points[1]}’ 결의 사례`
        : "",
    ].filter(Boolean),
    ["다음에는 다른 캐릭터와도 같은 주제로 짚어보기"],
  );

  return {
    id: `insight-${Date.now()}`,
    issueId: issue.id,
    issueTitle: issue.title,
    characterId,
    characterName: character.name,
    newlyLearned,
    alreadyKnew: ensureNonEmpty(alreadyKnew, [
      "오늘은 듣는 데 더 집중했어요",
    ]),
    wantToExplore,
    characterClosing: closingLine(character),
    turns,
    createdAt: new Date().toISOString(),
  };
}

function closingLine(character: Character): string {
  switch (character.id) {
    case "kkang":
      return "아 오늘 얘기 진짜 좋았다 ㅋㅋ 또 궁금한 거 생기면 들고 와~";
    case "uncle":
      return "재밌었어 자네~ 다음에 또 한 잔 하면서 보자고~";
    case "prof":
      return "오늘 함께 짚어주셔서 감사해요... 좋은 호기심이셨어요.";
    case "pm":
    default:
      return "어 오늘 얘기 좋았어요 ㅋㅋ 또 궁금한 거 도는 키워드 있으면 던져주세요.";
  }
}

/**
 * 캡처할 만한 한 줄을 추출. (평가 X)
 * 사용자가 수치/사례/시각을 말했으면 그대로 첫 문장만 따옴.
 */
function capturePoint(userText: string): string | undefined {
  const trimmed = userText.trim();
  if (trimmed.length < 12) return undefined;
  // 수치, 사례, 시각 표지 키워드가 있을 때 캡처
  if (/(\d|보도|사례|연구|발표|기관|예시|예를 들면|보니까|들었는데)/.test(trimmed)) {
    return firstSentence(trimmed);
  }
  return undefined;
}

function firstSentence(text: string): string {
  const m = text.match(/[^.?!\n]+[.?!]?/);
  const s = (m?.[0] ?? text).trim();
  return s.length > 60 ? s.slice(0, 60) + "…" : s;
}

// ============================================================================
// HELPERS
// ============================================================================

function detectAggression(text: string): boolean {
  return /(씨발|시발|병신|존나|좆|닥쳐|꺼져|개새|미친|머저리|찌질|혐오|족속|패버려|죽여|박살|꺼져)/i.test(
    text,
  );
}

function leansToward(text: string, target: "agree" | "different"): boolean {
  if (target === "agree") {
    return /(공감|동의|맞아|맞는|그런 거 같|그 말 맞|나도)/.test(text);
  }
  return /(다르게|반대|나는 좀|동의 안|아닌 것 같|글쎄|그건 좀)/.test(text);
}

function truncate(text: string, len: number): string {
  if (text.length <= len) return text;
  return text.slice(0, len) + "…";
}

function ensureNonEmpty<T>(arr: T[], fallback: T[]): T[] {
  return arr.length > 0 ? arr : fallback;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ============================================================================
// EXPORTS (편의)
// ============================================================================

export { CHARACTERS, getCharacter };
