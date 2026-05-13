// components/hero/notification.tsx
"use client";

import { motion } from "framer-motion";

export function Notification() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
      className="absolute top-0 right-[60px] bg-white border border-[#1B2559]/7 rounded-xl px-3 py-2.2 flex items-center gap-2.2 shadow-[0_6px_20px_rgba(27,37,89,0.08)] z-10 will-change-[transform,opacity]"
    >
      <span className="w-2 h-2 rounded-full bg-gradient-to-r from-[#F97316] via-[#EC4899] to-[#7C3AED] shrink-0" />
      <div>
        <div className="text-[11px] font-bold text-[#1B2559]">
          Novo lead qualificado
        </div>
        <div className="text-[10px] text-muted-foreground">
          há 2 minutos · IA Score 94%
        </div>
      </div>
    </motion.div>
  );
}