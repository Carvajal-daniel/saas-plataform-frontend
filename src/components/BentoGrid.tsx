"use client";

import { motion } from "framer-motion";
import { SpotlightCard } from "./ui/SpotlightCard";

// Variantes para os itens internos (mantidas)
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

const itemX = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { duration: 0.45 } },
};

export function BentoGrid() {
  return (
    <motion.section
      id="features"
      className="px-6 py-24 mt-10"
      // --- ANIMAÇÃO DE ENTRADA DO COMPONENTE ---
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }} 
      transition={{ duration: .8, delay: .2, ease: "easeOut" }}
      // -----------------------------------------
    >
      <div className="mx-auto max-w-7xl text-center md:text-left">
        <div className="mb-14 max-w-2xl">
          <p className="text-sm uppercase tracking-widest text-altair-muted">
            Funcionalidades
          </p>

          <h2
            className="font-serif-display mt-3 leading-tight"
            style={{ fontSize: "clamp(2rem,3.5vw,2.8rem)" }}
          >
            Todo lo que tu negocio necesita,{" "}
            <span className="italic bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
              en un solo lugar.
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-12 gap-4">
          {/* Card 1 */}
          <SpotlightCard className="col-span-12 lg:col-span-7 p-7">
            <div className="mb-5">
              <h3 className="font-serif-display text-2xl">Adiós al caos</h3>
              <p className="text-sm text-altair-muted mt-1">
                Del desorden de WhatsApp a una agenda impecable.
              </p>
            </div>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px" }}
              className="grid gap-3 md:grid-cols-2"
            >
              <div className="space-y-2">
                <p className="text-[10px] uppercase tracking-wider text-altair-muted">
                  Antes
                </p>
                {[
                  "! El cliente olvidó la cita",
                  "! Mensaje sin responder",
                  "! Conflicto de agenda",
                  "! Recordatorios manuales",
                ].map((t) => (
                  <motion.div
                    key={t}
                    variants={item}
                    className="rounded-lg border border-rose-500/20 bg-rose-500/5 px-3 py-2 text-xs text-rose-600 dark:text-rose-400"
                  >
                    {t}
                  </motion.div>
                ))}
              </div>

              <div className="space-y-2">
                <p className="text-[10px] uppercase tracking-wider text-altair-muted">
                  Después
                </p>
                {[
                  "María · 09:00 · Corte",
                  "Juan · 11:30 · Barba",
                  "Ana · 14:00 · Coloración",
                  "Lia · 16:30 · Manicure",
                ].map((t) => (
                  <motion.div
                    key={t}
                    variants={item}
                    className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-xs"
                  >
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    {t}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </SpotlightCard>

          {/* Card 2 */}
          <SpotlightCard className="col-span-12 lg:col-span-5 p-7">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif-display text-2xl">Isa IA 24/7</h3>
                <p className="text-sm text-altair-muted mt-1">
                  Conversa, agenda y confirma automáticamente.
                </p>
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] text-emerald-600 dark:text-emerald-400">
                <motion.span
                  className="h-1.5 w-1.5 rounded-full bg-emerald-500"
                  animate={{ scale: [1, 1.6, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                en línea
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2">
              {[
                { v: "24/7", l: "disponible" },
                { v: "<30s", l: "respuesta" },
                { v: "94%", l: "conversión" },
              ].map((s) => (
                <div
                  key={s.l}
                  className="rounded-xl border border-black/5 dark:border-white/5 bg-white/40 dark:bg-white/5 p-3"
                >
                  <p className="font-serif-display text-xl">{s.v}</p>
                  <p className="text-[10px] text-altair-muted">{s.l}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-xl bg-[#0b141a] p-3 space-y-2">
              <div className="max-w-[75%] rounded-2xl rounded-tl-sm bg-white/10 px-2.5 py-1.5 text-[11px] text-white">
                ¿Atienden mañana?
              </div>
              <div className="max-w-[80%] ml-auto rounded-2xl rounded-tr-sm bg-emerald-600 px-2.5 py-1.5 text-[11px] text-white">
                ¡Sí! Puedo agendarte a las 10h ✨
              </div>
            </div>
          </SpotlightCard>

          {/* Card 3 */}
          <SpotlightCard className="col-span-12 lg:col-span-5 p-7">
            <h3 className="font-serif-display text-2xl">Gestión financiera</h3>
            <p className="text-sm text-altair-muted mt-1">
              Sigue ingresos, ticket promedio y crecimiento en tiempo real.
            </p>

            <div className="mt-6 flex items-end gap-2 h-32">
              {[40, 60, 50, 75, 65, 90, 100].map((v, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  whileInView={{ height: `${v}%` }}
                  viewport={{ once: true }}
                  transition={{
                    type: "spring",
                    stiffness: 80,
                    damping: 15,
                    delay: i * 0.06,
                  }}
                  className="flex-1 rounded-t-md bg-gradient-to-t from-blue-600 to-violet-500"
                />
              ))}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
                <p className="text-xs text-altair-muted">vs mes anterior</p>
                <p className="font-serif-display text-xl text-emerald-600 dark:text-emerald-400">
                  ↑ 32%
                </p>
              </div>

              <div className="rounded-xl border border-black/5 dark:border-white/5 bg-white/40 dark:bg-white/5 p-3">
                <p className="text-xs text-altair-muted">ingresos</p>
                <p className="font-serif-display text-xl">$14k</p>
              </div>
            </div>
          </SpotlightCard>

          {/* Card 4 */}
          <SpotlightCard className="col-span-12 lg:col-span-7 p-7">
            <h3 className="font-serif-display text-2xl">CRM inteligente</h3>
            <p className="text-sm text-altair-muted mt-1">
              Conoce a cada cliente, anticipa necesidades y fideliza.
            </p>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px" }}
              className="mt-6 space-y-2.5"
            >
              {[
                {
                  name: "María Souza",
                  detail: "8 visitas · prefiere miércoles",
                  tag: "VIP",
                  tagClass: "bg-gradient-to-r from-amber-400 to-orange-500 text-white",
                  grad: "from-blue-500 to-violet-500",
                },
                {
                  name: "Juan Pereira",
                  detail: "1ª visita · referido por María",
                  tag: "Nuevo",
                  tagClass: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
                  grad: "from-emerald-500 to-teal-500",
                },
                {
                  name: "Ana Lima",
                  detail: "12 visitas · ticket alto",
                  tag: "Fiel",
                  tagClass: "bg-blue-500/15 text-blue-700 dark:text-blue-300",
                  grad: "from-pink-500 to-violet-500",
                },
              ].map((c) => (
                <motion.div
                  key={c.name}
                  variants={itemX}
                  className="flex items-center gap-3 rounded-xl border border-black/5 dark:border-white/5 bg-white/40 dark:bg-white/5 p-3"
                >
                  <div className={`h-9 w-9 rounded-full bg-gradient-to-br ${c.grad}`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{c.name}</p>
                    <p className="text-xs text-altair-muted">{c.detail}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${c.tagClass}`}>
                    {c.tag}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </SpotlightCard>
        </div>
      </div>
    </motion.section>
  );
}