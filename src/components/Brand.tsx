export function Brand({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const dot =
    size === "lg" ? "h-3 w-3" : size === "sm" ? "h-1.5 w-1.5" : "h-2 w-2";
  const text =
    size === "lg" ? "text-2xl" : size === "sm" ? "text-sm" : "text-base";
  return (
    <div className="flex items-center gap-2">
      <span
        className={`live-dot inline-block rounded-full bg-[var(--accent)] ${dot}`}
        aria-hidden
      />
      <span
        className={`font-semibold tracking-tight text-white ${text}`}
        style={{ letterSpacing: "-0.01em" }}
      >
        Trend<span className="text-[var(--accent)]">Arena</span>
      </span>
    </div>
  );
}
