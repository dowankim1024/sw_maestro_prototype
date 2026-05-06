export type Sentiment = "positive" | "neutral" | "negative" | "controversial";

export type SourceType = "news" | "community" | "social" | "search" | "rss";

export type AudienceAge = "20대" | "30대";

export type IssueCategory =
  | "정치/사회"
  | "경제"
  | "테크"
  | "문화/연예"
  | "스포츠"
  | "커뮤니티"
  | "글로벌";

export type Category = AudienceAge | "전체" | IssueCategory;

// 필터 탭 노출 순서: 연령(20대 → 30대) → 전체 → 도메인
export const CATEGORIES: Category[] = [
  "20대",
  "30대",
  "전체",
  "정치/사회",
  "경제",
  "테크",
  "문화/연예",
  "스포츠",
  "커뮤니티",
  "글로벌",
];

export interface CategoryMeta {
  emoji: string;
  caption: string;
  /** 칩 그라데이션 (Tailwind from/via/to) */
  gradient: string;
}

export const CATEGORY_META: Record<Category, CategoryMeta> = {
  "20대": {
    emoji: "🧃",
    caption: "취업·연애·관심사",
    gradient: "from-fuchsia-500/40 via-rose-500/30 to-orange-400/30",
  },
  "30대": {
    emoji: "🍵",
    caption: "일·돈·살림 이야기",
    gradient: "from-cyan-500/40 via-sky-500/30 to-indigo-500/30",
  },
  전체: {
    emoji: "🌐",
    caption: "지금 뜨는 모든 이슈",
    gradient: "from-slate-500/40 via-slate-500/20 to-slate-400/10",
  },
  "정치/사회": {
    emoji: "🏛️",
    caption: "정책·사회 변화",
    gradient: "from-rose-500/40 via-rose-500/20 to-amber-400/20",
  },
  경제: {
    emoji: "📈",
    caption: "물가·산업·일자리",
    gradient: "from-emerald-500/40 via-teal-500/20 to-cyan-500/20",
  },
  테크: {
    emoji: "🛰️",
    caption: "AI·플랫폼·디지털",
    gradient: "from-indigo-500/40 via-violet-500/30 to-fuchsia-500/30",
  },
  "문화/연예": {
    emoji: "🎬",
    caption: "콘텐츠·셀럽·트렌드",
    gradient: "from-pink-500/40 via-rose-500/30 to-amber-400/20",
  },
  스포츠: {
    emoji: "⚽",
    caption: "리그·이적·국가대표",
    gradient: "from-sky-500/40 via-blue-500/30 to-emerald-500/20",
  },
  커뮤니티: {
    emoji: "💬",
    caption: "익명 게시판·밈",
    gradient: "from-amber-500/40 via-orange-500/30 to-rose-500/20",
  },
  글로벌: {
    emoji: "🌏",
    caption: "해외·국제정세",
    gradient: "from-blue-500/40 via-indigo-500/30 to-purple-500/20",
  },
};

export interface IssueSource {
  /** 내부 보관용. UI에는 노출하지 않음 */
  name: string;
  type: SourceType;
  url: string;
  publishedAt: string;
}

/**
 * 관점(Perspective).
 * v3에서는 ‘찬성/반대’ 라벨을 쓰지 않는다. 항상 둘 이상의 ‘시각’만 있다.
 */
export interface Perspective {
  /** 예: "이렇게 보는 사람들" */
  label: string;
  points: string[];
}

export interface TrendIssue {
  id: string;
  rank: number;
  title: string;
  category: IssueCategory;
  /** 카드/슬라이드용 한 줄 후킹 */
  oneLine: string;
  /** 좀 더 길게 한 단락 요약 */
  summary: string;
  whyTrending: string;
  trendScore: number;
  mentionCount: number;
  growthRate: number;
  sentiment: Sentiment;
  /** 0~100. UI에 ‘논쟁성’이라는 단어로는 노출하지 않는다. */
  buzzScore: number;
  keywords: string[];
  audienceAge: AudienceAge[];
  imageSeed: string;
  coverEmoji: string;
  sources: IssueSource[];
  /** 항상 2개의 시각. 단어는 중립적. */
  perspectives: [Perspective, Perspective];
  /** 대화에서 다룰 수 있는 핵심 포인트 3개 (issue.md 가이드 기준) */
  keyPoints: string[];
  /** 사용자가 캐릭터에게 던질 만한 진입 질문 3개 (얕음 → 깊음) */
  conversationStarters: string[];
}

// === 캐릭터 ===
export type CharacterId = "kkang" | "uncle" | "prof" | "pm";
/**
 * 페르소나 매칭 톤. prompt/character_*.md 의 비교표 기준.
 * - 가벼움 (Light): 깡깡녀
 * - 친근함 (Friendly): 옆집 아재
 * - 깊이 (Depth): 교수님
 * - 스마트 (Smart): MZ 인턴
 *
 * 주의: 캐릭터 id 'pm'은 호환성 위해 유지하지만 의미는 'MZ 인턴'으로 재정의됨.
 */
export type CharacterTone = "가벼움" | "친근함" | "깊이" | "스마트";

export interface Character {
  id: CharacterId;
  name: string;
  shortName: string;
  oneLiner: string;
  description: string;
  emoji: string;
  /** Tailwind from/via/to */
  gradient: string;
  tone: CharacterTone;
}

// === 대화 ===
export type ChatRole = "user" | "character" | "system";

export type Mood = "공감" | "시각공유" | "지식체크";

export interface ChatTurn {
  id: string;
  role: ChatRole;
  text: string;
  /** role === 'character' 일 때만 의미 있음 */
  mood?: Mood;
  /** 이번 턴에서 인사이트로 잡힌 한 줄 (선택) */
  capturedFact?: string;
  /**
   * LLM 호출이 실패해 폴백 응답이 사용된 경우.
   * UI 에서 "지금 잠깐 혼잡해서 임시 답변이에요" 안내를 표시한다.
   */
  degraded?: boolean;
  /** 폴백 사유 코드 (예: 'request_failed' | 'incomplete_response' | 'network_error'). 디버그용. */
  degradedReason?: string;
  createdAt: string;
}

export interface ChatSession {
  id: string;
  issueId: string;
  characterId: CharacterId;
  startedAt: string;
}

/** 04-prototype 카드 스키마의 한 항목 */
export interface KeyTakeaway {
  concept: string;
  explanation: string;
}

export interface ChatInsight {
  id: string;
  issueId: string;
  issueTitle: string;
  characterId: CharacterId;
  characterName: string;

  // === 04-prototype 카드 스키마 (LLM 생성) ===
  /** 카드 헤드라인. 30자 이내, 학습 성취감 톤 */
  headline?: string;
  /** 핵심 3가지 (개념 + 짧은 설명) */
  keyTakeaways?: KeyTakeaway[];
  /** 사용자가 대화 중 보여준 좋은 관찰·질문 한 문장 */
  userInsight?: string;
  /** 다음에 더 알면 재밌을 지점 한 문장 */
  nextCuriosity?: string;
  /** SNS 공유용 캐릭터 톤 한 줄 */
  shareableQuote?: string;
  /** 대화 시간 또는 턴 수 */
  duration?: string;

  // === 기존 카드 (LLM 실패 시 폴백 + 보조 표시) ===
  newlyLearned: string[]; // 2~3
  alreadyKnew: string[]; // 1~2
  wantToExplore: string[]; // 1~2
  characterClosing: string;

  /** 내부 사용용 (히스토리 다시 보기) */
  turns: ChatTurn[];
  createdAt: string;
}

// 자주 사용하는 빠른 응답 (텍스트 입력 부담 ↓)
export type QuickReaction =
  | "좀 더 쉽게"
  | "예시 하나만"
  | "한 줄로 요약"
  | "나는 좀 다르게 봐"
  | "공감돼";

export const QUICK_REACTIONS: QuickReaction[] = [
  "좀 더 쉽게",
  "예시 하나만",
  "한 줄로 요약",
  "나는 좀 다르게 봐",
  "공감돼",
];
