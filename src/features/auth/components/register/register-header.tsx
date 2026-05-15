
"use client";

import { Logo } from "@/components/layout/header/Logo";
import { AnimatedSection } from "@/components/ui/animated-section";

export function RegisterHeader() {
  return (
    <AnimatedSection delay={0.1}>
      <Logo size={24} />
      <h1 className="mt-8 text-3xl font-bold text-[#1B2559]">Cree su cuenta</h1>
      <p className="mt-2 text-slate-500">Automatice procesos con IA desde el primer día</p>
    </AnimatedSection>
  );
}