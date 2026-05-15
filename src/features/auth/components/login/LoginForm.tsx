// auth/components/client/login/login-form.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

import { Logo } from "@/components/layout/header/Logo";
import { LoginHeroInfo } from "./login-hero-info";
import { InputField } from "../ui/input-field";
import { AuthLayout } from "../ui/auth-layout";
import { AnimatedSection } from "@/components/ui/animated-section";
import { Button } from "@/components/ui/Button";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <AuthLayout rightContent={<LoginHeroInfo />}>
      {/* HEADER */}
      <AnimatedSection delay={0.1}>
        <Logo size={24} />
        <h1 className="mt-8 text-3xl font-bold text-[#1B2559] dark:text-white">Bienvenido de vuelta</h1>
        <p className="mt-2 text-slate-500">Ingrese sus credenciales para continuar</p>
      </AnimatedSection>

      {/* FORMULARIO */}
      <form className="mt-8 flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
        
        {/* Email */}
        <InputField delay={0.2} icon={<Mail size={18} color="#7C3AED" />}>
          <input
            type="email"
            placeholder="su@correo.com"
            className="w-full bg-transparent outline-none text-[14px]"
          />
        </InputField>

        {/* Contraseña */}
        <InputField
          delay={0.28}
          icon={<Lock size={18} color="#7C3AED" />}
          right={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          }
        >
          <input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="w-full bg-transparent outline-none text-[14px]"
          />
        </InputField>

        {/* Olvidó contraseña */}
        <AnimatedSection delay={0.36} className="text-right">
          <a href="#" className="text-[13px] font-medium text-purple-600 hover:underline">
            ¿Olvidó su contraseña?
          </a>
        </AnimatedSection>

        <AnimatedSection delay={0.4}>
          <Button
            type="submit"
            className="h-12 w-full btn-primary-gradient rounded-xl font-bold text-white transition-all hover:opacity-90 cursor-pointer"
          >
            Iniciar sesión
          </Button>
        </AnimatedSection>

        {/* Separador */}
        <AnimatedSection delay={0.52} className="my-2 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200 dark:bg-neutral-800" />
          <span className="text-[12px] text-slate-400">o</span>
          <div className="h-px flex-1 bg-slate-200 dark:bg-neutral-800" />
        </AnimatedSection>

        {/* Botón Google */}
        <AnimatedSection delay={0.6}>
          <Button
            type="button"
            variant="outline"
            className="h-12 w-full gap-3 rounded-xl border-slate-200 bg-white text-[14px] font-semibold text-[#1B2559] hover:bg-slate-50 cursor-pointer dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800"
          >
            <GoogleIcon />
            Continuar con Google
          </Button>
        </AnimatedSection>

        {/* Enlace de Registro */}
        <AnimatedSection delay={0.68} className="mt-6 text-center text-sm text-slate-500">
          ¿No tiene cuenta?{" "}
          <Link href="/client/register" className="font-bold text-purple-600 hover:underline">
            Cree una aquí
          </Link>
        </AnimatedSection>
      </form>
    </AuthLayout>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
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