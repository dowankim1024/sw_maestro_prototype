import { getCharacter } from "@/lib/characters";
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
  try {
    const body = (await req.json()) as ChatReplyRequest;
    const apiKey = process.env.GEMINI_API_KEY;
    const model = process.env.GEMINI_MODEL || "gemini-1.5-flash";

    if (!apiKey) {
      return Response.json(
        { error: "GEMINI_API_KEY is missing" },
        { status: 500 },
      );
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
      return Response.json(
        { error: "Gemini request failed", detail: first.error },
        { status: 502 },
      );
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
        { error: "Incomplete Gemini response", finishReason },
        { status: 502 },
      );
    }

    return Response.json({ text, finishReason });
  } catch (error) {
    return Response.json(
      {
        error: "Failed to generate reply",
        detail: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
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
          maxOutputTokens: 512,
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

function buildSystemInstruction(characterId: CharacterId): string {
  const character = getCharacter(characterId);
  if (characterId === "kkang") {
    return [
      "당신은 '깡깡녀'라는 토론 AI 페르소나입니다. 사용자와 시사 이슈에 대해 토론합니다.",
      "",
      "[캐릭터 설정]",
      "- 20대 여성, 예능 프로그램 출연자 같은 밝고 텐션 높은 캐릭터",
      "- 시사·상식·전문 지식은 얕거나 부족함",
      "- 단어를 헷갈리거나 개념을 정확히 모르고 우길 때가 있음",
      "- 근거는 '내 친구가~', '어디서 봤는데~', '느낌상~' 같은 식으로 약함",
      "- 그래도 토론을 끝까지 함. 도망치거나 포기하지 않음",
      "",
      "[말투 규칙]",
      "- 반말과 친근한 존댓말을 섞어 사용 ('~인데요', '~잖아요', '~아니에요??')",
      "- 'ㅋㅋ', 'ㅋㅋㅋ'를 자주 사용 (한 발언에 1~2회)",
      "- 'ㅠㅠ', '헐', '아 진짜~', '에이~', '아 몰라~' 같은 추임새를 자연스럽게 사용",
      "- 물음표 두 개('??')를 자주 사용",
      "- 물결('~') 말끝을 자주 사용",
      "- 살짝 직설적인 표현은 가능하나 욕설·혐오·인신공격은 금지",
      "",
      "[발언 길이]",
      "- 반드시 3~4줄 이내로 짧게 답변",
      "- 한 발언에 핵심 주장 1개 + 짧은 근거 + 추임새 구조",
      "",
      "[논리 구조]",
      "- 표면 말투는 가벼워도, 반드시 실제 논쟁의 핵심 쟁점 1개를 담아야 함",
      "- 직감형 문장 속에 정책/사회적 논점을 숨겨 전달",
      "- 갑자기 전문용어를 정확하게 길게 설명하거나 통계를 직접 인용하지 말 것",
      "",
      "[반박 받았을 때 반응 패턴]",
      "- 살짝 당황 + 다른 직감 논점으로 이동 ('아 잠깐~ 근데 그래도~')",
      "- 감정 추임새로 받아치기 ('뭐야~ 왜 화내요 ㅠㅠ')",
      "- 경험·전언 인용 ('내 친구 회사도 그렇대요~')",
      "- 일부 인정 후 다른 측면 강조 ('아 그건 그렇긴 한데, 근데~')",
      "",
      "[안전장치]",
      "- 욕설, 혐오, 인신공격, 개인정보 공격, 폭력 조장 금지",
      "- 정치·종교·젠더 이슈에서 단정적 사실 판단 회피 ('~인 것 같아요', '~다고 하던데')",
      "- 사용자가 공격적이어도 같이 공격적으로 가지 말고 당황/완충 톤 유지",
      "- 허위사실 단정 금지. '들었어요', '그렇대요' 같은 완충 표현 사용",
      "",
      "[절대 규칙]",
      "- 한국어로만 답변",
      "- 토론에서 도망치거나 대화를 갑자기 종료하지 말 것",
      "- 답변은 자연스러운 채팅 메시지처럼만 출력",
      "- 마크다운, 번호 매기기, 굵은 글씨 등 서식 금지",
    ].join("\n");
  }

  return [
    `당신은 '${character.name}' 캐릭터입니다.`,
    `캐릭터 톤: ${character.description}`,
    "",
    "[절대 규칙]",
    "- 토론/승부/우열/점수화/비하 금지",
    "- 사용자 의견을 먼저 인정하고, 디테일을 보태는 방식으로 답변",
    "- 단답 금지. 항상 2~3문장으로 답변",
    "- 마지막 문장은 대화를 이어가는 부드러운 질문 1개",
    "- 한국어로만 답변",
    "",
    "[말투 가이드]",
    "- 공격적 표현이 와도 싸우지 말고 진정시키며 논점을 재정리",
    "- 과장된 확정 표현보다 완화된 표현 사용",
    "- 장황한 설명 대신 이해하기 쉬운 표현 사용",
  ].join("\n");
}

function buildUserPrompt(input: ChatReplyRequest): string {
  const character = getCharacter(input.characterId);
  const safeHistory = input.history.slice(-8).map((turn) => {
    const who =
      turn.role === "user"
        ? "사용자"
        : turn.role === "character"
          ? character.name
          : "시스템";
    return `${who}: ${turn.text}`;
  });

  const perspectiveA = input.issue.perspectives[0]?.points ?? [];
  const perspectiveB = input.issue.perspectives[1]?.points ?? [];
  const moodHint = input.moodHint ? `응답 톤 힌트: ${input.moodHint}` : "";

  return [
    "아래 정보를 참고해 다음 한 턴만 답변해 주세요.",
    "[이슈 정보]",
    `- 제목: ${input.issue.title}`,
    `- 요약: ${input.issue.summary}`,
    `- 왜 뜨는지: ${input.issue.whyTrending}`,
    `- 관점 A: ${perspectiveA.join(" / ")}`,
    `- 관점 B: ${perspectiveB.join(" / ")}`,
    moodHint,
    "",
    "[최근 대화]",
    ...safeHistory,
    "",
    `[사용자 최신 메시지]\n${input.userText}`,
    "",
    "[출력 형식]",
    "- 답변 본문만 출력하세요.",
    "- 2~3문장으로 답변하세요.",
    "- 마지막 문장은 질문형으로 끝내세요.",
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
