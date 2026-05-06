import type { TrendIssue } from "./types";

// NOTE: 추후 fetchTrends() 함수에서 실제 API/RSS/크롤러로 대체.
// 데이터 구조는 TrendIssue 타입과 1:1 매칭되므로 백엔드 응답을 그대로 매핑하면 됨.
//
// imageSeed 는 https://picsum.photos/seed/{seed}/W/H 형태로 사용.
// 실제 서비스에서는 큐레이션된 이미지 CDN/AI 생성 이미지로 대체 권장.
export const mockTrendData: TrendIssue[] = [
  {
    id: "issue-ai-regulation",
    rank: 1,
    title: "AI 규제 법안 통과 임박, 산업계 vs 시민단체 충돌",
    category: "테크",
    oneLine: "AI 안전성 평가, 의무가 될까?",
    summary:
      "범용 AI 모델에 대한 안전성 평가 의무화 법안이 본회의 상정을 앞두고 있다. 산업계는 혁신 위축을 우려하는 반면 시민단체는 위험 통제가 우선이라는 입장.",
    whyTrending:
      "법안 처리 일정이 공개되며 주요 IT 기업과 학계가 동시에 의견서를 제출, 관련 키워드 검색량이 24시간 만에 약 3.2배 증가.",
    trendScore: 96,
    mentionCount: 184_320,
    growthRate: 218,
    sentiment: "controversial",
    controversyScore: 88,
    keywords: ["AI법", "안전성평가", "혁신", "규제"],
    targetAge: ["20대"],
    imageSeed: "ai-regulation",
    coverEmoji: "🤖",
    sources: [
      {
        name: "테크 매체 A",
        type: "news",
        url: "https://example.com/news/ai-regulation",
        publishedAt: "2026-05-04T08:12:00+09:00",
      },
      {
        name: "디지털 매체 B",
        type: "news",
        url: "https://example.com/news/ai-bill",
        publishedAt: "2026-05-04T07:40:00+09:00",
      },
      {
        name: "AI 커뮤니티",
        type: "community",
        url: "https://example.com/forum/ai",
        publishedAt: "2026-05-04T06:55:00+09:00",
      },
      {
        name: "테크 RSS",
        type: "rss",
        url: "https://example.com/rss/tech",
        publishedAt: "2026-05-04T05:20:00+09:00",
      },
    ],
    proArguments: [
      "안전성 평가 의무화는 사용자 보호를 위한 최소한의 안전장치",
      "고위험 AI에 대한 사전 검증은 글로벌 추세",
      "사고 발생 시 책임 소재가 명확해져 산업 신뢰도가 상승",
    ],
    conArguments: [
      "스타트업의 진입 장벽이 높아져 혁신 속도가 둔화될 수 있음",
      "기술 정의가 모호해 행정 부담이 과중",
      "글로벌 기업과의 비대칭 규제로 국내 산업이 역차별",
    ],
  },
  {
    id: "issue-school-phone",
    rank: 2,
    title: "학교 내 스마트폰 사용 제한 강화 논쟁",
    category: "정치/사회",
    oneLine: "학교에서 스마트폰, 어디까지 막아야 할까?",
    summary:
      "교육부가 수업 시간 외에도 스마트폰 일괄 보관을 권고하는 가이드라인을 검토 중이다. 학습권 보호와 자율성 침해가 충돌.",
    whyTrending:
      "학부모 커뮤니티와 학생 커뮤니티에서 동시에 의견이 갈리며 토론 게시글이 급증.",
    trendScore: 92,
    mentionCount: 132_440,
    growthRate: 240,
    sentiment: "controversial",
    controversyScore: 72,
    keywords: ["스마트폰", "학습권", "자율성", "교육"],
    targetAge: ["10대"],
    imageSeed: "school-phone",
    coverEmoji: "📱",
    sources: [
      {
        name: "교육 매체",
        type: "news",
        url: "https://example.com/news/school-phone",
        publishedAt: "2026-05-03T16:40:00+09:00",
      },
      {
        name: "학부모 커뮤니티",
        type: "community",
        url: "https://example.com/parents",
        publishedAt: "2026-05-04T08:10:00+09:00",
      },
      {
        name: "학생 커뮤니티",
        type: "community",
        url: "https://example.com/students",
        publishedAt: "2026-05-04T08:30:00+09:00",
      },
    ],
    proArguments: [
      "수업 집중도와 학습 성취도 향상 가능성",
      "학교 폭력·사이버 괴롭힘 예방 효과",
      "디지털 디톡스를 통한 정서 안정",
    ],
    conArguments: [
      "비상 연락 등 안전 측면에서 제약",
      "학생 자율성 침해 소지",
      "디지털 리터러시 교육과 상충 가능",
    ],
  },
  {
    id: "issue-suneung-absolute",
    rank: 3,
    title: "수능 절대평가 확대안, 입시 공정성 논쟁",
    category: "정치/사회",
    oneLine: "수능, 절대평가로 더 가도 될까?",
    summary:
      "주요 영역의 절대평가 전환 폭을 확대하는 안이 거론된다. 학습 부담 경감과 변별력 약화 우려가 충돌.",
    whyTrending:
      "교육부 공청회 일정이 공개되면서 학생·학부모·교사 커뮤니티에서 동시에 의견이 폭증.",
    trendScore: 90,
    mentionCount: 118_300,
    growthRate: 198,
    sentiment: "controversial",
    controversyScore: 79,
    keywords: ["수능", "절대평가", "입시", "공정성"],
    targetAge: ["10대", "20대"],
    imageSeed: "suneung",
    coverEmoji: "📝",
    sources: [
      {
        name: "교육 매체",
        type: "news",
        url: "https://example.com/news/suneung",
        publishedAt: "2026-05-04T07:30:00+09:00",
      },
      {
        name: "수험생 커뮤니티",
        type: "community",
        url: "https://example.com/exam",
        publishedAt: "2026-05-04T08:15:00+09:00",
      },
    ],
    proArguments: [
      "과도한 사교육·서열화 완화 가능",
      "학교 교육 정상화 계기",
      "수험생 정서·건강 부담 감소",
    ],
    conArguments: [
      "변별력 저하로 상위권 변별 어려움",
      "다른 전형의 비중이 커져 또 다른 사교육 유발",
      "전형 변화로 학생 혼란 증가",
    ],
  },
  {
    id: "issue-genai-copyright",
    rank: 4,
    title: "생성형 AI 학습 데이터 저작권 가이드라인 발표",
    category: "테크",
    oneLine: "내 그림이 AI 학습에 쓰여도 될까?",
    summary:
      "정부가 생성형 AI 학습용 데이터 저작권 가이드라인 초안을 공개했다. 창작자 보상안과 옵트아웃 절차가 핵심.",
    whyTrending:
      "주요 작가·일러스트레이터 단체가 의견서를 제출하며 SNS에서 해시태그 캠페인이 확산.",
    trendScore: 88,
    mentionCount: 96_120,
    growthRate: 174,
    sentiment: "controversial",
    controversyScore: 83,
    keywords: ["생성형AI", "저작권", "창작자", "옵트아웃"],
    targetAge: ["10대", "20대"],
    imageSeed: "ai-copyright",
    coverEmoji: "🎨",
    sources: [
      {
        name: "문화 매체",
        type: "news",
        url: "https://example.com/news/copyright",
        publishedAt: "2026-05-03T22:00:00+09:00",
      },
      {
        name: "소셜 트렌드",
        type: "social",
        url: "https://example.com/social/copyright",
        publishedAt: "2026-05-04T08:20:00+09:00",
      },
    ],
    proArguments: [
      "창작자의 경제적 권리 보호 필요",
      "데이터 출처 투명성으로 신뢰도 향상",
      "정당한 보상 체계가 산업 생태계의 지속 가능성을 높임",
    ],
    conArguments: [
      "기술 발전 속도와 비교해 절차가 복잡",
      "학습 비용 상승으로 국내 AI 경쟁력 저하 우려",
      "옵트아웃 기준이 모호해 분쟁 가능성",
    ],
  },
  {
    id: "issue-ev-subsidy",
    rank: 5,
    title: "전기차 보조금 30% 축소안 발표, 소비자 부담 증가 우려",
    category: "경제",
    oneLine: "전기차 보조금, 정말 줄여도 될까?",
    summary:
      "정부가 내년부터 전기차 구매 보조금을 평균 30% 줄이는 안을 검토 중이다. 충전 인프라 예산은 확대되지만, 단기 수요 위축이 예상된다.",
    whyTrending:
      "주요 완성차 업체들이 가격 인상 가능성을 시사하면서 커뮤니티에서 ‘지금 사야 하나’ 논쟁이 폭증.",
    trendScore: 86,
    mentionCount: 142_980,
    growthRate: 165,
    sentiment: "negative",
    controversyScore: 74,
    keywords: ["전기차", "보조금", "친환경", "소비자"],
    targetAge: ["20대"],
    imageSeed: "ev-subsidy",
    coverEmoji: "🔌",
    sources: [
      {
        name: "경제 매체",
        type: "news",
        url: "https://example.com/news/ev-subsidy",
        publishedAt: "2026-05-04T09:00:00+09:00",
      },
      {
        name: "오토 커뮤니티",
        type: "community",
        url: "https://example.com/auto",
        publishedAt: "2026-05-04T07:30:00+09:00",
      },
      {
        name: "소셜 트렌드",
        type: "social",
        url: "https://example.com/social/ev",
        publishedAt: "2026-05-04T08:50:00+09:00",
      },
    ],
    proArguments: [
      "초기 보급은 어느 정도 진행되어 보조금 의존도를 낮출 시점",
      "충전 인프라 투자로 장기 사용자 편익이 증가",
      "재정 건전성 측면에서 단계적 축소가 합리적",
    ],
    conArguments: [
      "보급 확산 정체로 탄소 감축 목표 달성이 늦어짐",
      "중저가 모델 구매층의 부담이 가중",
      "관련 산업 생태계의 체력이 약화될 수 있음",
    ],
  },
  {
    id: "issue-four-day-week",
    rank: 6,
    title: "주 4일제 시범 도입 확대, 생산성 논쟁 재점화",
    category: "경제",
    oneLine: "주 4일제, 한국에서도 가능할까?",
    summary:
      "공공기관과 일부 대기업에서 주 4일제를 시범 운영하기로 했다. 노동 단체는 환영하지만, 중소기업은 인력 부담을 호소한다.",
    whyTrending:
      "정부 시범사업 발표 직후 채용 플랫폼에서 ‘주 4일제’ 검색량이 4배 이상 급등.",
    trendScore: 84,
    mentionCount: 121_540,
    growthRate: 142,
    sentiment: "controversial",
    controversyScore: 81,
    keywords: ["주4일제", "노동시간", "워라밸", "생산성"],
    targetAge: ["20대"],
    imageSeed: "four-day-week",
    coverEmoji: "🗓️",
    sources: [
      {
        name: "노동연구 리포트",
        type: "news",
        url: "https://example.com/news/four-day",
        publishedAt: "2026-05-03T18:30:00+09:00",
      },
      {
        name: "중소기업 포럼",
        type: "community",
        url: "https://example.com/sme",
        publishedAt: "2026-05-04T10:10:00+09:00",
      },
    ],
    proArguments: [
      "근로시간 단축은 번아웃을 줄이고 창의성을 높임",
      "장기적으로 우수 인재 유치 경쟁력 확보",
      "이미 도입한 해외 사례에서 생산성 유지 사례 보고",
    ],
    conArguments: [
      "교대근무·서비스업에 일괄 적용이 어려움",
      "단기 인건비 부담으로 채용 위축 우려",
      "업무 강도가 오히려 가중될 수 있다는 보고",
    ],
  },
  {
    id: "issue-youth-housing",
    rank: 7,
    title: "청년 월세 지원 확대안, 형평성 논쟁",
    category: "정치/사회",
    oneLine: "청년 월세 지원, 어디까지 늘려야 공정할까?",
    summary:
      "청년 1인 가구 대상 월세 지원금 한도를 두 배로 늘리는 정책안이 공개됐다. 사각지대 해소라는 평가와 동시에 형평성 문제 제기가 이어진다.",
    whyTrending:
      "관련 청원이 하루 만에 5만 명을 돌파하면서 커뮤니티 게시판에서 의견이 폭발적으로 증가.",
    trendScore: 82,
    mentionCount: 98_720,
    growthRate: 130,
    sentiment: "controversial",
    controversyScore: 76,
    keywords: ["청년정책", "월세지원", "주거안정", "형평성"],
    targetAge: ["20대"],
    imageSeed: "youth-housing",
    coverEmoji: "🏠",
    sources: [
      {
        name: "정책 매체",
        type: "news",
        url: "https://example.com/news/housing",
        publishedAt: "2026-05-04T08:00:00+09:00",
      },
      {
        name: "청년 커뮤니티",
        type: "community",
        url: "https://example.com/youth",
        publishedAt: "2026-05-04T09:35:00+09:00",
      },
    ],
    proArguments: [
      "치솟은 월세로 청년의 주거 불안이 심각",
      "주거비 부담 완화는 출산·결혼율 개선과 연결",
      "한시적 지원으로 정책 효과 측정이 가능",
    ],
    conArguments: [
      "신혼부부·중장년 1인 가구와의 형평성 문제",
      "재정 부담 대비 실효성에 대한 검증 필요",
      "월세 시장에 보조금이 흡수될 가능성",
    ],
  },
  {
    id: "issue-platform-fee",
    rank: 8,
    title: "배달 플랫폼 수수료 인상안, 자영업자 반발",
    category: "경제",
    oneLine: "배달앱 수수료 인상, 누가 부담해야 하나?",
    summary:
      "주요 배달 플랫폼이 수수료 체계 개편안을 공지했다. 일부 구간 수수료가 최대 1.8%p 인상되며 자영업자 단체가 강하게 반발.",
    whyTrending: "공정거래 이슈로 번지면서 정치권에서도 청문회 개최 가능성을 언급.",
    trendScore: 80,
    mentionCount: 89_440,
    growthRate: 118,
    sentiment: "negative",
    controversyScore: 71,
    keywords: ["플랫폼", "수수료", "자영업", "공정거래"],
    targetAge: ["20대"],
    imageSeed: "delivery-fee",
    coverEmoji: "🛵",
    sources: [
      {
        name: "비즈니스 매체",
        type: "news",
        url: "https://example.com/news/platform-fee",
        publishedAt: "2026-05-04T07:10:00+09:00",
      },
      {
        name: "자영업 모임",
        type: "community",
        url: "https://example.com/owners",
        publishedAt: "2026-05-04T09:00:00+09:00",
      },
    ],
    proArguments: [
      "운영 비용 상승을 반영한 합리적 조정",
      "장기적 서비스 안정화 투자 재원 확보",
      "타 플랫폼 대비 여전히 낮은 수준이라는 주장",
    ],
    conArguments: [
      "자영업자의 마진 압박이 임계치에 근접",
      "최종 가격 인상으로 소비자 부담 전가 가능",
      "독과점 구조에서의 일방적 인상 우려",
    ],
  },
  {
    id: "issue-remote-work",
    rank: 9,
    title: "주요 대기업 원격근무 축소 발표, 직원 반응 양분",
    category: "경제",
    oneLine: "다시 사무실로? 원격근무 축소 논쟁",
    summary:
      "복수의 대기업이 주 3일 출근 의무화를 추진한다. 협업 강화 vs 워라밸 후퇴라는 평가가 엇갈린다.",
    whyTrending:
      "내부 공지가 외부에 유출되면서 익명 직장인 커뮤니티에서 토론이 폭발.",
    trendScore: 76,
    mentionCount: 64_510,
    growthRate: 112,
    sentiment: "controversial",
    controversyScore: 69,
    keywords: ["원격근무", "출근", "워라밸", "협업"],
    targetAge: ["20대"],
    imageSeed: "remote-work",
    coverEmoji: "💻",
    sources: [
      {
        name: "잡 매체",
        type: "news",
        url: "https://example.com/news/remote",
        publishedAt: "2026-05-04T07:50:00+09:00",
      },
      {
        name: "직장인 익명",
        type: "community",
        url: "https://example.com/anon",
        publishedAt: "2026-05-04T08:30:00+09:00",
      },
    ],
    proArguments: [
      "대면 협업의 시너지와 신입 온보딩 효과",
      "조직 문화 유지에 필요한 최소 출근 일수",
      "성과 측정의 명확성 확보",
    ],
    conArguments: [
      "통근 시간 증가로 인한 생산성 저하 우려",
      "이미 정착된 유연근무 신뢰 훼손",
      "이직 시장 자극으로 핵심 인재 이탈 가능",
    ],
  },
  {
    id: "issue-kcontent-global",
    rank: 10,
    title: "K-콘텐츠 글로벌 흥행, 제작 환경 개선 요구",
    category: "문화/연예",
    oneLine: "K-콘텐츠는 흥하는데, 현장은 괜찮을까?",
    summary:
      "최근 공개된 K-시리즈가 글로벌 차트 상위권을 휩쓸었다. 동시에 현장 제작진의 노동 환경 개선 요구가 다시 부각.",
    whyTrending:
      "글로벌 차트 1위 소식과 함께 제작 인터뷰가 공개되며 노동 이슈로 확장.",
    trendScore: 74,
    mentionCount: 50_120,
    growthRate: 152,
    sentiment: "positive",
    controversyScore: 41,
    keywords: ["K콘텐츠", "글로벌", "제작환경", "노동"],
    targetAge: ["10대", "20대"],
    imageSeed: "kcontent",
    coverEmoji: "🎬",
    sources: [
      {
        name: "엔터 매체",
        type: "news",
        url: "https://example.com/news/kcontent",
        publishedAt: "2026-05-04T08:25:00+09:00",
      },
      {
        name: "TV 리뷰",
        type: "community",
        url: "https://example.com/tv",
        publishedAt: "2026-05-04T09:00:00+09:00",
      },
    ],
    proArguments: [
      "글로벌 흥행으로 산업 외형 성장",
      "신규 IP·해외 자본 유입 가속",
      "후속 작품 제작 다양화",
    ],
    conArguments: [
      "양적 성장과 노동 환경의 격차",
      "단기 흥행 의존 구조의 리스크",
      "현장 인력 이탈 가능성",
    ],
  },
  {
    id: "issue-sports-transfer",
    rank: 11,
    title: "리그 간판 선수 해외 이적설, 협상 막판 진통",
    category: "스포츠",
    oneLine: "그 선수, 정말 해외로 가는 걸까?",
    summary:
      "국내 리그 간판 선수의 해외 빅클럽 이적이 임박했다는 보도가 나왔다. 구단은 공식 입장을 유보 중.",
    whyTrending:
      "주요 스포츠 매체와 팬 커뮤니티가 동시에 떠들썩하면서 해시태그가 실시간 검색어 상위권에 진입.",
    trendScore: 72,
    mentionCount: 53_840,
    growthRate: 148,
    sentiment: "positive",
    controversyScore: 32,
    keywords: ["이적설", "해외리그", "구단", "팬덤"],
    targetAge: ["10대", "20대"],
    imageSeed: "sports-transfer",
    coverEmoji: "⚽",
    sources: [
      {
        name: "스포츠 매체",
        type: "news",
        url: "https://example.com/news/transfer",
        publishedAt: "2026-05-04T09:10:00+09:00",
      },
      {
        name: "팬 카페",
        type: "community",
        url: "https://example.com/fan",
        publishedAt: "2026-05-04T09:30:00+09:00",
      },
    ],
    proArguments: [
      "선수 개인 커리어와 시장가치 상승 기회",
      "리그의 글로벌 위상 확대",
      "유망주 영입 자금 확보 가능",
    ],
    conArguments: [
      "팀 전력 공백과 단기 성적 저하",
      "팬덤 이탈 우려",
      "구단의 협상력이 약해질 수 있음",
    ],
  },
  {
    id: "issue-inflation",
    rank: 12,
    title: "체감 물가 상승률 통계와 괴리, 신뢰도 도마 위",
    category: "경제",
    oneLine: "장바구니가 비는데 통계는 안정적?",
    summary:
      "소비자물가지수와 체감 물가의 격차가 확대되며 통계 산정 방식 개편 요구가 커진다.",
    whyTrending:
      "대형마트·온라인몰의 가격 비교 게시물이 화제가 되며 정책 비판 여론으로 확산.",
    trendScore: 70,
    mentionCount: 58_220,
    growthRate: 96,
    sentiment: "negative",
    controversyScore: 65,
    keywords: ["물가", "체감물가", "통계", "장바구니"],
    targetAge: ["20대"],
    imageSeed: "inflation",
    coverEmoji: "🛒",
    sources: [
      {
        name: "통계 매체",
        type: "news",
        url: "https://example.com/news/inflation",
        publishedAt: "2026-05-04T06:20:00+09:00",
      },
      {
        name: "맘 카페",
        type: "community",
        url: "https://example.com/mom",
        publishedAt: "2026-05-04T08:55:00+09:00",
      },
    ],
    proArguments: [
      "통계 항목 가중치 재조정으로 현실성 확보 가능",
      "신선식품·외식 등 체감 영역 별도 지표화 필요",
      "데이터 투명성이 정책 신뢰도를 높임",
    ],
    conArguments: [
      "지표가 잦게 바뀌면 시계열 비교성이 훼손",
      "체감은 개인 편차가 커서 공식 지표로 부적합",
      "지수 자체보다 분포 분석이 우선이라는 의견",
    ],
  },
  {
    id: "issue-community-anonymity",
    rank: 13,
    title: "익명 커뮤니티 실명 인증 강화안 추진",
    category: "커뮤니티",
    oneLine: "익명 게시판, 어디까지 책임져야 할까?",
    summary:
      "허위사실 유포·명예훼손 대응을 이유로 일부 익명 커뮤니티에 본인확인 절차를 강화하는 방안이 거론된다.",
    whyTrending:
      "관련 입법 토론회 일정이 알려지며 커뮤니티 자치 vs 표현의 자유 논쟁이 재점화.",
    trendScore: 68,
    mentionCount: 47_900,
    growthRate: 84,
    sentiment: "controversial",
    controversyScore: 78,
    keywords: ["익명성", "본인인증", "표현의자유", "허위사실"],
    targetAge: ["10대", "20대"],
    imageSeed: "anonymity",
    coverEmoji: "🕶️",
    sources: [
      {
        name: "미디어 비평",
        type: "news",
        url: "https://example.com/news/anon",
        publishedAt: "2026-05-04T07:00:00+09:00",
      },
      {
        name: "커뮤니티 연합",
        type: "community",
        url: "https://example.com/comm",
        publishedAt: "2026-05-04T09:15:00+09:00",
      },
    ],
    proArguments: [
      "허위사실·명예훼손 대응 실효성 강화",
      "피해자 구제 절차 단축",
      "악성 게시물 자정 효과 기대",
    ],
    conArguments: [
      "표현의 자유와 내부고발 위축",
      "데이터 수집 확대로 개인정보 위험 증가",
      "이용자 이탈로 자생 생태계 약화",
    ],
  },
  {
    id: "issue-supply-chain",
    rank: 14,
    title: "글로벌 반도체 공급망 재편, 한국 기업 대응 분주",
    category: "글로벌",
    oneLine: "반도체 공급망, 한국은 어디에 설까?",
    summary:
      "주요국이 자국 중심의 반도체 공급망을 재편하면서, 국내 기업은 생산 거점 분산과 R&D 투자 확대를 검토.",
    whyTrending:
      "주요국 정상회의 일정이 다가오면서 산업계 전망 보고서가 동시 발표.",
    trendScore: 65,
    mentionCount: 44_780,
    growthRate: 76,
    sentiment: "neutral",
    controversyScore: 48,
    keywords: ["반도체", "공급망", "지정학", "투자"],
    targetAge: ["20대"],
    imageSeed: "supply-chain",
    coverEmoji: "🌐",
    sources: [
      {
        name: "글로벌 경제",
        type: "news",
        url: "https://example.com/news/chip",
        publishedAt: "2026-05-04T05:30:00+09:00",
      },
      {
        name: "산업 정책 RSS",
        type: "rss",
        url: "https://example.com/rss/policy",
        publishedAt: "2026-05-04T06:00:00+09:00",
      },
    ],
    proArguments: [
      "리스크 분산으로 장기 안정성 확보",
      "R&D 투자 확대 계기",
      "고급 인력 수요 증가",
    ],
    conArguments: [
      "단기 비용 부담 증가",
      "지정학 리스크에 따른 변동성",
      "협력국과의 이해관계 충돌",
    ],
  },
];

/** 출처 url을 외부에 노출하지 않기 위한 변환기 */
export function summarizeSources(sources: TrendIssue["sources"]) {
  const counts: Record<string, number> = {};
  for (const s of sources) {
    counts[s.type] = (counts[s.type] ?? 0) + 1;
  }
  return counts;
}
