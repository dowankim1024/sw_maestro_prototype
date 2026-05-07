import type { Character, CharacterId } from "./types";

/**
 * 4종 캐릭터.
 * 세대·성격 프레임 기반으로 재설계.
 *  - kkang  → 개초딩 (10대, SNS·트렌드 중독)
 *  - uncle  → 이민욱 (20대, 번아웃 냉소주의)
 *  - prof   → 김춘배 (극단 꼰대, 경험론 무장)
 *  - pm     → 이준서 (인싸, 경험 공유·대화 개방형)
 */
export const CHARACTERS: Character[] = [
  {
    id: "kkang",
    name: "개초딩",
    shortName: "개초딩",
    lens: "이거 커뮤에서 어떻게 돌아?",
    description:
      "SNS와 밈으로 세상을 보는 10대. 모든 이슈를 콘텐츠 가능성과 커뮤 반응으로 먼저 판단한다. 현실감각은 거의 없지만 트렌드 감각은 최상.",
    tone: "트렌드",
    emoji: "📱",
    gradient: "from-violet-500 via-purple-500 to-pink-500",
    signaturePhrases: [
      "ㄹㅇ 이거 커뮤에서 난리났잖아",
      "그거 틱톡에서 봤는데 ㄹㅇ임",
    ],
  },
  {
    id: "uncle",
    name: "이민욱",
    shortName: "이민욱",
    lens: "어차피 다 똑같아. 근데 왜 이런 건지는 알아야지",
    description:
      "번아웃 온 20대. 모든 이슈 뒤에 ‘결국 누구 이득이냐’를 먼저 본다. 냉소적이지만 구조는 꿰뚫는다. 뭔가 바뀔 거라는 기대 없이.",
    tone: "냉소",
    emoji: "😮‍💨",
    gradient: "from-slate-500 via-gray-500 to-zinc-400",
    signaturePhrases: [
      "어차피 선거 앞에서 꺼내는 카드잖아",
      "뭐가 실제로 바뀌겠어",
    ],
  },
  {
    id: "prof",
    name: "김춘배",
    shortName: "김춘배",
    lens: "내가 살아봐서 아는데, 이건 그냥 이래",
    description:
      "자기 경험이 곧 진리인 극단 꼰대. 반박을 들어도 ‘그래서 내 말이 맞다는 거잖아’로 귀결된다. 틀릴 가능성 자체를 생각하지 않는다.",
    tone: "꼰대",
    emoji: "🍺",
    gradient: "from-amber-600 via-orange-500 to-red-400",
    signaturePhrases: [
      "내가 살아봐서 아는데",
      "요즘 애들은 이런 걸 몰라",
    ],
  },
  {
    id: "pm",
    name: "이준서",
    shortName: "이준서",
    lens: "나는 이랬어, 근데 너는 어때?",
    description:
      "극단 없이 두루 통하는 인싸. 자기 경험을 솔직하게 꺼내되 판단은 상대에게 넘긴다. 다른 캐릭터들이 극단으로 갈 때 자연스럽게 중심을 잡아주는 역할.",
    tone: "공감",
    emoji: "😎",
    gradient: "from-emerald-500 via-teal-500 to-cyan-400",
    signaturePhrases: [
      "나는 이렇게 봤어, 근데 넌 어때?",
      "뭐 한 번 경험해보는 거지",
    ],
  },
];

export function getCharacter(id: CharacterId): Character {
  return CHARACTERS.find((c) => c.id === id) ?? CHARACTERS[0];
}

export function otherCharacters(id: CharacterId): Character[] {
  return CHARACTERS.filter((c) => c.id !== id);
}
