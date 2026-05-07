export function Brand({ size = "md" }: { size?: "sm" | "md" }) {
  const text = size === "sm" ? "text-base" : "text-lg";
  return (
    <span className={`flex items-center gap-2 font-bold tracking-tight ${text}`}>
      <span
        aria-hidden
        className="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] text-white shadow-sm"
      >
        <span className="text-[13px] font-black">IC</span>
      </span>
      <span className="text-[var(--foreground)]">이슈캐스트</span>
    </span>
  );
}
