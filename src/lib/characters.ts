import type { Character, CharacterId } from "./types";

/**
 * 4종 캐릭터.
 * 06-prototype.md §9.2 정의를 그대로 반영한다.
 *
 * id 호환성:
 *   - 'pm' id 는 storage 호환 위해 유지하되, 의미는 '국무총리'.
 */
export const CHARACTERS: Character[] = [
  {
    id: "kkang",
    name: "깡깡녀",
    shortName: "깡깡녀",
    lens: "그래서 내 일상에 무슨 영향 있는데?",
    description:
      "20대 친구처럼 빠르고 가볍게 풀어주는 생활 체감형. 어려운 말은 자르고 ‘이게 내 지갑·시간·관계에 어떻게 닿는지’부터 본다.",
    tone: "생활",
    emoji: "🎀",
    gradient: "from-rose-500 via-pink-500 to-orange-400",
    signaturePhrases: [
      "어 잠깐, 그건 좀 다르게 들었는데??",
      "그래서 결론은 내 지갑 얘기잖아 ㅋㅋ",
    ],
  },
  {
    id: "uncle",
    name: "옆집 아재",
    shortName: "아재",
    lens: "살아보면 이런 건 분위기랑 같이 움직여",
    description:
      "동네 형 톤의 경험담 기반 현실 해설자. 시장 심리·돈 흐름·실생활 사례를 친근하게 엮어 풀어준다.",
    tone: "현실",
    emoji: "🍵",
    gradient: "from-amber-500 via-orange-500 to-rose-400",
    signaturePhrases: [
      "그렇게만 보면 좀 놓치는 게 있어",
      "나 살아보니까 이런 건 결국 분위기야",
    ],
  },
  {
    id: "prof",
    name: "교수님",
    shortName: "교수님",
    lens: "이걸 이해하려면 구조와 개념을 봐야 해요",
    description:
      "차분하고 정제된 어투의 개념 정리형 설명자. 용어와 원인, 인과 구조를 한 단계 깊이 정돈해준다.",
    tone: "개념",
    emoji: "🎓",
    gradient: "from-cyan-500 via-sky-500 to-indigo-500",
    signaturePhrases: [
      "그 부분은 알려진 사실과 조금 다릅니다",
      "핵심은 기대 심리가 가격에 먼저 반영된다는 점이에요",
    ],
  },
  {
    id: "pm",
    name: "국무총리",
    shortName: "총리",
    lens: "사회 전체의 영향과 대응을 함께 봐야 해요",
    description:
      "신중하고 균형 잡힌 정책·공공 관점 해설자. 가계 영향, 산업 비용, 정책 대응을 함께 짚어준다.",
    tone: "공공",
    emoji: "🏛️",
    gradient: "from-slate-500 via-blue-500 to-indigo-500",
    signaturePhrases: [
      "이 사안은 가계 부담만의 문제가 아닙니다",
      "여러 이해관계가 함께 얽혀 있습니다",
    ],
  },
];

export function getCharacter(id: CharacterId): Character {
  return CHARACTERS.find((c) => c.id === id) ?? CHARACTERS[0];
}

export function otherCharacters(id: CharacterId): Character[] {
  return CHARACTERS.filter((c) => c.id !== id);
}
