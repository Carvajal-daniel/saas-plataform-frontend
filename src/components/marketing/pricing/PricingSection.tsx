"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Calendar, X } from "lucide-react";
import { Reveal, container } from "../../ui/Reveal"; 
import { PricingCard } from "./PricingCard";
import type { Plan } from "./types/pricing";

const plans: Plan[] = [
  {
    name: "Starter", topColor: "#A78BFA",
    annual: "R$49", monthly: "R$65",
    sub: "Por usuario · mín. 4 usuarios",
    cta: "Empezar ahora", primary: false,
    features: ["15 flujos de atención", "10 pipelines de CRM", "Agendamientos ilimitados", "30GB almacenamiento", "Automatizaciones básicas", "Integración WhatsApp", "3 espaços de trabalho", "Formularios inteligentes"],
    highlighted: false,
  },

  {
    name: "Professional", topColor: "#7C3AED",
    annual: "R$89", monthly: "R$115",
    sub: "Por usuario · facturado mensual",
    cta: "Empezar ahora", primary: true,
    features: ["Todo en Starter", "Pipelines ilimitados", "100GB almacenamiento", "Agente de IA integrado", "Automatizaciones avanzadas", "Panel de Insights", "APIs abiertas", "Integraciones nativas", "Control de tiempo"],
    highlighted: true,
  },
  {
    name: "Enterprise", topColor: "#94A3B8",
    annual: "Personalizado", monthly: "Personalizado",
    sub: "Mínimo 10 usuarios",
    cta: "Contactar ventas", primary: false,
    features: ["Todo en Professional", "Almacenamiento personalizado", "Soporte corporativo", "White-label", "Agente de IA personalizado", "SLA garantizado", "Onboarding dedicado", "API Enterprise", "Gestor de cuenta exclusivo"],
    highlighted: false,
    custom: true,
  },
];







export default function PricingSection() {
  const [annual, setAnnual] = useState(true);

  return (
    <section id="precios" className=" bg-background dark:bg-background transition-colors">
      <div className="mx-auto max-w-[1200px] px-6 py-24">
        
        <Reveal className="text-center">
          <span className="text-[#7C3AED] font-bold tracking-widest uppercase text-xs">Precios</span>
          <h2 className="display-md mt-4 text-[#1B2559] dark:text-foreground">
            Simple, transparente, accesible
          </h2>
        </Reveal>

        <Reveal delay={0.1} className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {[
            { Icon: CreditCard, label: "Sin tarjeta de crédito" },
            { Icon: Calendar, label: "7 días completamente gratis" },
            { Icon: X, label: "Cancela en cualquier momento" },
          ].map((t) => (
            <span key={t.label} className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium bg-[#EDE9FE] text-[#1B2559]">
              <t.Icon size={14} className="text-[#7C3AED]" /> {t.label}
            </span>
          ))}
        </Reveal>

        <Reveal delay={0.15} className="mt-10 flex items-center justify-center gap-3">
          <div className="inline-flex rounded-full p-1 bg-white border border-border">
            {[
              { id: "month", label: "Mensual", val: false },
              { id: "year", label: "Anual", val: true },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setAnnual(opt.val)}
                className={`rounded-full px-5 py-2 text-[13px] font-semibold transition-colors ${
                  annual === opt.val ? "bg-[#1B2559] text-white" : "text-slate-500"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {annual && (
            <span className="rounded-full px-3 py-1 text-[12px] font-semibold bg-[#DCFCE7] text-[#15803D]">
              2 meses gratis
            </span>
          )}
        </Reveal>

        {/* Grid usando sua variant de container (staggerChildren) */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={container}
          className="mt-12 grid items-start gap-6 md:grid-cols-3"
        >
          {plans.map((p) => (
            <PricingCard key={p.name} plan={p} isAnnual={annual} />
          ))}
        </motion.div>

        <p className="mt-8 text-center text-[12px] text-slate-400">
          Precios en BRL · Impuestos incluidos
        </p>
      </div>
    </section>
  );

}


