export function Logo({ size = 20 }: { size?: number }) {
  const big = Math.round((size * 32) / 32);
  const accent = Math.round((size * 13) / 32);
  const radius = Math.round((size * 8) / 32);
  const accentRadius = Math.round((size * 4) / 32);
  const containerSize = Math.round((size * 52) / 32);

  return (
    <div className="flex items-center" style={{ gap: Math.round((size * 18) / 32) }}>
      <div className="relative flex-shrink-0" style={{ width: containerSize, height: containerSize }}>
        <span
          className="absolute top-0 left-0 animate-[squarePop_0.55s_cubic-bezier(.22,1,.36,1)_0.05s_both]"
          style={{ width: big, height: big, borderRadius: radius, background: "#7C3AED" }}
        />
        <span
          className="absolute bottom-0 right-0 opacity-[0.88] animate-[squarePop_0.55s_cubic-bezier(.22,1,.36,1)_0.17s_both]"
          style={{ width: big, height: big, borderRadius: radius, background: "#C026D3" }}
        />
        <span
          className="absolute top-0.5 left-0.5 animate-[squarePop_0.55s_cubic-bezier(.22,1,.36,1)_0.30s_both]"
          style={{ width: accent, height: accent, borderRadius: accentRadius, background: "#FF6B35" }}
        />
      </div>

      <span
        className="font-medium tracking-[-0.04em] text-foreground animate-[fadeInUp_0.5s_cubic-bezier(.22,1,.36,1)_0.32s_both]"
        style={{ fontSize: size }}
      >
        alt
        <span className="bg-gradient-to-r from-[#C026D3] to-[#7C3AED] bg-clip-text text-transparent">
          air
        </span>
      </span>
    </div>
  );
}