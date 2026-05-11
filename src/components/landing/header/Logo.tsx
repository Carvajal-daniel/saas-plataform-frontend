export function Logo({ size = 20 }: { size?: number }) {
  const sq = Math.round((size * 9) / 20);
  const gap = Math.round((size * 2) / 20);
  return (
    <div className="flex items-center gap-2">
      <div
        className="grid grid-cols-2"
        style={{ gap: `${gap}px` }}
        aria-hidden
      >
        <span style={{ width: sq, height: sq, background: "#FF6B35", borderRadius: 2 }} />
        <span style={{ width: sq, height: sq, background: "#7C3AED", borderRadius: 2 }} />
        <span style={{ width: sq, height: sq, background: "#C026D3", borderRadius: 2 }} />
        <span style={{ width: sq, height: sq, background: "#FF6B35", borderRadius: 2 }} />
      </div>
      <span style={{ color: "#1B2559", fontWeight: 700, fontSize: size, letterSpacing: "-0.01em" }}>
        altair
      </span>
    </div>
  );
}