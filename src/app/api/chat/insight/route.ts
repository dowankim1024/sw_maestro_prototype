import { getCharacter } from "@/lib/characters";
import type {
  CharacterId,
  ChatTurn,
  KeyTakeaway,
  TrendIssue,
} from "@/lib/types";

interface InsightRequest {
  issue: TrendIssue;
  characterId: CharacterId;
  turns: ChatTurn[];
}

export interface InsightCard {
  issueTitle: string;
  personaName: string;
  headline: string;
  keyTakeaways: KeyTakeaway[];
  userInsight: string;
  nextCuriosity: string;
  shareableQuote: string;
  duration: string;
}

interface GeminiResponse {
  candidates?: Array<{
    finishReason?: string;
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
}

export async function POST(req: Request) {
  let characterId: CharacterId = "kkang";
  try {
    const body = (await req.json()) as InsightRequest;
    characterId = body.characterId;
    const apiKey = process.env.GEMINI_API_KEY;
    const model = process.env.GEMINI_MODEL || "gemini-2.5-pro";

    if (!apiKey) {
      return Response.json({
        card: fallbackCard(body),
        degraded: true,
        reason: "missing_api_key",
      });
    }

    const systemInstruction = buildSystemInstruction();
    const prompt = buildUserPrompt(body);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemInstruction }] },
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            topP: 0.95,
            maxOutputTokens: 1024,
            responseMimeType: "application/json",
          },
        }),
      },
    );

    if (!response.ok) {
      const errorBody = await response.text();
      return Response.json({
        card: fallbackCard(body),
        degraded: true,
        reason: "request_failed",
        detail: errorBody,
      });
    }

    const data = (await response.json()) as GeminiResponse;
    const text = extractText(data);
    const parsed = safeParseCard(text);

    if (!parsed) {
      return Response.json({
        card: fallbackCard(body),
        degraded: true,
        reason: "parse_failed",
      });
    }

    return Response.json({ card: parsed, degraded: false });
  } catch (error) {
    return Response.json({
      card: fallbackCard({
        issue: { title: "이번 대화" } as TrendIssue,
        characterId,
        turns: [],
      }),
      degraded: true,
      reason: "server_exception",
      detail: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

function buildSystemInstruction(): string {
  return [
    "당신은 대화 인사이트 큐레이터입니다.",
    "사용자와 AI 캐릭터의 대화 전체를 받아, 사용자가 오늘 알게 된 것을 카드로 정리합니다.",
    "사용자가 보고 '오늘 똑똑해졌다'고 느끼게 하고, SNS에 공유하고 싶어지게 만드는 결과물입니다.",
    "점수나 승부 판정은 절대 하지 않습니다.",
    "",
    "[출력 형식]",
    "- 다음 JSON 스키마로만 출력하세요. 다른 텍스트 금지.",
    "{",
    '  "issueTitle": string,',
    '  "personaName": string,',
    '  "headline": string (30자 이내, 학습 성취감 톤),',
    '  "keyTakeaways": [ { "concept": string, "explanation": string (30자 이내) } x 3 ],',
    '  "userInsight": string (사용자가 보여준 좋은 관찰·질문 한 문장),',
    '  "nextCuriosity": string (다음에 더 궁금해할 만한 지점 한 문장),',
    '  "shareableQuote": string (캐릭터 톤, 30자 이내 권장),',
    '  "duration": string (대화 시간 또는 턴 수)',
    "}",
    "",
    "[작성 규칙]",
    "- keyTakeaways는 반드시 대화 히스토리에 등장한 사실/개념만 추출",
    "- 사용자가 부정확했어도 카드는 정확히 알게 된 부분만 강조",
    "- userInsight는 사용자 칭찬을 구체적으로",
    "- shareableQuote는 캐릭터 시그니처 톤 유지",
    "- 정치/민감 이슈는 단정 표현 회피, '~로 보인다', '보도에 따르면' 사용",
  ].join("\n");
}

function buildUserPrompt(input: InsightRequest): string {
  const character = getCharacter(input.characterId);
  const recent = input.turns.slice(-30);
  const transcript = recent
    .map((t) => {
      const who =
        t.role === "user"
          ? "사용자"
          : t.role === "character"
            ? character.name
            : "시스템";
      return `${who}: ${t.text}`;
    })
    .join("\n");

  const turnCount = input.turns.filter((t) => t.role !== "system").length;

  return [
    "[입력]",
    `issueId: ${input.issue.id}`,
    `issueTitle: ${input.issue.title}`,
    `personaId: ${input.characterId}`,
    `personaName: ${character.name}`,
    `summary: ${input.issue.summary}`,
    `keyPoints: ${input.issue.keyPoints?.join(" / ") ?? ""}`,
    `duration: ${turnCount}턴`,
    "",
    "[대화 히스토리]",
    transcript,
    "",
    "위 입력을 기반으로 시스템 지시에 따른 JSON만 출력하세요.",
  ].join("\n");
}

function extractText(data: GeminiResponse): string {
  const parts = data.candidates?.[0]?.content?.parts ?? [];
  return parts
    .map((p) => p.text?.trim() ?? "")
    .filter(Boolean)
    .join("\n")
    .trim();
}

function safeParseCard(raw: string): InsightCard | null {
  if (!raw) return null;
  const stripped = raw
    .replace(/^```(json)?/i, "")
    .replace(/```$/i, "")
    .trim();
  try {
    const obj = JSON.parse(stripped) as Partial<InsightCard>;
    if (
      typeof obj.issueTitle === "string" &&
      typeof obj.personaName === "string" &&
      typeof obj.headline === "string" &&
      Array.isArray(obj.keyTakeaways) &&
      typeof obj.userInsight === "string" &&
      typeof obj.nextCuriosity === "string" &&
      typeof obj.shareableQuote === "string"
    ) {
      return {
        issueTitle: obj.issueTitle,
        personaName: obj.personaName,
        headline: obj.headline,
        keyTakeaways: (obj.keyTakeaways as KeyTakeaway[]).slice(0, 3),
        userInsight: obj.userInsight,
        nextCuriosity: obj.nextCuriosity,
        shareableQuote: obj.shareableQuote,
        duration: obj.duration ?? "",
      };
    }
    return null;
  } catch {
    return null;
  }
}

function fallbackCard(input: InsightRequest): InsightCard {
  const character = getCharacter(input.characterId);
  const turnCount = input.turns?.filter((t) => t.role !== "system").length ?? 0;
  const issue = input.issue;
  const baseTakeaways: KeyTakeaway[] = (issue?.keyPoints ?? [])
    .slice(0, 3)
    .map((point, i) => ({
      concept: issue?.keywords?.[i] ?? `포인트 ${i + 1}`,
      explanation: point,
    }));

  while (baseTakeaways.length < 3) {
    baseTakeaways.push({
      concept: "오늘의 주제",
      explanation: issue?.oneLine ?? "함께 짚어본 한 줄",
    });
  }

  return {
    issueTitle: issue?.title ?? "오늘의 대화",
    personaName: character.name,
    headline: shortHeadline(issue?.title ?? "오늘 대화"),
    keyTakeaways: baseTakeaways,
    userInsight:
      "처음부터 끝까지 호기심을 놓지 않은 점이 좋았어요.",
    nextCuriosity:
      "다음에는 다른 캐릭터와 같은 주제를 한 번 더 짚어보면 그림이 더 또렷해질 거예요.",
    shareableQuote: characterQuote(character.id, issue?.title),
    duration: turnCount > 0 ? `${turnCount}턴` : "오늘의 대화",
  };
}

function shortHeadline(title: string): string {
  const cleaned = title.replace(/[?.!]+$/, "").trim();
  return cleaned.length > 22
    ? `${cleaned.slice(0, 22)} 이제 좀 알겠다`
    : `${cleaned}, 이제 좀 알겠다`;
}

function characterQuote(id: CharacterId, title?: string): string {
  const subject = title?.replace(/[?.!]+$/, "") ?? "이거";
  switch (id) {
    case "kkang":
      return `${subject}? 이제 좀 알겠어 ㅋㅋ`;
    case "uncle":
      return `내가 살아보니까 ${subject} 이게 진짜 정치 따라가더라`;
    case "prof":
      return `${subject} 구조가 한 줄로 정리되네요`;
    case "pm":
    default:
      return `${subject} 정책 시각에서 한 단계 보였습니다`;
  }
}
