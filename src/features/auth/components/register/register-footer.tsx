
"use client";

import { Grid3x3, CreditCard } from "lucide-react";
import { AnimatedSection } from "@/components/ui/animated-section";

export function RegisterFooter() {
  return (
    <AnimatedSection delay={0.68} className="mt-4 flex flex-wrap gap-4 text-[12px] text-slate-500">
      <div className="flex items-center gap-2">
        <Grid3x3 size={14} color="#7C3AED" /> Digitalice procesos
      </div>
      <div className="flex items-center gap-2">
        <CreditCard size={14} color="#7C3AED" /> No necesita tarjeta
      </div>
    </AnimatedSection>
  );
}