import { mockTrendData } from "./mock-data";
import { getPersona } from "./personas";
import type {
  DebateConfig,
  DebateMessage,
  DebateResult,
  DebateScores,
  Difficulty,
  Persona,
  PersonaId,
  ResolvedStance,
  Sentiment,
  TrendIssue,
  UserStance,
  Verdict,
} from "./types";

// ============================================================================
// TREND / ISSUE
// ============================================================================

/**
 * 실시간 이슈 목록을 가져옴.
 * MVP에서는 mock 데이터를 그대로 반환하며, 추후 아래 위치를 실제 API 호출로 교체.
 *
 * 예) const res = await fetch("/api/trends?category=...");
 *     return res.json();
 */
export async function fetchTrends(): Promise<TrendIssue[]> {
  // TODO: 실제 백엔드 연결 시 fetch("/api/trends") 등으로 교체
  await delay(120);
  return [...mockTrendData].sort((a, b) => a.rank - b.rank);
}

/**
 * 트렌드 점수 계산기. 백엔드가 직접 계산하지 않을 경우 클라이언트에서 보정 가능.
 * - 언급량 / 상승률 / 논쟁성 점수를 가중 합산
 */
export function calculateTrendScore(issue: TrendIssue): number {
  const mention = Math.min(issue.mentionCount / 2000, 100);
  const growth = Math.min(issue.growthRate, 250) / 2.5;
  const controversy = issue.controversyScore;
  const score = mention * 0.4 + growth * 0.4 + controversy * 0.2;
  return Math.round(Math.max(0, Math.min(100, score)));
}

export function getSentimentLabel(sentiment: Sentiment): string {
  switch (sentiment) {
    case "positive":
      return "긍정";
    case "negative":
      return "부정";
    case "controversial":
      return "논쟁적";
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
  if (count >= 10_000) {
    return `${(count / 10_000).toFixed(1)}만`;
  }
  if (count >= 1_000) {
    return `${(count / 1_000).toFixed(1)}천`;
  }
  return count.toString();
}

// ============================================================================
// DEBATE
// ============================================================================

/**
 * 토론 세션을 시작.
 * - 사용자가 'AI 자동 선택'으로 두면 AI가 반대 입장을 자동 결정.
 * - 추후 startDebateSession() 내부에서 LLM API에 system prompt를 전달하도록 교체.
 */
export function startDebateSession(input: {
  issue: TrendIssue;
  userStance: UserStance;
  difficulty: Difficulty;
  totalRounds: 3 | 5 | 7;
  personaId: PersonaId;
}): { config: DebateConfig; openingMessages: DebateMessage[] } {
  const { issue, userStance, difficulty, totalRounds, personaId } = input;
  const persona = getPersona(personaId);

  // AI 자동 선택일 경우 사용자 의견을 모르므로 기본은 '찬성'.
  const resolvedUserStance: ResolvedStance =
    userStance === "찬성"
      ? "찬성"
      : userStance === "반대"
        ? "반대"
        : "찬성";
  const aiStance: ResolvedStance =
    resolvedUserStance === "찬성" ? "반대" : "찬성";

  const now = new Date().toISOString();
  const openingMessages: DebateMessage[] = [
    {
      id: `sys-${Date.now()}`,
      role: "system",
      content: `[토론 시작] ‘${issue.title}’ · 상대 ${persona.name}(${persona.shortName}) · 총 ${totalRounds}라운드 · 난이도 ${difficulty}. 표현은 강할 수 있지만 인신공격은 자제해주세요. 근거 중심으로 토론하면 더 좋은 점수를 받습니다.`,
      round: 0,
      createdAt: now,
    },
    {
      id: `ai-open-${Date.now()}`,
      role: "ai",
      content: aiOpeningStatement(issue, aiStance, difficulty, persona),
      round: 1,
      createdAt: now,
    },
  ];

  return {
    config: {
      issueId: issue.id,
      userStance,
      resolvedUserStance,
      aiStance,
      difficulty,
      totalRounds,
      personaId,
    },
    openingMessages,
  };
}

function aiOpeningStatement(
  issue: TrendIssue,
  aiStance: ResolvedStance,
  difficulty: Difficulty,
  persona: Persona,
): string {
  const stanceArgs =
    aiStance === "찬성" ? issue.proArguments : issue.conArguments;
  const lead = stanceArgs[0] ?? "이 주제는 여러 관점이 충돌합니다.";
  const second = stanceArgs[1] ?? "근거를 함께 살펴봐야 합니다.";
  const intro = pick(persona.tone.intro);
  const closer = pick(persona.tone.closer);

  switch (persona.id) {
    case "sohn":
      return [
        `${intro} 저는 이번 토론에서 ‘${aiStance}’ 입장을 맡겠습니다.`,
        "",
        `쟁점을 둘로 분리해보죠.`,
        `1) ${lead}`,
        `2) ${second}`,
        "",
        `먼저 본인의 입장과 근거 하나만 명확히 들려주십시오. ${closer}`,
      ].join("\n");
    case "econ":
      return [
        `${intro} 저는 ‘${aiStance}’ 입장에서 분석을 시작하겠습니다.`,
        "",
        `두 가지 가설을 두겠습니다.`,
        `① ${lead}`,
        `② ${second}`,
        "",
        `각 가설에 대해 검증 가능한 지표 한 가지를 제시해주실 수 있을까요? ${closer}`,
      ].join("\n");
    case "kkang":
      return [
        `${intro} 나는 ‘${aiStance}’ 쪽이야. 길게 말 안 한다.`,
        "",
        `핵심 두 개만 짚는다.`,
        `- ${lead}`,
        `- ${second}`,
        "",
        `자, 본인 입장 한 줄, 근거 한 줄. 두 줄로 가자. ${closer}`,
      ].join("\n");
    case "teen":
    default: {
      const tone =
        difficulty === "어려움"
          ? "근데 진짜 그래요?"
          : difficulty === "보통"
            ? "음… 저는 좀 다른데요."
            : "솔직히 잘 모르겠어요. 근데요,";
      return [
        `${intro} 저는 그냥 ‘${aiStance}’ 쪽이에요. ${tone}`,
        "",
        `이런 게 좀 그래요.`,
        `· ${lead}`,
        `· ${second}`,
        "",
        `왜 다르게 생각해요? 그냥 듣고 싶어요. ${closer}`,
      ].join("\n");
    }
  }
}

/**
 * 사용자 메시지에 대한 AI 반론 생성.
 * MVP에서는 키워드 휴리스틱 + 라운드/난이도/과열도 기반의 mock 응답.
 *
 * 실제 LLM 연결 위치:
 *   const res = await fetch("/api/debate/reply", {
 *     method: "POST",
 *     body: JSON.stringify({ issue, userMessage, userStance, difficulty, roundHistory, heat }),
 *   });
 *   return res.json().reply as string;
 */
export function generateDebateReply(args: {
  issue: TrendIssue;
  userMessage: string;
  userStance: ResolvedStance;
  aiStance: ResolvedStance;
  difficulty: Difficulty;
  round: number;
  totalRounds: number;
  heat: number;
  personaId: PersonaId;
}): string {
  const {
    issue,
    userMessage,
    aiStance,
    difficulty,
    round,
    totalRounds,
    heat,
    personaId,
  } = args;
  const persona = getPersona(personaId);

  const aggressive = detectAggression(userMessage);
  const lacksEvidence = !hasEvidence(userMessage);
  const stanceArgs =
    aiStance === "찬성" ? issue.proArguments : issue.conArguments;
  const counterArg =
    stanceArgs[(round - 1) % stanceArgs.length] ??
    "근거 중심으로 살펴봐야 합니다.";

  const lines: string[] = [];

  if (heat >= 70 || aggressive) {
    lines.push(toneCoolDown(persona));
  }

  if (lacksEvidence) {
    lines.push(toneEvidenceProbe(persona, userMessage));
  }

  lines.push(toneSharpOpen(persona, difficulty));
  lines.push(`- 반론 ${round}: ${counterArg}`);

  if (round >= Math.ceil(totalRounds / 2)) {
    const second =
      stanceArgs[round % stanceArgs.length] ??
      "다양한 사례를 검토할 필요가 있습니다.";
    lines.push(`- 보강: ${second}`);
  }

  if (round >= totalRounds - 1) {
    lines.push(toneFinalPush(persona));
  } else {
    lines.push(toneNextTurn(persona));
  }

  return lines.join("\n");
}

function toneCoolDown(persona: Persona): string {
  switch (persona.id) {
    case "sohn":
      return "표현이 강해지셨습니다. 논점을 분리해서 다시 정리해보죠. 인신공격보다는 근거 중심으로 이어가겠습니다.";
    case "econ":
      return "감정 변수는 분석에서 분리하겠습니다. 데이터로 다시 가보죠.";
    case "kkang":
      return "워, 진정. 욕은 빼고 논리만. 그래야 뚫고 나오지.";
    case "teen":
    default:
      return "어… 좀 무서워요. 그래도 차근히 얘기해요.";
  }
}

function toneEvidenceProbe(persona: Persona, userMessage: string): string {
  const quoted = truncate(userMessage, 40);
  switch (persona.id) {
    case "sohn":
      return `좋은 관점입니다. 다만 “${quoted}”라는 주장은 어떤 근거에 기반합니까? 보도·통계·사례 중 한 가지만 인용해주시면 좋겠습니다.`;
    case "econ":
      return `흥미로운 가설입니다. “${quoted}”의 효과 크기를 추정할 수 있는 지표가 있을까요? 수치, 메타분석, 정책 보고서 중 하나를 제시해주시면 분석이 가능합니다.`;
    case "kkang":
      return `좋아, 그래서 “${quoted}” — 근거 한 줄. 숫자든 사례든. 짧게.`;
    case "teen":
    default:
      return `“${quoted}” … 근데 그거 어디서 봤어요? 진짜 그래요? 한 개만 알려줘봐요.`;
  }
}

function toneSharpOpen(persona: Persona, difficulty: Difficulty): string {
  const heavy = difficulty === "어려움";
  switch (persona.id) {
    case "sohn":
      return heavy
        ? "그 주장은 논리적 비약을 포함하고 있다고 봅니다. 정리해 반박드리겠습니다."
        : "그 주장에서 짚어볼 부분이 있습니다. 정리해보죠.";
    case "econ":
      return heavy
        ? "전제 조건이 깨지는 케이스가 존재합니다. 한계와 가정부터 다시 짚겠습니다."
        : "탄력성·외부효과를 함께 보면 결론이 달라질 수 있습니다.";
    case "kkang":
      return heavy
        ? "솔직히 그건 좀 약해. 한 방에 뚫는다."
        : "그건 좀 미지근하지. 진짜 핵심은 이거야.";
    case "teen":
    default:
      return "근데요, 좀 다르게 보면요…";
  }
}

function toneFinalPush(persona: Persona): string {
  switch (persona.id) {
    case "sohn":
      return "막바지입니다. 본인의 가장 강한 근거 한 가지로 정리 발언을 부탁드립니다.";
    case "econ":
      return "마지막 라운드에서는 결론을 단일 명제로 압축하고, 그 명제를 뒷받침하는 핵심 증거 하나만 제시해주십시오.";
    case "kkang":
      return "자, 마지막. 한 줄 결론 + 한 줄 근거. 두 줄이면 끝.";
    case "teen":
    default:
      return "거의 끝났네요. 마지막에 한 줄로만 정리해줘요!";
  }
}

function toneNextTurn(persona: Persona): string {
  switch (persona.id) {
    case "sohn":
      return "위 반론에 대해 본인의 입장이 어떻게 답하는지 들어보고 싶습니다.";
    case "econ":
      return "위 반박을 가정 ①과 ② 중 어디에 대응하는지 명확히 해주시기 바랍니다.";
    case "kkang":
      return "그래서, 받아칠 거야 말 거야? 한 줄.";
    case "teen":
    default:
      return "어떻게 생각해요? 솔직하게 말해줘요!";
  }
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * 과열도 점수 계산.
 * - 0~39: 정상 / 40~69: 주의 / 70~100: 과열
 * - 기준: 욕설/혐오/인신공격/단정적 표현/허위 단정 키워드
 */
export function calculateHeatScore(args: {
  previousHeat: number;
  message: string;
}): { heat: number; level: "정상" | "주의" | "과열"; deltas: string[] } {
  const { previousHeat, message } = args;
  const m = message.toLowerCase();
  const deltas: string[] = [];
  let delta = 0;

  const profanity = /(씨발|시발|병신|존나|좆|닥쳐|꺼져|개새|미친|fuck|shit)/i;
  const personalAttack = /(너 따위|너는 멍청|무식|머저리|틀딱|급식|찌질)/;
  const hate = /(혐오|차별|쓰레기들|족속)/;
  const absolute = /(무조건|절대|반드시 틀렸|뻔한 사실|100% 거짓)/;
  const violence = /(때려|패버려|죽여|박살)/;

  if (profanity.test(m)) {
    delta += 22;
    deltas.push("욕설/비속어 감지");
  }
  if (personalAttack.test(m)) {
    delta += 18;
    deltas.push("인신공격성 표현");
  }
  if (hate.test(m)) {
    delta += 16;
    deltas.push("혐오 표현 가능성");
  }
  if (violence.test(m)) {
    delta += 24;
    deltas.push("폭력 조장 표현");
  }
  if (absolute.test(m)) {
    delta += 6;
    deltas.push("단정적 표현(완화 권장)");
  }

  // 시간이 지나면 자연 감소
  const cooled = Math.max(0, previousHeat - 4);
  const heat = Math.min(100, cooled + delta);
  const level: "정상" | "주의" | "과열" =
    heat >= 70 ? "과열" : heat >= 40 ? "주의" : "정상";
  return { heat, level, deltas };
}

/**
 * 판단 AI: 토론 종료 후 중립 평가 리포트 생성.
 * 추후 LLM 연결 시 messages 전체를 프롬프트로 전달하도록 교체.
 */
export function judgeDebate(args: {
  issue: TrendIssue;
  config: DebateConfig;
  messages: DebateMessage[];
  finalHeat: number;
  heatHistory: number[];
}): DebateResult {
  const { issue, config, messages, finalHeat, heatHistory } = args;

  const userMsgs = messages.filter((m) => m.role === "user");
  const totalUserChars = userMsgs.reduce((acc, m) => acc + m.content.length, 0);
  const avgUserLen = userMsgs.length ? totalUserChars / userMsgs.length : 0;

  const evidenceHits = userMsgs.reduce(
    (acc, m) => acc + (hasEvidence(m.content) ? 1 : 0),
    0,
  );
  const evidenceRatio = userMsgs.length
    ? evidenceHits / userMsgs.length
    : 0;

  const aggressionHits = userMsgs.reduce(
    (acc, m) => acc + (detectAggression(m.content) ? 1 : 0),
    0,
  );
  const peakHeat = heatHistory.length ? Math.max(...heatHistory) : finalHeat;

  // 0~100 스코어링
  const logic = clamp(
    50 + Math.min(40, avgUserLen / 6) + evidenceRatio * 10 - aggressionHits * 5,
  );
  const evidence = clamp(
    35 + evidenceRatio * 60 + Math.min(10, userMsgs.length * 2),
  );
  const rebuttal = clamp(
    40 +
      Math.min(35, userMsgs.length * 6) +
      (avgUserLen > 60 ? 10 : 0) -
      aggressionHits * 4,
  );
  const emotionalControl = clamp(95 - peakHeat - aggressionHits * 6);
  const persuasion = clamp(
    (logic + evidence + rebuttal + emotionalControl) / 4 +
      (config.difficulty === "어려움" ? 5 : 0),
  );

  const scores: DebateScores = {
    logic: Math.round(logic),
    evidence: Math.round(evidence),
    rebuttal: Math.round(rebuttal),
    emotionalControl: Math.round(emotionalControl),
    persuasion: Math.round(persuasion),
  };

  const total =
    scores.logic +
    scores.evidence +
    scores.rebuttal +
    scores.emotionalControl +
    scores.persuasion;

  let finalVerdict: Verdict;
  if (total >= 360) finalVerdict = "사용자 우세";
  else if (total <= 280) finalVerdict = "AI 우세";
  else finalVerdict = "팽팽함";

  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const fallacies: string[] = [];
  const nextTips: string[] = [];

  if (avgUserLen >= 80)
    strengths.push("주장을 충분한 분량으로 풀어내며 논점을 명확히 했습니다.");
  if (evidenceRatio >= 0.4)
    strengths.push("수치·사례·출처 등 근거를 적극적으로 활용했습니다.");
  if (peakHeat < 40)
    strengths.push("표현 톤이 안정적이어서 토론이 매끄럽게 진행되었습니다.");
  if (userMsgs.length >= config.totalRounds)
    strengths.push("라운드 흐름에 맞춰 일관된 입장을 유지했습니다.");

  if (avgUserLen < 50)
    weaknesses.push("주장이 짧아 논리 전개가 부족하게 느껴졌습니다.");
  if (evidenceRatio < 0.3)
    weaknesses.push("주장에 비해 근거(수치, 사례, 보도)가 부족했습니다.");
  if (peakHeat >= 60)
    weaknesses.push("일부 구간에서 감정적 표현이 강해 논점이 흐려졌습니다.");
  if (aggressionHits > 0)
    weaknesses.push(
      "공격적 표현이 감지되어 설득력보다 반발 가능성이 커졌습니다.",
    );

  if (evidenceRatio < 0.3)
    fallacies.push("근거 없는 일반화 가능성 (Hasty Generalization)");
  if (aggressionHits > 0)
    fallacies.push("인신공격성 표현 (Ad Hominem) 위험");
  if (avgUserLen < 40)
    fallacies.push("논점 회피 또는 과도한 단순화 가능성");

  nextTips.push("핵심 주장을 한 문장으로 먼저 던지고, 근거 2~3개로 받쳐보세요.");
  nextTips.push(
    "수치·기관명·기간을 명시하면 ‘근거 활용 점수’가 빠르게 올라갑니다.",
  );
  if (peakHeat >= 50)
    nextTips.push(
      "감정적 단어 대신 ‘보도에 따르면’, ‘주장에 따르면’ 같은 완화 표현을 써보세요.",
    );
  nextTips.push(
    "마지막 라운드에서는 반대 측의 가장 강한 논리 한 가지를 선제적으로 반박해보세요.",
  );

  const summary = [
    `사용자는 ‘${config.resolvedUserStance}’ 입장에서 ${userMsgs.length}회 발언했고, 평균 ${Math.round(avgUserLen)}자 분량으로 주장했습니다.`,
    `근거 활용 비율은 ${Math.round(evidenceRatio * 100)}%, 토론 중 최고 과열도는 ${peakHeat}점이었습니다.`,
    finalVerdict === "사용자 우세"
      ? "사용자는 핵심 쟁점을 빠르게 잡았고, 일부 근거를 효과적으로 인용했습니다."
      : finalVerdict === "AI 우세"
        ? "사용자는 입장을 유지했지만, 근거 제시와 반박 대응에서 보강이 필요했습니다."
        : "사용자와 AI 모두 주요 쟁점을 균형 있게 다뤘습니다.",
  ].join(" ");

  const persona = getPersona(config.personaId);
  return {
    id: `result-${Date.now()}`,
    issueId: issue.id,
    issueTitle: issue.title,
    userStance: config.resolvedUserStance,
    aiStance: config.aiStance,
    difficulty: config.difficulty,
    totalRounds: config.totalRounds,
    personaId: persona.id,
    personaName: persona.name,
    messages,
    scores,
    finalVerdict,
    feedback: {
      summary,
      strengths: ensureNonEmpty(strengths, [
        "토론 끝까지 입장을 유지한 점이 인상적입니다.",
      ]),
      weaknesses: ensureNonEmpty(weaknesses, [
        "다음 토론에서는 근거를 더 자주 인용해보세요.",
      ]),
      fallacies,
      nextTips,
    },
    createdAt: new Date().toISOString(),
  };
}

// ============================================================================
// HELPERS
// ============================================================================

function detectAggression(text: string): boolean {
  return /(씨발|시발|병신|존나|좆|닥쳐|꺼져|개새|미친|머저리|찌질|혐오|족속|패버려|죽여|박살)/i.test(
    text,
  );
}

function hasEvidence(text: string): boolean {
  // 숫자, 단위, 보도/연구/통계 키워드, 인용표, 출처 표현 등이 있는지 검사
  return /(\d+\s?(%|％|만|천|억|조|건|명|시간|일|개|배))|(보도|연구|통계|발표|기관|논문|리포트|출처|인용|"|“|”)/.test(
    text,
  );
}

function truncate(text: string, len: number): string {
  if (text.length <= len) return text;
  return text.slice(0, len) + "…";
}

function clamp(v: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, v));
}

function ensureNonEmpty<T>(arr: T[], fallback: T[]): T[] {
  return arr.length > 0 ? arr : fallback;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
