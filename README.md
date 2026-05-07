# 이슈캐스트 프로토타입

같은 이슈를 4명의 시각으로 30초 안에 짚고, 더 궁금하면 그 시각의 캐릭터와 가볍게 대화하는 모바일 이슈 앱입니다.

## 현재 제품 구조

- **30초 카드**: 제목, 한 줄 요약, 핵심 사실, 출처 라벨로 빠르게 맥락을 잡습니다.
- **4가지 렌즈**: 생활자(민철), 전문가(수진 교수), 트렌드(지오), 회의주의자(도윤)가 같은 사실 위에 다른 정보 레이어를 얹습니다.
- **비논쟁 대화**: 찬반·점수·댓글 없이 캐릭터의 시각 안에서 짧게 대화합니다.
- **오늘 새로 본 것**: 대화 종료 시 새로 본 시각을 카드로 저장합니다.
- **로컬 우선 저장**: 인사이트 카드, 반응, 본 이슈 기록은 `localStorage`에 저장됩니다.

## 기술 스택

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Gemini API 연동용 Route Handler

## 실행

```bash
npm ci
npm run dev
```

브라우저에서 `http://localhost:3000`을 엽니다.

## 검증

```bash
npm run lint
npm run build
```

## 주요 파일

- `refactor/01_product_structure.md`: 제품 방향성 결정 사항
- `refactor/02_character_persona_prompts.md`: 최신 4렌즈 캐릭터 프롬프트 원문
- `src/lib/types.ts`: 도메인 타입
- `src/lib/characters.ts`: 4명 캐릭터 정의
- `src/lib/prompts.ts`: 실제 LLM 시스템 프롬프트
- `src/lib/mock-data.ts`: 6개 시드 이슈, 팩트, 출처, 캐릭터 관점
- `src/app/api/chat/reply/route.ts`: 캐릭터 답변 Route Handler
- `src/app/api/chat/insight/route.ts`: "오늘 새로 본 것" 카드 생성 Route Handler

`prompt/` 폴더의 기존 세대·성격 프레임 프롬프트는 레거시 추적용으로 보존되어 있으며, 현재 런타임은 `src/lib/prompts.ts`를 사용합니다.
