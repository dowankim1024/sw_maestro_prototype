import type { Issue } from "@/lib/types";
import { disclaimerFor } from "@/lib/services";

interface Props {
  issue: Issue;
  size?: "sm" | "md";
  className?: string;
}

/**
 * 면책 고지.
 * 캐릭터 발언이 단정이 아니라는 점, 사실은 출처 기준이라는 점을 강조한다.
 */
export function DisclaimerNotice({ issue, size = "md", className = "" }: Props) {
  const text = disclaimerFor(issue);
  const padding = size === "sm" ? "px-3 py-2 text-[11px]" : "px-4 py-3 text-xs";
  return (
    <div
      className={`flex items-start gap-2 rounded-xl border border-[var(--border)] bg-[var(--background-elev)] ${padding} text-[var(--muted)] ${className}`}
    >
      <span aria-hidden className="mt-[2px] text-[13px]">
        ℹ️
      </span>
      <p className="leading-relaxed">{text}</p>
    </div>
  );
}
