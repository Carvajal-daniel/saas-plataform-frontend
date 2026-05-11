"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Brain,
  Smartphone,
} from "lucide-react";
import { fadeUp } from "@/components/landing/Reveal";
import { Logo } from "@/components/landing/header/Logo";
import { PANEL_GRADIENT, PRIMARY_GRADIENT } from "@/components/landing/ui";



export default function LoginForm() {
  const [show, setShow] = useState(false);

  return (
    <div
      className="flex min-h-screen flex-col md:flex-row"
      style={{ background: "white" }}
    >
      {/* LEFT */}
      <div className="flex w-full items-center justify-center px-6 py-12 md:w-[45%]">
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.07,
              },
            },
          }}
          className="w-full max-w-[360px]"
        >
          <motion.div
            variants={fadeUp}
            className="mb-8 flex justify-center"
          >
            <Logo size={22} />
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-center text-[28px] font-bold"
            style={{
              color: "#1B2559",
              letterSpacing: "-0.01em",
            }}
          >
            Bienvenido de vuelta
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-2 text-center text-[14px]"
            style={{ color: "#64748B" }}
          >
            Ingrese sus credenciales para continuar
          </motion.p>

          <form
            className="mt-8 flex flex-col gap-4"
            onSubmit={(e) => e.preventDefault()}
          >
            <motion.div variants={fadeUp}>
              <Field icon={<Mail size={18} />}>
                <input
                  type="email"
                  placeholder="su@correo.com"
                  className="w-full bg-transparent text-[14px] outline-none"
                  style={{ color: "#1B2559" }}
                />
              </Field>
            </motion.div>

            <motion.div variants={fadeUp}>
              <Field
                icon={<Lock size={18} />}
                right={
                  <button
                    type="button"
                    onClick={() => setShow((v) => !v)}
                    aria-label="Mostrar contraseña"
                    style={{ color: "#94A3B8" }}
                  >
                    {show ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                }
              >
                <input
                  type={show ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full bg-transparent text-[14px] outline-none"
                  style={{ color: "#1B2559" }}
                />
              </Field>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="text-right"
            >
              <a
                href="#"
                className="text-[13px] font-medium"
                style={{ color: "#7C3AED" }}
              >
                ¿Olvidó su contraseña?
              </a>
            </motion.div>

            <motion.button
              variants={fadeUp}
              type="submit"
              className="mt-2 inline-flex h-12 items-center justify-center rounded-lg text-[15px] font-bold text-white"
              style={{ background: PRIMARY_GRADIENT }}
            >
              Iniciar sesión
            </motion.button>

            <motion.div
              variants={fadeUp}
              className="my-2 flex items-center gap-3"
            >
              <div
                className="h-px flex-1"
                style={{ background: "#E2E8F0" }}
              />
              <span
                className="text-[12px]"
                style={{ color: "#94A3B8" }}
              >
                o
              </span>
              <div
                className="h-px flex-1"
                style={{ background: "#E2E8F0" }}
              />
            </motion.div>

            <motion.button
              variants={fadeUp}
              type="button"
              className="inline-flex h-12 items-center justify-center gap-3 rounded-lg text-[14px] font-semibold"
              style={{
                background: "white",
                border: "1.5px solid #E2E8F0",
                color: "#1B2559",
              }}
            >
              <GoogleIcon />
              Continuar con Google
            </motion.button>

            <motion.p
              variants={fadeUp}
              className="mt-4 text-center text-[14px]"
              style={{ color: "#64748B" }}
            >
              ¿No tiene cuenta?{" "}
              <Link
                href="/client/register"
                className="font-semibold"
                style={{ color: "#7C3AED" }}
              >
                Cree una aquí
              </Link>
            </motion.p>
          </form>
        </motion.div>
      </div>

      {/* RIGHT */}
      <div
        className="relative hidden items-center justify-center overflow-hidden p-10 md:flex md:w-[55%]"
        style={{ background: PANEL_GRADIENT }}
      >
        <div className="relative w-full max-w-[400px]">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              delay: 0.3,
              duration: 0.6,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="ml-12 rounded-2xl p-6 shadow-2xl"
            style={{
              background: "white",
              width: 340,
            }}
          >
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <h3
                  className="text-[18px] font-bold"
                  style={{
                    backgroundImage:
                      "linear-gradient(90deg, #FF6B35, #C026D3)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  Lleve Altair con usted.
                </h3>

                <p
                  className="mt-2 text-[13px]"
                  style={{
                    color: "#64748B",
                    lineHeight: 1.6,
                  }}
                >
                  Gestione tareas, aprobaciones y procesos directamente
                  desde su celular.
                </p>

                <div className="mt-3 flex flex-col gap-2">
                  <StoreBadge
                    label="Google Play"
                    sub="Disponible en"
                  />

                  <StoreBadge
                    label="App Store"
                    sub="Descargar en el"
                  />
                </div>
              </div>

              <div
                className="shrink-0 rounded-xl"
                style={{
                  width: 70,
                  height: 130,
                  background:
                    "linear-gradient(180deg,#F0F2F8,#FFFFFF)",
                  border: "1px solid #E2E8F0",
                  boxShadow:
                    "0 8px 20px rgba(27,37,89,0.12)",
                  padding: 8,
                }}
              >
                <div className="space-y-1.5">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="flex items-center gap-1"
                    >
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ background: "#7C3AED" }}
                      />

                      <span
                        className="h-1.5 flex-1 rounded"
                        style={{ background: "#E2E8F0" }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              delay: 0.5,
              duration: 0.6,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="-mt-4 mr-12 rounded-2xl p-6 shadow-2xl"
            style={{
              background: "white",
              width: 340,
            }}
          >
            <div className="mb-3 flex items-center gap-3">
              <span
                className="flex h-10 w-10 items-center justify-center rounded-full"
                style={{
                  background: "#EDE9FE",
                  color: "#7C3AED",
                }}
              >
                <Brain size={20} />
              </span>

              <h3
                className="text-[16px] font-bold"
                style={{ color: "#1B2559" }}
              >
                Agente de IA en Altair
              </h3>
            </div>

            <p
              className="text-[13px]"
              style={{
                color: "#64748B",
                lineHeight: 1.6,
              }}
            >
              Automatice aún más sus flujos con inteligencia
              artificial integrada.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              {["Mis Flujos", "Automatizaciones", "IA"].map(
                (p, i) => (
                  <div
                    key={p}
                    className="flex items-center gap-2"
                  >
                    <span
                      className="rounded-full px-3 py-1 text-[11px] font-semibold"
                      style={
                        i === 2
                          ? {
                              background: "#EDE9FE",
                              color: "#7C3AED",
                            }
                          : {
                              background: "#F0F2F8",
                              color: "#1B2559",
                            }
                      }
                    >
                      {p}
                    </span>

                    {i < 2 && (
                      <ArrowRight
                        size={14}
                        color="#94A3B8"
                      />
                    )}
                  </div>
                )
              )}
            </div>
          </motion.div>

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
      </div>
    </div>
  );
}

function Field({
  icon,
  right,
  children,
}: {
  icon: React.ReactNode;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  const [focus, setFocus] = useState(false);

  return (
    <div
      className="flex h-12 items-center gap-3 rounded-xl px-3.5"
      style={{
        background: "white",
        border: `1.5px solid ${
          focus ? "#7C3AED" : "#E2E8F0"
        }`,
        boxShadow: focus
          ? "0 0 0 4px rgba(124,58,237,0.12)"
          : "none",
        transition:
          "border-color 150ms, box-shadow 150ms",
      }}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
    >
      <span style={{ color: "#94A3B8" }}>{icon}</span>

      <div className="flex-1">{children}</div>

      {right}
    </div>
  );
}

function StoreBadge({
  label,
  sub,
}: {
  label: string;
  sub: string;
}) {
  return (
    <div
      className="inline-flex items-center gap-2 rounded-md px-3 py-1.5"
      style={{
        background: "#1B2559",
        color: "white",
      }}
    >
      <div className="h-5 w-5 rounded bg-white/15" />

      <div className="leading-tight">
        <div className="text-[8px] uppercase opacity-80">
          {sub}
        </div>

        <div className="text-[11px] font-semibold">
          {label}
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      aria-hidden
    >
      <path
        fill="#4285F4"
        d="M17.6 9.2c0-.6-.1-1.2-.2-1.8H9v3.4h4.8a4.1 4.1 0 0 1-1.8 2.7v2.2h2.9c1.7-1.6 2.7-3.9 2.7-6.5z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.4 0 4.5-.8 6-2.2l-2.9-2.2c-.8.5-1.8.9-3.1.9-2.4 0-4.4-1.6-5.1-3.8H.9v2.3A9 9 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.9 10.7a5.4 5.4 0 0 1 0-3.4V5H.9a9 9 0 0 0 0 8l3-2.3z"
      />
      <path
        fill="#EA4335"
        d="M9 3.6c1.3 0 2.5.5 3.4 1.3L15 2.3A9 9 0 0 0 .9 5l3 2.3C4.6 5.2 6.6 3.6 9 3.6z"
      />
    </svg>
  );
}