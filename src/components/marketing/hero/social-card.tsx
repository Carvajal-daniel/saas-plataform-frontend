// components/hero/social-card.tsx
"use client";

import { motion } from "framer-motion";

export function SocialCard() {
  const avs = [
    { initials: "JR", bg: "bg-[#1B2559]" },
    { initials: "AK", bg: "bg-[#7C3AED]" },
    { initials: "ML", bg: "bg-[#EC4899]" },
    { initials: "SP", bg: "bg-[#F97316]" },
    { initials: "+", bg: "bg-[#0891B2]" },
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7, duration: 0.5, ease: "easeOut" }}
      className="absolute bottom-20 -left-3 w-[188px] bg-white rounded-2xl border border-[#1B2559]/8 shadow-[0_12px_40px_rgba(27,37,89,0.10)] p-3.5 will-change-[transform,opacity]"
    >
      <div className="flex mb-2">
        {avs.map((a, i) => (
          <div
            key={i}
            className={`w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-bold text-white tracking-tight ${a.bg} ${
              i === 0 ? "ml-0" : "-ml-1.5"
            }`}
          >
            {a.initials}
          </div>
        ))}
      </div>
      <div className="text-[12px] font-extrabold text-[#1B2559] mb-0.5">2.400+ empresas</div>
      <div className="text-[10.5px] text-muted-foreground">confiam no Altair</div>
      <div className="text-[#F59E0B] text-[11px] tracking-widest mt-1.5">★★★★★</div>
    </motion.div>
  );
}