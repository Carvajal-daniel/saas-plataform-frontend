"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { ShineButton } from "@/components/ui/ShineButton";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35 },
  },
};

const stagger = {
  hidden: {},
  show: {
    transition: {
      delayChildren: 0.2,
      staggerChildren: 0.12,
    },
  },
};

const AVATARS = [
  "from-emerald-400 to-teal-500",
  "from-blue-400 to-indigo-500",
  "from-violet-400 to-purple-500",
  "from-rose-400 to-pink-500",
];

export default function HeroText() {
  return (
    <motion.div
  variants={stagger}
  initial="hidden"
  animate="show"
  className="text-center md:text-left"
>

      {/* badge */}
      <motion.span
        variants={fadeUp}
        className="inline-flex items-center gap-2 rounded-full border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur px-3 py-1 text-xs text-gray-600 dark:text-gray-400"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
        IA de Agendamiento — Activo 24/7
      </motion.span>

      {/* título */}
      <motion.h1
        variants={fadeUp}
        className="font-[var(--font-montserrat)] mt-6 text-[2.7rem] md:text-7xl font-medium md:leading-[1.10] leading-12 md:tracking-tight tracking-tight text-gray-800 dark:text-white"
      >
        Tu agenda en{" "}
        <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
          piloto automático
        </span>{" "}
        con Isa.
      </motion.h1>

      {/* subtítulo */}
      <motion.p
        variants={fadeUp}
        className="mt-5 mx-auto md:mx-0 max-w-lg text-[1.05rem] md:leading-relaxed text-gray-500 dark:text-gray-400"
      >
        Isa atiende a tus clientes en WhatsApp, agenda citas,
        envía recordatorios y mantiene tu agenda llena — automáticamente.
      </motion.p>

      {/* CTAs */}
      <motion.div
        variants={fadeUp}
        className="mt-8 flex flex-wrap items-center justify-center md:justify-start gap-3"
      >
        <ShineButton>Comenzar gratis →</ShineButton>

        <a
          href="#"
          className="inline-flex items-center gap-1 border border-gray-200 px-4 py-2 rounded-3xl text-sm text-gray-700 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
        >
          Ver demostración
          <span className="opacity-60">→</span>
        </a>
      </motion.div>

      {/* prova social */}
      <motion.div
        variants={fadeUp}
        className="mt-10 flex items-center justify-center md:justify-start gap-4"
      >

        {/* avatars */}
        <div className="flex -space-x-2.5">
          {AVATARS.map((grad, i) => (
            <div
              key={i}
              className={`h-9 w-9 rounded-full bg-gradient-to-br ${grad} ring-2 ring-white dark:ring-gray-950`}
            />
          ))}
        </div>

        {/* estrelas + texto */}
        <div className="text-sm text-center md:text-left">
          <div className="flex justify-center md:justify-start gap-0.5 text-amber-400">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={13} fill="currentColor" strokeWidth={0} />
            ))}
          </div>

          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            <span className="font-semibold text-gray-900 dark:text-white">
              2.400 negocios
            </span>{" "}
            ya automatizan su agenda
          </p>
        </div>

      </motion.div>

    </motion.div>
  );
}