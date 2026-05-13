// components/hero/main-card.tsx
"use client";

import { motion } from "framer-motion";

export function MainCard() {
  const bars = [38, 52, 44, 67, 59, 87, 74];
  const pipes = [
    { label: "Qualificado", val: "78%", w: "78%", grad: true },
    { label: "Em proposta", val: "55%", w: "55%", grad: false, color: "bg-[#1B2559]" },
    { label: "Fechamento", val: "32%", w: "32%", grad: false, color: "bg-muted-foreground" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
      className="absolute top-0 left-0 w-[360px] bg-white rounded-[20px] border border-[#1B2559]/8 shadow-[0_20px_60px_rgba(27,37,89,0.10),0_4px_12px_rgba(27,37,89,0.05)] p-5 will-change-[transform,opacity]"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
            Dashboard CRM
          </div>
          <div className="text-[14px] font-extrabold text-[#1B2559] tracking-tight mt-0.5">
            Visão geral · Jun 2025
          </div>
        </div>
        <span className="flex items-center gap-1 text-[10.5px] font-medium text-[#059669] bg-[#059669]/8 border border-[#059669]/20 px-2 py-0.75 rounded-full">
          <span className="w-1.25 h-1.25 rounded-full bg-[#059669] inline-block" />
          Ao vivo
        </span>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-1.75 mb-3.5">
        {[["847", "Leads"], ["R$124k", "Pipeline"], ["68%", "Conversão"]].map(([val, lbl]) => (
          <div key={lbl} className="bg-[#F8F7FF] border border-[#7C3AED]/10 rounded-xl p-2">
            <div className="text-[17px] font-black text-[#1B2559] tracking-tighter leading-none mb-0.75">{val}</div>
            <div className="text-[8.5px] text-muted-foreground uppercase tracking-widest">{lbl}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-[#F8F7FF] border border-[#7C3AED]/8 rounded-xl p-2.5 pb-2 mb-3">
        <div className="flex justify-between items-center mb-22">
          <span className="text-[10.5px] text-slate-500 font-medium">Receita mensal</span>
          <span className="text-[9.5px] text-[#7C3AED] font-bold bg-[#7C3AED]/8 px-1.5 py-0.5 rounded-full">↑ +23%</span>
        </div>
        <div className="flex items-flex-end gap-1 h-13">
          {bars.map((h, i) => (
            <div
              key={i}
              style={{ height: `${h}%` }}
              className={`flex-1 rounded-t-[3px] ${
                i === 5 
                  ? "bg-gradient-to-r from-[#F97316] via-[#EC4899] to-[#7C3AED]" 
                  : "bg-[#E0DBFA]"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Pipeline */}
      <div className="flex flex-col gap-1.5">
        {pipes.map((p) => (
          <div key={p.label} className="flex items-center gap-1.75">
            <span className="text-[10px] text-slate-500 w-14 shrink-0">{p.label}</span>
            <div className="flex-1 h-1 bg-[#EDE9FF] rounded-full overflow-hidden">
              <div 
                style={{ width: p.w }} 
                className={`h-full rounded-full ${
                  p.grad 
                    ? "bg-gradient-to-r from-[#F97316] via-[#EC4899] to-[#7C3AED]" 
                    : p.color
                }`} 
              />
            </div>
            <span className="text-[10px] font-bold text-[#1B2559] w-6 text-right">{p.val}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}