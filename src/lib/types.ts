/**
 * 이슈캐스트 데이터 모델 v2.
 *
 * refactor 문서의 제품 구조 기준.
 * 핵심 원칙:
 *   - 사실(Fact)과 캐릭터 의견(Angle/Opinion)을 분리한다.
 *   - 모든 이슈에는 최소 2개 이상의 출처가 있어야 한다.
 *   - 위험도(safetyLevel)에 따라 면책 문구 강도를 다르게 한다.
 *   - 점수·등급·랭킹·찬반 대립 필드는 두지 않는다.
 */

// ---------------------------------------------------------------------------
// CATEGORY
// ---------------------------------------------------------------------------

export type IssueCategory =
  | "경제"
  | "사회"
  | "테크"
  | "문화"
  | "정치"
  | "글로벌";

export const ISSUE_CATEGORIES: IssueCategory[] = [
  "경제",
  "사회",
  "테크",
  "문화",
  "정치",
  "글로벌",
];

export interface CategoryMeta {
  emoji: string;
  caption: string;
}

export const CATEGORY_META: Record<IssueCategory, CategoryMeta> = {
  경제: { emoji: "📈", caption: "물가·소비·산업" },
  사회: { emoji: "🏘️", caption: "정책·생활·노동" },
  테크: { emoji: "🤖", caption: "AI·플랫폼·디지털" },
  문화: { emoji: "🎬", caption: "콘텐츠·트렌드" },
  정치: { emoji: "🏛️", caption: "정부·국회·정책" },
  글로벌: { emoji: "🌏", caption: "해외·국제 정세" },
};

// ---------------------------------------------------------------------------
// SAFETY
// ---------------------------------------------------------------------------

/**
 * 위험도 분류.
 *  - normal: 일반 트렌드·생활 이슈
 *  - sensitive: 정치·젠더·종교·노사 등 사회 갈등 이슈
 *  - highRisk: 명예훼손·수사·재판·의료/금융 위험 이슈 (MVP 발행 보류)
 */
export type SafetyLevel = "normal" | "sensitive" | "highRisk";

// ---------------------------------------------------------------------------
// SOURCE
// ---------------------------------------------------------------------------

export type SourceType = "news" | "official" | "report" | "data" | "other";

export interface Source {
  id: string;
  title: string;
  publisher: string;
  url: string;
  publishedAt: string;
  retrievedAt: string;
  type: SourceType;
}

// ---------------------------------------------------------------------------
// FACT
// ---------------------------------------------------------------------------

/** 사실 라벨. UI 라벨용 키. */
export type FactLabel = "fact" | "reported" | "uncertain";

export interface IssueFact {
  id: string;
  /** 한 문장. 단정 표현 회피. */
  statement: string;
  /** 어떤 출처에서 확인되었는지 */
  sourceIds: string[];
  /** 신뢰 단계. UI 라벨로 그대로 노출된다. */
  confidence: FactLabel;
  lastCheckedAt: string;
}

// ---------------------------------------------------------------------------
// CHARACTER
// ---------------------------------------------------------------------------

/**
 * 캐릭터 ID.
 * 호환성을 위해 기존 storage 키(`kkang`/`uncle`/`prof`/`pm`)를 유지하되,
 * 의미는 refactor/01_product_structure.md 와
 * refactor/02_character_persona_prompts.md 기준으로 재정의한다.
 *  - kkang  → 민철 (생활자 렌즈)
 *  - uncle  → 수진 교수 (전문가 렌즈)
 *  - prof   → 지오 (트렌드 렌즈)
 *  - pm     → 도윤 (회의주의자 렌즈)
 */
export type CharacterId = "kkang" | "uncle" | "prof" | "pm";

export const CHARACTER_IDS: CharacterId[] = ["kkang", "uncle", "prof", "pm"];

export type CharacterTone = "생활자" | "전문가" | "트렌드" | "회의주의";

export interface Character {
  id: CharacterId;
  name: string;
  shortName: string;
  /** 어떤 시각으로 이슈를 보는지 한 줄 */
  lens: string;
  /** 캐릭터 한 줄 소개 */
  description: string;
  /** 톤 라벨 (UI 칩에 사용) */
  tone: CharacterTone;
  emoji: string;
  /** Tailwind from/via/to */
  gradient: string;
  /** 캐릭터 시그니처 표현 일부. UI 미리보기용. */
  signaturePhrases: string[];
}

// ---------------------------------------------------------------------------
// CHARACTER ANGLE (이슈에 대한 캐릭터 관점)
// ---------------------------------------------------------------------------

/**
 * 같은 이슈를 캐릭터별로 어떻게 보는가.
 * 캐릭터 의견은 `referencedFactIds`로 항상 사실에 연결된다.
 */
export interface CharacterAngle {
  characterId: CharacterId;
  /** 캐릭터별 시각 라벨 (예: "내 지갑 관점") */
  lensLabel: string;
  /** 한 줄 관점 (30자 내외) */
  oneLiner: string;
  /** 3~4줄 설명. 캐릭터 톤. */
  viewpoint: string;
  /** 의견임을 명시하는 짧은 면책 한 줄 */
  opinionDisclaimer: string;
  /** 이 관점이 어떤 사실 위에 얹힌 것인지 */
  referencedFactIds: string[];
}

// ---------------------------------------------------------------------------
// ISSUE
// ---------------------------------------------------------------------------

export interface Issue {
  id: string;
  /** 본 제목. 자극적이지 않게. */
  title: string;
  /** 30자 이내 짧은 제목 (홈 카드용) */
  shortTitle: string;
  /** 한 줄 요약 */
  summary: string;
  /** 왜 지금 뜨는지 한 단락 */
  whyNow: string;
  category: IssueCategory;
  publishedAt: string;
  updatedAt: string;
  /** 30초 소비 기준 */
  readTimeSec: 30;
  keywords: string[];

  facts: IssueFact[];
  sources: Source[];
  characterAngles: CharacterAngle[];
  /** 사용자가 캐릭터에게 던질 만한 진입 질문 (얕음 → 깊음) */
  conversationStarters: string[];

  safetyLevel: SafetyLevel;
  /** 카드 커버용 이모지 */
  coverEmoji: string;
  /** 릴스 모드 표지 배경 이미지 (선택) */
  coverImage?: string;
}

// ---------------------------------------------------------------------------
// REACTION
// ---------------------------------------------------------------------------

export type ReactionKind =
  | "like"
  | "dislike"
  | "newToMe"
  | "moreCurious"
  | "loveCharacter"
  | "tryAnother";

export const REACTION_LABELS: Record<ReactionKind, string> = {
  like: "좋아요",
  dislike: "별로예요",
  newToMe: "새로 알았어요",
  moreCurious: "더 궁금해요",
  loveCharacter: "이 캐릭터 좋아요",
  tryAnother: "다른 캐릭터로 볼래요",
};

export interface Reaction {
  id: string;
  issueId: string;
  /** 캐릭터에 대한 반응이면 캐릭터 id, 이슈 자체에 대한 반응이면 undefined */
  characterId?: CharacterId;
  kind: ReactionKind;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// CHAT
// ---------------------------------------------------------------------------

export type ChatRole = "user" | "character" | "system";

export interface ChatTurn {
  id: string;
  role: ChatRole;
  text: string;
  /** 폴백 답변 여부 (LLM 실패 시 true) */
  degraded?: boolean;
  degradedReason?: string;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// INSIGHT CARD ("오늘 새로 본 것")
// ---------------------------------------------------------------------------

export interface KeyTakeaway {
  concept: string;
  explanation: string;
  /** 사실 ID (있을 때만) */
  sourceFactIds?: string[];
}

export interface InsightCard {
  id: string;
  issueId: string;
  issueTitle: string;
  characterId: CharacterId;
  characterName: string;
  /** 짧은 헤드라인 (30자 이내) */
  headline: string;
  keyTakeaways: KeyTakeaway[];
  /** 사용자가 던진 좋은 관찰·질문 한 문장 */
  userInsight: string;
  /** 다음에 더 궁금해할 만한 지점 */
  nextCuriosity: string;
  /** 캐릭터 톤의 공유용 한 줄 */
  shareableQuote: string;
  /** 대화 길이 (분 또는 턴 수) */
  duration: string;
  /** 폴백 카드 여부 (LLM 실패 시 true) */
  degraded?: boolean;
  /** 원본 대화 내역 (다시 보기) */
  turns: ChatTurn[];
  createdAt: string;
}

// ---------------------------------------------------------------------------
// QUICK REACTIONS (대화 중 빠른 입력)
// ---------------------------------------------------------------------------

export type QuickPrompt =
  | "더 쉽게"
  | "예시 하나만"
  | "한 줄로"
  | "왜 그런 건지"
  | "다른 시각도";

export const QUICK_PROMPTS: QuickPrompt[] = [
  "더 쉽게",
  "예시 하나만",
  "한 줄로",
  "왜 그런 건지",
  "다른 시각도",
];

export function quickPromptToText(qp: QuickPrompt): string {
  switch (qp) {
    case "더 쉽게":
      return "방금 그거, 좀 더 쉽게 설명해줄래?";
    case "예시 하나만":
      return "이해되게 예시 하나만 들어줘.";
    case "한 줄로":
      return "이 이슈를 한 줄로 정리해줘.";
    case "왜 그런 건지":
      return "그게 왜 그런 건지 좀 더 풀어줘.";
    case "다른 시각도":
      return "다르게 보는 사람들은 어떻게 봐?";
  }
}
