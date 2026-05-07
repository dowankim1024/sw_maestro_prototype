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
        lensLabel: "SNS·커뮤 관점",
        oneLiner: "ㄹㅇ 주유소 갔다가 멘붕 왔다는 글 커뮤에 폭발했잖아",
        viewpoint:
          "이거 커뮤에서 엄청 난리났거든 ㅋㅋ 기름값 올랐다고 멘붕 왔다는 글이 폭발했어. 근데 생각해보면 택시비, 배달비 다 따라 오를 수 있으니까 진짜 내 지갑이랑 연결된 얘기야.",
        opinionDisclaimer: "10대 SNS 관점의 해석입니다.",
        referencedFactIds: ["f-oil-1", "f-oil-2"],
      },
      {
        characterId: "uncle",
        lensLabel: "20대 냉소 관점",
        oneLiner: "어차피 오를 때는 빠르고 내릴 때는 느려. 뭐가 바뀌겠어요",
        viewpoint:
          "중동에서 뭔 일 나면 기름값 오르는 패턴이 어차피 반복이에요. 근데 오를 때는 빠르고 내릴 때는 느리잖아요. 결국 소비자만 부담하는 구조인데 뭐가 바뀌겠어요.",
        opinionDisclaimer: "20대 번아웃 관점의 해석입니다.",
        referencedFactIds: ["f-oil-3"],
      },
      {
        characterId: "prof",
        lensLabel: "경험자 관점",
        oneLiner: "내가 살아봐서 아는데, 기름값은 한번 오르면 잘 안 내려",
        viewpoint:
          "내가 살아봐서 아는데 기름값은 한번 올라가면 쉽게 안 내려와. 중동 분위기가 조금만 불안해도 가격이 먼저 올라버리는 거고. 이게 다 시장 원리야. 어쩔 수 없는 거라고.",
        opinionDisclaimer: "경험 기반의 주관적 해석입니다.",
        referencedFactIds: ["f-oil-1", "f-oil-2", "f-oil-3"],
      },
      {
        characterId: "pm",
        lensLabel: "인싸 관점",
        oneLiner: "나도 주유소 갔다가 깜짝 놀랐어. 체감이 확 오더라",
        viewpoint:
          "나 어제 주유소 갔다가 좀 놀랐어. 뭔가 확 올랐다 싶더라고. 중동 분위기 때문이라는데 뭐 그런 것들이 다 연결돼 있는 것 같긴 해. 너는 요즘 체감 어때?",
        opinionDisclaimer: "개인 경험 기반의 해석입니다.",
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
        lensLabel: "SNS·커뮤 관점",
        oneLiner: "이거 틱톡에서 AI가 혼자 다 한다고 ㄹㅇ 터졌잖아",
        viewpoint:
          "커뮤에서 ‘AI가 내 일 다 뺏어간다’ 글이 폭발했는데 ㄹㅇ임? 틱톡에서도 AI가 혼자 코딩하는 영상 엄청 돌고 있거든. 근데 봐보면 그냥 자동화 도구인 거 아니야? 내 일자리 진짜 없어지는 건지 모르겠어 ㅋㅋ",
        opinionDisclaimer: "10대 SNS 관점의 해석입니다.",
        referencedFactIds: ["f-ai-1", "f-ai-2"],
      },
      {
        characterId: "uncle",
        lensLabel: "20대 냉소 관점",
        oneLiner: "어차피 AI도 결국 인건비 줄이려고 만든 거잖아요",
        viewpoint:
          "어차피 AI 에이전트도 결국 인건비 줄이려는 거예요. 기업 입장에선 좋고 일하는 사람 입장에선 불안하고. 와 에이전트 시대 온다 하는 얘기들, 결국 누구 이득인지 보면 답 나와요. 뭐가 바뀌겠어요.",
        opinionDisclaimer: "20대 번아웃 관점의 해석입니다.",
        referencedFactIds: ["f-ai-1", "f-ai-3"],
      },
      {
        characterId: "prof",
        lensLabel: "경험자 관점",
        oneLiner: "내가 살아봐서 아는데, 기술이 일 뺏는다는 말은 항상 있었어",
        viewpoint:
          "내가 살아봐서 아는데, 자동화가 일 뺏는다는 말은 40년 전부터 있었어. 공장 자동화 때도 그랬고, 인터넷 나왔을 때도 그랬고. 근데 결국 새 일자리 생기더라고. 이번도 마찬가지야. 호들갑 떨 거 없어.",
        opinionDisclaimer: "경험 기반의 주관적 해석입니다.",
        referencedFactIds: ["f-ai-2", "f-ai-3"],
      },
      {
        characterId: "pm",
        lensLabel: "인싸 관점",
        oneLiner: "나도 업무에 AI 써봤는데, 생각보다 편하긴 하더라",
        viewpoint:
          "나 요즘 보고서 쓸 때 AI 도구 쓰고 있어. 뭔가 간단한 거 자동화해주니까 시간이 꽤 줄더라. 근데 중요한 판단은 아직 직접 하는 게 낫더라고. 너는 써봤어, 아직 안 써봤어?",
        opinionDisclaimer: "개인 경험 기반의 해석입니다.",
        referencedFactIds: ["f-ai-1", "f-ai-2"],
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
        lensLabel: "SNS·커뮤 관점",
        oneLiner: "ㄹㅇ 청년 월세 검색 터진 거 내 주변도 다 알더라",
        viewpoint:
          "커뮤에서 청년 월세 지원 글이 폭발했거든 ㅋㅋ ‘나 받을 수 있냐’가 다들 궁금해서. 신청 기간 없어진 게 크긴 한데 자격 조건 꼼꼼히 봐야 할 것 같아. 아무나 주는 건 아닌 것 같거든.",
        opinionDisclaimer: "10대 SNS 관점의 해석입니다.",
        referencedFactIds: ["f-rent-1"],
      },
      {
        characterId: "uncle",
        lensLabel: "20대 냉소 관점",
        oneLiner: "어차피 보조금 들어오면 집주인이 월세 올리더라고요",
        viewpoint:
          "어차피 정부가 보조금 주면 집주인이 슬쩍 올려버리는 게 반복이에요. 지원 받는 사람한테 다 가는 게 아니라 임대료에 흡수되는 거죠. 공급이 안 늘면 구조가 안 바뀌는데 뭐가 바뀌겠어요.",
        opinionDisclaimer: "20대 번아웃 관점의 해석입니다.",
        referencedFactIds: ["f-rent-3"],
      },
      {
        characterId: "prof",
        lensLabel: "경험자 관점",
        oneLiner: "내가 살아봐서 아는데, 지원이 늘면 월세도 따라 올라",
        viewpoint:
          "내가 살아봐서 아는데, 정부가 주거 보조금 늘리면 임대 시장이 그걸 다 흡수해버려. 공급을 안 늘리면 어쩔 수 없어. 이게 30년 전부터 반복된 패턴이야. 정책이 문제가 아니라 부동산 구조가 문제야.",
        opinionDisclaimer: "경험 기반의 주관적 해석입니다.",
        referencedFactIds: ["f-rent-2", "f-rent-3"],
      },
      {
        characterId: "pm",
        lensLabel: "인싸 관점",
        oneLiner: "나도 청년 때 지원 신청 놓쳤었는데, 상시로 바뀌는 건 낫겠다",
        viewpoint:
          "나 몇 년 전에 청년 지원 신청 기간 놓쳐서 못 받았어. 상시로 바뀐다니까 그건 편해질 것 같긴 해. 근데 월세 자체가 올라있으면 지원금 체감이 달라지잖아. 너는 어떻게 봐?",
        opinionDisclaimer: "개인 경험 기반의 해석입니다.",
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
        lensLabel: "SNS·커뮤 관점",
        oneLiner: "둘이 같이 쉬면 더 준다고? ㄹㅇ 커뮤에서 핫했잖아",
        viewpoint:
          "커뮤에서 육아휴직 관련 글이 엄청 나오던데 ㄹㅇ. ‘둘이 쉬면 더 준다’는 게 신기하긴 해. 근데 회사에서 눈치보는 게 진짜 문제라는 댓글이 더 많더라고 ㅋㅋ 제도는 있는데 못 쓰는 게 문제인 거 아니야?",
        opinionDisclaimer: "10대 SNS 관점의 해석입니다.",
        referencedFactIds: ["f-leave-1"],
      },
      {
        characterId: "uncle",
        lensLabel: "20대 냉소 관점",
        oneLiner: "어차피 육아휴직 쓰려면 회사 눈치 봐야죠",
        viewpoint:
          "어차피 육아휴직 제도가 좋아도 회사 분위기가 안 되면 못 쓰는 게 현실이에요. 남자 육아휴직은 더 그렇고. 결국 누가 눈치 안 보고 쓸 수 있냐가 핵심인데 제도만 바꾼다고 뭐가 바뀌겠어요.",
        opinionDisclaimer: "20대 번아웃 관점의 해석입니다.",
        referencedFactIds: ["f-leave-2", "f-leave-3"],
      },
      {
        characterId: "prof",
        lensLabel: "경험자 관점",
        oneLiner: "내가 살아봐서 아는데, 돈 준다고 쓰는 게 아니야",
        viewpoint:
          "내가 살아봐서 아는데, 육아휴직은 돈 얼마 준다고 쓰게 되는 게 아니야. 분위기가 돼야지. 우리 때는 쓰면 이상한 사람 됐었어. 지금도 크게 다를 게 없는 직장이 많다고.",
        opinionDisclaimer: "경험 기반의 주관적 해석입니다.",
        referencedFactIds: ["f-leave-2", "f-leave-3"],
      },
      {
        characterId: "pm",
        lensLabel: "인싸 관점",
        oneLiner: "나도 육아휴직 다 못 썼어. 눈치 보여서",
        viewpoint:
          "나 솔직히 다 쓸 수 있는 상황인데 절반만 썼어. 팀 분위기상 더 쓰기가 어렵더라고. 제도는 좋아졌는데 그걸 실제로 쓸 수 있는 분위기는 아직 격차가 있는 것 같아. 너는 어때?",
        opinionDisclaimer: "개인 경험 기반의 해석입니다.",
        referencedFactIds: ["f-leave-1", "f-leave-2"],
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
        lensLabel: "SNS·커뮤 관점",
        oneLiner: "ㄹㅇ 인스타에 보라색 카페 사진 폭발했잖아",
        viewpoint:
          "인스타에 우베 라떼 사진이 엄청 쏟아졌거든 ㄹㅇ. 근데 이게 버터떡 유행 끝나고 바로 또 다음 거잖아 ㅋㅋ 어차피 6개월 뒤엔 또 다른 거 나올 것 같긴 해. 트렌드 사이클이 너무 빠르다.",
        opinionDisclaimer: "10대 SNS 관점의 해석입니다.",
        referencedFactIds: ["f-ube-1", "f-ube-3"],
      },
      {
        characterId: "uncle",
        lensLabel: "20대 냉소 관점",
        oneLiner: "어차피 사진 잘 받는 거 나오면 다 따라가는 구조잖아요",
        viewpoint:
          "어차피 카페 트렌드는 사진 잘 받는 거 나오면 다 따라가는 구조예요. 우베가 보라색이라서 뜨는 거지 맛이 특별히 차별화된 건 아닌 거잖아요. 다음엔 또 다른 색 나올 거고. 반복이에요.",
        opinionDisclaimer: "20대 번아웃 관점의 해석입니다.",
        referencedFactIds: ["f-ube-2", "f-ube-3"],
      },
      {
        characterId: "prof",
        lensLabel: "경험자 관점",
        oneLiner: "내가 살아봐서 아는데, 음식 유행은 늘 이렇게 빠르게 돌아",
        viewpoint:
          "내가 살아봐서 아는데, 음식 유행은 옛날부터 빠르게 돌았어. 젤라또, 마카롱, 탕후루... 다 그렇게 왔다 가는 거야. 카페들도 알고 하는 거고. 그냥 다음 거 기다리면 돼.",
        opinionDisclaimer: "경험 기반의 주관적 해석입니다.",
        referencedFactIds: ["f-ube-2"],
      },
      {
        characterId: "pm",
        lensLabel: "인싸 관점",
        oneLiner: "나도 지난주에 우베 먹어봤는데, 색이 진짜 예쁘더라",
        viewpoint:
          "나 지난주에 친구들이랑 우베 카페 갔는데 색이 엄청 예쁘긴 해. 맛은 뭐 고구마 비슷한 느낌? 유행이 빠른 건 알겠는데 일단 신기해서 한번 가봤어. 너는 가봤어?",
        opinionDisclaimer: "개인 경험 기반의 해석입니다.",
        referencedFactIds: ["f-ube-1", "f-ube-3"],
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
        lensLabel: "SNS·커뮤 관점",
        oneLiner: "코인에서 돈 빠져서 주식 갔다는 게 커뮤에서 난리잖아",
        viewpoint:
          "코인 망했다 주식 간다 글이 커뮤에 엄청 올라왔거든 ㄹㅇ. 근데 솔직히 내가 그 돈이 어디 갔는지 어떻게 알겠어 ㅋㅋ 전문가들도 의견이 다 달라서 뭘 믿어야 할지 모르겠다.",
        opinionDisclaimer: "투자 권유가 아닌 10대 SNS 관점의 해석입니다.",
        referencedFactIds: ["f-flow-1", "f-flow-2"],
      },
      {
        characterId: "uncle",
        lensLabel: "20대 냉소 관점",
        oneLiner: "어차피 자금 이동 분석은 다 사후 해석이에요",
        viewpoint:
          "어차피 ‘코인에서 코스피로 자금 이동’ 분석은 다 사후 해석이에요. 오르면 들어왔다 하고 빠지면 나갔다 하는 거잖아요. 결국 이런 분석 믿고 따라가면 손해는 개인이 보는 거예요.",
        opinionDisclaimer: "투자 권유가 아닌 20대 번아웃 관점의 해석입니다.",
        referencedFactIds: ["f-flow-2", "f-flow-3"],
      },
      {
        characterId: "prof",
        lensLabel: "경험자 관점",
        oneLiner: "내가 살아봐서 아는데, 시장 분석은 다 맞고 틀리는 거야",
        viewpoint:
          "내가 살아봐서 아는데, 자금 이동 분석이라는 게 다 쌓이고 나서 하는 말이야. 실시간으론 아무도 몰라. 코인 올랐다 빠지고, 주식 올랐다 빠지고 이걸 반복해온 거야. 분석가들도 다 틀려.",
        opinionDisclaimer: "투자 권유가 아닌 경험 기반의 주관적 해석입니다.",
        referencedFactIds: ["f-flow-1", "f-flow-2"],
      },
      {
        characterId: "pm",
        lensLabel: "인싸 관점",
        oneLiner: "나도 작년에 비슷한 분석 들었는데, 결과는 달랐어",
        viewpoint:
          "나 작년에도 비슷한 자금 이동 분석 나왔을 때 관심 갖고 봤는데, 실제론 그렇게 딱 이동하진 않더라고. 뭔가 서로 연결은 돼 있는 것 같긴 한데 직선으로 보긴 어려운 것 같아. 너는 어떻게 보고 있어?",
        opinionDisclaimer: "투자 권유가 아닌 개인 경험 기반의 해석입니다.",
        referencedFactIds: ["f-flow-2", "f-flow-3"],
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
