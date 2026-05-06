"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  calculateHeatScore,
  generateDebateReply,
  judgeDebate,
  startDebateSession,
} from "@/lib/services";
import { getPersona } from "@/lib/personas";
import type {
  DebateConfig,
  DebateMessage,
  DebateResult,
  TrendIssue,
  UserStance,
  Difficulty,
  PersonaId,
  Persona,
} from "@/lib/types";

export function DebateRoom({
  issue,
  initialUserStance,
  initialDifficulty,
  initialRounds,
  initialPersonaId,
  onExit,
  onFinish,
}: {
  issue: TrendIssue;
  initialUserStance: UserStance;
  initialDifficulty: Difficulty;
  initialRounds: 3 | 5 | 7;
  initialPersonaId: PersonaId;
  onExit: () => void;
  onFinish: (result: DebateResult) => void;
}) {
  const session = useMemo(
    () =>
      startDebateSession({
        issue,
        userStance: initialUserStance,
        difficulty: initialDifficulty,
        totalRounds: initialRounds,
        personaId: initialPersonaId,
      }),
    [
      issue,
      initialUserStance,
      initialDifficulty,
      initialRounds,
      initialPersonaId,
    ],
  );
  const persona = getPersona(initialPersonaId);

  const [config] = useState<DebateConfig>(session.config);
  const [messages, setMessages] = useState<DebateMessage[]>(
    session.openingMessages,
  );
  const [round, setRound] = useState<number>(1);
  const [input, setInput] = useState("");
  const [heat, setHeat] = useState(0);
  const [heatHistory, setHeatHistory] = useState<number[]>([0]);
  const [aiTyping, setAiTyping] = useState(false);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [ended, setEnded] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, aiTyping]);

  const heatLevel: "정상" | "주의" | "과열" =
    heat >= 70 ? "과열" : heat >= 40 ? "주의" : "정상";

  function handleSend() {
    const text = input.trim();
    if (!text || aiTyping || ended) return;

    const heatRes = calculateHeatScore({ previousHeat: heat, message: text });
    setHeat(heatRes.heat);
    setHeatHistory((prev) => [...prev, heatRes.heat]);
    if (heatRes.deltas.length) {
      setWarnings(heatRes.deltas);
    } else {
      setWarnings([]);
    }

    const userMsg: DebateMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: text,
      round,
      createdAt: new Date().toISOString(),
    };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");

    // 시뮬레이션된 AI 응답
    setAiTyping(true);
    const replyText = generateDebateReply({
      issue,
      userMessage: text,
      userStance: config.resolvedUserStance,
      aiStance: config.aiStance,
      difficulty: config.difficulty,
      round,
      totalRounds: config.totalRounds,
      heat: heatRes.heat,
      personaId: config.personaId,
    });

    const typingMs = 700 + Math.min(1800, replyText.length * 8);
    window.setTimeout(() => {
      const aiMsg: DebateMessage = {
        id: `a-${Date.now()}`,
        role: "ai",
        content: replyText,
        round,
        createdAt: new Date().toISOString(),
      };
      const after = [...nextMessages, aiMsg];
      setMessages(after);
      setAiTyping(false);

      if (round >= config.totalRounds) {
        // 마지막 라운드 종료 → 자동 판정
        finalize(after);
      } else {
        setRound((r) => r + 1);
      }
    }, typingMs);
  }

  function finalize(allMessages: DebateMessage[]) {
    if (ended) return;
    setEnded(true);
    const result = judgeDebate({
      issue,
      config,
      messages: allMessages,
      finalHeat: heat,
      heatHistory,
    });
    onFinish(result);
  }

  function handleEnd() {
    finalize(messages);
  }

  return (
    <div className="flex h-[calc(100vh-5rem)] flex-col rounded-2xl border border-[var(--border)] bg-[var(--background-card)]">
      {/* 상단 바 */}
      <div className="flex flex-wrap items-center gap-3 border-b border-[var(--border)] p-4">
        <button
          onClick={onExit}
          className="rounded-md border border-[var(--border)] bg-white/5 px-2.5 py-1 text-xs text-white/80 hover:text-white"
        >
          ← 나가기
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-[var(--muted)]">
            <span>vs</span>
            <span
              className={`inline-flex items-center gap-1 rounded-full bg-gradient-to-r px-2 py-0.5 text-[10px] font-bold text-white ${persona.gradient}`}
            >
              {persona.emoji} {persona.shortName}
            </span>
          </div>
          <h2 className="truncate text-sm font-semibold text-white sm:text-base">
            {issue.title}
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-[11px]">
          <Pill>
            <span className="text-[var(--muted)]">라운드</span>
            <span className="font-semibold text-white">
              {Math.min(round, config.totalRounds)}/{config.totalRounds}
            </span>
          </Pill>
          <Pill>
            <span className="text-[var(--muted)]">난이도</span>
            <span className="font-semibold text-white">
              {config.difficulty}
            </span>
          </Pill>
          <Pill>
            <span className="text-[var(--muted)]">내 입장</span>
            <span className="font-semibold text-emerald-300">
              {config.resolvedUserStance}
            </span>
          </Pill>
          <Pill>
            <span className="text-[var(--muted)]">AI 입장</span>
            <span className="font-semibold text-rose-300">
              {config.aiStance}
            </span>
          </Pill>

          <HeatPill heat={heat} level={heatLevel} />
          <button
            onClick={handleEnd}
            className="rounded-md bg-white/10 px-2.5 py-1 text-white/90 hover:bg-white/15"
          >
            토론 종료
          </button>
        </div>
      </div>

      {/* 과열 경고 */}
      {warnings.length > 0 && heat >= 40 && (
        <div className="border-b border-amber-400/20 bg-amber-400/5 px-4 py-2 text-[12px] text-amber-200">
          ⚠ {warnings.join(" / ")} — 인신공격보다는 근거 중심으로 이어가보세요.
        </div>
      )}

      {/* 메시지 영역 */}
      <div
        ref={scrollRef}
        className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6"
      >
        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} persona={persona} />
        ))}
        {aiTyping && <TypingBubble persona={persona} />}
      </div>

      {/* 입력 */}
      <div className="border-t border-[var(--border)] bg-[var(--background-elev)] p-3 sm:p-4">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            disabled={aiTyping || ended}
            rows={2}
            placeholder={
              ended
                ? "토론이 종료되었습니다."
                : "내 주장을 입력하세요. 수치·사례·출처를 함께 적으면 점수가 올라갑니다. (Enter: 전송)"
            }
            className="min-h-[64px] w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--background-card)] p-3 text-sm text-white placeholder:text-[var(--muted)] focus:border-[var(--accent)]/60 focus:outline-none disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={aiTyping || ended || !input.trim()}
            className="h-[64px] rounded-xl bg-[var(--accent)] px-4 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(255,77,109,0.7)] transition hover:bg-[#ff6680] disabled:opacity-40"
          >
            전송
          </button>
        </div>
        <div className="mt-1.5 flex items-center justify-between text-[11px] text-[var(--muted)]">
          <span>욕설/혐오/인신공격은 과열도가 빠르게 상승해요.</span>
          <span>
            과열도 <span className="font-semibold text-white">{heat}</span> /
            100 ({heatLevel})
          </span>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({
  message,
  persona,
}: {
  message: DebateMessage;
  persona: Persona;
}) {
  if (message.role === "system") {
    return (
      <div className="mx-auto max-w-2xl rounded-xl border border-dashed border-[var(--border)] bg-white/5 px-3 py-2 text-center text-xs text-[var(--muted)]">
        {message.content}
      </div>
    );
  }
  const isUser = message.role === "user";
  return (
    <div
      className={[
        "fade-up flex w-full",
        isUser ? "justify-end" : "justify-start",
      ].join(" ")}
    >
      <div className="flex max-w-[85%] gap-2 sm:max-w-[75%]">
        {!isUser && (
          <div
            className={`mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br text-base shadow-md ${persona.gradient}`}
            aria-label={persona.name}
          >
            {persona.emoji}
          </div>
        )}
        <div
          className={[
            "rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap",
            isUser
              ? "bg-[var(--accent)]/15 border border-[var(--accent)]/30 text-white"
              : "bg-white/5 border border-[var(--border)] text-white/90",
          ].join(" ")}
        >
          <div className="mb-1 flex items-center gap-2 text-[11px] text-[var(--muted)]">
            <span>
              {isUser ? "나" : persona.shortName} · 라운드 {message.round}
            </span>
          </div>
          <div>{message.content}</div>
        </div>
        {isUser && (
          <div className="mt-1 h-8 w-8 shrink-0 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-400 text-center text-xs font-bold leading-8 text-white">
            ME
          </div>
        )}
      </div>
    </div>
  );
}

function TypingBubble({ persona }: { persona: Persona }) {
  return (
    <div className="flex w-full justify-start">
      <div className="flex gap-2">
        <div
          className={`mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br text-base shadow-md ${persona.gradient}`}
        >
          {persona.emoji}
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-white/5 px-4 py-3 text-sm text-white/80">
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
            {persona.shortName}의 반론 정리 중…
          </span>
        </div>
      </div>
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-white/5 px-2.5 py-1">
      {children}
    </span>
  );
}

function HeatPill({
  heat,
  level,
}: {
  heat: number;
  level: "정상" | "주의" | "과열";
}) {
  const color =
    level === "과열"
      ? "border-rose-400/40 bg-rose-400/10 text-rose-300"
      : level === "주의"
        ? "border-amber-400/40 bg-amber-400/10 text-amber-300"
        : "border-emerald-400/30 bg-emerald-400/10 text-emerald-300";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 ${color}`}
    >
      <span className="text-[var(--muted)]">과열도</span>
      <span className="font-semibold">
        {heat} · {level}
      </span>
    </span>
  );
}
