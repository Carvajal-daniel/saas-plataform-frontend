// components/hero/ai-chip.tsx
"use client";

import { motion } from "framer-motion";

export function AIChip() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.9, duration: 0.5, ease: "easeOut" }}
      className="absolute bottom-4 right-1 bg-white border border-[#124,58,237]/18 rounded-ebd px-3.5 py-2.5 shadow-[0_8px_28px_rgba(27,37,89,0.10)] flex items-center gap-2.5 will-change-[transform,opacity]"
    >
      <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-[#F97316] via-[#EC4899] to-[#7C3AED] flex items-center justify-center text-[16px] text-white shrink-0">
        ✦
      </div>
      <div>
        <div className="text-[11.5px] font-extrabold text-[#1B2559]">IA detectou oportunidade</div>
        <div className="text-[10px] text-muted-foreground mt-0.5">3 leads prontos para fechar</div>
      </div>
    </motion.div>
  );
}