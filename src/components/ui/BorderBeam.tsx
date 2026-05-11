import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function BorderBeam({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden rounded-2xl ${className}`}>
      <motion.span
        aria-hidden
        className="pointer-events-none absolute top-0 h-[2px] w-1/3"
        style={{
          background:
            "linear-gradient(90deg, transparent, #2563eb, #7c3aed, transparent)",
        }}
        animate={{ left: ["-30%", "120%"] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "linear" }}
      />
      <motion.span
        aria-hidden
        className="pointer-events-none absolute bottom-0 h-[2px] w-1/3"
        style={{
          background:
            "linear-gradient(90deg, transparent, #7c3aed, #2563eb, transparent)",
        }}
        animate={{ right: ["-30%", "120%"] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "linear", delay: 1.4 }}
      />
      {children}
    </div>
  );
}
