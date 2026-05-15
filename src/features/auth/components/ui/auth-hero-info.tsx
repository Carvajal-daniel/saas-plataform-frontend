"use client";
import { motion } from "framer-motion";

export function AuthHeroInfo() {
  return (
    <div className="space-y-6">
      {/* Card 1 */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="rounded-2xl bg-white/10 p-6 backdrop-blur-xl border border-white/20"
      >
        <h3 className="text-lg font-bold text-white">Lleve Altair con usted.</h3>
        <p className="mt-2 text-sm text-white/80">
          Gestione tareas, aprobaciones y procesos directamente desde su celular.
        </p>
        <div className="mt-4 flex gap-3">
          <div className="h-8 w-24 rounded bg-black/40" /> {/* Mock App Store */}
          <div className="h-8 w-24 rounded bg-black/40" /> {/* Mock Play Store */}
        </div>
      </motion.div>

      {/* Card 2 */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600">
            <span className="font-bold">IA</span>
          </div>
          <h3 className="font-bold text-slate-900">Agente de IA en Altair</h3>
        </div>
        <p className="mt-3 text-sm text-slate-600">
          Automatice aún más sus flujos con inteligencia artificial integrada.
        </p>
      </motion.div>
    </div>
  );
}