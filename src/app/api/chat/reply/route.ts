import { getCharacter } from "@/lib/characters";
import { buildSystemPrompt } from "@/lib/prompts";
import type { CharacterId, ChatTurn, Mood, TrendIssue } from "@/lib/types";

interface ChatReplyRequest {
  issue: TrendIssue;
  characterId: CharacterId;
  userText: string;
  history: ChatTurn[];
  moodHint?: Mood;
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
  let requestCharacterId: CharacterId = "kkang";
  try {
    const body = (await req.json()) as ChatReplyRequest;
    requestCharacterId = body.characterId;
    const apiKey = process.env.GEMINI_API_KEY;
    const model = process.env.GEMINI_MODEL || "gemini-2.5-pro";

    if (!apiKey) {
      return Response.json({
        text: fallbackReply(body.characterId),
        degraded: true,
        reason: "missing_api_key",
      });
    }

    const systemInstruction = buildSystemInstruction(body.characterId);
    const prompt = buildUserPrompt(body);

    const first = await callGemini({
      apiKey,
      model,
      systemInstruction,
      prompt,
    });
    if (!first.ok) {
      return Response.json({
        text: fallbackReply(body.characterId),
        degraded: true,
        reason: "request_failed",
        detail: first.error,
      });
    }

    let text = extractGeminiText(first.data);
    let finishReason = first.data.candidates?.[0]?.finishReason ?? "";

    // 중간 잘림 방지: MAX_TOKENS 또는 미완성 문장처럼 보이면 한 번 재생성
    if (needsRetry(text, finishReason)) {
      const retry = await callGemini({
        apiKey,
        model,
        systemInstruction,
        prompt:
          prompt +
          "\n\n[추가 지시]\n- 직전 답변처럼 중간에 끊기지 말고 완결된 문장으로 마무리하세요.\n- JSON 형식이 아니라 자연스러운 채팅 문장만 출력하세요.",
      });
      if (retry.ok) {
        const retried = extractGeminiText(retry.data);
        if (retried.length >= text.length || !looksTruncated(retried)) {
          text = retried;
          finishReason =
            retry.data.candidates?.[0]?.finishReason ?? finishReason;
        }
      }
    }

    if (!text || text.length < 16 || looksTruncated(text)) {
      const salvaged = salvageCompleteText(text);
      if (salvaged.length >= 16) {
        return Response.json({
          text: salvaged,
          finishReason,
          degraded: true,
        });
      }

      return Response.json(
        {
          text: fallbackReply(body.characterId),
          degraded: true,
          reason: "incomplete_response",
          finishReason,
        },
      );
    }

    return Response.json({ text, finishReason });
  } catch (error) {
    return Response.json(
      {
        text: fallbackReply(requestCharacterId),
        degraded: true,
        reason: "server_exception",
        detail: error instanceof Error ? error.message : "Unknown error",
      },
    );
  }
}

async function callGemini(args: {
  apiKey: string;
  model: string;
  systemInstruction: string;
  prompt: string;
}): Promise<{ ok: true; data: GeminiResponse } | { ok: false; error: string }> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${args.model}:generateContent?key=${args.apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: args.systemInstruction }],
        },
        contents: [
          {
            role: "user",
            parts: [{ text: args.prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.85,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      }),
    },
  );

  if (!response.ok) {
    const errorBody = await response.text();
    return { ok: false, error: errorBody };
  }

  return { ok: true, data: (await response.json()) as GeminiResponse };
}

/**
 * BASE 프롬프트(prompt/base_prompt.md)와 페르소나 프롬프트(prompt/character_*.md)를
 * 조립한 시스템 명령. 캐릭터별 분기는 src/lib/prompts.ts 가 책임진다.
 */
function buildSystemInstruction(characterId: CharacterId): string {
  return buildSystemPrompt(characterId);
}

/**
 * 베이스 §"컨텍스트 입력 형식" 에 맞춘 사용자 프롬프트.
 * 한 턴마다 이슈 정보·핵심 포인트·관련 키워드·대화 히스토리·사용자 직전 발언을 함께 전달한다.
 */
function buildUserPrompt(input: ChatReplyRequest): string {
  const character = getCharacter(input.characterId);
  const safeHistory = input.history.slice(-6).map((turn) => {
    const who =
      turn.role === "user"
        ? "사용자"
        : turn.role === "character"
          ? character.name
          : "시스템";
    return `${who}: ${turn.text}`;
  });

  const keyPoints = (input.issue.keyPoints ?? []).slice(0, 3);
  const keywords = (input.issue.keywords ?? []).join(", ");
  const moodHint = input.moodHint ? `응답 결 힌트: ${input.moodHint}` : "";

  return [
    "[이슈 정보]",
    `- 제목: ${input.issue.title}`,
    `- 한 줄: ${input.issue.oneLine}`,
    `- 요약: ${input.issue.summary}`,
    `- 왜 뜨는지: ${input.issue.whyTrending}`,
    keyPoints.length > 0 ? `- 핵심 포인트:\n  · ${keyPoints.join("\n  · ")}` : "",
    keywords ? `- 관련 키워드: ${keywords}` : "",
    moodHint,
    "",
    "[대화 히스토리]",
    safeHistory.length > 0 ? safeHistory.join("\n") : "(아직 없음)",
    "",
    `[사용자 직전 발언]\n${input.userText}`,
    "",
    "[지시]",
    "- 위 BASE 프롬프트와 캐릭터 프롬프트의 톤·규칙을 따라 한 턴만 답변하세요.",
    "- 한 발언당 3~4줄 이내. 마크다운·번호·굵은 글씨 금지.",
    "- 다음 턴으로 이어질 흥미 고리(질문·의외의 사실·비교 지점)를 자연스럽게 남기세요.",
  ]
    .filter(Boolean)
    .join("\n");
}

function extractGeminiText(data: GeminiResponse): string {
  const parts = data.candidates?.[0]?.content?.parts ?? [];
  return parts
    .map((part) => part.text?.trim() ?? "")
    .filter(Boolean)
    .join("\n")
    .trim();
}

function needsRetry(text: string, finishReason: string): boolean {
  if (!text) return true;
  if (finishReason === "MAX_TOKENS") return true;
  return looksTruncated(text);
}

function looksTruncated(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return true;
  if (trimmed.endsWith('"') && trimmed.includes('{"text"')) return true;
  if (/[가-힣a-zA-Z0-9,]$/.test(trimmed) && !/[.!?~]$/.test(trimmed))
    return true;
  return false;
}

function salvageCompleteText(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return "";
  const lastSentenceEnd = Math.max(
    trimmed.lastIndexOf("."),
    trimmed.lastIndexOf("!"),
    trimmed.lastIndexOf("?"),
    trimmed.lastIndexOf("~"),
  );
  if (lastSentenceEnd >= 12) {
    return trimmed.slice(0, lastSentenceEnd + 1).trim();
  }
  const lines = trimmed
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  if (lines.length >= 2) {
    return lines.slice(0, 2).join("\n").trim();
  }
  return "";
}

function fallbackReply(characterId: CharacterId): string {
  switch (characterId) {
    case "kkang":
      return "아 잠깐만 ㅠㅠ 내가 말이 꼬였네 ㅋㅋ 핵심만 다시 말하면, 이거 사람마다 체감이 달라서 관점이 갈리는 거 같아~ 너는 어디가 제일 걸려??";
    case "uncle":
      return "어어 잠깐~ 내가 말이 좀 헷갈렸네~ 핵심만 다시 보면 이 이슈는 결이 두 갈래거든. 자네는 어느 쪽이 더 와닿어?";
    case "prof":
      return "음... 방금 문장이 매끄럽지 않았네요... 다시 정리해 보면, 이 이슈는 한 가지 결로만 보긴 어려운 부분이 있어요. 가장 먼저 걸리는 지점이 어디일까요?";
    case "pm":
    default:
      return "어... 방금 답변이 좀 흐려졌네요 ㅋㅋ 결국 두 가지 결이 있는 이슈인데, 어느 쪽부터 정리해드리면 될까요?";
  }
}
