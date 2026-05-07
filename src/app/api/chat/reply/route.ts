import { getCharacter } from "@/lib/characters";
import { buildSystemPrompt } from "@/lib/prompts";
import { factLabelText } from "@/lib/services";
import type {
  CharacterId,
  ChatTurn,
  Issue,
} from "@/lib/types";

interface ChatReplyRequest {
  issue: Issue;
  characterId: CharacterId;
  userText: string;
  history: ChatTurn[];
  closingHint?: boolean;
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
    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

    if (!apiKey) {
      return Response.json({
        text: fallbackReply(body),
        degraded: true,
        reason: "missing_api_key",
      });
    }

    const systemInstruction = buildSystemPrompt(body.characterId);
    const prompt = buildUserPrompt(body);

    const first = await callGemini({
      apiKey,
      model,
      systemInstruction,
      prompt,
    });
    if (!first.ok) {
      return Response.json({
        text: fallbackReply(body),
        degraded: true,
        reason: "request_failed",
        detail: first.error,
      });
    }

    let text = extractGeminiText(first.data);
    let finishReason = first.data.candidates?.[0]?.finishReason ?? "";

    if (needsRetry(text, finishReason)) {
      const retry = await callGemini({
        apiKey,
        model,
        systemInstruction,
        prompt:
          prompt +
          "\n\n[추가 지시]\n- 직전 답변처럼 중간에 끊기지 말고 완결된 문장으로 마무리하세요.\n- 자연스러운 채팅 메시지로만 출력하세요. JSON, 마크다운, 헤더 금지.",
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

    if (!text || text.length < 12 || looksTruncated(text)) {
      const salvaged = salvageCompleteText(text);
      if (salvaged.length >= 12) {
        return Response.json({
          text: salvaged,
          finishReason,
          degraded: true,
          reason: "truncated",
        });
      }
      return Response.json({
        text: fallbackReply(body),
        degraded: true,
        reason: "incomplete_response",
        finishReason,
      });
    }

    return Response.json({ text, finishReason });
  } catch (error) {
    return Response.json({
      text: characterFallback(requestCharacterId),
      degraded: true,
      reason: "server_exception",
      detail: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

// ---------------------------------------------------------------------------
// Gemini call
// ---------------------------------------------------------------------------

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
        systemInstruction: { parts: [{ text: args.systemInstruction }] },
        contents: [{ role: "user", parts: [{ text: args.prompt }] }],
        generationConfig: {
          temperature: 0.85,
          topP: 0.95,
          maxOutputTokens: 800,
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

// ---------------------------------------------------------------------------
// Prompt assembly
// ---------------------------------------------------------------------------

function buildUserPrompt(input: ChatReplyRequest): string {
  const character = getCharacter(input.characterId);
  const issue = input.issue;

  const safeHistory = input.history.slice(-6).map((turn) => {
    const who =
      turn.role === "user"
        ? "사용자"
        : turn.role === "character"
          ? character.name
          : "시스템";
    return `${who}: ${turn.text}`;
  });

  const facts = issue.facts.map((f, i) => {
    const sources = issue.sources
      .filter((s) => f.sourceIds.includes(s.id))
      .map((s) => `${s.publisher}`)
      .join(", ");
    return `  ${i + 1}. [${factLabelText(f.confidence)}] ${f.statement}${sources ? ` (출처: ${sources})` : ""}`;
  });

  const angle = issue.characterAngles.find(
    (a) => a.characterId === input.characterId,
  );

  return [
    "[이슈]",
    `- 제목: ${issue.title}`,
    `- 한 줄 요약: ${issue.summary}`,
    `- 왜 지금 뜨는지: ${issue.whyNow}`,
    `- 카테고리: ${issue.category}`,
    `- 위험도: ${issue.safetyLevel}`,
    `- 키워드: ${issue.keywords.join(", ")}`,
    "",
    "[핵심 사실]",
    facts.length > 0 ? facts.join("\n") : "  (제공된 사실 없음)",
    "",
    angle
      ? [
          "[이 캐릭터의 기본 시각]",
          `- 라벨: ${angle.lensLabel}`,
          `- 한 줄: ${angle.oneLiner}`,
          `- 톤 지문: ${angle.viewpoint}`,
          `- 의견 면책: ${angle.opinionDisclaimer}`,
          "",
        ].join("\n")
      : "",
    "[대화 히스토리]",
    safeHistory.length > 0 ? safeHistory.join("\n") : "(아직 없음)",
    "",
    `[사용자 직전 발언]\n${input.userText}`,
    "",
    "[지시]",
    "- 위 BASE + 캐릭터 프롬프트 톤·규칙을 따라 한 턴만 답하세요.",
    "- 한 발언당 3~4줄. 마크다운·번호·헤더 금지.",
    "- 위 ‘핵심 사실’에 없는 새 수치, 인명, 사건은 만들지 마세요.",
    "- 사실과 캐릭터 의견을 섞지 마세요. 의견은 ‘제 생각엔’ 같은 표지로 드러내세요.",
    input.closingHint
      ? "- 사용자가 마무리 신호를 보냈습니다. 캐릭터 톤으로 가벼운 마무리만 하고 별도 정리는 하지 마세요."
      : "- 다음 턴으로 이어지는 흥미 고리(다음 개념, 비교 지점)를 자연스럽게 남기세요.",
  ]
    .filter(Boolean)
    .join("\n");
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function extractGeminiText(data: GeminiResponse): string {
  const parts = data.candidates?.[0]?.content?.parts ?? [];
  return parts
    .map((p) => p.text?.trim() ?? "")
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
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length >= 2) return lines.slice(0, 2).join("\n").trim();
  return "";
}

function fallbackReply(body: ChatReplyRequest): string {
  if (body.closingHint) {
    return characterFallback(body.characterId, true);
  }
  return characterFallback(body.characterId);
}

function characterFallback(id: CharacterId, closing = false): string {
  if (closing) {
    switch (id) {
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
  switch (id) {
    case "kkang":
      return "솔직히 답변이 잠깐 흐려졌네. 핵심만 보면 이 이슈가 내 생활에 어디 닿는지가 포인트야. 가격이든 시간이나 가게든, 결국 티가 나는 데가 있거든.";
    case "uncle":
      return "답변이 잠깐 매끄럽지 못했네요. 한 가지 짚고 싶은 건, 이 이슈는 단일 사건보다 그 뒤의 구조를 같이 봐야 이해가 된다는 점이에요.";
    case "prof":
      return "잠깐 끊겼네. 이거 지금 사람들이 어떤 톤으로 받아들이는지가 꽤 중요해. 다만 반응이랑 사실은 분리해서 봐야 해.";
    case "pm":
    default:
      return "잠깐, 근데 이 사안은 한 줄로 단정하긴 어려워. 출처에 나온 사실과 그 위에 얹힌 해석을 나눠 보는 게 먼저야.";
  }
}
