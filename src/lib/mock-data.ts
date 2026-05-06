import type { TrendIssue } from "./types";

/**
 * 트렌드 이슈 mock 데이터.
 *
 * 톤 가이드 (prompt/issue.md):
 * - title: 의문문/구어체, 30자 이내, 사용자 시점에서 "어 이거 궁금하네"
 * - oneLine(=subtitle): 호기심 자극 한 줄, 50자 이내, "~라는 보도", "~로 보인다" 같은 완충 표현
 * - whyTrending: 2~3 문장으로 왜 지금 뜨는지
 * - keyPoints: 핵심 포인트 3개 (사실/맥락 위주, 단정 회피)
 * - conversationStarters: 사용자가 캐릭터에게 던질 만한 질문 3개 (얕음 → 깊음)
 *
 * 출처는 내부 보관만 — UI에서 매체명/URL 노출 X (편향 방지).
 * perspectives 라벨은 항상 중립 표현. ‘찬성/반대’가 아니라 ‘이렇게 보는 사람들 / 다르게 보는 사람들’.
 *
 * 주제 큐레이션 기준 (2026-05 기준 한국 트렌드):
 * MZ 등산 명소(관악산), 에이전트 AI(GPT-5.5), 트럼프 관세, 학교 폰 금지,
 * 청년 월세 상시 지원, 북중미 월드컵, 뉴진스 컴백설, 코스피 vs 코인,
 * 우베·버터떡 디저트, '은밀한 감사' 드라마, 6+6 육아휴직, GenZ 음주 감소, BTS 2.0.
 */
export const mockTrendData: TrendIssue[] = [
  {
    id: "issue-gwanaksan-mz",
    rank: 1,
    title: "관악산이 갑자기 왜 이렇게 핫해?",
    category: "커뮤니티",
    oneLine: "재난문자까지 떴다는 MZ 인증샷 명소 등극",
    summary:
      "5월 1일 과천시·안양시가 등산객 인파에 ‘안전거리 확보’ 재난문자를 발송했다. 한 예능에서 역술가가 ‘운 풀러 가라’고 말한 뒤 SNS 인증샷 줄이 길어진 분위기.",
    whyTrending:
      "tvN 예능 출연 역술가의 ‘관악산 정기’ 발언 이후 인스타그램에서 관악산 태그가 32만 건을 돌파했다는 보도. 봄철과 맞물려 인파가 폭증하며 지자체가 잇따라 안전 안내 재난문자를 보냈다.",
    trendScore: 95,
    mentionCount: 158_420,
    growthRate: 312,
    sentiment: "neutral",
    buzzScore: 55,
    keywords: ["관악산", "MZ등산", "재난문자"],
    audienceAge: ["20대", "30대"],
    imageSeed: "gwanaksan-mz",
    coverEmoji: "⛰️",
    keyPoints: [
      "5월 1일 경기 과천·안양시가 등산객 인파에 안전거리 확보 재난문자를 발송했다는 보도",
      "1월 한 예능에서 역술가가 ‘관악산 정기가 좋다’고 언급한 이후 MZ 등산객이 급증",
      "좁은 등산로·암릉 구간이 많아 낙상·충돌 사고 우려가 동시에 부각",
    ],
    conversationStarters: [
      "갑자기 관악산이 왜 이렇게 핫해진 거야?",
      "운 풀러 가는 등산이라는 게 진짜 효과가 있을까?",
      "재난문자까지 보낼 정도면 입장 제한해야 되는 거 아니야?",
    ],
    sources: [
      { name: "사회 매체", type: "news", url: "https://example.com/gwanaksan-a", publishedAt: "2026-05-01T15:30:00+09:00" },
      { name: "라이프 매거진", type: "news", url: "https://example.com/gwanaksan-b", publishedAt: "2026-05-02T09:00:00+09:00" },
      { name: "여행 커뮤니티", type: "community", url: "https://example.com/gwanaksan-c", publishedAt: "2026-05-04T08:30:00+09:00" },
    ],
    perspectives: [
      {
        label: "이렇게 보는 사람들",
        points: [
          "젊은 층의 등산·자연 친화 트렌드가 자생적으로 확산된 사례",
          "지역 상권과 산악 관광이 동시에 활기를 띠는 효과",
          "운동·자기관리 문화로 자연스럽게 이어질 수 있다는 시각",
        ],
      },
      {
        label: "다르게 보는 사람들",
        points: [
          "좁은 암릉 구간에서 낙상·충돌 위험이 커진다는 우려",
          "쓰레기·낙서 등 환경 훼손이 이미 보고된다는 지적",
          "특정 코스 인파 집중에 따른 입산 제한 필요성",
        ],
      },
    ],
  },
  {
    id: "issue-gpt-agent",
    rank: 2,
    title: "GPT가 이제 알아서 일한다고?",
    category: "테크",
    oneLine: "오픈AI ‘GPT-5.5’ 공개, 챗봇에서 에이전트로 본격 전환",
    summary:
      "오픈AI가 4월 23일 ‘GPT-5.5’를 공개했다. 적은 지시로도 다단계 업무를 스스로 처리하는 에이전트형 연산에 최적화됐다는 설명.",
    whyTrending:
      "GPT-5.4 출시 두 달 만의 신모델 발표로 AI 업계가 술렁였다. 앤트로픽 클로드 오퍼스 4.7과의 직접 비교, 코딩 부문 열세 등 비교 분석 콘텐츠가 SNS·테크 매체에서 폭증.",
    trendScore: 90,
    mentionCount: 145_220,
    growthRate: 220,
    sentiment: "neutral",
    buzzScore: 70,
    keywords: ["GPT-5.5", "AI에이전트", "오픈AI"],
    audienceAge: ["20대", "30대"],
    imageSeed: "gpt-agent",
    coverEmoji: "🤖",
    keyPoints: [
      "오픈AI가 4월 23일 ‘GPT-5.5’를 공개, 두 달 만의 신모델 발표라는 보도",
      "적은 지시로 다단계 업무를 스스로 계획·실행하는 ‘에이전트형 연산’에 최적화",
      "앤트로픽 클로드 오퍼스 4.7과 직접 성능을 비교, 코딩 부문에선 뒤졌다는 분석",
    ],
    conversationStarters: [
      "GPT-5.5가 진짜 알아서 일을 처리해?",
      "챗봇 시대가 끝나고 ‘에이전트 전쟁’이라는 게 무슨 뜻이야?",
      "사람 일자리는 결국 어디까지 위협받게 되는 거야?",
    ],
    sources: [
      { name: "테크 매체", type: "news", url: "https://example.com/gpt55-a", publishedAt: "2026-04-24T07:30:00+09:00" },
      { name: "AI 정책 매체", type: "news", url: "https://example.com/gpt55-b", publishedAt: "2026-04-24T11:10:00+09:00" },
      { name: "개발자 커뮤니티", type: "community", url: "https://example.com/gpt55-c", publishedAt: "2026-04-25T09:20:00+09:00" },
    ],
    perspectives: [
      {
        label: "이렇게 보는 사람들",
        points: [
          "다단계 업무 자동화로 생산성 한 단계 도약",
          "에이전트 표준 경쟁이 한국 AI 산업에 새 기회",
          "반복 업무에서 사람을 해방시키는 효과",
        ],
      },
      {
        label: "다르게 보는 사람들",
        points: [
          "벤치마크 점수만큼 실제 업무 성능이 따라줄지 의문",
          "에이전트의 자율 판단이 데이터·보안 사고 위험을 키운다는 우려",
          "사무직 대체 속도가 사회 적응 속도보다 빠를 수 있다는 분석",
        ],
      },
    ],
  },
  {
    id: "issue-trump-tariff",
    rank: 3,
    title: "한국 관세 또 25%로 뛴다고?",
    category: "글로벌",
    oneLine: "특별법 미통과 이유로 트럼프, 한미 관세 인상 위협",
    summary:
      "트럼프 대통령이 한국 국회의 특별법 미통과를 이유로 상호관세·자동차 232조 관세를 15%에서 25%로 올리겠다는 가능성을 언급했다는 보도.",
    whyTrending:
      "미국이 약달러 정책을 시사하면서 원·달러 환율이 1390원대로 절상되는 분위기. 자동차·배터리 업종 영향 분석이 쏟아지며 ‘차값 오르나’ 검색이 급증.",
    trendScore: 87,
    mentionCount: 132_180,
    growthRate: 168,
    sentiment: "negative",
    buzzScore: 72,
    keywords: ["트럼프관세", "환율", "232조"],
    audienceAge: ["30대"],
    imageSeed: "trump-tariff",
    coverEmoji: "🇺🇸",
    keyPoints: [
      "트럼프 대통령이 한국 국회 특별법 미통과를 이유로 25% 인상 가능성을 언급했다는 보도",
      "미국 약달러 기조로 원·달러 환율이 1390원대로 절상되는 분위기",
      "자동차 232조 관세 추가 인상은 자동차·배터리 업종에 직접 타격이라는 분석",
    ],
    conversationStarters: [
      "트럼프가 또 관세 올린다는데 한국이 뭘 잘못한 거야?",
      "환율은 떨어진다는데 그게 우리한테 왜 안 좋은 거야?",
      "관세 25%면 차값·전자제품 가격이 우리한테 올라?",
    ],
    sources: [
      { name: "경제 매체", type: "news", url: "https://example.com/tariff-a", publishedAt: "2026-05-04T08:12:00+09:00" },
      { name: "통상 매체", type: "news", url: "https://example.com/tariff-b", publishedAt: "2026-05-03T22:00:00+09:00" },
      { name: "투자 커뮤니티", type: "community", url: "https://example.com/tariff-c", publishedAt: "2026-05-04T07:00:00+09:00" },
    ],
    perspectives: [
      {
        label: "이렇게 보는 사람들",
        points: [
          "장기적으로 한미 통상 협상 카드를 다시 정리할 기회라는 시각",
          "원화 절상이 수입 물가 안정에는 도움이 된다는 분석",
          "공급망 다변화·미국 현지 투자 확대로 충격을 줄일 수 있다는 입장",
        ],
      },
      {
        label: "다르게 보는 사람들",
        points: [
          "수출 기업 가격 경쟁력이 단기적으로 약화될 우려",
          "예측 불가능한 관세 체계가 기업 설비 투자에 부담",
          "환율관찰대상국 지정 시 통화 정책 운신의 폭이 좁아진다는 시각",
        ],
      },
    ],
  },
  {
    id: "issue-school-phone-ban",
    rank: 4,
    title: "이제 수업 시간엔 폰 진짜 못 봐?",
    category: "정치/사회",
    oneLine: "초중등교육법 개정, 3월부터 전국 수업 중 스마트폰 금지",
    summary:
      "2025년 8월 통과된 초중등교육법 개정안이 2026년 3월부터 시행되며 전국 초·중·고가 학칙 정비에 들어갔다는 보도.",
    whyTrending:
      "학기가 진행되며 학교마다 학칙·반입 절차 차이가 드러나면서 학부모·학생 커뮤니티에서 의견이 폭증. 교사 단체와 청소년 인권 단체의 입장이 동시에 회자되는 중.",
    trendScore: 84,
    mentionCount: 102_540,
    growthRate: 142,
    sentiment: "controversial",
    buzzScore: 78,
    keywords: ["스마트폰금지", "학교", "초중등교육법"],
    audienceAge: ["30대"],
    imageSeed: "phone-ban",
    coverEmoji: "📱",
    keyPoints: [
      "2026년 3월부터 전국 초·중·고 수업 중 스마트기기 사용이 원칙적으로 금지된다는 보도",
      "교사·학교장에게 사용 제한 권한이 부여되며 세부 학칙은 학교가 정함",
      "장애 학생 보조기기·교육 목적 사용·긴급 상황 등 예외 조항도 명시",
    ],
    conversationStarters: [
      "수업 중 폰 금지, 이거 진짜 효과 있어?",
      "그럼 비상 연락이나 부모랑 연락은 어떻게 해야 돼?",
      "결국 학교마다 운영이 달라져서 더 혼란스러워지는 거 아니야?",
    ],
    sources: [
      { name: "교육 매체", type: "news", url: "https://example.com/phoneban-a", publishedAt: "2026-05-04T07:30:00+09:00" },
      { name: "학부모 커뮤니티", type: "community", url: "https://example.com/phoneban-b", publishedAt: "2026-05-04T09:00:00+09:00" },
      { name: "정책 매체", type: "news", url: "https://example.com/phoneban-c", publishedAt: "2026-05-03T18:30:00+09:00" },
    ],
    perspectives: [
      {
        label: "이렇게 보는 사람들",
        points: [
          "수업 집중도 회복과 교권 보호의 최소한의 장치",
          "SNS·게임 의존을 줄이는 사회적 합의의 출발",
          "긴급 상황 등 예외가 마련돼 부작용을 최소화한다는 입장",
        ],
      },
      {
        label: "다르게 보는 사람들",
        points: [
          "학생 자율성과 통신권을 일률적으로 제한한다는 우려",
          "학교마다 학칙이 달라 형평성 문제 가능성",
          "근본적으로는 디지털 시민성 교육이 우선이라는 지적",
        ],
      },
    ],
  },
  {
    id: "issue-youth-rent",
    rank: 5,
    title: "청년 월세 지원, 이제 상시로 받아?",
    category: "정치/사회",
    oneLine: "한시 사업이 끝나고 상시 운영, 예산도 1300억으로 확대",
    summary:
      "정부가 2026년부터 청년 월세 지원을 한시 사업에서 상시 운영 체계로 전환한다고 발표. 신청 가능 여부를 묻는 청년 커뮤니티 글이 폭증.",
    whyTrending:
      "예산이 777억원에서 1300억원으로 늘고 신청 기간 제약이 사라지는 변화. 동시에 ‘지분적립형 청년 특공’ 등 자가 마련 지원안이 잇따라 거론된다는 보도가 이어진다.",
    trendScore: 80,
    mentionCount: 88_440,
    growthRate: 122,
    sentiment: "positive",
    buzzScore: 58,
    keywords: ["청년월세", "주거지원", "상시화"],
    audienceAge: ["20대"],
    imageSeed: "youth-rent",
    coverEmoji: "🏠",
    keyPoints: [
      "청년 월세 지원이 한시 사업에서 상시 운영 체계로 전환된다는 발표",
      "월 최대 20만원 수준, 예산은 777억→1300억원으로 확대 예정",
      "지분적립형 공공주택 청년 특별공급도 함께 추진 중이라는 보도",
    ],
    conversationStarters: [
      "월세 지원 상시화면 나도 받을 수 있어?",
      "결국 보조금이 월세 시장 가격을 또 끌어올리는 거 아니야?",
      "차라리 공공임대를 빨리 늘리는 게 나은 거 아니야?",
    ],
    sources: [
      { name: "정책 매체", type: "news", url: "https://example.com/rent-a", publishedAt: "2026-05-04T08:00:00+09:00" },
      { name: "주거 매체", type: "news", url: "https://example.com/rent-b", publishedAt: "2026-05-03T17:50:00+09:00" },
      { name: "청년 커뮤니티", type: "community", url: "https://example.com/rent-c", publishedAt: "2026-05-04T09:35:00+09:00" },
    ],
    perspectives: [
      {
        label: "이렇게 보는 사람들",
        points: [
          "신청 기간 제약이 사라져 사각지대가 줄어든다는 평가",
          "예산 확대로 실질 지원 규모가 의미 있는 수준으로 커진다는 시각",
          "지분적립형 특공과 결합해 자가 마련 사다리가 다층화된다는 입장",
        ],
      },
      {
        label: "다르게 보는 사람들",
        points: [
          "보조금이 결국 임대 시장 가격에 흡수될 수 있다는 우려",
          "신혼·중장년 1인 가구와의 형평성 문제",
          "공급 확대 없이 보조만 늘리면 효과가 한정된다는 분석",
        ],
      },
    ],
  },
  {
    id: "issue-worldcup-100",
    rank: 6,
    title: "손흥민·이강인 진짜 월드컵 100인 들었어?",
    category: "스포츠",
    oneLine: "디애슬레틱 ‘북중미월드컵 주목 100인’에 둘 다 이름",
    summary:
      "미국 디애슬레틱이 발표한 ‘월드컵 주목 100인’에 손흥민(LA FC) 37위, 이강인(PSG) 66위가 선정됐다. 6월 12일 본선 개막을 앞두고 화제성 재점화.",
    whyTrending:
      "손흥민의 MLS 적응, 이강인의 AFC·KFA 올해의 선수 2관왕 등 개인 성과가 동시 부각. 본선 조 추첨과 평가전 일정이 가까워지며 SNS·스포츠 커뮤니티에서 검색 폭증.",
    trendScore: 78,
    mentionCount: 96_720,
    growthRate: 158,
    sentiment: "positive",
    buzzScore: 38,
    keywords: ["월드컵", "손흥민", "이강인"],
    audienceAge: ["20대", "30대"],
    imageSeed: "worldcup-100",
    coverEmoji: "🇰🇷",
    keyPoints: [
      "디애슬레틱 ‘월드컵 주목 100인’에 손흥민 37위, 이강인 66위가 선정됐다는 보도",
      "손흥민은 MLS 데뷔 후 15경기 12골, 이강인은 AFC·KFA 올해의 선수 2관왕",
      "한국은 6월 12일 개막 본선에서 11회 연속 진출 기록 도전",
    ],
    conversationStarters: [
      "손흥민이 LA FC 가서 진짜 잘하고 있는 거야?",
      "이강인이 손흥민보다 위라는 평가가 진짜야?",
      "이번 월드컵에서 한국, 어디까지 갈 수 있을 것 같아?",
    ],
    sources: [
      { name: "스포츠 매체", type: "news", url: "https://example.com/wc-a", publishedAt: "2026-03-05T09:10:00+09:00" },
      { name: "축구 전문 매체", type: "news", url: "https://example.com/wc-b", publishedAt: "2026-03-07T07:40:00+09:00" },
      { name: "축구 커뮤니티", type: "community", url: "https://example.com/wc-c", publishedAt: "2026-05-04T08:20:00+09:00" },
    ],
    perspectives: [
      {
        label: "이렇게 보는 사람들",
        points: [
          "두 핵심 선수의 폼이 정점에 가까워 본선 기대치가 높다는 시각",
          "K리거·해외파 균형이 잡혀 전술 옵션이 다양해졌다는 평가",
          "조별리그 통과 가능성이 충분하다는 분석",
        ],
      },
      {
        label: "다르게 보는 사람들",
        points: [
          "수비 라인 노쇠화와 백업 자원 부족 우려",
          "본선 직전 평가전 결과에 따라 분위기가 크게 흔들릴 가능성",
          "스타 의존도가 높아 이탈 시 전력 공백 위험",
        ],
      },
    ],
  },
  {
    id: "issue-newjeans-3",
    rank: 7,
    title: "뉴진스 3명만 컴백한다는 게 진짜야?",
    category: "문화/연예",
    oneLine: "코펜하겐 녹음설에 어도어 ‘사전 프로덕션 인정’",
    summary:
      "하니·해린·혜인이 코펜하겐에서 목격되며 컴백 가시화 보도. 어도어가 ‘새로운 음악적 서사를 위한 사전 프로덕션’이라고 공식 인정한 분위기.",
    whyTrending:
      "6개월 만의 SNS 게시물과 코펜하겐 작업설이 동시에 터지며 팬덤 화력이 다시 점화. 2024년 계약 분쟁 이후 멤버 구성 변화에 대한 관심도 함께 증폭됐다.",
    trendScore: 76,
    mentionCount: 110_240,
    growthRate: 175,
    sentiment: "controversial",
    buzzScore: 74,
    keywords: ["뉴진스", "어도어", "컴백"],
    audienceAge: ["20대"],
    imageSeed: "newjeans-3",
    coverEmoji: "🐰",
    keyPoints: [
      "어도어가 멤버 3인의 코펜하겐 사전 프로덕션 작업을 공식 인정했다는 보도",
      "2024년 계약 분쟁 이후 민지 거취는 미정, 다니엘은 그룹에서 빠진 상태라는 보도",
      "6개월 만의 SNS 게시물이 컴백 기대감을 다시 끌어올렸다는 분석",
    ],
    conversationStarters: [
      "뉴진스 진짜 3명만 다시 활동해?",
      "민지는 결국 안 돌아오는 거야?",
      "멤버 구성이 바뀌고도 옛날 같은 분위기가 나올 수 있을까?",
    ],
    sources: [
      { name: "엔터 매체 A", type: "news", url: "https://example.com/nj-a", publishedAt: "2026-04-30T10:00:00+09:00" },
      { name: "엔터 매체 B", type: "news", url: "https://example.com/nj-b", publishedAt: "2026-05-02T08:20:00+09:00" },
      { name: "K팝 커뮤니티", type: "community", url: "https://example.com/nj-c", publishedAt: "2026-05-04T08:55:00+09:00" },
    ],
    perspectives: [
      {
        label: "이렇게 보는 사람들",
        points: [
          "공백을 깨고 음악적 정체성을 새로 정리할 기회",
          "남은 멤버 중심으로 결속력이 오히려 강해질 수 있다는 시각",
          "북유럽 프로듀서와의 협업 범위 확대 가능성",
        ],
      },
      {
        label: "다르게 보는 사람들",
        points: [
          "오리지널 라인업의 케미가 핵심이었다는 팬덤 우려",
          "법적 분쟁의 잔열이 활동 일정에 변수로 남는다는 분석",
          "리브랜딩 과정에서 일부 팬덤 이탈 가능성",
        ],
      },
    ],
  },
  {
    id: "issue-kospi-coin",
    rank: 8,
    title: "코인 떠난 돈, 다 코스피로 간 거야?",
    category: "경제",
    oneLine: "국내 가상자산 60조 증발, 코스피는 사상 최고치 경신",
    summary:
      "국내 가상자산 보유금액이 1년 새 121조원에서 60조원으로 반토막. 같은 기간 코스피는 34일 만에 37% 오르며 사상 최고치를 경신했다는 보도.",
    whyTrending:
      "비트코인 변동성이 코스피보다 낮아진 이례적 구간이 부각되며 ‘자금 이동’ 분석이 폭증. 김치 프리미엄 1% 수준 등 과거와 다른 신호도 동시에 회자된다.",
    trendScore: 75,
    mentionCount: 84_310,
    growthRate: 132,
    sentiment: "controversial",
    buzzScore: 65,
    keywords: ["코스피", "비트코인", "가상자산"],
    audienceAge: ["20대", "30대"],
    imageSeed: "kospi-coin",
    coverEmoji: "📈",
    keyPoints: [
      "국내 가상자산 보유금액이 121조→60조원으로 절반 이상 줄었다는 보도",
      "코스피는 34일 만에 37% 급등, 사상 최고치 경신",
      "비트코인 30일 변동성이 코스피보다 낮아진 이례적 구간이라는 분석",
    ],
    conversationStarters: [
      "코인에서 빠진 돈이 진짜 다 코스피로 간 거야?",
      "코스피가 너무 단기간에 올라서 거품 아니야?",
      "지금은 비트코인이 더 안정적이라는데 그럼 다시 코인 사야 해?",
    ],
    sources: [
      { name: "경제 매체", type: "news", url: "https://example.com/kospi-a", publishedAt: "2026-04-21T08:50:00+09:00" },
      { name: "디지털 자산 매체", type: "news", url: "https://example.com/kospi-b", publishedAt: "2026-04-30T07:30:00+09:00" },
      { name: "투자 커뮤니티", type: "community", url: "https://example.com/kospi-c", publishedAt: "2026-05-04T09:00:00+09:00" },
    ],
    perspectives: [
      {
        label: "이렇게 보는 사람들",
        points: [
          "국내 자본이 위험자산에서 주식으로 정상 이동한 자연스러운 흐름",
          "ETF·기관 자금 유입으로 가상자산이 ‘제도권화’되는 단계라는 시각",
          "포트폴리오 분산 관점에서 두 자산이 보완재로 자리 잡는 중",
        ],
      },
      {
        label: "다르게 보는 사람들",
        points: [
          "단기 급등으로 코스피의 밸류에이션 부담이 커졌다는 우려",
          "개인 투자자 손실 누적 후 자금이 이동했을 가능성",
          "정책·환율 변동성에 따라 다시 빠르게 반전될 수 있다는 분석",
        ],
      },
    ],
  },
  {
    id: "issue-ube-butter",
    rank: 9,
    title: "이번엔 보라색 우베가 뜬다고?",
    category: "커뮤니티",
    oneLine: "두쫀쿠·버터떡 다음 카페 트렌드는 ‘우베’라는 분석",
    summary:
      "보랏빛 참마류 ‘우베’를 활용한 라떼·케이크가 스타벅스·투썸·노티드 등 주요 카페에 동시 등장. 디저트 유행 주기가 수개월 단위로 짧아진 구조.",
    whyTrending:
      "‘버터떡’이 자리 잡기도 전에 ‘우베’ 메뉴가 동시 출시되며 SNS 인증샷이 폭증. 컬러·식감 중심의 초단기 유행 사이클이 더 빨라진다는 분석이 매체에서 잇따른다.",
    trendScore: 72,
    mentionCount: 76_510,
    growthRate: 196,
    sentiment: "positive",
    buzzScore: 35,
    keywords: ["우베", "버터떡", "카페트렌드"],
    audienceAge: ["20대", "30대"],
    imageSeed: "ube-butter",
    coverEmoji: "💜",
    keyPoints: [
      "보라색 식재료 ‘우베’가 말차를 잇는 차세대 카페 트렌드로 거론된다는 보도",
      "스타벅스 코리아·투썸·노티드 등 주요 브랜드가 동시에 우베 메뉴를 출시",
      "‘버터떡’ 등 쫀득 식감 디저트도 강세, 유행 주기는 점점 짧아지는 중",
    ],
    conversationStarters: [
      "우베가 도대체 뭐길래 갑자기 다 이걸 팔아?",
      "두쫀쿠·버터떡 다음에 또 다른 게 나오는 이유가 뭐야?",
      "SNS용 색깔 디저트 유행, 결국 누구한테 좋은 일이야?",
    ],
    sources: [
      { name: "푸드 매체", type: "news", url: "https://example.com/ube-a", publishedAt: "2026-04-30T08:00:00+09:00" },
      { name: "라이프 매거진", type: "news", url: "https://example.com/ube-b", publishedAt: "2026-04-30T09:30:00+09:00" },
      { name: "카페 인스타", type: "social", url: "https://example.com/ube-c", publishedAt: "2026-05-04T08:30:00+09:00" },
    ],
    perspectives: [
      {
        label: "이렇게 보는 사람들",
        points: [
          "동네 카페·소형 자영업의 빠른 대응이 매출 기회로 작용",
          "컬러 트렌드가 콘텐츠·관광 산업에도 파급 효과",
          "신선한 식재료 다양화로 디저트 시장 외연이 넓어지는 중",
        ],
      },
      {
        label: "다르게 보는 사람들",
        points: [
          "유행 주기 단축으로 폐기·재고 비용이 커진다는 우려",
          "SNS 노출용 메뉴가 본질적인 맛 경쟁을 가린다는 지적",
          "색소·재료 안전성 검증이 속도를 따라가지 못할 가능성",
        ],
      },
    ],
  },
  {
    id: "issue-secret-audit",
    rank: 10,
    title: "‘은밀한 감사’ 왜 이렇게 다들 봐?",
    category: "문화/연예",
    oneLine: "신혜선·공명 주연, 4회 만에 시청률 7.9% 자체 최고",
    summary:
      "tvN ‘은밀한 감사’가 4회에서 시청률 7.9%로 자체 최고를 기록하며 동시간대 1위. 본격 로맨스 진입과 함께 SNS 화력이 폭발한 분위기.",
    whyTrending:
      "호텔 잠입 작전 후 첫 키스신이 화제가 되며 ‘은감 클립’이 X·유튜브 쇼츠에서 폭증. 감시-공조-연정으로 전환되는 캐릭터 구도가 시청자들에게 강하게 박혔다는 평가.",
    trendScore: 70,
    mentionCount: 64_820,
    growthRate: 145,
    sentiment: "positive",
    buzzScore: 30,
    keywords: ["은밀한감사", "신혜선", "공명"],
    audienceAge: ["20대", "30대"],
    imageSeed: "secret-audit",
    coverEmoji: "🎬",
    keyPoints: [
      "tvN ‘은밀한 감사’가 4회 시청률 7.9%로 자체 최고를 갱신했다는 보도",
      "신혜선·공명의 호텔 잠입 작전 후 본격 로맨스 진입이 시청률을 견인",
      "공조-감시-연정 구도의 빠른 전환이 화제성의 핵심이라는 평가",
    ],
    conversationStarters: [
      "‘은밀한 감사’ 줄거리가 뭐길래 이렇게 흥행해?",
      "한국 로맨스는 왜 늘 적이었다가 사랑하는 패턴이야?",
      "이 드라마, 진짜 뒷심까지 갈 수 있을 것 같아?",
    ],
    sources: [
      { name: "엔터 매체", type: "news", url: "https://example.com/audit-a", publishedAt: "2026-05-04T07:50:00+09:00" },
      { name: "TV 리뷰 매체", type: "news", url: "https://example.com/audit-b", publishedAt: "2026-05-03T22:30:00+09:00" },
      { name: "드라마 커뮤니티", type: "community", url: "https://example.com/audit-c", publishedAt: "2026-05-04T09:30:00+09:00" },
    ],
    perspectives: [
      {
        label: "이렇게 보는 사람들",
        points: [
          "감사·잠입 등 직업적 설정이 신선하다는 평가",
          "두 주연의 호흡과 코믹 톤 연기가 호평",
          "글로벌 OTT에서도 통할 수 있는 빠른 호흡이라는 시각",
        ],
      },
      {
        label: "다르게 보는 사람들",
        points: [
          "후반부 사건 전개가 헐거워질 수 있다는 우려",
          "로맨스 전환 시점이 지나치게 빨랐다는 의견",
          "비슷한 ‘적→연인’ 클리셰 의존도가 높다는 비판",
        ],
      },
    ],
  },
  {
    id: "issue-parental-leave-66",
    rank: 11,
    title: "부모가 같이 쉬면 진짜 1년 6개월 받아?",
    category: "정치/사회",
    oneLine: "‘6+6 부모함께 육아휴직제’ 시행, 월 최대 450만원",
    summary:
      "부모가 모두 3개월 이상 사용 시 육아휴직 기간이 1년에서 1년 6개월로 연장되고, 월 상한액이 250만원에서 최대 450만원까지 늘어난다는 보도.",
    whyTrending:
      "출생아는 늘었지만 ‘둘째 포기 사회’ 분석이 함께 나오며 정책 실효성 논의가 재점화. 고용보험 미가입자·자영업자가 사각지대로 남는다는 비판도 동시 부각된다.",
    trendScore: 68,
    mentionCount: 58_220,
    growthRate: 108,
    sentiment: "controversial",
    buzzScore: 60,
    keywords: ["육아휴직", "6+6", "출산정책"],
    audienceAge: ["30대"],
    imageSeed: "parental-leave",
    coverEmoji: "👶",
    keyPoints: [
      "부모 모두 3개월 이상 사용 시 육아휴직이 1년 6개월로 연장된다는 발표",
      "‘6+6 부모함께 육아휴직제’에서 월 상한액이 최대 450만원까지 늘어남",
      "고용보험 미가입자·자영업자·플랫폼 노동자가 사각지대로 남는다는 비판",
    ],
    conversationStarters: [
      "부모가 같이 써야 1년 반이라는 게 무슨 뜻이야?",
      "자영업자나 프리랜서는 결국 못 받는 거야?",
      "이게 출산율 반등에 진짜 효과 있을까?",
    ],
    sources: [
      { name: "복지 매체", type: "news", url: "https://example.com/leave-a", publishedAt: "2026-04-30T11:00:00+09:00" },
      { name: "노동 매체", type: "news", url: "https://example.com/leave-b", publishedAt: "2026-05-01T08:30:00+09:00" },
      { name: "맘 카페", type: "community", url: "https://example.com/leave-c", publishedAt: "2026-05-04T07:20:00+09:00" },
    ],
    perspectives: [
      {
        label: "이렇게 보는 사람들",
        points: [
          "부모 공동 육아 인센티브가 가사 분담 문화를 바꾼다는 시각",
          "급여 상한 인상으로 실질 소득 감소 폭이 줄어든다는 평가",
          "장기적으로 경력 단절 완화에 기여할 수 있다는 분석",
        ],
      },
      {
        label: "다르게 보는 사람들",
        points: [
          "고용보험 사각지대 청년·자영업자에는 그림의 떡이라는 비판",
          "중소기업은 인력 운영 부담이 더 커진다는 우려",
          "현금성 지원만으로 출산율을 돌이키기 어렵다는 분석",
        ],
      },
    ],
  },
  {
    id: "issue-genz-sober",
    rank: 12,
    title: "20대 절반이 술 거의 안 마신다고?",
    category: "커뮤니티",
    oneLine: "19~29세 56%가 ‘월 1회 이하’, 통계 시작 이후 최고치",
    summary:
      "19~29세 응답자 56%가 ‘전혀 안 마시거나 월 1회 이하’ 음주라고 답한 통계가 공개. 2005년 통계 작성 이후 동일 연령대 최고 수준의 비음주 비율.",
    whyTrending:
      "회식·소개팅 자리에서 ‘술 안 마셔요’가 자연스러워졌다는 직장인 커뮤니티 글이 폭증. 무알코올 맥주·논알코올 칵테일 매출 데이터도 함께 회자되는 분위기.",
    trendScore: 65,
    mentionCount: 48_910,
    growthRate: 124,
    sentiment: "positive",
    buzzScore: 45,
    keywords: ["GenZ", "음주문화", "회식"],
    audienceAge: ["20대"],
    imageSeed: "genz-sober",
    coverEmoji: "🥤",
    keyPoints: [
      "19~29세 응답자 56%가 ‘거의 안 마시거나 월 1회 이하’라고 답했다는 통계",
      "2005년 통계 작성 이후 같은 연령대에서 가장 높은 비음주 비율이라는 보도",
      "회식 문화 변화·건강 트렌드·SNS 노출 부담 등 복합 원인이 거론된다는 분석",
    ],
    conversationStarters: [
      "요즘 20대는 진짜 회식도 다 거절해?",
      "술 안 마시는 트렌드, 어디까지 갈 것 같아?",
      "그래도 사회생활은 술이 있어야 풀린다는 의견은 어떻게 봐야 해?",
    ],
    sources: [
      { name: "라이프 매체", type: "news", url: "https://example.com/sober-a", publishedAt: "2026-04-28T09:00:00+09:00" },
      { name: "헬스 매체", type: "news", url: "https://example.com/sober-b", publishedAt: "2026-04-29T07:40:00+09:00" },
      { name: "직장인 익명", type: "community", url: "https://example.com/sober-c", publishedAt: "2026-05-04T08:00:00+09:00" },
    ],
    perspectives: [
      {
        label: "이렇게 보는 사람들",
        points: [
          "건강·정신건강 우선 가치관이 자리 잡는 자연스러운 변화",
          "주류 산업의 무알코올·논알코올 라인업 확대가 따라가는 흐름",
          "회식 문화의 강제성이 점차 옅어진다는 신호",
        ],
      },
      {
        label: "다르게 보는 사람들",
        points: [
          "관계망 형성 기회가 줄어든다는 일부 직장인의 체감",
          "전통 주류 산업·자영업 매출에 타격 가능성",
          "통계와 실제 음주량 사이 갭이 있다는 신중론",
        ],
      },
    ],
  },
  {
    id: "issue-bts-arirang",
    rank: 13,
    title: "BTS ‘2.0’은 도대체 뭐가 다른 거야?",
    category: "문화/연예",
    oneLine: "7인 완전체 ‘아리랑’ 발매, 광화문 컴백 라이브",
    summary:
      "BTS가 4년 만에 7인 완전체로 정규 5집 ‘아리랑’을 발매했다. 광화문 컴백 라이브에서 ‘BTS 2.0 시작’을 선언했다는 보도.",
    whyTrending:
      "발매 직후 400만장 판매가 전해지며 K팝 단일 앨범 기록 흐름이 다시 점화. 솔로 활동과 단체 활동 병행 모델이 어떻게 운영될지에 대한 관심이 함께 커지는 중.",
    trendScore: 64,
    mentionCount: 71_320,
    growthRate: 138,
    sentiment: "positive",
    buzzScore: 32,
    keywords: ["BTS", "아리랑", "컴백"],
    audienceAge: ["20대", "30대"],
    imageSeed: "bts-arirang",
    coverEmoji: "💜",
    keyPoints: [
      "BTS가 4년 만에 7인 완전체로 정규 5집 ‘아리랑’을 발매했다는 보도",
      "발매 직후 400만장이 팔리며 K팝 단일 앨범 흐름을 다시 견인",
      "광화문 컴백 라이브에서 ‘BTS 2.0 시작’ 선언, 솔로·단체 병행 모델 가능성",
    ],
    conversationStarters: [
      "BTS ‘2.0’이 정확히 뭐야? 뭐가 달라졌다는 거야?",
      "4년 공백을 깨고도 다시 1위 가능할까?",
      "솔로 활동이랑 그룹 활동을 어떻게 같이 가져간대?",
    ],
    sources: [
      { name: "엔터 매체", type: "news", url: "https://example.com/bts-a", publishedAt: "2026-03-21T20:00:00+09:00" },
      { name: "음악 매체", type: "news", url: "https://example.com/bts-b", publishedAt: "2026-03-22T09:00:00+09:00" },
      { name: "팬 커뮤니티", type: "community", url: "https://example.com/bts-c", publishedAt: "2026-05-04T08:45:00+09:00" },
    ],
    perspectives: [
      {
        label: "이렇게 보는 사람들",
        points: [
          "솔로·단체 활동 병행으로 멤버 개인 브랜드와 그룹 화력이 같이 성장",
          "한국적 정서를 담은 ‘아리랑’ 콘셉트가 글로벌에서도 차별성으로 작용",
          "K팝 단일 앨범 시장의 천장을 다시 한 번 끌어올린 사례",
        ],
      },
      {
        label: "다르게 보는 사람들",
        points: [
          "솔로와 단체 일정이 겹치면 멤버 부담이 커진다는 우려",
          "1세대 팬덤과 신규 팬덤 사이 톤 차이가 갈등이 될 수 있다는 분석",
          "‘아리랑’ 콘셉트가 일부 해외 팬에게는 진입 장벽이 될 수 있다는 의견",
        ],
      },
    ],
  },
];
