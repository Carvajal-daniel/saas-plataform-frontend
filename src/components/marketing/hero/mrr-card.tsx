// components/hero/mrr-card.tsx
"use client";

import { motion } from "framer-motion";

export function MRRCard() {
  const bars = [
    { h: "40%", bg: "bg-[#E0DBFA]" },
    { h: "55%", bg: "bg-[#C4BBFA]" },
    { h: "48%", bg: "bg-[#C4BBFA]" },
    { h: "70%", bg: "bg-[#9D8EF5]" },
    { h: "62%", bg: "bg-[#7C6FEE]" },
    { h: "90%", bg: "bg-gradient-to-r from-[#F97316] via-[#EC4899] to-[#7C3AED]" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5, ease: "easeOut" }}
      className="absolute top-12 -right-4 w-[196px] bg-white rounded-2xl border border-[#1B2559]/8 shadow-[0_12px_40px_rgba(27,37,89,0.10)] p-3.5 will-change-[transform,opacity]"
    >
      <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2.5">
        MRR este mês
      </div>
      <div className="flex items-flex-end gap-0.75 h-9 mb-2.5">
        {bars.map((bar, i) => (
          <div 
            key={i} 
            style={{ height: bar.h }} 
            className={`flex-1 rounded-t-[2px] ${bar.bg}`} 
          />
        ))}
      </div>
      <div className="text-[28px] font-black text-[#1B2559] tracking-tighter leading-none">R$48.2k</div>
      <div className="text-[10px] text-muted-foreground mt-0.75">Receita recorrente mensal</div>
      <div className="inline-flex items-center gap-0.75 text-[10px] font-semibold text-[#059669] bg-[#059669]/8 px-1.75 py-0.5 rounded-full mt-1.5">
        ↑ +18.4% vs mês anterior
      </div>
    </motion.div>
  );
}