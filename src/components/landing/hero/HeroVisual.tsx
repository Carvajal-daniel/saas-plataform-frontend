"use client";

import { useState, useEffect, useRef } from "react";
import { motion, Variants } from "framer-motion";

interface Message {
  id: number;
  type: "in" | "out";
  text: string;
  time: string;
}

const SCRIPT: Omit<Message, "id">[] = [
  { type: "in",  text: "Oi! Quero agendar um horário 😊",                time: "09:41" },
  { type: "out", text: "Olá! Tenho amanhã às 14h ou 16h. Qual prefere?", time: "09:41" },
  { type: "in",  text: "16h perfeito ✨",                                 time: "09:42" },
  { type: "out", text: "Agendado! 📅 Te envio um lembrete 1h antes 💙",   time: "09:42" },
  { type: "in",  text: "Obrigada! 🙏",                                    time: "09:43" },
  { type: "out", text: "Até amanhã! 😊",                                  time: "09:43" },
];

const EVENT_DAYS = new Set([2, 5, 9, 12, 16, 19, 23, 26, 30]);
const BUSY_DAYS  = new Set([3, 7, 14, 21, 28]);
const MULTI_DAYS = new Set([6, 13, 20, 27]);
const OFFSET     = 4;
const TODAY      = 2;

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const sceneVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      delayChildren: 0.8, 
      staggerChildren: 0.12, 
    },
  },
};

const calVariants: Variants = {
  hidden: { opacity: 0, x: -32, y: 16 },
  show: {
    opacity: 1, x: 0, y: 0,
    transition: { duration: 0.6, ease: EASE },
  },
};

const phoneVariants: Variants = {
  hidden: { opacity: 0, x: 32, y: 32 },
  show: {
    opacity: 1, x: 0, y: 0,
    transition: { duration: 0.35, ease: EASE },
  },
};

const bubbleVariants: Variants = {
  hidden: { opacity: 0, y: 6, scale: 0.97 },
  show: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.22, ease: "easeOut" },
  },
};

const typingVariants: Variants = {
  hidden: { opacity: 0, y: 4 },
  show: {
    opacity: 1, y: 0,
    transition: { duration: 0.18, ease: "easeOut" },
  },
};

export function HeroVisual() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [typing, setTyping]     = useState(false);
  const [status, setStatus]     = useState("online agora");
  const idxRef   = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bodyRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [messages, typing]);

  useEffect(() => {
    function addNext() {
      const i = idxRef.current;
      if (i >= SCRIPT.length) {
        timerRef.current = setTimeout(() => {
          setMessages([]);
          idxRef.current = 0;
          timerRef.current = setTimeout(addNext, 900);
        }, 3200);
        return;
      }
      setTyping(true);
      setStatus("escribiendo...");
      const m = SCRIPT[i];
      timerRef.current = setTimeout(() => {
        setTyping(false);
        setStatus("online agora");
        setMessages((prev) => [...prev, { ...m, id: Date.now() }]);
        idxRef.current = i + 1;
        timerRef.current = setTimeout(addNext, 850 + Math.random() * 450);
      }, m.type === "out" ? 850 : 600);
    }
    timerRef.current = setTimeout(addNext, 1400);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  return (
    <div className="relative w-full py-6 pb-10">
      <motion.div
        className="relative mx-auto h-[400px] sm:h-[440px] md:h-[480px] max-w-[640px]"
        variants={sceneVariants}
         initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }} 
      transition={{ duration: .8, delay: .5, ease: "easeOut" }}
        animate="show"
      >

        {/* ── CALENDÁRIO ── */}
        <motion.div
          variants={calVariants}
          className="
            absolute left-0 top-0
            w-[20rem] sm:w-lg md:w-md
            min-w-[230px]
            bg-white/90 dark:bg-slate-900/90
            backdrop-blur-sm
            border border-black/[0.06] dark:border-white/[0.06]
            rounded-2xl md:rounded-[20px]
            p-4 md:p-5
            shadow-[0_20px_60px_-10px_rgba(16,185,129,0.08),0_4px_20px_rgba(0,0,0,0.06)]
          "
        >
          {/* dots */}
          <div className="flex items-center gap-1.5 mb-3 md:mb-4">
            <span className="h-[9px] w-[9px] rounded-full bg-rose-400" />
            <span className="h-[9px] w-[9px] rounded-full bg-amber-400" />
            <span className="h-[9px] w-[9px] rounded-full bg-emerald-400" />
            <span className="ml-2 text-[10px] tracking-wide text-slate-400 dark:text-slate-500">
              altair · agenda
            </span>
          </div>

          {/* header */}
          <div className="flex items-center justify-between mb-2.5">
            <p className="text-[11px] font-medium tracking-wide text-slate-400 dark:text-slate-500">
              Maio 2026
            </p>
            <div className="flex gap-1">
              {["‹", "›"].map((ch) => (
                <button
                  key={ch}
                  className="
                    w-[22px] h-[22px] rounded-md text-[12px]
                    flex items-center justify-center
                    border border-black/[0.06] dark:border-white/[0.06]
                    text-slate-400
                    hover:bg-black/5 dark:hover:bg-white/5
                    transition-colors
                  "
                >
                  {ch}
                </button>
              ))}
            </div>
          </div>

          {/* grid */}
          <div className="grid grid-cols-7 gap-[3px]">
            {["S","T","Q","Q","S","S","D"].map((d, i) => (
              <div
                key={`wday-${i}`}
                className="text-[9px] sm:text-[10px] font-semibold text-slate-400 dark:text-slate-500 text-center pb-1 tracking-wider"
              >
                {d}
              </div>
            ))}

            {Array.from({ length: OFFSET }).map((_, i) => (
              <div key={`off-${i}`} className="aspect-square" />
            ))}

            {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => {
              const isToday = d === TODAY;
              const isEvent = EVENT_DAYS.has(d);
              const isBusy  = BUSY_DAYS.has(d);
              const isMulti = MULTI_DAYS.has(d);

              let cls = "";
              if (isToday) {
                cls = "bg-emerald-500 text-white font-bold";
              } else if (isEvent) {
                cls = "bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400";
              } else if (isBusy) {
                cls = "bg-violet-500/10 dark:bg-violet-500/15 text-violet-600 dark:text-violet-400";
              } else if (isMulti) {
                cls = "bg-amber-400/10 dark:bg-amber-400/15 text-amber-600 dark:text-amber-400";
              } else {
                cls = "text-slate-400 dark:text-slate-500 hover:bg-black/5 dark:hover:bg-white/5";
              }

              return (
                <div
                  key={d}
                  className={`
                    aspect-square rounded-[7px] flex flex-col items-center justify-center
                    text-[10px] sm:text-[11px] font-medium relative cursor-pointer transition-colors
                    ${cls}
                  `}
                >
                  {d}
                  {!isToday && (isEvent || isBusy || isMulti) && (
                    <span
                      className={`
                        absolute bottom-[2px] w-[3px] h-[3px] rounded-full
                        ${isEvent ? "bg-emerald-400" : isBusy ? "bg-violet-400" : "bg-amber-400"}
                      `}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* legenda */}
          <div className="hidden sm:flex gap-3 mt-2.5">
            {[
              { color: "bg-emerald-400", label: "confirmado" },
              { color: "bg-violet-400",  label: "pendente"   },
              { color: "bg-amber-400",   label: "múltiplos"  },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${l.color}`} />
                <span className="text-[10px] text-slate-400 dark:text-slate-500">{l.label}</span>
              </div>
            ))}
          </div>

          {/* stats */}
          <div className="mt-2.5 grid grid-cols-3 gap-2">
            {[
              { v: "+38",   l: "novos"    },
              { v: "94%",   l: "ocupação" },
              { v: "R$12k", l: "receita"  },
            ].map((s) => (
              <div
                key={s.l}
                className="
                  rounded-[10px]
                  border border-black/[0.05] dark:border-white/[0.05]
                  bg-black/[0.02] dark:bg-white/[0.03]
                  p-2 md:p-2.5
                "
              >
                <p className="text-[12px] md:text-[13px] font-semibold text-slate-700 dark:text-slate-200">
                  {s.v}
                </p>
                <p className="text-[9px] md:text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                  {s.l}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── TELEFONE ── */}
        <motion.div
          variants={phoneVariants}
          className="
            absolute right-0 bottom-0
            w-[138px] sm:w-[168px] md:w-[190px] md:h-[340px]
            rounded-[26px] sm:rounded-[28px]
            border-[5px] sm:border-[6px]
            border-neutral-900 bg-neutral-900
            shadow-[0_24px_60px_-8px_rgba(139,92,246,0.25),0_6px_20px_rgba(0,0,0,0.3)]
          "
        >
          <div className="rounded-[21px] sm:rounded-[23px] overflow-hidden bg-[#0b141a]">

            {/* header */}
            <div className="bg-[#1f2c34] px-2.5 py-2 flex items-center gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-700 flex items-center justify-center text-white text-[9px] sm:text-[10px] font-bold flex-shrink-0">
                AL
              </div>
              <div>
                <p className="text-[10px] sm:text-[11px] font-semibold text-[#e9edef] leading-none">
                  Altair
                </p>
                <p className="text-[9px] sm:text-[10px] text-[#8696a0] mt-0.5 leading-none">
                  {status}
                </p>
              </div>
            </div>

            {/* mensagens */}
            <div
              ref={bodyRef}
              className="px-2 pt-2 pb-1.5 flex flex-col gap-1.5 overflow-hidden bg-[#0b141a]"
              style={{ height: "clamp(150px, 28vw, 220px)" }}
            >
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  variants={bubbleVariants}
                  initial="hidden"
                  animate="show"
                  className={`
                    max-w-[90%] px-2 py-1.5
                    text-[9px] sm:text-[10px] leading-relaxed text-white flex-shrink-0
                    ${m.type === "in"
                      ? "self-start rounded-[9px] rounded-tl-[3px] bg-white/10"
                      : "self-end   rounded-[9px] rounded-tr-[3px] bg-emerald-700/80"
                    }
                  `}
                >
                  {m.text}
                  <span className="block text-[7px] sm:text-[8px] text-white/40 text-right mt-0.5">
                    {m.time}{m.type === "out" ? " ✓✓" : ""}
                  </span>
                </motion.div>
              ))}

              {typing && (
                <motion.div
                  variants={typingVariants}
                  initial="hidden"
                  animate="show"
                  className="inline-flex gap-1 rounded-[9px] rounded-tl-[3px] bg-white/10 px-2.5 py-2 self-start flex-shrink-0"
                >
                  {[0, 0.2, 0.4].map((delay, i) => (
                    <span
                      key={i}
                      className="h-[5px] w-[5px] rounded-full bg-white/55 animate-bounce"
                      style={{ animationDelay: `${delay}s`, animationDuration: "1s" }}
                    />
                  ))}
                </motion.div>
              )}
            </div>

            {/* input bar */}
            <div className="bg-[#1f2c34] mt-5 px-2.5 py-1.5 flex items-center gap-1.5">
              <div className="flex-1 bg-[#2a3942] rounded-full px-2.5 py-1 text-[8px] sm:text-[9px] text-[#8696a0]">
                Mensagem
              </div>
              <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center text-white text-[9px] flex-shrink-0">
                ➤
              </div>
            </div>

          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}