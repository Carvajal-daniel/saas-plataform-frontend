"use client";

import Link from "next/link";
import type {
  ReactNode,
  CSSProperties,
} from "react";

import type { LucideIcon } from "lucide-react";

export const PRIMARY_GRADIENT =
  "linear-gradient(to right, #FF6B35, #C026D3, #7C3AED)";

export const PANEL_GRADIENT =
  "linear-gradient(135deg, #FF6B35 0%, #C026D3 55%, #7C3AED 100%)";

export function Eyebrow({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div
      className="inline-block rounded-full px-4 py-1.5 text-[12px] font-semibold uppercase"
      style={{
        background: "#EDE9FE",
        color: "#7C3AED",
        letterSpacing: "0.1em",
      }}
    >
      {children}
    </div>
  );
}

export function SectionHeading({
  children,
  style,
}: {
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <h2
      className="text-[32px] font-bold leading-tight md:text-[40px]"
      style={{
        color: "#1B2559",
        letterSpacing: "-0.02em",
        ...style,
      }}
    >
      {children}
    </h2>
  );
}

export function PrimaryButton({
  children,
  href,
  type = "button",
  full,
}: {
  children: ReactNode;
  href?: string;
  type?: "button" | "submit";
  full?: boolean;
}) {
  const cls = `
    inline-flex items-center justify-center gap-2
    rounded-lg text-[14px] font-semibold text-white
    transition-transform hover:-translate-y-0.5
    ${full ? "w-full" : ""}
  `;

  const style = {
    padding: "12px 28px",
    background: PRIMARY_GRADIENT,
  };

  if (href) {
    return (
      <Link href={href} className={cls} style={style}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={cls}
      style={style}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  href,
}: {
  children: ReactNode;
  href?: string;
}) {
  const cls = `
    inline-flex items-center justify-center gap-2
    rounded-lg text-[14px] font-semibold
    transition-colors hover:bg-[#F0F2F8]
  `;

  const style = {
    padding: "12px 28px",
    background: "white",
    border: "1.5px solid #1B2559",
    color: "#1B2559",
  };

  if (href) {
    return (
      <Link href={href} className={cls} style={style}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={cls}
      style={style}
    >
      {children}
    </button>
  );
}

export function IconCircle({
  Icon,
  size = 40,
  color = "#7C3AED",
  bg = "#EDE9FE",
}: {
  Icon: LucideIcon;
  size?: number;
  color?: string;
  bg?: string;
}) {
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full"
      style={{
        width: size,
        height: size,
        background: bg,
        color,
      }}
    >
      <Icon size={Math.round(size * 0.5)} />
    </span>
  );
}

export function Card({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={`transition-all duration-200 ${
        className ?? ""
      }`}
      style={{
        background: "white",
        border: "1px solid #E2E8F0",
        borderRadius: 12,
        padding: 24,
        ...style,
      }}
    >
      {children}
    </div>
  );
}