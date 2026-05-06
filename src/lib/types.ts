export type Sentiment = "positive" | "neutral" | "negative" | "controversial";

export type SourceType = "news" | "community" | "social" | "search" | "rss";

export type AgeGroup = "10대" | "20대";

export type IssueCategory =
  | "정치/사회"
  | "경제"
  | "테크"
  | "문화/연예"
  | "스포츠"
  | "커뮤니티"
  | "글로벌";

export type Category = AgeGroup | "전체" | IssueCategory;

// 필터 탭 노출 순서: 연령 → 전체 → 도메인
export const CATEGORIES: Category[] = [
  "10대",
  "20대",
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
  /** 칩 그라데이션 (Tailwind from/via/to 클래스) */
  gradient: string;
}

export const CATEGORY_META: Record<Category, CategoryMeta> = {
  "10대": {
    emoji: "🧃",
    caption: "교복부터 입시까지",
    gradient: "from-fuchsia-500/40 via-rose-500/30 to-orange-400/30",
  },
  "20대": {
    emoji: "🎧",
    caption: "취업·연애·관심사",
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
  name: string;
  type: SourceType;
  /** 내부 보관용. UI에는 노출하지 않음 */
  url: string;
  publishedAt: string;
}

export interface TrendIssue {
  id: string;
  rank: number;
  title: string;
  category: IssueCategory;
  /** 카드/슬라이드용 한 줄 후킹 */
  oneLine: string;
  summary: string;
  whyTrending: string;
  trendScore: number;
  mentionCount: number;
  growthRate: number;
  sentiment: Sentiment;
  controversyScore: number;
  keywords: string[];
  /** 연령 관심사 태그 (필터링용) */
  targetAge: AgeGroup[];
  /** 이미지 시드 (picsum.photos seed 등) */
  imageSeed: string;
  /** 카드 커버 이모지 (이미지 로딩 실패 대비/장식) */
  coverEmoji: string;
  sources: IssueSource[];
  proArguments: string[];
  conArguments: string[];
}

export type DebateRole = "user" | "ai" | "system";

export interface DebateMessage {
  id: string;
  role: DebateRole;
  content: string;
  round: number;
  createdAt: string;
}

export type UserStance = "찬성" | "반대" | "AI 자동 선택";
export type ResolvedStance = "찬성" | "반대";
export type Difficulty = "쉬움" | "보통" | "어려움";

// === AI 페르소나 ===
export type PersonaId = "kkang" | "sohn" | "teen" | "econ";

export interface Persona {
  id: PersonaId;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  emoji: string;
  /** 그라데이션 (Tailwind) */
  gradient: string;
  /** 난이도 권장 (UI 가이드용) */
  recommendedDifficulty: Difficulty;
  /** 톤 가이드 (services.generateDebateReply 가 사용) */
  tone: {
    /** 자주 쓰는 첫 마디 / 추임새 */
    intro: string[];
    /** 강조 어휘 */
    fillers: string[];
    /** 마무리 어구 */
    closer: string[];
    /** aggression 가중 (0~1) */
    sharpness: number;
  };
}

export interface DebateScores {
  logic: number;
  evidence: number;
  rebuttal: number;
  emotionalControl: number;
  persuasion: number;
}

export type Verdict = "사용자 우세" | "AI 우세" | "팽팽함";

export interface DebateFeedback {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  fallacies: string[];
  nextTips: string[];
}

export interface DebateConfig {
  issueId: string;
  userStance: UserStance;
  resolvedUserStance: ResolvedStance;
  aiStance: ResolvedStance;
  difficulty: Difficulty;
  totalRounds: 3 | 5 | 7;
  personaId: PersonaId;
}

export interface DebateResult {
  id: string;
  issueId: string;
  issueTitle: string;
  userStance: ResolvedStance;
  aiStance: ResolvedStance;
  difficulty: Difficulty;
  totalRounds: number;
  personaId: PersonaId;
  personaName: string;
  messages: DebateMessage[];
  scores: DebateScores;
  finalVerdict: Verdict;
  feedback: DebateFeedback;
  createdAt: string;
}
