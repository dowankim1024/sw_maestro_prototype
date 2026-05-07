import type { Issue } from "./types";

/**
 * 이슈캐스트 시드 이슈.
 *
 * 콘텐츠 원칙:
 *  - 30초 안에 핵심을 잡을 수 있는 분량.
 *  - 사실(facts)은 ‘단정 회피’ 표현으로 작성하고 출처 ID에 매핑.
 *  - 캐릭터 관점(characterAngles)은 4렌즈(생활자/전문가/트렌드/회의주의자)가
 *    동일한 사실 기반 위에서 다른 정보 레이어를 얹는다.
 *  - safetyLevel: 정치·정책 갈등은 'sensitive', 일반 트렌드는 'normal'.
 *
 * 출처는 가상 매체명을 사용한다 (프로토타입 단계). 실제 발행 시에는
 * 운영자 검수 도구를 통해 검증된 출처로 교체된다.
 */

const ISO = (d: string) => new Date(d).toISOString();

export const mockIssues: Issue[] = [
  // ──────────────────────────────────────────────────────────────────────────
  // 1. 기름값 — 기본 시나리오
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "issue-oil-price",
    title: "기름값 왜 다시 오르나",
    shortTitle: "기름값 왜 다시 오르나",
    summary:
      "국제 유가와 환율, 중동 리스크가 겹치며 국내 휘발유·경유 부담이 다시 주목받고 있다는 보도.",
    whyNow:
      "최근 중동 지역 긴장이 다시 부각되며 시장 심리가 흔들렸고, 환율과 물류비 변동까지 겹쳐 ‘체감 물가’ 얘기가 한꺼번에 나오고 있는 분위기.",
    category: "경제",
    publishedAt: ISO("2026-05-07T07:00:00+09:00"),
    updatedAt: ISO("2026-05-07T08:30:00+09:00"),
    readTimeSec: 30,
    keywords: ["유가", "환율", "중동 리스크", "물류비"],
    safetyLevel: "normal",
    coverEmoji: "⛽",
    coverImage: "https://picsum.photos/seed/issuecast-oil/720/1280",
    facts: [
      {
        id: "f-oil-1",
        statement:
          "국제 유가는 국내 휘발유·경유 가격에 영향을 주는 핵심 변수로 자주 언급된다.",
        sourceIds: ["s-oil-1", "s-oil-2"],
        confidence: "fact",
        lastCheckedAt: ISO("2026-05-07T07:00:00+09:00"),
      },
      {
        id: "f-oil-2",
        statement:
          "원·달러 환율이 오르면 수입 원유 비용 부담이 커질 수 있다는 분석이 통상적이다.",
        sourceIds: ["s-oil-2"],
        confidence: "fact",
        lastCheckedAt: ISO("2026-05-07T07:00:00+09:00"),
      },
      {
        id: "f-oil-3",
        statement:
          "중동 지역 긴장은 에너지 시장 불안 요인으로 자주 보도되며, 실제 공급 차질 전에도 가격에 반영되는 경우가 있다.",
        sourceIds: ["s-oil-1", "s-oil-3"],
        confidence: "reported",
        lastCheckedAt: ISO("2026-05-07T07:00:00+09:00"),
      },
    ],
    sources: [
      {
        id: "s-oil-1",
        title: "국제 유가 동향과 국내 영향",
        publisher: "에너지경제 데일리",
        url: "https://example.com/oil-1",
        publishedAt: ISO("2026-05-06T22:30:00+09:00"),
        retrievedAt: ISO("2026-05-07T07:00:00+09:00"),
        type: "news",
      },
      {
        id: "s-oil-2",
        title: "환율 변동이 물가에 미치는 경로",
        publisher: "한국통계연구원",
        url: "https://example.com/oil-2",
        publishedAt: ISO("2026-04-30T10:00:00+09:00"),
        retrievedAt: ISO("2026-05-07T07:00:00+09:00"),
        type: "report",
      },
      {
        id: "s-oil-3",
        title: "중동 리스크와 시장 심리",
        publisher: "글로벌 마켓 리뷰",
        url: "https://example.com/oil-3",
        publishedAt: ISO("2026-05-05T18:00:00+09:00"),
        retrievedAt: ISO("2026-05-07T07:00:00+09:00"),
        type: "news",
      },
    ],
    characterAngles: [
      {
        characterId: "kkang",
        lensLabel: "생활자 관점",
        oneLiner: "솔직히 이건 주유소 영수증으로 바로 오는 얘기야",
        viewpoint:
          "아 그거, 기름값 오르면 우리 같은 가게도 바로 느껴. 배달비도 그렇고 재료 실어오는 차도 그렇고 결국 메뉴판 앞에서 고민하게 되거든. 내가 봤을 땐 이건 큰 뉴스 같아 보여도 손님 지갑까지 내려오는 얘기야.",
        opinionDisclaimer: "생활자 렌즈의 AI 생성 의견입니다.",
        referencedFactIds: ["f-oil-1", "f-oil-2"],
      },
      {
        characterId: "uncle",
        lensLabel: "전문가 관점",
        oneLiner: "흥미로운 건 유가·환율·리스크가 한꺼번에 얽힌다는 점이에요",
        viewpoint:
          "흥미로운 게요, 국내 기름값은 국제 유가 하나만으로 움직인다고 보기 어려워요. 원유는 달러로 거래되기 때문에 환율이 함께 작동하고, 중동 리스크처럼 실제 공급 차질 전에도 시장 심리를 흔드는 요인이 붙습니다. 한 가지 짚고 싶은 건 체감 물가가 여러 경로를 거쳐 만들어진다는 점이에요.",
        opinionDisclaimer: "전문가 렌즈의 AI 생성 의견입니다.",
        referencedFactIds: ["f-oil-1", "f-oil-2", "f-oil-3"],
      },
      {
        characterId: "prof",
        lensLabel: "트렌드 관점",
        oneLiner: "주유소 인증이랑 배달비 걱정이 같이 돌고 있어",
        viewpoint:
          "이거 진짜 웃긴 게, 사람들은 국제 유가보다 주유소 가격판 사진으로 먼저 반응하거든. 기름값 오르면 바로 ‘배달비 또 오르나’ 같은 얘기가 붙고, 커뮤에서는 체감 물가 소재로 도배돼. 이미 생활비 이슈로 번질 각이야.",
        opinionDisclaimer: "트렌드 렌즈의 AI 생성 의견입니다.",
        referencedFactIds: ["f-oil-1", "f-oil-2"],
      },
      {
        characterId: "pm",
        lensLabel: "회의주의자 관점",
        oneLiner: "잠깐, 중동 리스크 하나로 단정하긴 이르다",
        viewpoint:
          "잠깐, 근데 ‘중동 리스크 때문에 올랐다’고만 말하면 빠지는 게 있어. 출처를 보면 유가, 환율, 시장 심리가 같이 언급되거든. 실제 공급 차질이 있었는지, 심리만 먼저 반영된 건지는 좀 더 봐야 돼. 일단 단정하긴 이르다.",
        opinionDisclaimer: "회의주의자 렌즈의 AI 생성 의견입니다.",
        referencedFactIds: ["f-oil-2", "f-oil-3"],
      },
    ],
    conversationStarters: [
      "내 생활비에는 어떻게 닿아?",
      "유가·환율·중동 리스크가 어떻게 연결돼?",
      "중동 리스크 때문이라고 단정해도 돼?",
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 2. AI 에이전트
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "issue-ai-agent",
    title: "AI가 알아서 일한다는 ‘에이전트’가 뭔데?",
    shortTitle: "AI 에이전트, 뭐가 다른 거야?",
    summary:
      "챗봇 단계를 넘어 ‘적은 지시로 다단계 업무를 스스로 처리하는 AI 에이전트’ 흐름이 본격화됐다는 보도가 이어진다.",
    whyNow:
      "주요 AI 모델들이 잇따라 에이전트형 기능을 강조하면서, 단순 질문·답변에서 ‘작업 위임’으로 사용 패턴이 바뀐다는 분석이 함께 나오는 분위기.",
    category: "테크",
    publishedAt: ISO("2026-05-06T19:00:00+09:00"),
    updatedAt: ISO("2026-05-07T08:00:00+09:00"),
    readTimeSec: 30,
    keywords: ["AI 에이전트", "자동화", "업무 변화"],
    safetyLevel: "normal",
    coverEmoji: "🤖",
    coverImage: "https://picsum.photos/seed/issuecast-ai/720/1280",
    facts: [
      {
        id: "f-ai-1",
        statement:
          "여러 글로벌 AI 업체들이 ‘에이전트형’ 기능을 강조하며 신모델·기능을 발표하고 있다는 보도가 최근 잇따르고 있다.",
        sourceIds: ["s-ai-1", "s-ai-2"],
        confidence: "fact",
        lastCheckedAt: ISO("2026-05-07T08:00:00+09:00"),
      },
      {
        id: "f-ai-2",
        statement:
          "에이전트는 사용자의 적은 지시로도 다단계 업무를 ‘스스로 계획하고 실행한다’는 컨셉으로 설명되는 경우가 많다.",
        sourceIds: ["s-ai-1"],
        confidence: "reported",
        lastCheckedAt: ISO("2026-05-07T08:00:00+09:00"),
      },
      {
        id: "f-ai-3",
        statement:
          "벤치마크 점수와 실제 업무 정확도 사이에 격차가 있다는 우려도 함께 거론된다는 분석이 나온다.",
        sourceIds: ["s-ai-2", "s-ai-3"],
        confidence: "reported",
        lastCheckedAt: ISO("2026-05-07T08:00:00+09:00"),
      },
    ],
    sources: [
      {
        id: "s-ai-1",
        title: "AI 에이전트 시대 본격화",
        publisher: "테크 인사이트",
        url: "https://example.com/ai-1",
        publishedAt: ISO("2026-05-06T11:00:00+09:00"),
        retrievedAt: ISO("2026-05-07T08:00:00+09:00"),
        type: "news",
      },
      {
        id: "s-ai-2",
        title: "에이전트 표준 경쟁 보고",
        publisher: "디지털 정책 매체",
        url: "https://example.com/ai-2",
        publishedAt: ISO("2026-05-04T15:00:00+09:00"),
        retrievedAt: ISO("2026-05-07T08:00:00+09:00"),
        type: "report",
      },
      {
        id: "s-ai-3",
        title: "벤치마크와 실무 사이의 격차",
        publisher: "AI 리서치 노트",
        url: "https://example.com/ai-3",
        publishedAt: ISO("2026-05-02T09:30:00+09:00"),
        retrievedAt: ISO("2026-05-07T08:00:00+09:00"),
        type: "report",
      },
    ],
    characterAngles: [
      {
        characterId: "kkang",
        lensLabel: "생활자 관점",
        oneLiner: "AI가 알아서 일한다 해도, 내 가게 일은 어디까지 맡길 수 있나가 문제야",
        viewpoint:
          "솔직히 AI가 알아서 일한다 그래도 우리 가게 주문 받고 손님 눈치 보는 건 아직 사람이 해야 하잖아. 그래도 재고 정리나 문서 같은 건 맡길 수 있으면 편하긴 하겠지. 내가 봤을 땐 중요한 건 ‘다 뺏긴다’보다 어디까지 맡겨도 되는지야.",
        opinionDisclaimer: "생활자 렌즈의 AI 생성 의견입니다.",
        referencedFactIds: ["f-ai-2", "f-ai-3"],
      },
      {
        characterId: "uncle",
        lensLabel: "전문가 관점",
        oneLiner: "챗봇에서 작업 위임으로 넘어가는 구조 변화예요",
        viewpoint:
          "흥미로운 게요, 에이전트라는 말은 단순히 질문에 답하는 챗봇을 넘어 ‘작업을 맡긴다’는 방향을 강조합니다. 사용자의 지시가 적어도 계획과 실행을 이어간다는 컨셉이 핵심이에요. 다만 한 가지 짚고 싶은 건, 벤치마크 점수와 실제 업무 정확도 사이의 격차가 계속 문제로 남는다는 점입니다.",
        opinionDisclaimer: "전문가 렌즈의 AI 생성 의견입니다.",
        referencedFactIds: ["f-ai-1", "f-ai-2", "f-ai-3"],
      },
      {
        characterId: "prof",
        lensLabel: "트렌드 관점",
        oneLiner: "AI가 혼자 일한다는 클립이 너무 잘 퍼지는 중이야",
        viewpoint:
          "이거 진짜 웃긴 게, ‘AI가 알아서 코딩함’, ‘AI가 이메일 다 처리함’ 같은 영상이 너무 잘 퍼져. 사람들은 기능보다도 ‘내 일이 사라지는 거 아니야?’라는 feel로 먼저 반응하거든. 이미 에이전트라는 말 자체가 공포랑 기대가 같이 붙는 밈이 됐어.",
        opinionDisclaimer: "트렌드 렌즈의 AI 생성 의견입니다.",
        referencedFactIds: ["f-ai-1", "f-ai-2"],
      },
      {
        characterId: "pm",
        lensLabel: "회의주의자 관점",
        oneLiner: "잠깐, ‘스스로 실행’이 실제 정확도까지 보장하진 않아",
        viewpoint:
          "잠깐, 근데 에이전트가 ‘스스로 계획하고 실행한다’고 설명된다고 해서 결과가 항상 맞다는 뜻은 아니야. 출처에서도 벤치마크와 실제 업무 정확도 사이의 격차 우려가 같이 언급돼. 다른 가능성도 있어. 기능 홍보와 실제 현장 안정성은 나눠 봐야 돼.",
        opinionDisclaimer: "회의주의자 렌즈의 AI 생성 의견입니다.",
        referencedFactIds: ["f-ai-2", "f-ai-3"],
      },
    ],
    conversationStarters: [
      "에이전트가 챗봇이랑 뭐가 달라?",
      "내 일이나 가게에는 어디까지 닿아?",
      "벤치마크와 실제 업무 정확도는 왜 다를 수 있어?",
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 3. 청년 월세 상시 지원 (sensitive 영역에 가까운 사회 이슈)
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "issue-youth-rent",
    title: "청년 월세 지원, 이제 상시로 받는다고?",
    shortTitle: "청년 월세 상시 지원, 핵심만",
    summary:
      "한시 사업이던 청년 월세 지원을 상시 운영 체계로 바꾸고 예산도 확대한다는 발표가 나오면서 조건과 사각지대 논의가 함께 떠오르고 있다는 보도.",
    whyNow:
      "신청 기간 제약이 사라지면서 ‘나도 받을 수 있나’ 검색이 늘고, 동시에 보조금이 임대 시장 가격에 흡수될 수 있다는 우려와 사각지대 비판도 함께 나오는 중.",
    category: "사회",
    publishedAt: ISO("2026-05-06T08:30:00+09:00"),
    updatedAt: ISO("2026-05-07T07:30:00+09:00"),
    readTimeSec: 30,
    keywords: ["청년 월세", "주거 지원", "정책 변화"],
    safetyLevel: "sensitive",
    coverEmoji: "🏠",
    coverImage: "https://picsum.photos/seed/issuecast-rent/720/1280",
    facts: [
      {
        id: "f-rent-1",
        statement:
          "청년 월세 지원이 한시 사업에서 상시 운영 체계로 전환된다는 발표가 최근 보도됐다.",
        sourceIds: ["s-rent-1"],
        confidence: "fact",
        lastCheckedAt: ISO("2026-05-07T07:30:00+09:00"),
      },
      {
        id: "f-rent-2",
        statement:
          "관련 예산 규모가 기존 대비 확대되는 방향으로 추진된다는 보도가 이어진다.",
        sourceIds: ["s-rent-1", "s-rent-2"],
        confidence: "reported",
        lastCheckedAt: ISO("2026-05-07T07:30:00+09:00"),
      },
      {
        id: "f-rent-3",
        statement:
          "보조금이 임대 시장 가격에 일부 흡수될 수 있다는 우려와 사각지대 형평성 비판이 함께 거론된다는 분석이 나온다.",
        sourceIds: ["s-rent-2", "s-rent-3"],
        confidence: "reported",
        lastCheckedAt: ISO("2026-05-07T07:30:00+09:00"),
      },
    ],
    sources: [
      {
        id: "s-rent-1",
        title: "청년 월세 상시 지원 전환 발표",
        publisher: "정책 매체 A",
        url: "https://example.com/rent-1",
        publishedAt: ISO("2026-05-06T07:00:00+09:00"),
        retrievedAt: ISO("2026-05-07T07:30:00+09:00"),
        type: "official",
      },
      {
        id: "s-rent-2",
        title: "예산 확대와 정책 효과 분석",
        publisher: "주거 정책 리뷰",
        url: "https://example.com/rent-2",
        publishedAt: ISO("2026-05-05T15:00:00+09:00"),
        retrievedAt: ISO("2026-05-07T07:30:00+09:00"),
        type: "report",
      },
      {
        id: "s-rent-3",
        title: "사각지대와 형평성 논쟁",
        publisher: "사회 이슈 매체",
        url: "https://example.com/rent-3",
        publishedAt: ISO("2026-05-04T20:00:00+09:00"),
        retrievedAt: ISO("2026-05-07T07:30:00+09:00"),
        type: "news",
      },
    ],
    characterAngles: [
      {
        characterId: "kkang",
        lensLabel: "생활자 관점",
        oneLiner: "월세는 지원보다도 매달 빠지는 돈이 먼저 무섭지",
        viewpoint:
          "아 그거, 우리 가게 알바들도 월세 얘기 제일 많이 해. 상시로 신청할 수 있으면 놓치는 사람은 줄겠지만, 월세 자체가 올라가면 체감은 또 달라지거든. 솔직히 지원금이 들어와도 집값이 같이 움직이면 사람은 그대로 빠듯해.",
        opinionDisclaimer: "생활자 렌즈의 AI 생성 의견입니다.",
        referencedFactIds: ["f-rent-1", "f-rent-3"],
      },
      {
        characterId: "uncle",
        lensLabel: "전문가 관점",
        oneLiner: "한시 지원이 상시 제도로 바뀌는 건 설계의 변화예요",
        viewpoint:
          "흥미로운 게요, 한시 사업이 상시 운영 체계로 바뀌면 ‘예외적 지원’에서 제도에 가까운 형태로 이동합니다. 예산 확대 방향도 함께 보도되고 있어서 접근성은 달라질 수 있어요. 다만 보조금이 임대료에 흡수될 수 있다는 우려와 사각지대 문제를 같이 봐야 합니다.",
        opinionDisclaimer: "전문가 렌즈의 AI 생성 의견입니다.",
        referencedFactIds: ["f-rent-1", "f-rent-2", "f-rent-3"],
      },
      {
        characterId: "prof",
        lensLabel: "트렌드 관점",
        oneLiner: "‘나도 받을 수 있나’ 검색이 먼저 터지는 이슈야",
        viewpoint:
          "이거 진짜 반응이 빠른 게, 사람들은 정책명보다 ‘내가 대상이냐’부터 보거든. 신청 기간 제약이 사라진다는 말이 나오면 단톡방에서 조건 캡처가 도배돼. 근데 동시에 ‘기준 살짝 넘으면 못 받는다’는 애매함도 같이 밈처럼 돌아.",
        opinionDisclaimer: "트렌드 렌즈의 AI 생성 의견입니다.",
        referencedFactIds: ["f-rent-1"],
      },
      {
        characterId: "pm",
        lensLabel: "회의주의자 관점",
        oneLiner: "잠깐, 확대 방향과 실제 조건은 나눠 봐야 돼",
        viewpoint:
          "잠깐, 근데 ‘예산 확대 방향’이라는 표현은 실제 조건과 규모가 확정됐다는 뜻과는 다를 수 있어. 출처를 보면 사각지대와 형평성 비판도 같이 언급되거든. 다른 가능성도 있어. 상시화가 편의는 높여도 임대 시장 가격 문제까지 해결한다고 단정하긴 이르다.",
        opinionDisclaimer: "회의주의자 렌즈의 AI 생성 의견입니다.",
        referencedFactIds: ["f-rent-2", "f-rent-3"],
      },
    ],
    conversationStarters: [
      "이거 결국 누가 받을 수 있는 거야?",
      "상시 지원으로 바뀌면 뭐가 달라져?",
      "보조금이 월세에 흡수될 수 있다는 말은 무슨 뜻이야?",
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 4. 6+6 부모 함께 육아휴직
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "issue-parental-leave",
    title: "부모가 같이 쉬면 1년 6개월 받는다는 게 진짜야?",
    shortTitle: "6+6 육아휴직, 핵심만",
    summary:
      "‘6+6 부모 함께 육아휴직제’가 시행되면서 부부 동시 사용 시 기간과 급여 상한이 함께 늘어나는 변화에 관심이 모이는 중이라는 보도.",
    whyNow:
      "출생아 수와 둘째 출산 의향에 대한 분석이 동시에 나오며, ‘공동 육아 인센티브’의 실효성 논쟁이 다시 떠오르고 있는 분위기.",
    category: "사회",
    publishedAt: ISO("2026-05-05T09:00:00+09:00"),
    updatedAt: ISO("2026-05-07T07:45:00+09:00"),
    readTimeSec: 30,
    keywords: ["육아휴직", "부모 공동 육아", "출산 정책"],
    safetyLevel: "sensitive",
    coverEmoji: "👶",
    coverImage: "https://picsum.photos/seed/issuecast-baby/720/1280",
    facts: [
      {
        id: "f-leave-1",
        statement:
          "부모가 모두 일정 기간 이상 사용하면 육아휴직 기간이 연장되는 ‘6+6 부모 함께 육아휴직’ 제도가 운영되고 있다는 보도가 이어진다.",
        sourceIds: ["s-leave-1", "s-leave-2"],
        confidence: "fact",
        lastCheckedAt: ISO("2026-05-07T07:45:00+09:00"),
      },
      {
        id: "f-leave-2",
        statement:
          "관련 급여 상한이 함께 인상됐다는 보도가 있으며, 구체 수치는 시점·매체별로 다를 수 있다.",
        sourceIds: ["s-leave-1"],
        confidence: "reported",
        lastCheckedAt: ISO("2026-05-07T07:45:00+09:00"),
      },
      {
        id: "f-leave-3",
        statement:
          "고용보험 미가입자·자영업자·플랫폼 노동자의 사각지대가 함께 거론된다는 분석이 있다.",
        sourceIds: ["s-leave-2", "s-leave-3"],
        confidence: "reported",
        lastCheckedAt: ISO("2026-05-07T07:45:00+09:00"),
      },
    ],
    sources: [
      {
        id: "s-leave-1",
        title: "6+6 부모 함께 육아휴직 운영",
        publisher: "복지 정책 매체",
        url: "https://example.com/leave-1",
        publishedAt: ISO("2026-05-04T11:00:00+09:00"),
        retrievedAt: ISO("2026-05-07T07:45:00+09:00"),
        type: "official",
      },
      {
        id: "s-leave-2",
        title: "공동 육아 인센티브 효과 분석",
        publisher: "노동 리서치",
        url: "https://example.com/leave-2",
        publishedAt: ISO("2026-05-03T09:30:00+09:00"),
        retrievedAt: ISO("2026-05-07T07:45:00+09:00"),
        type: "report",
      },
      {
        id: "s-leave-3",
        title: "사각지대와 형평성 논쟁",
        publisher: "사회 이슈 매체",
        url: "https://example.com/leave-3",
        publishedAt: ISO("2026-05-02T20:00:00+09:00"),
        retrievedAt: ISO("2026-05-07T07:45:00+09:00"),
        type: "news",
      },
    ],
    characterAngles: [
      {
        characterId: "kkang",
        lensLabel: "생활자 관점",
        oneLiner: "제도가 좋아도 가게와 직장에서 빈자리 버티는 게 문제야",
        viewpoint:
          "솔직히 애 키우는 집은 쉬는 시간이 제일 귀하지. 근데 제도가 있어도 직장에서 눈치 보이면 못 쓰는 거야. 우리 같은 작은 가게도 한 명 빠지면 빈자리 메우는 게 바로 일이거든. 결국 돈이랑 분위기가 같이 맞아야 돼.",
        opinionDisclaimer: "생활자 렌즈의 AI 생성 의견입니다.",
        referencedFactIds: ["f-leave-1", "f-leave-2", "f-leave-3"],
      },
      {
        characterId: "uncle",
        lensLabel: "전문가 관점",
        oneLiner: "제도는 기간과 급여보다 사용 가능한 문화까지 봐야 해요",
        viewpoint:
          "흥미로운 게요, 부모가 함께 쓰도록 인센티브를 설계하는 건 돌봄 책임을 한쪽에만 두지 않겠다는 방향을 담고 있습니다. 하지만 한 가지 짚고 싶은 건 제도 설계와 실제 사용 가능성은 다르다는 점이에요. 고용보험 밖 노동자나 자영업자 사각지대도 함께 보도되고 있습니다.",
        opinionDisclaimer: "전문가 렌즈의 AI 생성 의견입니다.",
        referencedFactIds: ["f-leave-1", "f-leave-2", "f-leave-3"],
      },
      {
        characterId: "prof",
        lensLabel: "트렌드 관점",
        oneLiner: "댓글은 ‘제도는 있는데 눈치 보여서 못 쓴다’로 모이는 중이야",
        viewpoint:
          "이거 진짜 웃긴 게, ‘부모가 같이 쉬면 더 준다’는 제목보다 댓글은 회사 눈치 얘기로 도배돼. 특히 ‘우리 회사에서 가능?’ 같은 반응이 먼저 나와. 제도 설명은 좋아 보이는데, 사람들은 바로 현장 분위기 feel로 받아들이는 거지.",
        opinionDisclaimer: "트렌드 렌즈의 AI 생성 의견입니다.",
        referencedFactIds: ["f-leave-1", "f-leave-3"],
      },
      {
        characterId: "pm",
        lensLabel: "회의주의자 관점",
        oneLiner: "잠깐, ‘더 받는다’는 표현은 조건을 같이 봐야 돼",
        viewpoint:
          "잠깐, 근데 이 이슈는 ‘부모가 같이 쉬면 1년 6개월’처럼 단순화되기 쉬워. 출처를 보면 급여 상한이나 구체 수치는 시점·매체별로 다를 수 있다고 되어 있어. 다른 가능성도 있어. 자격, 고용보험 가입 여부, 회사 상황을 빼고 말하면 실제 체감과 달라질 수 있어.",
        opinionDisclaimer: "회의주의자 렌즈의 AI 생성 의견입니다.",
        referencedFactIds: ["f-leave-2", "f-leave-3"],
      },
    ],
    conversationStarters: [
      "‘부모가 같이 써야’ 라는 게 무슨 뜻이야?",
      "회사 눈치 문제는 어떻게 봐야 해?",
      "자영업자나 플랫폼 노동자는 어디서 빠질 수 있어?",
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 5. 우베·디저트 트렌드
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "issue-ube-dessert",
    title: "이번엔 보라색 ‘우베’가 뜬다고?",
    shortTitle: "우베 트렌드, 왜 갑자기?",
    summary:
      "참마류 ‘우베’를 활용한 디저트가 주요 카페에 동시 등장하며 카페 트렌드 사이클이 점점 짧아진다는 분석이 함께 회자된다는 보도.",
    whyNow:
      "‘버터떡’ 등 직전 트렌드가 자리 잡기도 전에 새로운 컬러·식감 디저트가 동시에 출시되며 SNS 인증 흐름이 다시 폭증하는 분위기.",
    category: "문화",
    publishedAt: ISO("2026-05-04T13:00:00+09:00"),
    updatedAt: ISO("2026-05-07T08:00:00+09:00"),
    readTimeSec: 30,
    keywords: ["우베", "카페 트렌드", "디저트"],
    safetyLevel: "normal",
    coverEmoji: "💜",
    coverImage: "https://picsum.photos/seed/issuecast-ube/720/1280",
    facts: [
      {
        id: "f-ube-1",
        statement:
          "보라색 식재료 ‘우베’를 활용한 디저트가 여러 주요 브랜드에 동시 등장하고 있다는 보도가 이어진다.",
        sourceIds: ["s-ube-1", "s-ube-2"],
        confidence: "fact",
        lastCheckedAt: ISO("2026-05-07T08:00:00+09:00"),
      },
      {
        id: "f-ube-2",
        statement:
          "최근 카페 디저트 트렌드 주기가 과거보다 짧아지고 있다는 분석이 자주 언급된다.",
        sourceIds: ["s-ube-2"],
        confidence: "reported",
        lastCheckedAt: ISO("2026-05-07T08:00:00+09:00"),
      },
      {
        id: "f-ube-3",
        statement:
          "SNS 노출 효과가 신메뉴 출시 결정의 주요 변수로 거론된다는 업계 분석이 있다.",
        sourceIds: ["s-ube-3"],
        confidence: "reported",
        lastCheckedAt: ISO("2026-05-07T08:00:00+09:00"),
      },
    ],
    sources: [
      {
        id: "s-ube-1",
        title: "주요 카페 ‘우베’ 메뉴 잇따라",
        publisher: "푸드 매거진",
        url: "https://example.com/ube-1",
        publishedAt: ISO("2026-05-03T08:00:00+09:00"),
        retrievedAt: ISO("2026-05-07T08:00:00+09:00"),
        type: "news",
      },
      {
        id: "s-ube-2",
        title: "카페 트렌드 주기 분석",
        publisher: "라이프 리포트",
        url: "https://example.com/ube-2",
        publishedAt: ISO("2026-05-02T11:00:00+09:00"),
        retrievedAt: ISO("2026-05-07T08:00:00+09:00"),
        type: "report",
      },
      {
        id: "s-ube-3",
        title: "SNS와 신메뉴 결정 구조",
        publisher: "마케팅 인사이트",
        url: "https://example.com/ube-3",
        publishedAt: ISO("2026-04-30T15:00:00+09:00"),
        retrievedAt: ISO("2026-05-07T08:00:00+09:00"),
        type: "report",
      },
    ],
    characterAngles: [
      {
        characterId: "kkang",
        lensLabel: "생활자 관점",
        oneLiner: "예쁜 건 알겠는데, 결국 손님이 계속 찾느냐가 문제야",
        viewpoint:
          "아 그거, 보라색이라 사진은 잘 나오겠지. 근데 가게 하는 입장에선 재료 들여놓고 한 달 반짝하고 끝나면 골치야. 솔직히 손님이 계속 찾는 메뉴인지, 그냥 인증샷 한 번 찍고 끝나는 건지 그게 더 중요해.",
        opinionDisclaimer: "생활자 렌즈의 AI 생성 의견입니다.",
        referencedFactIds: ["f-ube-1", "f-ube-2"],
      },
      {
        characterId: "uncle",
        lensLabel: "전문가 관점",
        oneLiner: "SNS에서 잘 찍히는 식재료가 트렌드 주기를 압축하고 있어요",
        viewpoint:
          "흥미로운 게요, 우베 자체보다 ‘보라색 식재료가 여러 브랜드에 동시에 등장한다’는 구조가 중요합니다. 카페 디저트는 맛뿐 아니라 촬영 가능한 색감과 식감이 소비를 밀어 올리는 경우가 많아요. 한 가지 짚고 싶은 건 SNS 노출 효과가 신메뉴 결정의 변수로 거론된다는 점입니다.",
        opinionDisclaimer: "전문가 렌즈의 AI 생성 의견입니다.",
        referencedFactIds: ["f-ube-1", "f-ube-2", "f-ube-3"],
      },
      {
        characterId: "prof",
        lensLabel: "트렌드 관점",
        oneLiner: "인스타에 보라색 컵 사진이 이미 도배됐어",
        viewpoint:
          "이거 진짜 도배됐어. 우베 라떼, 우베 케이크처럼 보라색 컷이 피드에서 너무 잘 튀거든. 버터떡 다음 사이클 오기도 전에 새 컬러가 올라온 느낌이라, 이미 ‘다음 인증 메뉴’ 각이야.",
        opinionDisclaimer: "트렌드 렌즈의 AI 생성 의견입니다.",
        referencedFactIds: ["f-ube-1", "f-ube-3"],
      },
      {
        characterId: "pm",
        lensLabel: "회의주의자 관점",
        oneLiner: "잠깐, ‘뜬다’의 기준이 생각보다 모호해",
        viewpoint:
          "잠깐, 근데 ‘우베가 뜬다’는 말은 기준을 봐야 돼. 여러 브랜드에 동시 등장했다는 보도는 있지만, 그게 장기 수요인지 SNS 노출이 만든 순간적 확산인지는 다를 수 있어. 다른 가능성도 있어. 트렌드 보도는 흐름을 설명하면서 동시에 흐름을 키우기도 하거든.",
        opinionDisclaimer: "회의주의자 렌즈의 AI 생성 의견입니다.",
        referencedFactIds: ["f-ube-1", "f-ube-2", "f-ube-3"],
      },
    ],
    conversationStarters: [
      "‘우베’가 도대체 뭐길래 갑자기 다 팔아?",
      "이런 디저트 유행이 왜 이렇게 빨라진 거야?",
      "‘뜬다’는 걸 어떻게 확인해야 해?",
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 6. 코스피·코인 자금 이동
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "issue-stock-coin-flow",
    title: "코인에서 빠진 돈이 다 코스피로 갔다고?",
    shortTitle: "코스피·코인 자금 이동, 진짜야?",
    summary:
      "국내 가상자산 보유 규모가 줄고 코스피는 강세를 보이면서 ‘자금 이동’ 분석이 함께 회자된다는 보도. 단기 변동성에 대한 우려도 동시에 거론되는 분위기.",
    whyNow:
      "비트코인 변동성과 코스피 강세 흐름이 동시에 나타나면서 ‘위험자산에서 주식으로의 자금 이동’이라는 해석이 자주 나오는 시점.",
    category: "경제",
    publishedAt: ISO("2026-05-06T18:00:00+09:00"),
    updatedAt: ISO("2026-05-07T07:50:00+09:00"),
    readTimeSec: 30,
    keywords: ["코스피", "비트코인", "자금 이동"],
    safetyLevel: "sensitive",
    coverEmoji: "📊",
    coverImage: "https://picsum.photos/seed/issuecast-market/720/1280",
    facts: [
      {
        id: "f-flow-1",
        statement:
          "최근 국내 가상자산 보유 규모가 이전 대비 줄어들었다는 보도가 이어진다.",
        sourceIds: ["s-flow-1"],
        confidence: "reported",
        lastCheckedAt: ISO("2026-05-07T07:50:00+09:00"),
      },
      {
        id: "f-flow-2",
        statement:
          "같은 기간 코스피는 비교적 단기간에 큰 폭으로 상승했다는 분석이 자주 언급된다.",
        sourceIds: ["s-flow-1", "s-flow-2"],
        confidence: "reported",
        lastCheckedAt: ISO("2026-05-07T07:50:00+09:00"),
      },
      {
        id: "f-flow-3",
        statement:
          "단기 급등에 따른 밸류에이션 부담과 정책·환율 변동성에 따른 반전 가능성도 함께 거론된다는 분석이 있다.",
        sourceIds: ["s-flow-2", "s-flow-3"],
        confidence: "reported",
        lastCheckedAt: ISO("2026-05-07T07:50:00+09:00"),
      },
    ],
    sources: [
      {
        id: "s-flow-1",
        title: "가상자산 보유 규모 변화",
        publisher: "디지털 자산 매체",
        url: "https://example.com/flow-1",
        publishedAt: ISO("2026-05-04T08:00:00+09:00"),
        retrievedAt: ISO("2026-05-07T07:50:00+09:00"),
        type: "news",
      },
      {
        id: "s-flow-2",
        title: "코스피 강세와 자금 이동 분석",
        publisher: "경제 매체",
        url: "https://example.com/flow-2",
        publishedAt: ISO("2026-05-05T09:30:00+09:00"),
        retrievedAt: ISO("2026-05-07T07:50:00+09:00"),
        type: "news",
      },
      {
        id: "s-flow-3",
        title: "단기 급등 후 변수 점검",
        publisher: "투자 리서치",
        url: "https://example.com/flow-3",
        publishedAt: ISO("2026-05-06T11:00:00+09:00"),
        retrievedAt: ISO("2026-05-07T07:50:00+09:00"),
        type: "report",
      },
    ],
    characterAngles: [
      {
        characterId: "kkang",
        lensLabel: "생활자 관점",
        oneLiner: "내 돈이면 남들 자금 이동 얘기만 보고 따라가면 무섭지",
        viewpoint:
          "솔직히 이런 얘기는 남 얘기 같아도 내 통장 돈 들어가면 겁나는 거야. 코스피 올랐다, 코인 빠졌다 해도 생활비로 투자하는 사람은 한 번 잘못 들어가면 바로 티가 나거든. 내가 봤을 땐 ‘다 갔다더라’보다 내가 감당할 수 있냐가 먼저야.",
        opinionDisclaimer: "투자 권유가 아닌 생활자 렌즈의 AI 생성 의견입니다.",
        referencedFactIds: ["f-flow-1", "f-flow-2", "f-flow-3"],
      },
      {
        characterId: "uncle",
        lensLabel: "전문가 관점",
        oneLiner: "자금 이동 서사는 강하지만 인과관계는 따로 봐야 해요",
        viewpoint:
          "흥미로운 게요, 가상자산 보유 규모 감소와 코스피 상승이 동시에 보이면 ‘자금 이동’이라는 서사가 생기기 쉽습니다. 하지만 동시에 일어난 현상과 직접 인과관계는 구분해야 해요. 한 가지 짚고 싶은 건 단기 급등 뒤에는 밸류에이션 부담과 환율 같은 변수가 함께 거론된다는 점입니다.",
        opinionDisclaimer: "투자 권유가 아닌 전문가 렌즈의 AI 생성 의견입니다.",
        referencedFactIds: ["f-flow-1", "f-flow-2", "f-flow-3"],
      },
      {
        characterId: "prof",
        lensLabel: "트렌드 관점",
        oneLiner: "커뮤는 벌써 ‘코인 손절하고 국장 가냐’로 갈리는 중이야",
        viewpoint:
          "이거 진짜 반응 갈려. 한쪽은 ‘코인 끝났다’ 하고, 다른 쪽은 ‘코스피 고점에 또 물리는 거 아니냐’고 하거든. 숫자보다도 사람들이 어느 쪽 자산에 FOMO 느끼는지가 더 크게 도는 느낌적인 느낌이야.",
        opinionDisclaimer: "투자 권유가 아닌 트렌드 렌즈의 AI 생성 의견입니다.",
        referencedFactIds: ["f-flow-1", "f-flow-2"],
      },
      {
        characterId: "pm",
        lensLabel: "회의주의자 관점",
        oneLiner: "잠깐, 코인 돈이 전부 코스피로 갔다고 보긴 어려워",
        viewpoint:
          "잠깐, 근데 ‘코인에서 빠진 돈이 다 코스피로 갔다’는 건 출처를 더 봐야 해. 보도에는 가상자산 보유 규모 감소와 코스피 상승이 같이 언급되지만, 그 돈의 이동 경로가 직접 확인됐다는 뜻은 아닐 수 있어. 다른 가능성도 있어. 단기 급등 뒤 반전 가능성도 같이 거론되니까 단정하긴 이르다.",
        opinionDisclaimer: "투자 권유가 아닌 회의주의자 렌즈의 AI 생성 의견입니다.",
        referencedFactIds: ["f-flow-1", "f-flow-2", "f-flow-3"],
      },
    ],
    conversationStarters: [
      "코인 빠진 돈이 정말 코스피로 간 거야?",
      "지금 너무 빨리 올라서 거품 아니야?",
      "단기 급등 뒤 변수는 뭐가 있어?",
    ],
  },
];

export function getMockIssueById(id: string): Issue | undefined {
  return mockIssues.find((i) => i.id === id);
}
