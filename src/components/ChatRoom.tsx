"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getCharacter } from "@/lib/characters";
import {
  buildInsight,
  generateCharacterReply,
  quickReactionToText,
  startChat,
} from "@/lib/services";
import {
  QUICK_REACTIONS,
  type Character,
  type CharacterId,
  type ChatInsight,
  type ChatTurn,
  type Mood,
  type QuickReaction,
  type TrendIssue,
} from "@/lib/types";

export function ChatRoom({
  issue,
  characterId,
  onExit,
  onFinish,
}: {
  issue: TrendIssue;
  characterId: CharacterId;
  onExit: () => void;
  onFinish: (insight: ChatInsight) => void;
}) {
  const character = getCharacter(characterId);
  const session = useMemo(
    () => startChat({ issue, characterId }),
    [issue, characterId],
  );

  const [turns, setTurns] = useState<ChatTurn[]>(session.openingTurns);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [ended, setEnded] = useState(false);
  const [lastUserText, setLastUserText] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [turns, typing]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || typing || ended) return;

    const userTurn: ChatTurn = {
      id: `u-${Date.now()}`,
      role: "user",
      text: trimmed,
      createdAt: new Date().toISOString(),
    };
    const next = [...turns, userTurn];
    setTurns(next);
    setInput("");
    setLastUserText(trimmed);
    setTyping(true);

    const reply = await generateCharacterReply({
      issue,
      characterId,
      userText: trimmed,
      history: next,
    });

    const typingMs = 600 + Math.min(1400, reply.text.length * 6);
    window.setTimeout(() => {
      const charTurn: ChatTurn = {
        id: `c-${Date.now()}`,
        role: "character",
        mood: reply.mood,
        text: reply.text,
        capturedFact: reply.capturedFact,
        degraded: reply.degraded,
        degradedReason: reply.degradedReason,
        createdAt: new Date().toISOString(),
      };
      setTurns((prev) => [...prev, charTurn]);
      setTyping(false);
    }, typingMs);
  }

  /**
   * 마지막 사용자 발언을 그대로 다시 보낸다 (degraded 응답 재시도용).
   * 이미 추가된 사용자 턴은 두고, 직전 캐릭터 폴백 턴만 제거한 뒤 재호출한다.
   */
  async function retryLastUserTurn() {
    if (!lastUserText || typing || ended) return;
    setTyping(true);

    const trimmedHistory = (() => {
      const last = turns[turns.length - 1];
      if (last?.role === "character" && last.degraded) {
        return turns.slice(0, -1);
      }
      return turns;
    })();
    setTurns(trimmedHistory);

    const reply = await generateCharacterReply({
      issue,
      characterId,
      userText: lastUserText,
      history: trimmedHistory,
    });

    const typingMs = 400 + Math.min(1200, reply.text.length * 6);
    window.setTimeout(() => {
      const charTurn: ChatTurn = {
        id: `c-retry-${Date.now()}`,
        role: "character",
        mood: reply.mood,
        text: reply.text,
        capturedFact: reply.capturedFact,
        degraded: reply.degraded,
        degradedReason: reply.degradedReason,
        createdAt: new Date().toISOString(),
      };
      setTurns((prev) => [...prev, charTurn]);
      setTyping(false);
    }, typingMs);
  }

  function handleQuick(qr: QuickReaction) {
    send(quickReactionToText(qr));
  }

  async function handleEnd() {
    if (ended) return;
    setEnded(true);
    const insight = await buildInsight({
      issue,
      characterId,
      turns,
    });
    onFinish(insight);
  }

  // 인사이트 누적 미리보기 (우측 미니바에서 사용)
  const captured = useMemo(
    () =>
      turns
        .map((t) => t.capturedFact)
        .filter((s): s is string => !!s)
        .slice(-3),
    [turns],
  );

  return (
    <div className="flex h-[calc(100vh-5rem)] flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--background-card)]">
      {/* 상단 바 */}
      <div className="flex items-center gap-3 border-b border-[var(--border)] p-3 sm:p-4">
        <button
          onClick={onExit}
          className="rounded-md border border-[var(--border)] bg-white/5 px-2.5 py-1 text-xs text-white/80 hover:text-white"
        >
          ← 나가기
        </button>
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <div
            className={`grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br text-base shadow-md ${character.gradient}`}
          >
            {character.emoji}
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-white">
              {character.name}{" "}
              <span className="text-[var(--muted)]">
                · {character.oneLiner}
              </span>
            </div>
            <div className="line-clamp-1 text-[11px] text-[var(--muted)]">
              {issue.title}
            </div>
          </div>
        </div>
        <button
          onClick={handleEnd}
          className="rounded-md bg-white/10 px-2.5 py-1 text-xs text-white/90 hover:bg-white/15"
        >
          오늘은 여기까지
        </button>
      </div>

      {/* 인사이트 미리보기 (옵션) */}
      {captured.length > 0 && (
        <div className="border-b border-[var(--border)] bg-[var(--background-elev)]/60 px-4 py-2 text-[11px] text-[var(--muted)]">
          오늘 짚은 포인트 ·{" "}
          <span className="text-white/85">{captured.join(" / ")}</span>
        </div>
      )}

      {/* 메시지 영역 */}
      <div
        ref={scrollRef}
        className="flex-1 space-y-4 overflow-y-auto p-3 sm:p-5"
      >
        {turns.map((t, idx) => {
          const isLastCharTurn =
            t.role === "character" && idx === turns.length - 1;
          return (
            <Bubble
              key={t.id}
              turn={t}
              character={character}
              onRetry={
                isLastCharTurn && t.degraded && !typing && !ended
                  ? retryLastUserTurn
                  : undefined
              }
            />
          );
        })}
        {typing && <TypingBubble character={character} />}
      </div>

      {/* 퀵 리액션 + 입력 */}
      <div className="border-t border-[var(--border)] bg-[var(--background-elev)] p-3 sm:p-4">
        {/* 사용자가 아직 입력 안 했으면 conversationStarters 추천 */}
        {!turns.some((t) => t.role === "user") &&
          issue.conversationStarters &&
          issue.conversationStarters.length > 0 && (
            <div className="-mx-1 mb-2 flex gap-1.5 overflow-x-auto px-1 pb-1">
              {issue.conversationStarters.slice(0, 3).map((q, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => send(q)}
                  disabled={typing || ended}
                  className="shrink-0 rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/10 px-3 py-1.5 text-[12px] text-white/95 transition hover:border-[var(--accent)]/70 disabled:opacity-40"
                >
                  💬 {q}
                </button>
              ))}
            </div>
          )}

        <div className="-mx-1 mb-2 flex gap-1.5 overflow-x-auto px-1 pb-1">
          {QUICK_REACTIONS.map((qr) => (
            <button
              key={qr}
              type="button"
              onClick={() => handleQuick(qr)}
              disabled={typing || ended}
              className="shrink-0 rounded-full border border-[var(--border)] bg-white/5 px-3 py-1.5 text-[12px] text-white/85 transition hover:border-white/20 hover:text-white disabled:opacity-40"
            >
              {qr}
            </button>
          ))}
        </div>

        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
            disabled={typing || ended}
            rows={1}
            placeholder={
              ended
                ? "오늘 대화는 마무리됐어요."
                : "편하게 한 줄 던져보세요. (Enter 전송)"
            }
            className="min-h-[44px] w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--background-card)] p-3 text-sm text-white placeholder:text-[var(--muted)] focus:border-[var(--accent)]/60 focus:outline-none disabled:opacity-50"
          />
          <button
            onClick={() => send(input)}
            disabled={typing || ended || !input.trim()}
            className="h-[44px] rounded-xl bg-[var(--accent)] px-4 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(255,77,109,0.7)] transition hover:bg-[#ff6680] disabled:opacity-40"
          >
            보내기
          </button>
        </div>
      </div>
    </div>
  );
}

function Bubble({
  turn,
  character,
  onRetry,
}: {
  turn: ChatTurn;
  character: Character;
  /** 정의되어 있으면 degraded 안내 하단에 '다시 보내볼까?' 버튼 노출 */
  onRetry?: () => void;
}) {
  if (turn.role === "system") {
    return (
      <div className="mx-auto max-w-md rounded-xl border border-dashed border-[var(--border)] bg-white/5 px-3 py-2 text-center text-[11px] text-[var(--muted)]">
        {turn.text}
      </div>
    );
  }
  const isUser = turn.role === "user";
  const showDegraded = !isUser && turn.degraded === true;
  return (
    <div
      className={`fade-up flex w-full ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div className="flex max-w-[88%] gap-2 sm:max-w-[78%]">
        {!isUser && (
          <div
            className={`mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br text-base shadow-md ${character.gradient}`}
            aria-label={character.name}
          >
            {character.emoji}
          </div>
        )}
        <div
          className={[
            "rounded-2xl px-4 py-2.5 text-[14px] leading-relaxed whitespace-pre-wrap",
            isUser
              ? "bg-[var(--accent)]/15 border border-[var(--accent)]/30 text-white"
              : showDegraded
                ? "bg-white/5 border border-amber-400/30 text-white/90"
                : "bg-white/5 border border-[var(--border)] text-white/90",
          ].join(" ")}
        >
          <div className="mb-1 flex items-center gap-2 text-[10px] text-[var(--muted)]">
            <span>{isUser ? "나" : character.shortName}</span>
            {!isUser && turn.mood && <MoodTag mood={turn.mood} />}
          </div>
          <div>{turn.text}</div>
          {showDegraded && (
            <div className="mt-2 flex flex-wrap items-center gap-2 border-t border-amber-400/20 pt-2 text-[11px]">
              <span className="inline-flex items-center gap-1 text-amber-200/90">
                <span aria-hidden>⚠️</span>
                <span>지금 잠깐 혼잡해서 임시 답변이에요.</span>
              </span>
              {onRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  className="rounded-full border border-amber-400/40 bg-amber-400/10 px-2 py-0.5 text-[11px] font-medium text-amber-100 transition hover:border-amber-300/70 hover:bg-amber-400/20"
                >
                  다시 보내볼까?
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MoodTag({ mood }: { mood: Mood }) {
  const map: Record<
    Mood,
    { label: string; color: string }
  > = {
    공감: {
      label: "공감",
      color: "bg-rose-400/15 text-rose-200 border-rose-400/30",
    },
    시각공유: {
      label: "다른 시각",
      color: "bg-cyan-400/15 text-cyan-200 border-cyan-400/30",
    },
    지식체크: {
      label: "디테일 보태기",
      color: "bg-amber-400/15 text-amber-200 border-amber-400/30",
    },
  };
  const m = map[mood];
  return (
    <span
      className={`inline-flex items-center rounded-full border px-1.5 py-0.5 text-[9px] font-medium ${m.color}`}
    >
      {m.label}
    </span>
  );
}

function TypingBubble({ character }: { character: Character }) {
  return (
    <div className="flex w-full justify-start">
      <div className="flex gap-2">
        <div
          className={`mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br text-base shadow-md ${character.gradient}`}
        >
          {character.emoji}
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-white/5 px-4 py-2.5 text-sm text-white/80">
          <span className="inline-flex items-center gap-1">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/70" />
            <span
              className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/70"
              style={{ animationDelay: "120ms" }}
            />
            <span
              className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/70"
              style={{ animationDelay: "240ms" }}
            />
          </span>
          <span className="ml-2 text-[var(--muted)]">
            {character.shortName} 입력 중…
          </span>
        </div>
      </div>
    </div>
  );
}
