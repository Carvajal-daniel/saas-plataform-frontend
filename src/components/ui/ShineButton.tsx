import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "ghost";

export function ShineButton({
  children,
  variant = "primary",
  className = "",
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode; variant?: Variant }) {
  const base =
    "shine inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-transform duration-200 hover:-translate-y-0.5";
  const styles =
    variant === "primary"
      ? "text-white shadow-lg shadow-blue-600/25 bg-[linear-gradient(120deg,#2563eb,#7c3aed)]"
      : "border border-black/10 dark:border-white/15 bg-transparent text-foreground hover:bg-black/5 dark:hover:bg-white/5";
  return (
    <button {...rest} className={`${base} ${styles} ${className}`}>
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </button>
  );
}
