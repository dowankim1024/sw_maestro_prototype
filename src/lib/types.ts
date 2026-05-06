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
}

// === 캐릭터 ===
export type CharacterId = "kkang" | "uncle" | "prof" | "pm";
export type CharacterTone = "직설_공감" | "생활밀착" | "학술" | "정책";

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
  createdAt: string;
}

export interface ChatSession {
  id: string;
  issueId: string;
  characterId: CharacterId;
  startedAt: string;
}

export interface ChatInsight {
  id: string;
  issueId: string;
  issueTitle: string;
  characterId: CharacterId;
  characterName: string;
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
