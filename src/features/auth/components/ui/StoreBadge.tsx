export function StoreBadge({ label, sub }: { label: string; sub: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-md bg-[#1B2559] px-3 py-1.5 text-white">
      <div className="h-5 w-5 rounded bg-white/15" />
      <div className="leading-tight">
        <div className="text-[8px] uppercase opacity-80">{sub}</div>
        <div className="text-[11px] font-semibold">{label}</div>
      </div>
    </div>
  );
}