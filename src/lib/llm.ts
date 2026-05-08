/**
 * LLM 프로바이더 추상화.
 *
 * 두 백엔드를 같은 인터페이스로 호출한다.
 *  - "gemini"  : Google Generative Language API (gemini-2.5-flash 등)
 *  - "upstage" : Upstage Solar (OpenAI 호환 /chat/completions)
 *
 * 호출자(`api/chat/reply`, `api/chat/insight`)는 프로바이더가 무엇이든
 * `generateText({ system, user, jsonMode })` 한 번만 부르면 된다.
 *
 * 프로바이더 선택 우선순위:
 *  1) 인자로 명시된 provider (요청 body 등)
 *  2) 환경 변수 `LLM_PROVIDER`
 *  3) "gemini" (기본값)
 */

export type LlmProvider = "gemini" | "upstage";

export const LLM_PROVIDERS: LlmProvider[] = ["gemini", "upstage"];

export function isLlmProvider(v: unknown): v is LlmProvider {
  return v === "gemini" || v === "upstage";
}

export function resolveProvider(input?: unknown): LlmProvider {
  if (isLlmProvider(input)) return input;
  const env = process.env.LLM_PROVIDER;
  if (isLlmProvider(env)) return env;
  return "gemini";
}

// ---------------------------------------------------------------------------
// 공통 인터페이스
// ---------------------------------------------------------------------------

export interface LlmRequest {
  system: string;
  user: string;
  /** JSON 출력을 강제할지. 인사이트 카드 등에서 사용. */
  jsonMode?: boolean;
  temperature?: number;
  maxOutputTokens?: number;
  /** 명시적으로 프로바이더를 고정 (없으면 env / 기본값) */
  provider?: LlmProvider;
}

export type LlmFinishReason =
  | "stop"
  | "length"
  | "content_filter"
  | "other"
  | "";

export type LlmResult =
  | {
      ok: true;
      text: string;
      finishReason: LlmFinishReason;
      provider: LlmProvider;
      model: string;
    }
  | {
      ok: false;
      error: string;
      provider: LlmProvider;
      model: string;
    };

// ---------------------------------------------------------------------------
// 진입점
// ---------------------------------------------------------------------------

export async function generateText(req: LlmRequest): Promise<LlmResult> {
  const provider = resolveProvider(req.provider);
  if (provider === "upstage") {
    return callUpstage(req);
  }
  return callGemini(req);
}

// ---------------------------------------------------------------------------
// Gemini 어댑터
// ---------------------------------------------------------------------------

interface GeminiResponse {
  candidates?: Array<{
    finishReason?: string;
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
  promptFeedback?: { blockReason?: string };
}

async function callGemini(req: LlmRequest): Promise<LlmResult> {
  const provider: LlmProvider = "gemini";
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

  if (!apiKey) {
    return { ok: false, error: "missing_api_key", provider, model };
  }

  const generationConfig: Record<string, unknown> = {
    temperature: req.temperature ?? 0.85,
    topP: 0.95,
    maxOutputTokens: req.maxOutputTokens ?? 800,
  };
  if (req.jsonMode) {
    generationConfig.responseMimeType = "application/json";
  }

  let response: Response;
  try {
    response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: req.system }] },
          contents: [{ role: "user", parts: [{ text: req.user }] }],
          generationConfig,
        }),
      },
    );
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "fetch_failed",
      provider,
      model,
    };
  }

  if (!response.ok) {
    const errorBody = await response.text();
    return { ok: false, error: errorBody, provider, model };
  }

  const data = (await response.json()) as GeminiResponse;
  const text = (data.candidates?.[0]?.content?.parts ?? [])
    .map((p) => p.text?.trim() ?? "")
    .filter(Boolean)
    .join("\n")
    .trim();

  return {
    ok: true,
    text,
    finishReason: mapGeminiFinish(data.candidates?.[0]?.finishReason),
    provider,
    model,
  };
}

function mapGeminiFinish(reason: string | undefined): LlmFinishReason {
  if (!reason) return "";
  if (reason === "STOP") return "stop";
  if (reason === "MAX_TOKENS") return "length";
  if (reason === "SAFETY" || reason === "RECITATION") return "content_filter";
  return "other";
}

// ---------------------------------------------------------------------------
// Upstage 어댑터 (OpenAI 호환)
// ---------------------------------------------------------------------------

interface UpstageChatResponse {
  choices?: Array<{
    finish_reason?: string;
    message?: { role?: string; content?: string };
  }>;
  error?: { message?: string };
}

async function callUpstage(req: LlmRequest): Promise<LlmResult> {
  const provider: LlmProvider = "upstage";
  const apiKey = process.env.UPSTAGE_API_KEY;
  const model = process.env.UPSTAGE_MODEL || "solar-pro3";
  // Upstage 는 OpenAI 호환 /chat/completions 를 제공한다.
  // 공식 예시: baseURL = "https://api.upstage.ai/v1"
  // (openai-node SDK 가 base_url 뒤에 /chat/completions 를 자동으로 붙임)
  const baseUrl = (
    process.env.UPSTAGE_BASE_URL || "https://api.upstage.ai/v1"
  ).replace(/\/+$/, "");

  if (!apiKey) {
    return { ok: false, error: "missing_api_key", provider, model };
  }

  const body: Record<string, unknown> = {
    model,
    messages: [
      { role: "system", content: req.system },
      { role: "user", content: req.user },
    ],
    temperature: req.temperature ?? 0.85,
    top_p: 0.95,
    max_tokens: req.maxOutputTokens ?? 800,
  };
  if (req.jsonMode) {
    // OpenAI 호환 JSON mode
    body.response_format = { type: "json_object" };
  }

  let response: Response;
  try {
    response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "fetch_failed",
      provider,
      model,
    };
  }

  if (!response.ok) {
    const errorBody = await response.text();
    return { ok: false, error: errorBody, provider, model };
  }

  const data = (await response.json()) as UpstageChatResponse;
  if (data.error?.message) {
    return { ok: false, error: data.error.message, provider, model };
  }
  const choice = data.choices?.[0];
  const text = (choice?.message?.content ?? "").trim();

  return {
    ok: true,
    text,
    finishReason: mapOpenAiFinish(choice?.finish_reason),
    provider,
    model,
  };
}

function mapOpenAiFinish(reason: string | undefined): LlmFinishReason {
  if (!reason) return "";
  if (reason === "stop") return "stop";
  if (reason === "length") return "length";
  if (reason === "content_filter") return "content_filter";
  return "other";
}
