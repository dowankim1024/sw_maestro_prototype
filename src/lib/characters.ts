import type { Character, CharacterId } from "./types";

export const CHARACTERS: Character[] = [
  {
    id: "kkang",
    name: "깡깡녀",
    shortName: "깡깡녀",
    oneLiner: "솔직 친구",
    description:
      "팩트만 짧고 굵게. 답답한 이슈 한방에 정리해주는 친한 친구. 욕설 X, 공격 X — 다정한 직설.",
    emoji: "🔥",
    gradient: "from-rose-500 via-pink-500 to-orange-400",
    tone: "직설_공감",
  },
  {
    id: "uncle",
    name: "옆집아재",
    shortName: "옆집 아재",
    oneLiner: "생활 밀착형",
    description:
      "30년 살아본 시각. 통계보다 동네 이야기·내 회사 사례로 풀어준다. 점심시간 옆 팀 차장님 톤.",
    emoji: "🍵",
    gradient: "from-amber-500 via-orange-500 to-rose-400",
    tone: "생활밀착",
  },
  {
    id: "prof",
    name: "교수님",
    shortName: "교수님",
    oneLiner: "데이터·근거",
    description:
      "친절한 교수님처럼. 정의·연구·맥락을 부드럽게 짚어준다. 사용자가 알고 있는 디테일을 채워주는 역할.",
    emoji: "🎓",
    gradient: "from-cyan-500 via-sky-500 to-indigo-500",
    tone: "학술",
  },
  {
    id: "pm",
    name: "국무총리",
    shortName: "총리",
    oneLiner: "정책·제도",
    description:
      "한 사람을 넘어 사회 전체에서 이 결정이 어떤 의미인지. 정중한 행정 톤, 단·장기 영향까지.",
    emoji: "🏛️",
    gradient: "from-slate-500 via-zinc-500 to-stone-400",
    tone: "정책",
  },
];

export function getCharacter(id: CharacterId): Character {
  return CHARACTERS.find((c) => c.id === id) ?? CHARACTERS[0];
}
