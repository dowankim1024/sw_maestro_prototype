import type { Source } from "@/lib/types";

interface Props {
  sources: Source[];
  compact?: boolean;
  title?: string;
}

const TYPE_LABEL: Record<Source["type"], string> = {
  news: "뉴스",
  official: "공식",
  report: "리포트",
  data: "데이터",
  other: "기타",
};

export function SourceList({ sources, compact = false, title = "출처" }: Props) {
  if (sources.length === 0) {
    return (
      <div className="text-[11px] text-[var(--muted)]">
        등록된 출처가 없습니다.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between">
        <h4 className="text-xs font-semibold text-[var(--foreground)]">{title}</h4>
        <span className="text-[11px] text-[var(--muted)]">
          {sources.length}건
        </span>
      </div>
      <ul className={compact ? "space-y-1" : "space-y-2"}>
        {sources.map((s) => (
          <li
            key={s.id}
            className="flex items-start gap-2 rounded-lg border border-[var(--border)] bg-white px-3 py-2"
          >
            <span className="mt-[2px] inline-flex shrink-0 items-center rounded-full border border-[var(--border-strong)] bg-[var(--background)] px-2 py-[1px] text-[10px] font-semibold text-[var(--muted)]">
              {TYPE_LABEL[s.type]}
            </span>
            <div className="min-w-0 flex-1">
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block truncate text-[12px] font-medium text-[var(--foreground)] hover:text-[var(--accent)]"
              >
                {s.title}
              </a>
              <div className="mt-[2px] flex items-center gap-2 text-[11px] text-[var(--muted)]">
                <span>{s.publisher}</span>
                <span aria-hidden>·</span>
                <time dateTime={s.publishedAt}>{formatDate(s.publishedAt)}</time>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}
