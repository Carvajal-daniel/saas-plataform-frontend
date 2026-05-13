// components/hero/badge.tsx
"use client";

import { motion } from "framer-motion";
import { fadeUp } from "../../landing/Reveal";

export function Badge() {
  return (
    <motion.div variants={fadeUp} className="will-change-[transform,opacity]">
      <span className="inline-flex items-center gap-2 border border-[#7C3AED]/28 bg-[#7C3AED]/5 px-3.5 py-1.2 rounded-full text-[11.5px] font-medium text-[#7C3AED] tracking-wide mb-[26px]">
        {/* Dot indicador con animación optimizada por GPU */}
        <span className="w-1.75 h-1.75 rounded-full bg-gradient-to-r from-[#F97316] via-[#EC4899] to-[#7C3AED] inline-block animate-pulse" />
        Plataforma CRM · IA Enterprise
      </span>
    </motion.div>
  );
}