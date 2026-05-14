// components/hero/hero.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { container, fadeUp } from "../../ui/Reveal";

import { Badge } from "./badge";
import { Notification } from "./notification";
import { MainCard } from "./main-card";
import { MRRCard } from "./mrr-card";
import { SocialCard } from "./social-card";
import { AIChip } from "./ai-chip";

export function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden md:mt-30 pb-20 min-h-dvh mt-10">
      
      {/* Background Orbs con optimización nativa */}
      <div className="absolute -top-[180px] -right-[100px] w-[560px] h-[560px] rounded-full bg-[radial-gradient(circle,rgba(249,115,22,0.07)_0%,rgba(236,72,153,0.06)_40%,rgba(124,58,237,0.05)_70%,transparent_100%)] pointer-events-none" />
      <div className="absolute -bottom-[200px] -left-[120px] w-[480px] h-[480px] rounded-full bg-[radial-gradient(circle,rgba(27,37,89,0.05)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(124,58,237,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(124,58,237,0.035)_1px,transparent_1px)] bg-[size:52px_52px] pointer-events-none" />

      <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-14 px-4 pt-16 pb-10 text-center sm:px-6 md:pt-20 lg:flex-row lg:gap-16 lg:px-8 lg:text-left">

        {/* LEFT COLUMN */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={container}
          className="flex w-full max-w-[620px] flex-col items-center lg:items-start will-change-[transform,opacity]"
        >
          <Badge />

          <h1 className="text-[clamp(2.4rem,5vw,58px)] font-black tracking-tight leading-none mb-5">
            <motion.span variants={fadeUp} className="block text-[#1B2559]">
              Gestione<br />relações.
            </motion.span>
            <motion.span
              variants={fadeUp}
              className="block bg-gradient-to-r from-[#F97316] via-[#EC4899] to-[#7C3AED] bg-clip-text text-transparent"
            >
              Escale com IA.
            </motion.span>
          </h1>

          <motion.p
            variants={fadeUp}
            className="text-[15.5px] leading-relaxed text-slate-500 max-w-[390px] mb-8"
          >
            Altair unifica CRM, agendamentos e automação inteligente em uma plataforma enterprise — para equipes que precisam operar com precisão e velocidade.
          </motion.p>

          <motion.div variants={fadeUp} className="flex items-center gap-3 mb-3.5">
            <Link
              href="/client/register"
              className="btn-primary-gradient rounded-lg px-5 py-4 text-[14px] font-semibold text-white transition-opacity hover:opacity-95"
            >
              Empezar gratis
            </Link>
            
            <a
              href="#demo"
              className="inline-flex items-center gap-2 bg-white text-[#1B2559] text-[14px] font-medium px-[22px] py-[13px] rounded-xl border border-[#1B2559]/12 shadow-[0_2px_8px_rgba(27,37,89,0.06)] hover:bg-slate-50 transition-colors duration-150"
            >
              <span className="w-[26px] h-[26px] rounded-full bg-[#7C3AED]/10 flex items-center justify-center">
                <svg width="9" height="9" viewBox="0 0 10 10" fill="#7C3AED">
                  <path d="M2 1.5l7 3.5-7 3.5V1.5z" />
                </svg>
              </span>
              Ver demo
            </a>
          </motion.div>
        </motion.div>

        {/* RIGHT COLUMN - VISUAL CARDS GRID */}
        <div className="relative mt-4 flex w-full max-w-[580px] justify-center lg:mt-0 h-[560px]">
          <Notification />
          <MainCard />
          <MRRCard />
          <SocialCard />
          <AIChip />
        </div>

      </div>
    </section>
  );
}