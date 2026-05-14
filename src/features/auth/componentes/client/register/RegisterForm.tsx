"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Grid3x3, CreditCard, User, Phone, Lock, Eye, EyeOff } from "lucide-react";

import { Logo } from "@/components/layout/header/Logo";
import { AuthLayout } from "../ui/auth-layout";
import { AuthHeroInfo } from "../ui/auth-hero-info";
import { InputField } from "../ui/input-field";
import { PasswordRules } from "./password-rules";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  const validations = {
    min: password.length >= 8,
    letter: /[a-zA-Z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const passwordIsValid = Object.values(validations).every(Boolean);

  return (
    <AuthLayout rightContent={<AuthHeroInfo />}>
      {/* HEADER */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
      >
        <Logo size={24} />
        <h1 className="mt-8 text-3xl font-bold text-[#1B2559]">Cree su cuenta</h1>
        <p className="mt-2 text-slate-500">Automatice procesos con IA desde el primer día</p>
      </motion.div>

      <form className="mt-8 flex flex-col gap-4">
        {/* INPUTS (Animação controlada individualmente pelo delay interno) */}
        <InputField delay={0.2} icon={<User size={18} color="#7C3AED" />}>
          <input type="text" placeholder="Nombre completo" className="w-full bg-transparent outline-none text-[14px]" />
        </InputField>

        <InputField delay={0.28} icon={<Mail size={18} color="#7C3AED" />}>
          <input type="email" placeholder="correo@ejemplo.com" className="w-full bg-transparent outline-none text-[14px]" />
        </InputField>

        <InputField delay={0.36} icon={<Phone size={18} color="#7C3AED" />}>
          <input type="tel" placeholder="+58 412 000 0000" className="w-full bg-transparent outline-none text-[14px]" />
        </InputField>

        <InputField 
          delay={0.44} 
          icon={<Lock size={18} color="#7C3AED" />}
          right={
            <button type="button" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={18} color="#94A3B8" /> : <Eye size={18} color="#94A3B8" />}
            </button>
          }
        >
          <input 
            type={showPassword ? "text" : "password"} 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Digite su contraseña" 
            className="w-full bg-transparent outline-none text-[14px]" 
          />
        </InputField>

        {/* REGRAS DE VALIDAÇÃO */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.52, duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
        >
          <PasswordRules validations={validations} />
        </motion.div>

        {/* BOTÃO PRINCIPAL */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
          type="submit"
          disabled={!passwordIsValid}
          className="h-12 w-full btn-primary-gradient rounded-xl font-bold text-white transition-all hover:opacity-90 disabled:opacity-50"
        >
          Crear cuenta
        </motion.button>

        {/* FOOTER DO FORMULÁRIO */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.68, duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
          className="mt-4 flex flex-wrap gap-4 text-[12px] text-slate-500"
        >
          <div className="flex items-center gap-2">
            <Grid3x3 size={14} color="#7C3AED" /> Digitalice procesos
          </div>
          <div className="flex items-center gap-2">
            <CreditCard size={14} color="#7C3AED" /> No necesita tarjeta
          </div>
        </motion.div>

        {/* LINK DE LOGIN */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.76, duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
          className="mt-6 text-center text-sm text-slate-500"
        >
          ¿Ya tiene cuenta?{" "}
          <Link href="/client/login" className="font-bold text-purple-600 hover:underline">
            Inicie sesión
          </Link>
        </motion.p>
      </form>
    </AuthLayout>
  );
}