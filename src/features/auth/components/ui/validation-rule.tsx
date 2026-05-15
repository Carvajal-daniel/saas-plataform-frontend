export function ValidationRule({ ok, text }: { ok: boolean; text: string }) {
  return (
    <div
      className="flex items-center gap-2"
      style={{ color: ok ? "#16A34A" : "#94A3B8" }}
    >
      <div
        className="h-2 w-2 rounded-full"
        style={{ background: ok ? "#16A34A" : "#CBD5E1" }}
      />
      {text}
    </div>
  );
}