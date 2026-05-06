import type { TrendIssue } from "./types";

// NOTE: fetchTrends() 가 이 데이터를 반환. 실제 API 연결 시 동일 스키마로 교체.
// imageSeed → https://picsum.photos/seed/{seed}/W/H 에서 일관 이미지 확보.
// 출처는 내부 보관만 — UI에서 매체명/URL 노출 X (편향 방지).
//
// perspectives 라벨은 항상 중립 표현. ‘찬성/반대’가 아니라 ‘이렇게 보는 사람들 / 다르게 보는 사람들’.
export const mockTrendData: TrendIssue[] = [
  {
    id: "issue-ai-regulation",
    rank: 1,
    title: "AI 규제 법안, 곧 본회의 상정",
    category: "테크",
    oneLine: "AI 안전성 평가, 의무가 될까?",
    summary:
      "범용 AI 모델에 안전성 평가를 의무화하는 법안이 본회의 상정을 앞두고 있다. 산업 혁신과 위험 통제를 둘러싼 시각이 엇갈린다.",
    whyTrending:
      "법안 일정이 공개되며 IT 기업·학계가 동시에 의견서를 제출, 검색량이 24시간 만에 약 3배.",
    trendScore: 96,
    mentionCount: 184_320,
    growthRate: 218,
    sentiment: "controversial",
    buzzScore: 88,
    keywords: ["AI법", "안전성평가", "혁신"],
    audienceAge: ["20대", "30대"],
    imageSeed: "ai-regulation",
    coverEmoji: "🤖",
    sources: [
      { name: "테크 매체 A", type: "news", url: "https://example.com/a", publishedAt: "2026-05-04T08:12:00+09:00" },
      { name: "디지털 매체 B", type: "news", url: "https://example.com/b", publishedAt: "2026-05-04T07:40:00+09:00" },
      { name: "AI 커뮤니티", type: "community", url: "https://example.com/c", publishedAt: "2026-05-04T06:55:00+09:00" },
      { name: "테크 RSS", type: "rss", url: "https://example.com/rss", publishedAt: "2026-05-04T05:20:00+09:00" },
    ],
    perspectives: [
      {
        label: "이렇게 보는 사람들",
        points: [
          "안전성 평가는 사용자 보호의 최소 안전장치",
          "사고 발생 시 책임 소재가 명확해진다",
          "고위험 AI 사전 검증은 글로벌 흐름과 맞물린다",
        ],
      },
      {
        label: "다르게 보는 사람들",
        points: [
          "기술 정의가 모호해 행정 부담이 커질 수 있다",
          "스타트업의 진입 장벽이 높아질 우려",
          "글로벌 빅테크와의 비대칭 규제 가능성",
        ],
      },
    ],
  },
  {
    id: "issue-suneung-absolute",
    rank: 2,
    title: "수능 절대평가 확대안",
    category: "정치/사회",
    oneLine: "수능, 절대평가로 더 가도 될까?",
    summary:
      "주요 영역의 절대평가 전환 폭을 확대하는 안이 거론된다. 학습 부담 경감과 변별력 약화가 동시에 회자된다.",
    whyTrending:
      "교육부 공청회 일정이 공개되며 학생·학부모·교사 커뮤니티에서 동시에 의견 폭증.",
    trendScore: 90,
    mentionCount: 118_300,
    growthRate: 198,
    sentiment: "controversial",
    buzzScore: 79,
    keywords: ["수능", "절대평가", "입시"],
    audienceAge: ["20대"],
    imageSeed: "suneung",
    coverEmoji: "📝",
    sources: [
      { name: "교육 매체", type: "news", url: "https://example.com/edu", publishedAt: "2026-05-04T07:30:00+09:00" },
      { name: "수험생 커뮤니티", type: "community", url: "https://example.com/exam", publishedAt: "2026-05-04T08:15:00+09:00" },
    ],
    perspectives: [
      {
        label: "이렇게 보는 사람들",
        points: [
          "사교육·서열화 완화 가능성",
          "학교 교육 정상화의 계기",
          "수험생 정서·건강 부담 감소",
        ],
      },
      {
        label: "다르게 보는 사람들",
        points: [
          "변별력 저하로 상위권 평가가 어려워질 수 있다",
          "또 다른 전형의 비중이 커지면 새로운 사교육 유발",
          "전형 변화에 따른 학생 혼란",
        ],
      },
    ],
  },
  {
    id: "issue-genai-copyright",
    rank: 3,
    title: "생성형 AI 학습 데이터 가이드라인",
    category: "테크",
    oneLine: "내 그림이 AI 학습에 쓰여도 될까?",
    summary:
      "정부가 생성형 AI 학습용 데이터 저작권 가이드라인 초안을 공개했다. 보상안과 옵트아웃 절차가 핵심.",
    whyTrending:
      "주요 작가·일러스트레이터 단체가 의견서를 제출, SNS 캠페인이 확산.",
    trendScore: 88,
    mentionCount: 96_120,
    growthRate: 174,
    sentiment: "controversial",
    buzzScore: 83,
    keywords: ["생성형AI", "저작권", "옵트아웃"],
    audienceAge: ["20대", "30대"],
    imageSeed: "ai-copyright",
    coverEmoji: "🎨",
    sources: [
      { name: "문화 매체", type: "news", url: "https://example.com/culture", publishedAt: "2026-05-03T22:00:00+09:00" },
      { name: "소셜 트렌드", type: "social", url: "https://example.com/social", publishedAt: "2026-05-04T08:20:00+09:00" },
    ],
    perspectives: [
      {
        label: "이렇게 보는 사람들",
        points: [
          "창작자의 경제적 권리 보호 필요",
          "데이터 출처 투명성으로 신뢰도 향상",
          "정당한 보상 체계가 산업 지속 가능성을 높인다",
        ],
      },
      {
        label: "다르게 보는 사람들",
        points: [
          "기술 발전 속도와 비교해 절차가 복잡",
          "학습 비용 상승은 국내 AI 경쟁력에 부담",
          "옵트아웃 기준이 모호해 분쟁 가능",
        ],
      },
    ],
  },
  {
    id: "issue-ev-subsidy",
    rank: 4,
    title: "전기차 보조금 30% 축소안",
    category: "경제",
    oneLine: "전기차 보조금, 정말 줄여도 될까?",
    summary:
      "내년부터 평균 30% 줄이는 안이 검토 중. 충전 인프라 예산은 확대되지만 단기 수요 위축이 예상된다.",
    whyTrending:
      "완성차 업체들이 가격 인상 가능성을 시사하며 ‘지금 사야 하나’ 글이 폭증.",
    trendScore: 86,
    mentionCount: 142_980,
    growthRate: 165,
    sentiment: "negative",
    buzzScore: 74,
    keywords: ["전기차", "보조금", "친환경"],
    audienceAge: ["20대", "30대"],
    imageSeed: "ev-subsidy",
    coverEmoji: "🔌",
    sources: [
      { name: "경제 매체", type: "news", url: "https://example.com/eco", publishedAt: "2026-05-04T09:00:00+09:00" },
      { name: "오토 커뮤니티", type: "community", url: "https://example.com/auto", publishedAt: "2026-05-04T07:30:00+09:00" },
      { name: "소셜 트렌드", type: "social", url: "https://example.com/social-ev", publishedAt: "2026-05-04T08:50:00+09:00" },
    ],
    perspectives: [
      {
        label: "이렇게 보는 사람들",
        points: [
          "초기 보급은 일정 수준 진행, 보조금 의존도 낮출 시점",
          "충전 인프라 투자로 장기 사용자 편익 증가",
          "재정 건전성 측면의 단계적 축소",
        ],
      },
      {
        label: "다르게 보는 사람들",
        points: [
          "보급 정체로 탄소 감축 목표 달성 지연",
          "중저가 모델 구매층의 부담 가중",
          "산업 생태계의 체력 약화 우려",
        ],
      },
    ],
  },
  {
    id: "issue-four-day-week",
    rank: 5,
    title: "주 4일제 시범 도입 확대",
    category: "경제",
    oneLine: "주 4일제, 한국에서도 가능할까?",
    summary:
      "공공기관과 일부 대기업이 주 4일제 시범 운영. 노동단체는 환영, 중소기업은 인력 부담을 호소.",
    whyTrending:
      "정부 시범사업 발표 후 채용 플랫폼에서 ‘주 4일제’ 검색량 4배 이상.",
    trendScore: 84,
    mentionCount: 121_540,
    growthRate: 142,
    sentiment: "controversial",
    buzzScore: 81,
    keywords: ["주4일제", "노동시간", "워라밸"],
    audienceAge: ["20대", "30대"],
    imageSeed: "four-day-week",
    coverEmoji: "🗓️",
    sources: [
      { name: "노동연구 리포트", type: "news", url: "https://example.com/labor", publishedAt: "2026-05-03T18:30:00+09:00" },
      { name: "중소기업 포럼", type: "community", url: "https://example.com/sme", publishedAt: "2026-05-04T10:10:00+09:00" },
    ],
    perspectives: [
      {
        label: "이렇게 보는 사람들",
        points: [
          "근로시간 단축이 번아웃을 줄이고 창의성 확보",
          "장기적으로 우수 인재 유치 경쟁력",
          "도입한 해외 사례에서 생산성 유지 보고",
        ],
      },
      {
        label: "다르게 보는 사람들",
        points: [
          "교대근무·서비스업에 일괄 적용 어려움",
          "단기 인건비 부담으로 채용 위축 우려",
          "업무 강도가 오히려 가중될 수 있다는 보고",
        ],
      },
    ],
  },
  {
    id: "issue-youth-housing",
    rank: 6,
    title: "청년 월세 지원 확대안",
    category: "정치/사회",
    oneLine: "청년 월세 지원, 어디까지가 공정할까?",
    summary:
      "청년 1인 가구 대상 월세 지원금 한도를 두 배로 늘리는 정책안. 사각지대 해소와 형평성 문제 동시 제기.",
    whyTrending:
      "관련 청원이 하루 만에 5만 명 돌파, 커뮤니티 게시판 의견 폭증.",
    trendScore: 82,
    mentionCount: 98_720,
    growthRate: 130,
    sentiment: "controversial",
    buzzScore: 76,
    keywords: ["청년정책", "월세", "주거안정"],
    audienceAge: ["20대"],
    imageSeed: "youth-housing",
    coverEmoji: "🏠",
    sources: [
      { name: "정책 매체", type: "news", url: "https://example.com/policy", publishedAt: "2026-05-04T08:00:00+09:00" },
      { name: "청년 커뮤니티", type: "community", url: "https://example.com/youth", publishedAt: "2026-05-04T09:35:00+09:00" },
    ],
    perspectives: [
      {
        label: "이렇게 보는 사람들",
        points: [
          "치솟은 월세로 청년 주거 불안이 심각",
          "주거비 완화는 출산·결혼율 개선과 연결",
          "한시적 지원으로 정책 효과 측정 가능",
        ],
      },
      {
        label: "다르게 보는 사람들",
        points: [
          "신혼부부·중장년 1인 가구와의 형평성 문제",
          "재정 부담 대비 실효성에 대한 검증 필요",
          "보조금이 월세 시장에 흡수될 가능성",
        ],
      },
    ],
  },
  {
    id: "issue-platform-fee",
    rank: 7,
    title: "배달 플랫폼 수수료 인상안",
    category: "경제",
    oneLine: "배달앱 수수료, 누가 부담하나?",
    summary:
      "주요 배달 플랫폼의 수수료 체계 개편안. 일부 구간 최대 1.8%p 인상 — 자영업자 단체가 반발.",
    whyTrending: "공정거래 이슈로 확장, 정치권에서도 청문회 가능성 언급.",
    trendScore: 80,
    mentionCount: 89_440,
    growthRate: 118,
    sentiment: "negative",
    buzzScore: 71,
    keywords: ["플랫폼", "수수료", "자영업"],
    audienceAge: ["30대"],
    imageSeed: "delivery-fee",
    coverEmoji: "🛵",
    sources: [
      { name: "비즈니스 매체", type: "news", url: "https://example.com/biz", publishedAt: "2026-05-04T07:10:00+09:00" },
      { name: "자영업 모임", type: "community", url: "https://example.com/owners", publishedAt: "2026-05-04T09:00:00+09:00" },
    ],
    perspectives: [
      {
        label: "이렇게 보는 사람들",
        points: [
          "운영 비용 상승을 반영한 합리적 조정",
          "장기적 서비스 안정화 투자 재원",
          "타 플랫폼 대비 여전히 낮은 수준이라는 주장",
        ],
      },
      {
        label: "다르게 보는 사람들",
        points: [
          "자영업자의 마진 압박이 임계치에 근접",
          "최종 가격 인상으로 소비자 부담 전가 가능",
          "독과점 구조에서의 일방적 인상 우려",
        ],
      },
    ],
  },
  {
    id: "issue-remote-work",
    rank: 8,
    title: "대기업 원격근무 축소 발표",
    category: "경제",
    oneLine: "다시 사무실로? 원격근무 축소",
    summary:
      "주 3일 출근 의무화 추진. 협업 강화 vs 워라밸 후퇴 평가가 엇갈린다.",
    whyTrending:
      "내부 공지 유출로 익명 직장인 커뮤니티 토론 폭발.",
    trendScore: 76,
    mentionCount: 64_510,
    growthRate: 112,
    sentiment: "controversial",
    buzzScore: 69,
    keywords: ["원격근무", "출근", "워라밸"],
    audienceAge: ["20대", "30대"],
    imageSeed: "remote-work",
    coverEmoji: "💻",
    sources: [
      { name: "잡 매체", type: "news", url: "https://example.com/job", publishedAt: "2026-05-04T07:50:00+09:00" },
      { name: "직장인 익명", type: "community", url: "https://example.com/anon", publishedAt: "2026-05-04T08:30:00+09:00" },
    ],
    perspectives: [
      {
        label: "이렇게 보는 사람들",
        points: [
          "대면 협업의 시너지와 신입 온보딩 효과",
          "조직 문화 유지에 필요한 최소 출근 일수",
          "성과 측정의 명확성 확보",
        ],
      },
      {
        label: "다르게 보는 사람들",
        points: [
          "통근 시간 증가로 인한 생산성 저하 우려",
          "이미 정착된 유연근무 신뢰 훼손",
          "이직 시장 자극으로 핵심 인재 이탈 가능",
        ],
      },
    ],
  },
  {
    id: "issue-kcontent-global",
    rank: 9,
    title: "K-콘텐츠 글로벌 흥행, 제작 환경",
    category: "문화/연예",
    oneLine: "K-콘텐츠는 흥하는데, 현장은 괜찮을까?",
    summary:
      "공개된 K-시리즈가 글로벌 차트 상위. 동시에 현장 제작진의 노동 환경 개선 요구가 다시 부각.",
    whyTrending:
      "글로벌 차트 1위와 함께 제작 인터뷰 공개로 노동 이슈로 확장.",
    trendScore: 74,
    mentionCount: 50_120,
    growthRate: 152,
    sentiment: "positive",
    buzzScore: 41,
    keywords: ["K콘텐츠", "글로벌", "제작환경"],
    audienceAge: ["20대", "30대"],
    imageSeed: "kcontent",
    coverEmoji: "🎬",
    sources: [
      { name: "엔터 매체", type: "news", url: "https://example.com/ent", publishedAt: "2026-05-04T08:25:00+09:00" },
      { name: "TV 리뷰", type: "community", url: "https://example.com/tv", publishedAt: "2026-05-04T09:00:00+09:00" },
    ],
    perspectives: [
      {
        label: "이렇게 보는 사람들",
        points: [
          "글로벌 흥행으로 산업 외형 성장",
          "신규 IP·해외 자본 유입 가속",
          "후속 작품 제작 다양화",
        ],
      },
      {
        label: "다르게 보는 사람들",
        points: [
          "양적 성장과 노동 환경의 격차",
          "단기 흥행 의존 구조의 리스크",
          "현장 인력 이탈 가능성",
        ],
      },
    ],
  },
  {
    id: "issue-sports-transfer",
    rank: 10,
    title: "리그 간판 선수 해외 이적설",
    category: "스포츠",
    oneLine: "그 선수, 정말 해외로 갈까?",
    summary:
      "국내 리그 간판 선수의 해외 빅클럽 이적 임박설. 구단은 공식 입장 유보 중.",
    whyTrending:
      "주요 스포츠 매체와 팬 커뮤니티가 동시 떠들썩, 해시태그 상위권.",
    trendScore: 72,
    mentionCount: 53_840,
    growthRate: 148,
    sentiment: "positive",
    buzzScore: 32,
    keywords: ["이적설", "해외리그", "팬덤"],
    audienceAge: ["20대", "30대"],
    imageSeed: "sports-transfer",
    coverEmoji: "⚽",
    sources: [
      { name: "스포츠 매체", type: "news", url: "https://example.com/sport", publishedAt: "2026-05-04T09:10:00+09:00" },
      { name: "팬 카페", type: "community", url: "https://example.com/fan", publishedAt: "2026-05-04T09:30:00+09:00" },
    ],
    perspectives: [
      {
        label: "이렇게 보는 사람들",
        points: [
          "선수 개인 커리어와 시장가치 상승 기회",
          "리그의 글로벌 위상 확대",
          "유망주 영입 자금 확보 가능",
        ],
      },
      {
        label: "다르게 보는 사람들",
        points: [
          "팀 전력 공백과 단기 성적 저하",
          "팬덤 이탈 우려",
          "구단의 협상력이 약해질 수 있음",
        ],
      },
    ],
  },
  {
    id: "issue-inflation",
    rank: 11,
    title: "체감 물가 vs 통계의 괴리",
    category: "경제",
    oneLine: "장바구니가 비는데 통계는 안정적?",
    summary:
      "소비자물가지수와 체감 물가의 격차가 확대되며 통계 산정 방식 개편 요구가 커진다.",
    whyTrending:
      "대형마트·온라인몰 가격 비교 게시물이 화제, 정책 비판으로 확산.",
    trendScore: 70,
    mentionCount: 58_220,
    growthRate: 96,
    sentiment: "negative",
    buzzScore: 65,
    keywords: ["물가", "체감물가", "통계"],
    audienceAge: ["30대"],
    imageSeed: "inflation",
    coverEmoji: "🛒",
    sources: [
      { name: "통계 매체", type: "news", url: "https://example.com/stat", publishedAt: "2026-05-04T06:20:00+09:00" },
      { name: "맘 카페", type: "community", url: "https://example.com/mom", publishedAt: "2026-05-04T08:55:00+09:00" },
    ],
    perspectives: [
      {
        label: "이렇게 보는 사람들",
        points: [
          "통계 항목 가중치 재조정으로 현실성 확보",
          "신선식품·외식 등 체감 영역 별도 지표화 필요",
          "데이터 투명성이 정책 신뢰도를 높인다",
        ],
      },
      {
        label: "다르게 보는 사람들",
        points: [
          "지표가 자주 바뀌면 시계열 비교성 훼손",
          "체감은 개인 편차가 커서 공식 지표로 부적합",
          "지수 자체보다 분포 분석이 우선이라는 의견",
        ],
      },
    ],
  },
  {
    id: "issue-community-anonymity",
    rank: 12,
    title: "익명 커뮤니티 실명 인증 강화",
    category: "커뮤니티",
    oneLine: "익명 게시판, 어디까지 책임져야 할까?",
    summary:
      "허위사실·명예훼손 대응을 이유로 일부 익명 커뮤니티에 본인확인 강화 방안이 거론된다.",
    whyTrending:
      "관련 입법 토론회 일정 공개로 자치 vs 표현의 자유 논쟁 재점화.",
    trendScore: 68,
    mentionCount: 47_900,
    growthRate: 84,
    sentiment: "controversial",
    buzzScore: 78,
    keywords: ["익명성", "본인인증", "표현의자유"],
    audienceAge: ["20대"],
    imageSeed: "anonymity",
    coverEmoji: "🕶️",
    sources: [
      { name: "미디어 비평", type: "news", url: "https://example.com/media", publishedAt: "2026-05-04T07:00:00+09:00" },
      { name: "커뮤니티 연합", type: "community", url: "https://example.com/comm", publishedAt: "2026-05-04T09:15:00+09:00" },
    ],
    perspectives: [
      {
        label: "이렇게 보는 사람들",
        points: [
          "허위사실·명예훼손 대응 실효성 강화",
          "피해자 구제 절차 단축",
          "악성 게시물 자정 효과 기대",
        ],
      },
      {
        label: "다르게 보는 사람들",
        points: [
          "표현의 자유와 내부고발 위축",
          "데이터 수집 확대로 개인정보 위험 증가",
          "이용자 이탈로 자생 생태계 약화",
        ],
      },
    ],
  },
  {
    id: "issue-supply-chain",
    rank: 13,
    title: "글로벌 반도체 공급망 재편",
    category: "글로벌",
    oneLine: "반도체 공급망, 한국은 어디에 설까?",
    summary:
      "주요국이 자국 중심으로 반도체 공급망을 재편. 국내 기업은 거점 분산과 R&D 투자 확대를 검토.",
    whyTrending:
      "주요국 정상회의 일정이 다가오며 산업계 전망 보고서 동시 발표.",
    trendScore: 65,
    mentionCount: 44_780,
    growthRate: 76,
    sentiment: "neutral",
    buzzScore: 48,
    keywords: ["반도체", "공급망", "지정학"],
    audienceAge: ["30대"],
    imageSeed: "supply-chain",
    coverEmoji: "🌐",
    sources: [
      { name: "글로벌 경제", type: "news", url: "https://example.com/global", publishedAt: "2026-05-04T05:30:00+09:00" },
      { name: "산업 정책 RSS", type: "rss", url: "https://example.com/rss-policy", publishedAt: "2026-05-04T06:00:00+09:00" },
    ],
    perspectives: [
      {
        label: "이렇게 보는 사람들",
        points: [
          "리스크 분산으로 장기 안정성 확보",
          "R&D 투자 확대 계기",
          "고급 인력 수요 증가",
        ],
      },
      {
        label: "다르게 보는 사람들",
        points: [
          "단기 비용 부담 증가",
          "지정학 리스크에 따른 변동성",
          "협력국과의 이해관계 충돌",
        ],
      },
    ],
  },
];
