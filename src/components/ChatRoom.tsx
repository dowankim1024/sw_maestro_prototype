"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getCharacter } from "@/lib/characters";
import { generateCharacterReply, getAngle } from "@/lib/services";
import {
  QUICK_PROMPTS,
  quickPromptToText,
  type CharacterId,
  type ChatTurn,
  type Issue,
  type QuickPrompt,
} from "@/lib/types";
import { DisclaimerNotice } from "./DisclaimerNotice";
import { FactBadge } from "./FactBadge";
import { SuggestedQuestionChips } from "./SuggestedQuestionChips";

interface Props {
  issue: Issue;
  characterId: CharacterId;
  onExit: () => void;
  onFinish: (turns: ChatTurn[]) => Promise<void> | void;
}

/**
 * 캐릭터 대화 화면.
 *  - 추천 질문 칩 노출
 *  - 사실/의견 라벨 사용
 *  - 종료 버튼은 항상 보임
 *  - 출처 보기 토글
 */
export function ChatRoom({ issue, characterId, onExit, onFinish }: Props) {
  const character = getCharacter(characterId);
  const angle = getAngle(issue, characterId);

  const [turns, setTurns] = useState<ChatTurn[]>(() => initialTurns(issue, characterId));
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [showSources, setShowSources] = useState(false);
  const [finishing, setFinishing] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [turns.length]);

  const userTurnCount = useMemo(
    () => turns.filter((t) => t.role === "user").length,
    [turns],
  );

  async function send(rawText: string) {
    const text = rawText.trim();
    if (!text || pending) return;

    const userTurn: ChatTurn = {
      id: `u-${Date.now()}`,
      role: "user",
      text,
      createdAt: new Date().toISOString(),
    };
    const next = [...turns, userTurn];
    setTurns(next);
    setInput("");
    setPending(true);

    const reply = await generateCharacterReply({
      issue,
      characterId,
      userText: text,
      history: next,
    });

    const charTurn: ChatTurn = {
      id: `c-${Date.now()}`,
      role: "character",
      text: reply.text,
      degraded: reply.degraded,
      degradedReason: reply.degradedReason,
      createdAt: new Date().toISOString(),
    };
    setTurns([...next, charTurn]);
    setPending(false);
  }

  function pickQuick(qp: QuickPrompt) {
    const text = quickPromptToText(qp);
    setInput(text);
  }

  async function finish() {
    if (finishing) return;
    setFinishing(true);
    await onFinish(turns);
  }

  return (
    <section className="flex h-[calc(100vh-72px)] flex-col gap-3 sm:h-[calc(100vh-88px)]">
      {/* 상단 — 캐릭터 + 이슈 맥락 고정 바 */}
      <header className="card-surface flex items-center gap-3 p-3 sm:p-4">
        <button
          onClick={onExit}
          className="rounded-full border border-[var(--border)] bg-white px-2 py-1 text-xs text-[var(--muted)] hover:border-[var(--border-strong)]"
          aria-label="뒤로"
        >
          ←
        </button>

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-base shadow-sm ${character.gradient}`}
          aria-hidden
        >
          <span className="rounded-full bg-white/85 px-1.5 py-[2px]">
            {character.emoji}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h2 className="truncate text-sm font-bold text-[var(--foreground)]">
              {character.name}
            </h2>
            <span className="rounded-full border border-[var(--border-strong)] bg-[var(--background)] px-2 py-[1px] text-[10px] font-semibold text-[var(--muted)]">
              {character.tone}
            </span>
          </div>
          <p className="truncate text-[11px] text-[var(--muted)]">
            #{issue.category} · {issue.shortTitle}
          </p>
        </div>

        <button
          onClick={finish}
          disabled={finishing || userTurnCount < 1}
          className="shrink-0 rounded-xl border border-[var(--border)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {finishing ? "정리 중…" : "오늘 새로 본 것"}
        </button>
      </header>

      {/* 면책 + 출처 토글 */}
      <div className="flex flex-col gap-2 px-1 sm:flex-row sm:items-center sm:gap-3">
        <DisclaimerNotice issue={issue} size="sm" className="flex-1" />
        <button
          onClick={() => setShowSources((v) => !v)}
          className="shrink-0 rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-[11px] font-semibold text-[var(--muted)] transition hover:border-[var(--border-strong)] hover:text-[var(--foreground)]"
        >
          {showSources ? "출처 닫기" : `출처 ${issue.sources.length}건 보기`}
        </button>
      </div>

      {showSources && (
        <div className="card-surface space-y-2 p-3">
          {issue.sources.map((s) => (
            <a
              key={s.id}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-[12px] hover:border-[var(--accent)]"
            >
              <span className="font-semibold text-[var(--foreground)]">
                {s.title}
              </span>
              <span className="ml-2 text-[var(--muted)]">{s.publisher}</span>
            </a>
          ))}
        </div>
      )}

      {/* 메시지 영역 */}
      <div
        ref={scrollRef}
        className="card-surface flex-1 overflow-y-auto p-3 sm:p-4"
      >
        <div className="space-y-3">
          {/* 캐릭터 시작 카드 (관점 미리보기) */}
          {angle && (
            <CharacterAngleBubble
              characterName={character.name}
              avatarGradient={character.gradient}
              avatarEmoji={character.emoji}
              oneLiner={angle.oneLiner}
              viewpoint={angle.viewpoint}
              opinionDisclaimer={angle.opinionDisclaimer}
            />
          )}

          {turns.map((t) => (
            <Bubble key={t.id} turn={t} characterName={character.name} characterGradient={character.gradient} characterEmoji={character.emoji} />
          ))}

          {pending && <Typing characterName={character.name} characterEmoji={character.emoji} characterGradient={character.gradient} />}
        </div>
      </div>

      {/* 추천 질문 칩 (사용자 발화 전에만 추천) */}
      {userTurnCount === 0 && (
        <SuggestedQuestionChips
          questions={issue.conversationStarters}
          onPick={(q) => send(q)}
          label="이렇게 물어볼래?"
          disabled={pending}
          className="px-1"
        />
      )}

      {/* 빠른 프롬프트 */}
      <div className="flex flex-wrap gap-1.5 px-1">
        {QUICK_PROMPTS.map((qp) => (
          <button
            key={qp}
            type="button"
            disabled={pending}
            onClick={() => pickQuick(qp)}
            className="rounded-full border border-[var(--border)] bg-white px-2.5 py-1 text-[11px] font-medium text-[var(--muted)] transition hover:border-[var(--border-strong)] hover:text-[var(--foreground)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {qp}
          </button>
        ))}
      </div>

      {/* 입력 */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="card-surface flex items-end gap-2 p-2"
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send(input);
            }
          }}
          placeholder={`${character.name}에게 던져보세요. (Enter로 전송)`}
          rows={1}
          className="max-h-32 min-h-[40px] flex-1 resize-none rounded-xl border border-[var(--border)] bg-[var(--background-elev)] px-3 py-2 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
        />
        <button
          type="submit"
          disabled={pending || !input.trim()}
          className="rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#d44141] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? "…" : "보내기"}
        </button>
      </form>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Sub components
// ---------------------------------------------------------------------------

function initialTurns(issue: Issue, characterId: CharacterId): ChatTurn[] {
  const character = getCharacter(characterId);
  const now = new Date().toISOString();
  return [
    {
      id: `sys-${Date.now()}`,
      role: "system",
      text: `‘${issue.shortTitle}’에 대해 ${character.name}의 시각으로 가볍게 이야기 나눠요. 30초로 끝나도 좋고, 더 묻고 싶으면 이어가도 돼요.`,
      createdAt: now,
    },
  ];
}

function CharacterAngleBubble({
  characterName,
  avatarGradient,
  avatarEmoji,
  oneLiner,
  viewpoint,
  opinionDisclaimer,
}: {
  characterName: string;
  avatarGradient: string;
  avatarEmoji: string;
  oneLiner: string;
  viewpoint: string;
  opinionDisclaimer: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <Avatar gradient={avatarGradient} emoji={avatarEmoji} />
      <div className="max-w-[85%] space-y-2">
        <div className="rounded-2xl rounded-tl-md border border-[var(--border)] bg-white px-4 py-3 shadow-sm">
          <div className="mb-1 flex items-center gap-1.5 text-[11px]">
            <span className="font-semibold text-[var(--foreground)]">
              {characterName}
            </span>
            <FactBadge kind="opinion" />
          </div>
          <p className="text-[14px] font-semibold leading-snug text-[var(--foreground)]">
            “{oneLiner}”
          </p>
          <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--foreground)]/85">
            {viewpoint}
          </p>
        </div>
        <p className="px-1 text-[11px] italic text-[var(--muted)]">
          {opinionDisclaimer}
        </p>
      </div>
    </div>
  );
}

function Bubble({
  turn,
  characterName,
  characterGradient,
  characterEmoji,
}: {
  turn: ChatTurn;
  characterName: string;
  characterGradient: string;
  characterEmoji: string;
}) {
  if (turn.role === "system") {
    return (
      <div className="mx-auto max-w-md rounded-xl border border-dashed border-[var(--border)] bg-[var(--background)]/50 px-3 py-2 text-center text-[11px] text-[var(--muted)]">
        {turn.text}
      </div>
    );
  }
  if (turn.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-2xl rounded-tr-md bg-[var(--accent)] px-4 py-2.5 text-[14px] leading-relaxed text-white shadow-sm">
          {turn.text}
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-start gap-2">
      <Avatar gradient={characterGradient} emoji={characterEmoji} />
      <div className="max-w-[85%] space-y-1">
        <div
          className={`rounded-2xl rounded-tl-md border px-4 py-2.5 text-[14px] leading-relaxed shadow-sm ${
            turn.degraded
              ? "border-amber-300/70 bg-amber-50 text-[var(--foreground)]"
              : "border-[var(--border)] bg-white text-[var(--foreground)]"
          }`}
        >
          <div className="mb-1 flex items-center gap-1.5 text-[11px]">
            <span className="font-semibold text-[var(--foreground)]">
              {characterName}
            </span>
            <FactBadge kind="opinion" />
            {turn.degraded && (
              <span className="rounded-full bg-amber-100 px-1.5 py-[1px] text-[10px] text-amber-800">
                임시 답변
              </span>
            )}
          </div>
          <p className="whitespace-pre-line">{turn.text}</p>
        </div>
      </div>
    </div>
  );
}

function Avatar({ gradient, emoji }: { gradient: string; emoji: string }) {
  return (
    <span
      aria-hidden
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br shadow-sm ${gradient}`}
    >
      <span className="rounded-full bg-white/85 px-1 py-[1px] text-[12px]">
        {emoji}
      </span>
    </span>
  );
}

function Typing({
  characterName,
  characterEmoji,
  characterGradient,
}: {
  characterName: string;
  characterEmoji: string;
  characterGradient: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <Avatar gradient={characterGradient} emoji={characterEmoji} />
      <div className="rounded-2xl rounded-tl-md border border-[var(--border)] bg-white px-4 py-2 text-[12px] text-[var(--muted)] shadow-sm">
        <span className="font-semibold text-[var(--foreground)]">
          {characterName}
        </span>
        <span className="ml-2 inline-flex gap-0.5">
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--muted-2)]" />
          <span
            className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--muted-2)]"
            style={{ animationDelay: "120ms" }}
          />
          <span
            className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--muted-2)]"
            style={{ animationDelay: "240ms" }}
          />
        </span>
      </div>
    </div>
  );
}
