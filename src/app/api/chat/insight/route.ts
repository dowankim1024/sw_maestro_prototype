import { getCharacter } from "@/lib/characters";
import { INSIGHT_SYSTEM_PROMPT } from "@/lib/prompts";
import type {
  CharacterId,
  ChatTurn,
  Issue,
  KeyTakeaway,
} from "@/lib/types";

interface InsightRequest {
  issue: Issue;
  characterId: CharacterId;
  turns: ChatTurn[];
}

export interface InsightCardPayload {
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
  let issueTitle = "오늘의 대화";
  try {
    const body = (await req.json()) as InsightRequest;
    characterId = body.characterId;
    issueTitle = body.issue?.title ?? issueTitle;

    const apiKey = process.env.GEMINI_API_KEY;
    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

    if (!apiKey) {
      return Response.json({
        card: fallbackCard(body),
        degraded: true,
        reason: "missing_api_key",
      });
    }

    const prompt = buildUserPrompt(body);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: INSIGHT_SYSTEM_PROMPT }] },
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            topP: 0.95,
            maxOutputTokens: 900,
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
        issue: { title: issueTitle } as Issue,
        characterId,
        turns: [],
      }),
      degraded: true,
      reason: "server_exception",
      detail: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

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

  const factLines = (input.issue.facts ?? []).map(
    (f, i) => `  ${i + 1}. ${f.statement}`,
  );

  const turnCount = input.turns.filter((t) => t.role !== "system").length;

  return [
    "[이슈]",
    `- title: ${input.issue.title}`,
    `- summary: ${input.issue.summary}`,
    `- safetyLevel: ${input.issue.safetyLevel}`,
    `- keywords: ${input.issue.keywords?.join(", ") ?? ""}`,
    "",
    "[핵심 사실]",
    factLines.length > 0 ? factLines.join("\n") : "(없음)",
    "",
    `[캐릭터] ${character.name} (${input.characterId})`,
    `[대화 턴 수] ${turnCount}턴`,
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

function safeParseCard(raw: string): InsightCardPayload | null {
  if (!raw) return null;
  const stripped = raw
    .replace(/^```(json)?/i, "")
    .replace(/```$/i, "")
    .trim();
  try {
    const obj = JSON.parse(stripped) as Partial<InsightCardPayload>;
    if (
      typeof obj.issueTitle === "string" &&
      typeof obj.personaName === "string" &&
      typeof obj.headline === "string" &&
      Array.isArray(obj.keyTakeaways) &&
      obj.keyTakeaways.length > 0 &&
      typeof obj.userInsight === "string" &&
      typeof obj.nextCuriosity === "string" &&
      typeof obj.shareableQuote === "string"
    ) {
      const cleanedTakeaways = (obj.keyTakeaways as KeyTakeaway[])
        .filter(
          (kt) =>
            typeof kt?.concept === "string" &&
            typeof kt?.explanation === "string",
        )
        .slice(0, 3);
      if (cleanedTakeaways.length === 0) return null;
      return {
        issueTitle: obj.issueTitle,
        personaName: obj.personaName,
        headline: obj.headline,
        keyTakeaways: cleanedTakeaways,
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

function fallbackCard(input: InsightRequest): InsightCardPayload {
  const character = getCharacter(input.characterId);
  const issue = input.issue;
  const turnCount = input.turns?.filter((t) => t.role !== "system").length ?? 0;

  const baseTakeaways: KeyTakeaway[] = (issue?.facts ?? [])
    .slice(0, 3)
    .map((f, i) => ({
      concept: issue?.keywords?.[i] ?? `핵심 ${i + 1}`,
      explanation:
        f.statement.length > 32
          ? `${f.statement.slice(0, 30)}…`
          : f.statement,
      sourceFactIds: [f.id],
    }));

  while (baseTakeaways.length < 3) {
    baseTakeaways.push({
      concept: "오늘의 주제",
      explanation: issue?.summary?.slice(0, 30) ?? "함께 짚어본 한 줄",
    });
  }

  const angle = issue?.characterAngles?.find(
    (a) => a.characterId === input.characterId,
  );

  return {
    issueTitle: issue?.title ?? "오늘의 대화",
    personaName: character.name,
    headline: shortHeadline(issue?.title ?? "오늘 대화"),
    keyTakeaways: baseTakeaways,
    userInsight:
      "처음부터 끝까지 호기심을 놓지 않고 짚어주신 점이 좋았어요.",
    nextCuriosity:
      "다음에는 다른 캐릭터로 같은 이슈를 한 번 더 짚어보면 그림이 더 또렷해져요.",
    shareableQuote: angle?.oneLiner ?? characterDefaultQuote(input.characterId),
    duration: turnCount > 0 ? `${turnCount}턴` : "오늘의 대화",
  };
}

function shortHeadline(title: string): string {
  const cleaned = title.replace(/[?.!]+$/, "").trim();
  return cleaned.length > 22
    ? `${cleaned.slice(0, 22)} 이제 좀 알겠다`
    : `${cleaned}, 이제 좀 알겠다`;
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
