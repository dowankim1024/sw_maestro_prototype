"use client";

import { CATEGORY_META, ISSUE_CATEGORIES, type IssueCategory } from "@/lib/types";

interface Props {
  active: IssueCategory | "전체";
  onChange: (next: IssueCategory | "전체") => void;
  counts: Partial<Record<IssueCategory | "전체", number>>;
}

export function CategoryChips({ active, onChange, counts }: Props) {
  const entries: Array<{
    id: IssueCategory | "전체";
    emoji: string;
    label: string;
  }> = [
    { id: "전체", emoji: "🌐", label: "전체" },
    ...ISSUE_CATEGORIES.map((c) => ({
      id: c,
      emoji: CATEGORY_META[c].emoji,
      label: c,
    })),
  ];

  return (
    <nav className="flex flex-wrap gap-1.5">
      {entries.map((e) => {
        const isActive = active === e.id;
        const count = counts[e.id] ?? 0;
        return (
          <button
            key={e.id}
            type="button"
            onClick={() => onChange(e.id)}
            className={[
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition",
              isActive
                ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
                : "border-[var(--border)] bg-white text-[var(--muted)] hover:border-[var(--border-strong)] hover:text-[var(--foreground)]",
            ].join(" ")}
            aria-pressed={isActive}
          >
            <span aria-hidden>{e.emoji}</span>
            {e.label}
            {count > 0 && (
              <span
                className={
                  isActive
                    ? "text-[var(--accent)]"
                    : "text-[var(--muted-2)]"
                }
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
