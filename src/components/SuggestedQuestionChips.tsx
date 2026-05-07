"use client";

interface Props {
  questions: string[];
  onPick: (text: string) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * 06 §16.5 — 추천 질문 칩.
 * 사용자가 직접 질문하지 못해도 시작할 수 있도록 진입 질문을 칩으로 노출.
 */
export function SuggestedQuestionChips({
  questions,
  onPick,
  label = "이렇게 물어볼래?",
  disabled = false,
  className = "",
}: Props) {
  if (questions.length === 0) return null;

  return (
    <div className={className}>
      {label && (
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--muted)]">
          {label}
        </p>
      )}
      <div className="flex flex-wrap gap-1.5">
        {questions.map((q, i) => (
          <button
            key={`${i}-${q}`}
            type="button"
            disabled={disabled}
            onClick={() => onPick(q)}
            className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-white px-3 py-1.5 text-xs font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span aria-hidden className="text-[var(--accent)]">
              ?
            </span>
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
