"use client";

import { CATEGORIES, CATEGORY_META, type Category } from "@/lib/types";

export function CategoryTabs({
  active,
  onChange,
  counts,
}: {
  active: Category;
  onChange: (c: Category) => void;
  counts: Partial<Record<Category, number>>;
}) {
  return (
    <div className="-mx-1 overflow-x-auto pb-1">
      <div className="flex w-max gap-3 px-1 sm:flex-wrap sm:w-full">
        {CATEGORIES.map((c) => {
          const isActive = c === active;
          const meta = CATEGORY_META[c];
          const count = counts[c];
          const isAge = c === "10대" || c === "20대";
          return (
            <button
              key={c}
              type="button"
              onClick={() => onChange(c)}
              className={[
                "group relative flex h-[88px] w-[140px] shrink-0 flex-col justify-between overflow-hidden rounded-2xl border p-3 text-left transition",
                "sm:h-[96px] sm:w-[156px]",
                isActive
                  ? "border-white/40 ring-1 ring-white/30"
                  : "border-[var(--border)] hover:border-white/20",
                isAge ? "ring-1 ring-[var(--accent)]/30" : "",
              ].join(" ")}
            >
              <div
                className={[
                  "absolute inset-0 -z-10 bg-gradient-to-br opacity-90",
                  meta.gradient,
                ].join(" ")}
                aria-hidden
              />
              <div
                className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.18),transparent_60%)]"
                aria-hidden
              />
              <div
                className={[
                  "absolute inset-0 -z-10 bg-black/40 transition",
                  isActive ? "bg-black/20" : "group-hover:bg-black/30",
                ].join(" ")}
                aria-hidden
              />

              <div className="flex items-center justify-between">
                <span className="text-2xl">{meta.emoji}</span>
                {typeof count === "number" && (
                  <span className="rounded-full bg-black/40 px-2 py-0.5 text-[10px] font-medium text-white/90">
                    {count}
                  </span>
                )}
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold text-white">{c}</span>
                  {isAge && (
                    <span className="rounded-full bg-white/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                      AGE
                    </span>
                  )}
                </div>
                <div className="line-clamp-1 text-[11px] text-white/75">
                  {meta.caption}
                </div>
              </div>

              {isActive && (
                <div
                  className="pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-white/60"
                  aria-hidden
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
