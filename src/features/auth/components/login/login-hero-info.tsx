// auth/components/client/login/login-hero-info.tsx
"use client";

import { motion } from "framer-motion";
import { Brain, ArrowRight, Smartphone } from "lucide-react";
import { StoreBadge } from "../ui/StoreBadge";

export function LoginHeroInfo() {
  return (
    <div className="relative w-full max-w-[400px]">
      
     
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="ml-12 w-[340px] rounded-2xl bg-white p-6 shadow-2xl dark:bg-neutral-900"
      >
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <h3 className="bg-gradient-to-r from-[#FF6B35] to-[#C026D3] bg-clip-text text-[18px] font-bold text-transparent">
              Lleve Altair con usted.
            </h3>
            <p className="mt-2 text-[13px] leading-relaxed text-slate-500 dark:text-neutral-400">
              Gestione tareas, aprobaciones y procesos directamente desde su celular.
            </p>
            <div className="mt-3 flex flex-col gap-2">
              <StoreBadge label="Google Play" sub="Disponible en" />
              <StoreBadge label="App Store" sub="Descargar en el" />
            </div>
          </div>

          {/* Celular Mockup */}
          <div className="h-[130px] w-[70px] shrink-0 rounded-xl border border-slate-200 bg-gradient-to-b from-[#F0F2F8] to-white p-2 shadow-[0_8px_20px_rgba(27,37,89,0.12)] dark:border-neutral-800 dark:from-neutral-800 dark:to-neutral-950">
            <div className="space-y-1.5">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-600" />
                  <span className="h-1.5 flex-1 rounded bg-slate-200 dark:bg-neutral-800" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* TARJETA 2: AGENTE IA */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="-mt-4 mr-12 w-[340px] rounded-2xl bg-white p-6 shadow-2xl dark:bg-neutral-900"
      >
        <div className="mb-3 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EDE9FE] text-purple-600 dark:bg-purple-950/50">
            <Brain size={20} />
          </span>
          <h3 className="text-[16px] font-bold text-[#1B2559] dark:text-white">
            Agente de IA en Altair
          </h3>
        </div>
        
        <p className="text-[13px] leading-relaxed text-slate-500 dark:text-neutral-400">
          Automatice aún más sus flujos con inteligencia artificial integrada.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {["Mis Flujos", "Automatizaciones", "IA"].map((p, i) => (
            <div key={p} className="flex items-center gap-2">
              <span
                className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
                  i === 2
                    ? "bg-[#EDE9FE] text-purple-600 dark:bg-purple-950/50"
                    : "bg-[#F0F2F8] text-[#1B2559] dark:bg-neutral-800 dark:text-neutral-200"
                }`}
              >
                {p}
              </span>
              {i < 2 && <ArrowRight size={14} className="text-slate-400" />}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Footer del Hero */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="absolute -bottom-6 left-0 flex items-center gap-2 text-[12px] text-white/80"
      >
        <Smartphone size={14} />
        App disponible para iOS y Android
      </motion.div>
    </div>
  );
}