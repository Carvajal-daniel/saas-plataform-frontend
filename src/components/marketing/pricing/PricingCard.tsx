"use client";

import { motion, Variants } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { fadeUp } from "../../ui/Reveal"; // Importando sua animação original
import type { Plan } from "./types/pricing";

export function PricingCard({ plan, isAnnual }: { plan: Plan; isAnnual: boolean }) {
  // Adicionamos a tipagem "Variants" e o "as const" no ease
  const highlightedVariant: Variants = {
    hidden: { opacity: 0, scale: 0.96, y: 28 },
    show: { 
      opacity: 1, 
      scale: 1.03, 
      y: 0, 
      transition: { 
        duration: 0.55, 
        ease: [0.16, 1, 0.3, 1] as const // <--- O SEGREDO ESTÁ AQUI
      } 
    },
  };

  return (
    <motion.div
      variants={plan.highlighted ? highlightedVariant : fadeUp}
      className={`relative bg-card p-7 rounded-[14px] transition-all ${
        plan.highlighted 
          ? "border-2 border-[#7C3AED] shadow-[0_8px_40px_rgba(124,58,237,0.15)] z-10" 
          : "border border-border"
      }`}
      style={{ borderTop: !plan.highlighted ? `4px solid ${plan.topColor}` : undefined }}
    >
      {plan.highlighted && (
        <span className="mb-3 inline-block rounded-full px-3 py-1 text-[11px] font-semibold bg-[#EDE9FE] text-[#7C3AED]">
          Más popular
        </span>
      )}

      <h3 className="text-[22px] font-bold text-[#1B2559] dark:text-foreground">{plan.name}</h3>
      
      <div className="mt-4">
        {plan.custom ? (
          <div className="text-[28px] font-bold text-[#1B2559] dark:text-foreground">{plan.annual}</div>
        ) : (
          <div className="flex items-baseline gap-1">
            <span className="text-[34px] font-bold text-[#1B2559] dark:text-foreground">
              {isAnnual ? plan.annual : plan.monthly}
            </span>
            <span className="text-[14px] text-muted-foreground">/mes</span>
          </div>
        )}
        <p className="mt-1 text-[13px] text-muted-foreground">{plan.sub}</p>
      </div>

      <div className="mt-6">
        <button
          className={`w-full rounded-lg text-[14px] font-semibold transition-all py-3 ${
            plan.primary 
              ? "btn-primary text-white" 
              : "bg-white border-[1.5px] border-[#1B2559] text-[#1B2559] hover:bg-[#F0F2F8]"
          }`}
        >
          {plan.cta}
        </button>
      </div>

      <div className="my-6 h-px w-full bg-border" />

      <ul className="space-y-3">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5">
            <CheckCircle size={16} className="mt-0.5 shrink-0 text-[#7C3AED]" />
            <span className="text-[14px] text-[#1B2559] dark:text-slate-300">{f}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}