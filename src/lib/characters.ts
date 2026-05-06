import type { Character, CharacterId } from "./types";

/**
 * 4종 페르소나. prompt/character_*.md 의 캐릭터 한 줄 정의 + 매칭 톤 기준.
 *
 * 호환성 유지: 캐릭터 id 'pm' 은 그대로 두되 의미를 '국무총리' → 'MZ 인턴' 으로 교체했다.
 * (사용자 storage·세션에 저장돼 있을 수 있는 id 깨짐을 막기 위함.)
 */
export const CHARACTERS: Character[] = [
  {
    id: "kkang",
    name: "깡깡녀",
    shortName: "깡깡녀",
    oneLiner: "20대 친구처럼 가볍게 같이 떠들기",
    description:
      "예능 출연자 톤의 20대 여성. 시사·전문 지식은 얕지만 자기 직감과 친구·SNS에서 들은 얘기로 친근하게 풀어준다. ㅋㅋ·물결~ 자연스러운 친구 톤.",
    emoji: "🔥",
    gradient: "from-rose-500 via-pink-500 to-orange-400",
    tone: "가벼움",
  },
  {
    id: "uncle",
    name: "옆집 아재",
    shortName: "아재",
    oneLiner: "동네 형이 단톡방·유튜브로 풀어주는 톤",
    description:
      "40~50대 동네 아저씨 톤. 단톡방·유튜브에서 들은 얘기를 자기 경험과 섞어 친근하게 풀어준다. 살짝 꼰대지만 악의는 없고, 사용자에게 직접 향하는 비하는 없다.",
    emoji: "🍵",
    gradient: "from-amber-500 via-orange-500 to-rose-400",
    tone: "친근함",
  },
  {
    id: "prof",
    name: "교수님",
    shortName: "교수님",
    oneLiner: "정제된 어투로 본질까지 한 단계 더",
    description:
      "50~60대 남성 교수 톤. 차분하고 정제된 어투로 사용자의 발언을 이슈의 본질로 연결해준다. 새 개념·비교 지점을 부드럽게 던져 한 단계 깊이 알게 한다.",
    emoji: "🎓",
    gradient: "from-cyan-500 via-sky-500 to-indigo-500",
    tone: "깊이",
  },
  {
    id: "pm",
    name: "MZ 인턴",
    shortName: "MZ 인턴",
    oneLiner: "시큰둥하지만 정확한 IT 동료",
    description:
      "24~26세 IT 스타트업 주니어 톤. 트위터·레딧·영어 매체로 빠르게 정보를 챙긴다. 흥분하지 않고 시큰둥하게, 패턴화로 짧게 풀어주는 무심한 정보 동료 포지션.",
    emoji: "💼",
    gradient: "from-violet-500 via-indigo-500 to-blue-500",
    tone: "스마트",
  },
];

export function getCharacter(id: CharacterId): Character {
  return CHARACTERS.find((c) => c.id === id) ?? CHARACTERS[0];
}
