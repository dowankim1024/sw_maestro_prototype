import type { FactLabel } from "@/lib/types";

const TEXT: Record<FactLabel | "opinion", string> = {
  fact: "팩트",
  reported: "보도됨",
  uncertain: "불확실",
  opinion: "캐릭터 의견",
};

const CLASSES: Record<FactLabel | "opinion", string> = {
  fact: "label-fact",
  reported: "label-reported",
  uncertain: "label-uncertain",
  opinion: "label-opinion",
};

interface Props {
  kind: FactLabel | "opinion";
  className?: string;
}

export function FactBadge({ kind, className = "" }: Props) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-[2px] text-[11px] font-semibold ${CLASSES[kind]} ${className}`}
    >
      {TEXT[kind]}
    </span>
  );
}
