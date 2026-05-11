"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { container, fadeUp } from "../Reveal";

const GRAD = "linear-gradient(90deg,#F97316 0%,#EC4899 48%,#7C3AED 100%)";

function Badge() {
  return (
    <motion.div variants={fadeUp}>
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          border: "1px solid rgba(124,58,237,0.28)",
          background: "rgba(124,58,237,0.06)",
          padding: "5px 14px 5px 8px",
          borderRadius: 100,
          fontSize: 11.5,
          fontWeight: 500,
          color: "#7C3AED",
          letterSpacing: "0.02em",
          marginBottom: 26,
        }}
      >
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: GRAD,
            display: "inline-block",
            animation: "altair-blink 2s ease-in-out infinite",
          }}
        />
        Plataforma CRM · IA Enterprise
      </span>
    </motion.div>
  );
}

function FeatureCard({ icon, title, sub, gradient }: any) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: 12,
        border: "1px solid rgba(27,37,89,0.07)",
        padding: "12px 14px",
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
        boxShadow: "0 2px 8px rgba(27,37,89,0.04)",
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          background: gradient ? GRAD : "#EEF0F8",
        }}
      >
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#1B2559", lineHeight: 1.2, marginBottom: 2 }}>
          {title}
        </div>
        <div style={{ fontSize: 11, color: "#94A3B8", fontWeight: 400, lineHeight: 1.3 }}>
          {sub}
        </div>
      </div>
    </div>
  );
}

function Notification() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      style={{
        position: "absolute",
        top: 0,
        right: 60,
        background: "white",
        border: "1px solid rgba(27,37,89,0.07)",
        borderRadius: 12,
        padding: "9px 12px",
        display: "flex",
        alignItems: "center",
        gap: 9,
        boxShadow: "0 6px 20px rgba(27,37,89,0.08)",
        zIndex: 10,
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: GRAD,
          flexShrink: 0,
        }}
      />
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, color: "#1B2559" }}>
          Novo lead qualificado
        </div>
        <div style={{ fontSize: 10, color: "#94A3B8" }}>há 2 minutos · IA Score 94%</div>
      </div>
    </motion.div>
  );
}

function MainCard() {
  const bars = [38, 52, 44, 67, 59, 87, 74];
  const pipes = [
    { label: "Qualificado", val: "78%", w: "78%", grad: true },
    { label: "Em proposta", val: "55%", w: "55%", grad: false, color: "#1B2559" },
    { label: "Fechamento", val: "32%", w: "32%", grad: false, color: "#94A3B8" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.6 }}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: 310,
        background: "white",
        borderRadius: 20,
        border: "1px solid rgba(27,37,89,0.08)",
        boxShadow: "0 20px 60px rgba(27,37,89,0.10), 0 4px 12px rgba(27,37,89,0.05)",
        padding: 20,
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 500, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Dashboard CRM
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#1B2559", letterSpacing: "-0.02em", marginTop: 2 }}>
            Visão geral · Jun 2025
          </div>
        </div>
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            fontSize: 10.5,
            fontWeight: 500,
            color: "#059669",
            background: "rgba(5,150,105,0.08)",
            border: "0.5px solid rgba(5,150,105,0.2)",
            padding: "3px 8px",
            borderRadius: 100,
          }}
        >
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#059669", display: "inline-block" }} />
          Ao vivo
        </span>
      </div>

      {/* Metrics */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 7, marginBottom: 14 }}>
        {[["847","Leads"],["R$124k","Pipeline"],["68%","Conversão"]].map(([val, lbl]) => (
          <div key={lbl} style={{ background: "#F8F7FF", border: "0.5px solid rgba(124,58,237,0.1)", borderRadius: 10, padding: "9px 8px" }}>
            <div style={{ fontSize: 17, fontWeight: 800, color: "#1B2559", letterSpacing: "-0.04em", lineHeight: 1, marginBottom: 3 }}>{val}</div>
            <div style={{ fontSize: 8.5, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em" }}>{lbl}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div style={{ background: "#F8F7FF", borderRadius: 11, padding: "11px 10px 9px", marginBottom: 12, border: "0.5px solid rgba(124,58,237,0.08)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 9 }}>
          <span style={{ fontSize: 10.5, color: "#64748B", fontWeight: 500 }}>Receita mensal</span>
          <span style={{ fontSize: 9.5, color: "#7C3AED", fontWeight: 600, background: "rgba(124,58,237,0.08)", padding: "2px 6px", borderRadius: 100 }}>↑ +23%</span>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 52 }}>
          {bars.map((h, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: `${h}%`,
                borderRadius: "3px 3px 0 0",
                background: i === 5 ? GRAD : "#E0DBFA",
              }}
            />
          ))}
        </div>
      </div>

      {/* Pipeline */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {pipes.map((p) => (
          <div key={p.label} style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <span style={{ fontSize: 10, color: "#64748B", width: 56, flexShrink: 0 }}>{p.label}</span>
            <div style={{ flex: 1, height: 4, background: "#EDE9FF", borderRadius: 100, overflow: "hidden" }}>
              <div style={{ width: p.w, height: "100%", background: p.grad ? GRAD : p.color, borderRadius: 100 }} />
            </div>
            <span style={{ fontSize: 10, fontWeight: 700, color: "#1B2559", width: 26, textAlign: "right" }}>{p.val}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function MRRCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      style={{
        position: "absolute",
        top: 48,
        right: -16,
        width: 196,
        background: "white",
        borderRadius: 16,
        border: "1px solid rgba(27,37,89,0.08)",
        boxShadow: "0 12px 40px rgba(27,37,89,0.10)",
        padding: 14,
      }}
    >
      <div style={{ fontSize: 10, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
        MRR este mês
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 36, marginBottom: 10 }}>
        {[
          { h: "40%", bg: "#E0DBFA" },
          { h: "55%", bg: "#C4BBFA" },
          { h: "48%", bg: "#C4BBFA" },
          { h: "70%", bg: "#9D8EF5" },
          { h: "62%", bg: "#7C6FEE" },
          { h: "90%", bg: GRAD },
        ].map((bar, i) => (
          <div key={i} style={{ flex: 1, height: bar.h, borderRadius: "2px 2px 0 0", background: bar.bg }} />
        ))}
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, color: "#1B2559", letterSpacing: "-0.04em", lineHeight: 1 }}>R$48.2k</div>
      <div style={{ fontSize: 10, color: "#94A3B8", marginTop: 3 }}>Receita recorrente mensal</div>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 10, fontWeight: 600, color: "#059669", background: "rgba(5,150,105,0.08)", padding: "2px 7px", borderRadius: 100, marginTop: 6 }}>
        ↑ +18.4% vs mês anterior
      </div>
    </motion.div>
  );
}

function SocialCard() {
  const avs = [
    { initials: "JR", bg: "#1B2559" },
    { initials: "AK", bg: "#7C3AED" },
    { initials: "ML", bg: "#EC4899" },
    { initials: "SP", bg: "#F97316" },
    { initials: "+", bg: "#0891B2" },
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7, duration: 0.5 }}
      style={{
        position: "absolute",
        bottom: 80,
        left: -12,
        width: 188,
        background: "white",
        borderRadius: 16,
        border: "1px solid rgba(27,37,89,0.08)",
        boxShadow: "0 12px 40px rgba(27,37,89,0.10)",
        padding: 14,
      }}
    >
      <div style={{ display: "flex", marginBottom: 8 }}>
        {avs.map((a, i) => (
          <div
            key={i}
            style={{
              width: 26, height: 26, borderRadius: "50%",
              border: "2px solid white",
              marginLeft: i === 0 ? 0 : -6,
              background: a.bg,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 9, fontWeight: 700, color: "white",
            }}
          >
            {a.initials}
          </div>
        ))}
      </div>
      <div style={{ fontSize: 12, fontWeight: 700, color: "#1B2559", marginBottom: 2 }}>2.400+ empresas</div>
      <div style={{ fontSize: 10.5, color: "#94A3B8" }}>confiam no Altair</div>
      <div style={{ color: "#F59E0B", fontSize: 11, letterSpacing: 1, marginTop: 6 }}>★★★★★</div>
    </motion.div>
  );
}

function AIChip() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.9, duration: 0.5 }}
      style={{
        position: "absolute",
        bottom: 16,
        right: 4,
        background: "white",
        border: "1px solid rgba(124,58,237,0.18)",
        borderRadius: 14,
        boxShadow: "0 8px 28px rgba(27,37,89,0.10)",
        padding: "10px 14px",
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      <div
        style={{
          width: 34, height: 34, borderRadius: 10,
          background: GRAD,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 16, color: "white", flexShrink: 0,
        }}
      >
        ✦
      </div>
      <div>
        <div style={{ fontSize: 11.5, fontWeight: 700, color: "#1B2559" }}>IA detectou oportunidade</div>
        <div style={{ fontSize: 10, color: "#94A3B8", marginTop: 2 }}>3 leads prontos para fechar</div>
      </div>
    </motion.div>
  );
}


export function Hero() {
  return (
    <>
      <style>{`
        @keyframes altair-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>

      <section
        id="inicio"
        className="relative overflow-hidden md:mt-20 pb-20 min-h-dvh mt-10"
      >
        {/* Subtle background orbs */}
        <div style={{
          position: "absolute", top: -180, right: -100,
          width: 560, height: 560, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(249,115,22,0.07) 0%, rgba(236,72,153,0.06) 40%, rgba(124,58,237,0.05) 70%, transparent 100%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: -200, left: -120,
          width: 480, height: 480, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(27,37,89,0.05) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(124,58,237,0.035) 1px,transparent 1px),linear-gradient(90deg,rgba(124,58,237,0.035) 1px,transparent 1px)",
          backgroundSize: "52px 52px",
          pointerEvents: "none",
        }} />

        <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-14 px-4 pt-16 pb-10 text-center sm:px-6 md:pt-20 lg:flex-row lg:gap-16 lg:px-8 lg:text-left">

          {/* LEFT */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={container}
            className="flex w-full max-w-[620px] flex-col items-center lg:items-start"
          >
            <Badge />

            <h1
              style={{ fontSize: "clamp(2.4rem, 5vw, 58px)", fontWeight: 800, lineHeight: 1.0, letterSpacing: "-0.045em", marginBottom: 20 }}
            >
              <motion.span variants={fadeUp} style={{ display: "block", color: "#1B2559" }}>
                Gestione<br />relações.
              </motion.span>
              <motion.span
                variants={fadeUp}
                style={{
                  display: "block",
                  background: GRAD,
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                Escale com IA.
              </motion.span>
            </h1>

            <motion.p
              variants={fadeUp}
              style={{ fontSize: 15.5, lineHeight: 1.65, color: "#64748B", maxWidth: 390, marginBottom: 32 }}
            >
              Altair unifica CRM, agendamentos e automação inteligente em uma plataforma enterprise — para equipes que precisam operar com precisão e velocidade.
            </motion.p>

            <motion.div variants={fadeUp} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <a
                href="/register"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 9,
                  background: GRAD, color: "white",
                  fontSize: 14, fontWeight: 600,
                  padding: "13px 26px", borderRadius: 11, border: "none",
                  cursor: "pointer", letterSpacing: "-0.01em", textDecoration: "none",
                  boxShadow: "0 6px 24px rgba(236,72,153,0.35)",
                }}
              >
                Empezar gratis
                <ArrowRight size={14} />
              </a>
              <a
                href="#demo"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: "white", color: "#1B2559",
                  fontSize: 14, fontWeight: 500,
                  padding: "13px 22px", borderRadius: 11,
                  border: "1.5px solid rgba(27,37,89,0.12)",
                  cursor: "pointer", letterSpacing: "-0.02em", textDecoration: "none",
                  boxShadow: "0 2px 8px rgba(27,37,89,0.06)",
                }}
              >
                <span style={{ width: 26, height: 26, borderRadius: "50%", background: "rgba(124,58,237,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="9" height="9" viewBox="0 0 10 10" fill="#7C3AED"><path d="M2 1.5l7 3.5-7 3.5V1.5z"/></svg>
                </span>
                Ver demo
              </a>
            </motion.div>


            
          </motion.div>

          {/* RIGHT */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-4 flex w-full max-w-[580px] justify-center lg:mt-0"
            style={{ position: "relative", height: 560 }}
          >
            <Notification />
            <MainCard />
            <MRRCard />
            <SocialCard />
            <AIChip />
          </motion.div>

        </div>
      </section>
    </>
  );
}
