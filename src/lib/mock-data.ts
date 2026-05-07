import type { Issue } from "./types";

/**
 * 이슈캐스트 시드 이슈 (06-prototype.md §10, §23 기준).
 *
 * 콘텐츠 원칙:
 *  - 30초 안에 핵심을 잡을 수 있는 분량.
 *  - 사실(facts)은 ‘단정 회피’ 표현으로 작성하고 출처 ID에 매핑.
 *  - 캐릭터 관점(characterAngles)은 4명 모두 동일한 사실 기반 위에서 다른 시각.
 *  - safetyLevel: 정치·정책 갈등은 'sensitive', 일반 트렌드는 'normal'.
 *
 * 출처는 가상 매체명을 사용한다 (프로토타입 단계). 실제 발행 시에는
 * 운영자 검수 도구를 통해 검증된 출처로 교체된다.
 */

const ISO = (d: string) => new Date(d).toISOString();

export const mockIssues: Issue[] = [
  // ──────────────────────────────────────────────────────────────────────────
  // 1. 기름값 — 06 §23 의 기본 시나리오
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
        lensLabel: "내 지갑 관점",
        oneLiner: "결국 내 택시·배달·여행값에 슉 닿는 얘기야",
        viewpoint:
          "이거 해외 뉴스처럼 보여도 은근 내 지갑 얘기야. 기름값 오르면 택시비, 배달비, 항공권까지 분위기가 같이 움직일 수 있거든. 지금 바로 폭등은 아닌데 체감은 분명히 와.",
        opinionDisclaimer: "캐릭터의 생활 체감 해석입니다.",
        referencedFactIds: ["f-oil-1", "f-oil-2"],
      },
      {
        characterId: "uncle",
        lensLabel: "시장 분위기",
        oneLiner: "큰일 안 터져도 분위기만으로 가격이 먼저 움직여",
        viewpoint:
          "이런 건 실제로 큰일이 터지기 전에도 가격이 먼저 반응할 때가 많아. 시장은 불안한 낌새만 보여도 미리 움직이는 편이거든. 그래서 단순 ‘사고 났냐 안 났냐’만 보면 놓쳐.",
        opinionDisclaimer: "캐릭터의 경험 기반 해석입니다.",
        referencedFactIds: ["f-oil-3"],
      },
      {
        characterId: "prof",
        lensLabel: "구조와 개념",
        oneLiner: "원유 가격, 환율, 위험 기대가 함께 작동하는 구조",
        viewpoint:
          "핵심은 원유 가격과 환율, 그리고 위험 기대가 함께 작동한다는 점입니다. 실제 공급 변화뿐 아니라 시장 심리도 가격에 선반영되는 경향이 있어요. 변수 한 개로 설명하기는 어렵습니다.",
        opinionDisclaimer: "개념 정리는 캐릭터의 해석 영역입니다.",
        referencedFactIds: ["f-oil-1", "f-oil-2", "f-oil-3"],
      },
      {
        characterId: "pm",
        lensLabel: "정책·공공 관점",
        oneLiner: "가계 부담과 산업 비용을 함께 봐야 합니다",
        viewpoint:
          "이 문제는 가계 부담만의 문제가 아닙니다. 유류비는 개인 소비뿐 아니라 물류와 생산 비용에도 영향을 줄 수 있습니다. 단기 충격과 장기 구조를 분리해서 보는 시각이 필요합니다.",
        opinionDisclaimer: "캐릭터의 공공 관점 해석입니다.",
        referencedFactIds: ["f-oil-1", "f-oil-2"],
      },
    ],
    conversationStarters: [
      "이 이슈가 내 생활에 어떻게 닿아?",
      "왜 지금 다시 뜨는 거야?",
      "한 줄로 핵심만 정리해줘.",
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
        lensLabel: "내 일상 관점",
        oneLiner: "결국 ‘내 업무 단순 반복’이 줄 수 있느냐 그거지",
        viewpoint:
          "이거 결국 ‘내가 매일 하는 단순 반복 업무가 줄어드냐’가 핵심이야. 진짜 다 자동화는 아닌데, 여러 단계 한 번에 시키는 게 좀 편해질 거 같긴 해. 지금 당장 일자리 사라지는 얘기는 좀 과장이고.",
        opinionDisclaimer: "캐릭터의 생활 체감 해석입니다.",
        referencedFactIds: ["f-ai-1", "f-ai-2"],
      },
      {
        characterId: "uncle",
        lensLabel: "시장 흐름",
        oneLiner: "기술 사이클은 늘 ‘놀라움 → 익숙함 → 실속’으로 가",
        viewpoint:
          "기술 흐름이 다 그런 식이야. 처음엔 놀랍게 보이고, 다음엔 익숙해지고, 결국엔 실속만 남거든. 단톡방에서 ‘다 바뀐다’ 하는 얘기는 좀 거리 두고 듣는 게 좋아.",
        opinionDisclaimer: "캐릭터의 경험 기반 해석입니다.",
        referencedFactIds: ["f-ai-3"],
      },
      {
        characterId: "prof",
        lensLabel: "구조와 개념",
        oneLiner: "‘대화’와 ‘작업 위임’은 다른 평가 기준이 필요합니다",
        viewpoint:
          "에이전트는 단순 응답 모델과 평가 기준이 달라야 해요. ‘말을 잘하느냐’와 ‘여러 단계를 정확히 끝내느냐’는 다른 문제거든요. 벤치마크 점수만으로 판단하기는 어렵습니다.",
        opinionDisclaimer: "개념 정리는 캐릭터의 해석 영역입니다.",
        referencedFactIds: ["f-ai-2", "f-ai-3"],
      },
      {
        characterId: "pm",
        lensLabel: "정책·공공 관점",
        oneLiner: "산업 변화와 사회 적응 속도를 함께 봐야 합니다",
        viewpoint:
          "에이전트 도입이 빨라질수록 산업 변화 속도와 사회 적응 속도의 격차가 커질 수 있습니다. 일자리 영향, 데이터 보안, 책임 소재까지 함께 논의해야 합니다. 단정보다 설계가 필요한 단계입니다.",
        opinionDisclaimer: "캐릭터의 공공 관점 해석입니다.",
        referencedFactIds: ["f-ai-1", "f-ai-3"],
      },
    ],
    conversationStarters: [
      "에이전트가 챗봇이랑 뭐가 달라?",
      "내 일자리에 진짜 영향 있어?",
      "회사에서 이걸 잘 쓰려면 어떻게 시작해야 해?",
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
        lensLabel: "내 생활 관점",
        oneLiner: "결국 ‘나도 받을 수 있나’가 제일 궁금하잖아",
        viewpoint:
          "솔직히 핵심은 ‘나도 받을 수 있냐’잖아 ㅋㅋ 신청 기간 제한이 사라진다는 게 큰 변화고, 그래서 갑자기 검색이 폭발한 거야. 자세한 자격은 정책 페이지 보고 체크해야 해.",
        opinionDisclaimer: "캐릭터의 생활 체감 해석입니다.",
        referencedFactIds: ["f-rent-1"],
      },
      {
        characterId: "uncle",
        lensLabel: "시장·동네 시각",
        oneLiner: "보조금 들어오면 동네 월세가 슬쩍 따라 오르기도 해",
        viewpoint:
          "지원이 늘면 좋긴 한데, 살아보니까 보조금이 들어오는 동네는 월세가 슬쩍 따라 오르기도 하더라고. 그래서 공급이 같이 안 늘면 지원 효과가 좀 깎이는 게 옛날부터 반복된 패턴이야.",
        opinionDisclaimer: "캐릭터의 경험 기반 해석입니다.",
        referencedFactIds: ["f-rent-3"],
      },
      {
        characterId: "prof",
        lensLabel: "정책 효과 구조",
        oneLiner: "수요 보조와 공급 정책은 함께 움직여야 효과가 큽니다",
        viewpoint:
          "수요 보조만으로 가격을 잡기 어렵다는 점은 일반적으로 알려져 있어요. 공급 확대와 함께 가야 정책 효과가 안정적이에요. 다만 단기 부담을 덜어주는 의미는 분명합니다.",
        opinionDisclaimer: "개념 정리는 캐릭터의 해석 영역입니다.",
        referencedFactIds: ["f-rent-2", "f-rent-3"],
      },
      {
        characterId: "pm",
        lensLabel: "정책·공공 관점",
        oneLiner: "사각지대와 형평성을 함께 점검해야 합니다",
        viewpoint:
          "신청 사각지대를 줄인다는 점에서 의미가 있습니다. 동시에 고용 형태가 다양한 청년층 사이에서 형평성 문제가 제기될 수 있습니다. 후속 보완책이 함께 논의돼야 합니다.",
        opinionDisclaimer: "캐릭터의 공공 관점 해석입니다.",
        referencedFactIds: ["f-rent-1", "f-rent-3"],
      },
    ],
    conversationStarters: [
      "이거 결국 누가 받을 수 있는 거야?",
      "보조금이 월세 시장 가격을 또 올리는 거 아니야?",
      "공공임대를 빨리 늘리는 게 더 낫지 않아?",
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
        lensLabel: "내 일상 관점",
        oneLiner: "혼자 쓸 때보다 같이 쓸 때 혜택이 커지는 구조야",
        viewpoint:
          "한마디로 ‘둘이 같이 쉬면 더 줘요’ 구조야. 혼자 쓸 때보다 같이 쓸 때 혜택이 커지니까 동기 부여 측면이 강해. 다만 자세한 조건은 회사·고용 형태마다 다르니 꼭 확인해야 해.",
        opinionDisclaimer: "캐릭터의 생활 체감 해석입니다.",
        referencedFactIds: ["f-leave-1"],
      },
      {
        characterId: "uncle",
        lensLabel: "현장 분위기",
        oneLiner: "회사 분위기 따라 ‘쓰기 부담’이 다른 게 현실이야",
        viewpoint:
          "제도는 좋아 보여도 막상 회사 분위기 따라 ‘쓰기 부담’이 큰 데가 많아. 살아보면 결국 윗사람이 어떻게 받느냐가 절반이거든. 정책만큼이나 분위기 변화도 같이 가야 효과가 나.",
        opinionDisclaimer: "캐릭터의 경험 기반 해석입니다.",
        referencedFactIds: ["f-leave-2", "f-leave-3"],
      },
      {
        characterId: "prof",
        lensLabel: "정책 구조",
        oneLiner: "현금 인센티브와 문화 변화는 함께 작동해야 합니다",
        viewpoint:
          "현금성 인센티브만으로 출산 결정에 큰 변화를 만들기는 어렵다는 게 일반적인 분석이에요. 가사 분담·근무 환경 변화와 함께 작동할 때 정책 효과가 더 안정적입니다.",
        opinionDisclaimer: "개념 정리는 캐릭터의 해석 영역입니다.",
        referencedFactIds: ["f-leave-2"],
      },
      {
        characterId: "pm",
        lensLabel: "정책·공공 관점",
        oneLiner: "사각지대 청년·자영업자 정책을 함께 봐야 합니다",
        viewpoint:
          "공동 육아 인센티브의 의미는 큽니다. 다만 고용보험 사각지대에 있는 분들에게는 체감이 적을 수 있다는 점이 자주 지적됩니다. 보완 정책이 함께 논의돼야 할 사안입니다.",
        opinionDisclaimer: "캐릭터의 공공 관점 해석입니다.",
        referencedFactIds: ["f-leave-1", "f-leave-3"],
      },
    ],
    conversationStarters: [
      "‘부모가 같이 써야’ 라는 게 무슨 뜻이야?",
      "자영업자나 프리랜서는 결국 못 받는 거야?",
      "이게 출산율 변화에 진짜 영향이 있을까?",
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
        lensLabel: "내 카페 관점",
        oneLiner: "보라색 라떼 인증샷, 결국 사진 잘 받는 게 핵심이지 ㅋㅋ",
        viewpoint:
          "솔직히 보라색이라 사진 잘 받는 게 절반이야 ㅋㅋ 맛도 궁금하긴 한데, 이게 6개월 뒤에 또 다른 색으로 바뀔 거 같아. 유행이 너무 빨라서 따라가기 좀 피곤해.",
        opinionDisclaimer: "캐릭터의 생활 체감 해석입니다.",
        referencedFactIds: ["f-ube-1", "f-ube-3"],
      },
      {
        characterId: "uncle",
        lensLabel: "현장 분위기",
        oneLiner: "동네 카페한테는 반응 빠른 만큼 부담도 커져",
        viewpoint:
          "이런 트렌드는 동네 카페 입장에서는 양날의 검이야. 빨리 따라가면 매출 기회가 되는데, 못 따라가면 손님이 빠지거든. 결국 재고·재료 회전 잘 돌리는 데가 살아남아.",
        opinionDisclaimer: "캐릭터의 경험 기반 해석입니다.",
        referencedFactIds: ["f-ube-2"],
      },
      {
        characterId: "prof",
        lensLabel: "트렌드 구조",
        oneLiner: "SNS 가시성이 메뉴 결정의 핵심 변수로 작동합니다",
        viewpoint:
          "최근 트렌드는 ‘맛’보다 ‘노출’이 메뉴 결정 변수로 더 크게 작동하는 경향이 있어요. 그래서 사이클이 짧아지고, 컬러·식감처럼 시각·감각 자극이 강한 메뉴가 자주 등장합니다.",
        opinionDisclaimer: "개념 정리는 캐릭터의 해석 영역입니다.",
        referencedFactIds: ["f-ube-2", "f-ube-3"],
      },
      {
        characterId: "pm",
        lensLabel: "산업·공공 관점",
        oneLiner: "소상공인 부담과 식품 안전을 함께 봐야 합니다",
        viewpoint:
          "트렌드가 짧아질수록 소상공인 재고 부담이 커질 수 있고, 새 식재료 안전성 검증 속도도 함께 점검돼야 합니다. 트렌드 자체는 자연스러운 흐름이지만 보호 장치는 필요합니다.",
        opinionDisclaimer: "캐릭터의 공공 관점 해석입니다.",
        referencedFactIds: ["f-ube-1", "f-ube-2"],
      },
    ],
    conversationStarters: [
      "‘우베’가 도대체 뭐길래 갑자기 다 팔아?",
      "이런 디저트 유행이 왜 이렇게 빨라진 거야?",
      "결국 누구한테 좋은 일이야?",
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
        lensLabel: "내 지갑 관점",
        oneLiner: "결국 ‘지금 들어가도 돼?’가 제일 궁금하잖아",
        viewpoint:
          "솔직히 다들 궁금한 건 ‘지금 들어가도 돼?’잖아 ㅋㅋ 근데 단기간에 너무 빨리 오른 구간은 늘 조심해야 한대. 자기 돈 들어가는 일이라 더 천천히 보는 게 좋아.",
        opinionDisclaimer: "투자 권유가 아닌 캐릭터의 생활 체감 해석입니다.",
        referencedFactIds: ["f-flow-2", "f-flow-3"],
      },
      {
        characterId: "uncle",
        lensLabel: "시장 분위기",
        oneLiner: "분위기로 오른 자리는 분위기로도 빨리 빠져",
        viewpoint:
          "분위기로 오른 자리는 분위기로도 빨리 빠지는 게 시장이거든. 살아보니까 짧은 기간 강하게 오르면 늘 그 다음 ‘조정’ 얘기가 같이 나와. 무조건 안 좋다는 건 아니고, 흐름이 그래.",
        opinionDisclaimer: "캐릭터의 경험 기반 해석입니다.",
        referencedFactIds: ["f-flow-2", "f-flow-3"],
      },
      {
        characterId: "prof",
        lensLabel: "구조와 개념",
        oneLiner: "‘자금 이동’ 해석은 변수 한두 개로 단정하기 어렵습니다",
        viewpoint:
          "‘코인에서 주식으로’ 같은 직선 해석은 단정하기 어려워요. 환율, 금리, 글로벌 자금 흐름까지 함께 봐야 합니다. 같은 데이터라도 시점에 따라 결론이 바뀔 수 있다는 점은 늘 염두에 둬야 해요.",
        opinionDisclaimer: "개념 정리는 캐릭터의 해석 영역입니다.",
        referencedFactIds: ["f-flow-1", "f-flow-2"],
      },
      {
        characterId: "pm",
        lensLabel: "정책·공공 관점",
        oneLiner: "개인 투자자 보호와 시장 안정이 함께 가야 합니다",
        viewpoint:
          "단기 변동이 커질수록 개인 투자자 손실 누적 가능성이 함께 커집니다. 시장 안정성과 정보 비대칭 해소를 동시에 짚어야 할 시점입니다. 단정 표현은 피하되, 위험 신호는 분명히 공유돼야 합니다.",
        opinionDisclaimer: "캐릭터의 공공 관점 해석입니다.",
        referencedFactIds: ["f-flow-3"],
      },
    ],
    conversationStarters: [
      "코인 빠진 돈이 정말 코스피로 간 거야?",
      "지금 너무 빨리 올라서 거품 아니야?",
      "그럼 일반 사람은 뭘 보고 판단해야 해?",
    ],
  },
];

export function getMockIssueById(id: string): Issue | undefined {
  return mockIssues.find((i) => i.id === id);
}
