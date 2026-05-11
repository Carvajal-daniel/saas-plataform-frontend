"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Mail,
  Grid3x3,
  CreditCard,
  User,
  Phone,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

import { useState } from "react";
import { PANEL_GRADIENT, PRIMARY_GRADIENT } from "@/components/landing/ui";
import { Logo } from "@/components/landing/header/Logo";
import { fadeUp } from "@/components/landing/Reveal";



export default function RegisterPage() {
  const [showPassword, setShowPassword] =
    useState(false);

  const [password, setPassword] = useState("");

  const validations = {
    min: password.length >= 8,
    letter: /[a-zA-Z]/.test(password),
    number: /\d/.test(password),
    special:
      /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const passwordIsValid =
    validations.min &&
    validations.letter &&
    validations.number &&
    validations.special;

  return (
    <div
      className="relative flex min-h-screen items-center justify-center px-6 py-16"
      style={{ background: PANEL_GRADIENT }}
    >
      <Link
        href="/client/login"
        className="absolute right-6 top-6 rounded-lg border border-white/70 px-5 py-2 text-[13px] font-semibold text-white hover:bg-white/10"
      >
        ¿Ya tiene cuenta? Entre aquí
      </Link>

      <motion.div
        initial={{
          opacity: 0,
          scale: 0.95,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        transition={{
          duration: 0.5,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="w-full max-w-[480px] overflow-hidden rounded-[20px]"
        style={{
          background: "white",
          boxShadow:
            "0 24px 80px rgba(0,0,0,0.2)",
        }}
      >
        <div
          className="relative h-[4px] w-full"
          style={{ background: "#E2E8F0" }}
        >
          <div
            className="h-full"
            style={{
              width: "35%",
              background:
                "linear-gradient(90deg,#FF6B35,#7C3AED)",
            }}
          />
        </div>

        <div className="p-10">
          <div className="flex items-center justify-between">
            <h1
              className="text-[20px] font-bold"
              style={{ color: "#1B2559" }}
            >
              Cree su cuenta
            </h1>

            <Logo size={18} />
          </div>

          <motion.h2
            initial={{
              opacity: 0,
              y: 16,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.15,
              duration: 0.5,
            }}
            className="mt-6 text-center text-[12px] font-semibold"
            style={{
              color: "#1B2559",
              lineHeight: 1.4,
            }}
          >
            Automatice procesos con IA desde el
            primer día
          </motion.h2>

          <form
            className="mt-8 flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();

              if (!passwordIsValid) {
                alert(
                  "Password does not meet requirements"
                );

                return;
              }

              console.log("submit");
            }}
          >
            {/* FULL NAME */}
            <InputField
              delay={0.2}
              icon={<User size={18} color="#7C3AED" />}
            >
              <input
                type="text"
                placeholder="Nombre completo"
                className="w-full bg-transparent text-[14px] outline-none"
                style={{ color: "#1B2559" }}
              />
            </InputField>

            {/* EMAIL */}
            <InputField
              delay={0.28}
              icon={<Mail size={18} color="#7C3AED" />}
            >
              <input
                type="email"
                placeholder="Digite su correo"
                className="w-full bg-transparent text-[14px] outline-none"
                style={{ color: "#1B2559" }}
              />
            </InputField>

            {/* PHONE */}
            <InputField
              delay={0.36}
              icon={<Phone size={18} color="#7C3AED" />}
            >
              <input
                type="tel"
                placeholder="+58 412 000 0000"
                className="w-full bg-transparent text-[14px] outline-none"
                style={{ color: "#1B2559" }}
              />
            </InputField>

            {/* PASSWORD */}
            <InputField
              delay={0.44}
              icon={<Lock size={18} color="#7C3AED" />}
              right={
                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((v) => !v)
                  }
                >
                  {showPassword ? (
                    <EyeOff
                      size={18}
                      color="#94A3B8"
                    />
                  ) : (
                    <Eye
                      size={18}
                      color="#94A3B8"
                    />
                  )}
                </button>
              }
            >
              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Digite una contraseña"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                className="w-full bg-transparent text-[14px] outline-none"
                style={{ color: "#1B2559" }}
              />
            </InputField>

            {/* PASSWORD RULES */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              transition={{ delay: 0.5 }}
              className="rounded-xl border p-4"
              style={{
                borderColor: "#E2E8F0",
                background: "#FAFAFA",
              }}
            >
              <p
                className="mb-3 text-[13px] font-semibold"
                style={{ color: "#1B2559" }}
              >
                Password requirements
              </p>

              <div className="space-y-2 text-[12px]">
                <Rule
                  ok={validations.min}
                  text="At least 8 characters"
                />

                <Rule
                  ok={validations.letter}
                  text="Contains letters"
                />

                <Rule
                  ok={validations.number}
                  text="Contains numbers"
                />

                <Rule
                  ok={validations.special}
                  text="Contains special characters"
                />
              </div>
            </motion.div>

            <motion.button
              variants={fadeUp}
              initial="hidden"
              animate="show"
              transition={{ delay: 0.55 }}
              type="submit"
              disabled={!passwordIsValid}
              className="inline-flex h-12 w-full items-center justify-center rounded-lg text-[15px] font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
              style={{
                background: PRIMARY_GRADIENT,
              }}
            >
              Crear cuenta
            </motion.button>
          </form>

          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
            <div
              className="flex items-center gap-2 text-[12px]"
              style={{ color: "#64748B" }}
            >
              <Grid3x3
                size={14}
                color="#7C3AED"
              />
              Digitalice procesos rápidamente
            </div>

            <div
              className="flex items-center gap-2 text-[12px]"
              style={{ color: "#64748B" }}
            >
              <CreditCard
                size={14}
                color="#7C3AED"
              />
              No necesita tarjeta de crédito
            </div>
          </div>

          <p
            className="mt-6 text-[12px]"
            style={{
              color: "#94A3B8",
              lineHeight: 1.6,
            }}
          >
            Al crear una cuenta, acepta nuestra{" "}
            <a
              href="#"
              style={{ color: "#7C3AED" }}
            >
              Política de Privacidad
            </a>{" "}
            y{" "}
            <a
              href="#"
              style={{ color: "#7C3AED" }}
            >
              Términos de uso
            </a>
            .
          </p>
        </div>
      </motion.div>
    </div>
  );
}

function InputField({
  children,
  icon,
  right,
  delay,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
  right?: React.ReactNode;
  delay: number;
}) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="show"
      transition={{ delay }}
      className="flex h-12 items-center gap-3 rounded-xl px-3.5"
      style={{
        background: "white",
        border: "1.5px solid #E2E8F0",
      }}
    >
      {icon}

      <div className="flex-1">
        {children}
      </div>

      {right}
    </motion.div>
  );
}

function Rule({
  ok,
  text,
}: {
  ok: boolean;
  text: string;
}) {
  return (
    <div
      className="flex items-center gap-2"
      style={{
        color: ok ? "#16A34A" : "#94A3B8",
      }}
    >
      <div
        className="h-2 w-2 rounded-full"
        style={{
          background: ok
            ? "#16A34A"
            : "#CBD5E1",
        }}
      />

      {text}
    </div>
  );
}