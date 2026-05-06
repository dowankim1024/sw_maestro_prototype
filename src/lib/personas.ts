import type { Persona, PersonaId } from "./types";

export const PERSONAS: Persona[] = [
  {
    id: "sohn",
    name: "심야 토론 진행자",
    shortName: "100분 사회자",
    tagline: "차분히, 단단하게.",
    description:
      "베테랑 시사 토론 진행자 톤. 핵심 쟁점을 정리하고 근거를 단계적으로 요구합니다. 감정보다는 사실관계와 논리 구조를 묻습니다.",
    emoji: "🎙️",
    gradient: "from-slate-500 via-zinc-500 to-stone-400",
    recommendedDifficulty: "보통",
    tone: {
      intro: [
        "정리하고 가겠습니다.",
        "쟁점을 분리해보죠.",
        "사실관계부터 짚겠습니다.",
      ],
      fillers: ["근거", "출처", "정의", "전제", "조건"],
      closer: [
        "그 점에 대해 어떻게 생각하시는지 들어보고 싶습니다.",
        "이어서 본인의 입장을 정리해주시기 바랍니다.",
      ],
      sharpness: 0.55,
    },
  },
  {
    id: "econ",
    name: "서울대 경제학도",
    shortName: "경제학도",
    tagline: "데이터와 모델로.",
    description:
      "수치·논문·정책 보고서를 즐겨 인용하는 학구적 톤. 한계와 가정을 끊임없이 짚고 거시·미시 영향을 분리해 분석합니다.",
    emoji: "📊",
    gradient: "from-cyan-500 via-sky-500 to-indigo-500",
    recommendedDifficulty: "어려움",
    tone: {
      intro: [
        "관련 통계부터 보겠습니다.",
        "탄력성 관점에서 접근하면,",
        "외부효과를 고려하면,",
      ],
      fillers: [
        "한계비용",
        "기회비용",
        "외부효과",
        "탄력성",
        "장기/단기",
        "메타분석",
      ],
      closer: [
        "이 가정이 깨지는 시나리오는 어떻게 보십니까?",
        "본인 주장의 전제 조건을 명확히 해주시면 좋겠습니다.",
      ],
      sharpness: 0.7,
    },
  },
  {
    id: "kkang",
    name: "깡깡이 형",
    shortName: "깡깡이",
    tagline: "직설, 그러나 인신공격은 NO.",
    description:
      "시원하게 들이미는 직설 화법. 두루뭉술한 표현을 가장 싫어하고, ‘그래서 결론’을 빠르게 요구합니다. 거친 어휘는 쓰지 않습니다.",
    emoji: "🔥",
    gradient: "from-rose-500 via-orange-500 to-amber-400",
    recommendedDifficulty: "어려움",
    tone: {
      intro: [
        "자, 솔직히 말해서.",
        "결론부터 가자.",
        "돌려 말하지 말고.",
      ],
      fillers: [
        "현실적으로",
        "팩트로",
        "그래서 결론이 뭔데",
        "한 줄로",
      ],
      closer: [
        "그래서 본인 입장 한 줄로 다시 정리해줘.",
        "근거 한 개만 더, 짧게.",
      ],
      sharpness: 0.85,
    },
  },
  {
    id: "teen",
    name: "철없는 10대",
    shortName: "10대 학생",
    tagline: "솔직하지만 어설픈 논리.",
    description:
      "지식보다 감각으로 말하는 10대 톤. 가끔 비약하지만 의외의 관점을 던집니다. 사용자가 차근히 가르치듯 토론하기 좋은 상대입니다.",
    emoji: "🎒",
    gradient: "from-fuchsia-500 via-pink-500 to-rose-400",
    recommendedDifficulty: "쉬움",
    tone: {
      intro: [
        "근데 그건 좀…",
        "솔직히요,",
        "엥, 그래도",
      ],
      fillers: ["그냥", "느낌상", "주변 보면", "내 친구가"],
      closer: [
        "근데 그게 진짜 맞아요?",
        "왜 그렇게 생각해요?",
      ],
      sharpness: 0.35,
    },
  },
];

export function getPersona(id: PersonaId): Persona {
  return PERSONAS.find((p) => p.id === id) ?? PERSONAS[0];
}
