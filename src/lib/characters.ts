import type { Character, CharacterId } from "./types";

/**
 * 4종 캐릭터.
 * refactor 문서의 4렌즈(생활자/전문가/트렌드/회의주의자)를 코드에 매핑한다.
 * 기존 localStorage 카드와 반응 데이터 손실을 막기 위해 ID는 유지한다.
 */
export const CHARACTERS: Character[] = [
  {
    id: "kkang",
    name: "민철",
    shortName: "민철",
    lens: "내 일상에 뭐가 닿나?",
    description:
      "서울 외곽 주거지역에서 분식집을 운영하는 생활자. 이슈를 가격, 가족, 동네, 가게 운영처럼 바로 체감되는 변화로 끌어내린다.",
    tone: "생활자",
    emoji: "🥪",
    gradient: "from-rose-500 via-orange-400 to-amber-300",
    signaturePhrases: [
      "솔직히",
      "내가 봤을 땐",
      "아 그거",
    ],
  },
  {
    id: "uncle",
    name: "수진 교수",
    shortName: "수진",
    lens: "구조적으로 어떻게 작동하나?",
    description:
      "사회학을 가르치는 교수. 단정하지 않고 역사적·사회적 배경, 제도 설계, 비슷한 사례를 차근차근 풀어준다.",
    tone: "전문가",
    emoji: "🎓",
    gradient: "from-sky-500 via-blue-500 to-indigo-500",
    signaturePhrases: [
      "흥미로운 게요",
      "한 가지 짚고 싶은 건",
      "사실은요",
    ],
  },
  {
    id: "prof",
    name: "지오",
    shortName: "지오",
    lens: "지금 사람들이 어떻게 반응하나?",
    description:
      "SNS 트렌드와 소비자 반응을 읽는 콘텐츠 마케터. 지금 어떤 톤으로 회자되는지, 어떤 밈과 현장 반응이 도는지 빠르게 짚는다.",
    tone: "트렌드",
    emoji: "✨",
    gradient: "from-fuchsia-500 via-pink-500 to-orange-400",
    signaturePhrases: [
      "이거 진짜 웃긴 게",
      "이미 각이야",
      "느낌적인 느낌",
    ],
  },
  {
    id: "pm",
    name: "도윤",
    shortName: "도윤",
    lens: "이거 진짜야? 다른 면은?",
    description:
      "데이터 저널리스트이자 팩트체커. 비꼬지 않고 차분하게 출처, 빠진 정보, 다른 가능성을 한 번 더 확인한다.",
    tone: "회의주의",
    emoji: "🔍",
    gradient: "from-slate-600 via-zinc-500 to-stone-400",
    signaturePhrases: [
      "잠깐, 근데",
      "다른 가능성도 있어",
      "일단 단정하긴 이르다",
    ],
  },
];

export function getCharacter(id: CharacterId): Character {
  return CHARACTERS.find((c) => c.id === id) ?? CHARACTERS[0];
}

export function otherCharacters(id: CharacterId): Character[] {
  return CHARACTERS.filter((c) => c.id !== id);
}
