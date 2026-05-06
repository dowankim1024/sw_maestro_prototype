"use client";

import { useEffect, useState } from "react";
import { PersonaPicker } from "./PersonaPicker";
import { getPersona } from "@/lib/personas";
import type {
  Difficulty,
  PersonaId,
  TrendIssue,
  UserStance,
} from "@/lib/types";

const STANCES: UserStance[] = ["찬성", "반대", "AI 자동 선택"];
const DIFFICULTIES: Difficulty[] = ["쉬움", "보통", "어려움"];
const ROUND_OPTIONS: (3 | 5 | 7)[] = [3, 5, 7];

export function DebateSetupModal({
  issue,
  open,
  initialPersonaId,
  onClose,
  onStart,
}: {
  issue: TrendIssue | null;
  open: boolean;
  initialPersonaId?: PersonaId;
  onClose: () => void;
  onStart: (config: {
    issue: TrendIssue;
    userStance: UserStance;
    difficulty: Difficulty;
    totalRounds: 3 | 5 | 7;
    personaId: PersonaId;
  }) => void;
}) {
  const [stance, setStance] = useState<UserStance>("찬성");
  const [difficulty, setDifficulty] = useState<Difficulty>("보통");
  const [rounds, setRounds] = useState<3 | 5 | 7>(5);
  const [personaId, setPersonaId] = useState<PersonaId>(
    initialPersonaId ?? "sohn",
  );

  useEffect(() => {
    if (open) {
      setStance("찬성");
      setDifficulty(getPersona(initialPersonaId ?? "sohn").recommendedDifficulty);
      setRounds(5);
      setPersonaId(initialPersonaId ?? "sohn");
    }
  }, [open, issue?.id, initialPersonaId]);

  if (!open || !issue) return null;

  const persona = getPersona(personaId);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-6">
      <div className="fade-up max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-3xl border border-[var(--border)] bg-[var(--background-elev)] sm:max-h-[88vh] sm:rounded-2xl">
        <div className="border-b border-[var(--border)] p-5">
          <div className="text-[11px] uppercase tracking-widest text-[var(--muted)]">
            토론 시작 설정
          </div>
          <h3 className="mt-1 text-base font-semibold text-white sm:text-lg">
            {issue.title}
          </h3>
          <p className="mt-1 text-xs text-[var(--muted)]">
            누구와 토론할지 먼저 고르세요. 봇마다 말투와 강도가 다릅니다.
          </p>
        </div>

        <div className="space-y-5 p-5">
          <Field
            label={
              <span>
                상대 봇 선택{" "}
                <span className="text-[10px] font-normal text-[var(--muted)]">
                  (4명)
                </span>
              </span>
            }
          >
            <PersonaPicker
              value={personaId}
              onChange={setPersonaId}
              variant="card"
            />
            <div className="mt-3 rounded-xl border border-[var(--border)] bg-white/5 p-3 text-xs leading-relaxed text-white/85">
              <span className="mr-1.5 text-base">{persona.emoji}</span>
              <span className="font-semibold">{persona.name}</span>
              <span className="text-[var(--muted)]"> · {persona.tagline}</span>
              <p className="mt-1 text-[12px] text-white/75">
                {persona.description}
              </p>
            </div>
          </Field>

          <Field label="내 입장">
            <div className="grid grid-cols-3 gap-2">
              {STANCES.map((s) => (
                <ToggleButton
                  key={s}
                  active={stance === s}
                  onClick={() => setStance(s)}
                >
                  {s}
                </ToggleButton>
              ))}
            </div>
            <p className="mt-1.5 text-[11px] text-[var(--muted)]">
              ‘AI 자동 선택’을 고르면 AI가 반대 입장을 잡고 토론을 진행합니다.
            </p>
          </Field>

          <Field label="난이도">
            <div className="grid grid-cols-3 gap-2">
              {DIFFICULTIES.map((d) => (
                <ToggleButton
                  key={d}
                  active={difficulty === d}
                  onClick={() => setDifficulty(d)}
                >
                  {d}
                </ToggleButton>
              ))}
            </div>
          </Field>

          <Field label="토론 라운드">
            <div className="grid grid-cols-3 gap-2">
              {ROUND_OPTIONS.map((r) => (
                <ToggleButton
                  key={r}
                  active={rounds === r}
                  onClick={() => setRounds(r)}
                >
                  {r}라운드
                </ToggleButton>
              ))}
            </div>
          </Field>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-[var(--border)] bg-[var(--background-card)]/60 p-4">
          <button
            onClick={onClose}
            className="rounded-lg border border-[var(--border)] bg-white/5 px-4 py-2 text-sm text-white/80 hover:text-white"
          >
            취소
          </button>
          <button
            onClick={() =>
              onStart({
                issue,
                userStance: stance,
                difficulty,
                totalRounds: rounds,
                personaId,
              })
            }
            className="rounded-lg bg-[var(--accent)] px-5 py-2 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(255,77,109,0.7)] hover:bg-[#ff6680]"
          >
            토론방 입장
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 text-xs font-semibold text-white/90">{label}</div>
      {children}
    </div>
  );
}

function ToggleButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-lg border px-3 py-2 text-sm transition",
        active
          ? "border-[var(--accent)]/60 bg-[var(--accent)]/15 text-white"
          : "border-[var(--border)] bg-white/5 text-white/70 hover:text-white",
      ].join(" ")}
    >
      {children}
    </button>
  );
}
