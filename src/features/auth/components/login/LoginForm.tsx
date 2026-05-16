// src/modules/auth/components/client/login/login-form.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";

import { Logo } from "@/components/layout/header/Logo";
import { LoginHeroInfo } from "./login-hero-info";
import { InputField } from "../ui/input-field";
import { AuthLayout } from "../ui/auth-layout";
import { AnimatedSection } from "@/components/ui/animated-section";
import { Button } from "@/components/ui/Button";
import { loginAction } from "./api-client";

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError("Por favor, llene todos los campos.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await loginAction(email, password);

      if (!result.success) {
        setError(result.error || "Ocurrió un error inesperado.");
        setIsLoading(false);
        return;
      }

      router.push("/dashboard");
    } catch (err) {
      setError("Error de conexión con el servidor.");
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout rightContent={<LoginHeroInfo />}>
      {/* HEADER */}
      <AnimatedSection delay={0.1}>
        <Logo size={24} />
        <h1 className="mt-8 text-3xl font-bold tracking-tight text-[#1B2559] dark:text-white">
          Bienvenido de vuelta
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Ingrese sus credenciales para continuar
        </p>
      </AnimatedSection>

      {/* FEEDBACK DE ERRO PREMIUM */}
      {error && (
        <AnimatedSection delay={0.15} className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm dark:bg-red-950/30 dark:border-red-900/50 dark:text-red-400">
          {error}
        </AnimatedSection>
      )}

      {/* FORMULARIO */}
      <form className="mt-8 flex flex-col gap-4" onSubmit={onSubmit}>
        
        {/* Campo de Email */}
        <InputField delay={0.2} icon={<Mail size={18} className="text-violet-600 dark:text-violet-400" />}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="su@correo.com"
            disabled={isLoading}
            required
            className="w-full bg-transparent text-sm text-slate-800 dark:text-slate-200 outline-none placeholder:text-slate-400 disabled:opacity-50"
          />
        </InputField>

        {/* Campo de Contraseña */}
        <InputField
          delay={0.28}
          icon={<Lock size={18} className="text-violet-600 dark:text-violet-400" />}
          right={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer disabled:opacity-50 focus:outline-none"
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          }
        >
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            disabled={isLoading}
            required
            className="w-full bg-transparent text-sm text-slate-800 dark:text-slate-200 outline-none placeholder:text-slate-400 disabled:opacity-50"
          />
        </InputField>

        {/* Olvidó contraseña */}
        <AnimatedSection delay={0.36} className="text-right">
          <Link href="/auth/forgot-password" className="text-xs font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 transition-colors">
            ¿Olvidó su contraseña?
          </Link>
        </AnimatedSection>

        {/* Botón de Enviar Formulario */}
        <AnimatedSection delay={0.4}>
          <Button
            type="submit"
            disabled={isLoading}
            className="h-12 w-full btn-primary-gradient rounded-xl font-semibold text-white transition-all hover:opacity-95 focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Iniciando sesión...
              </>
            ) : (
              "Iniciar sesión"
            )}
          </Button>
        </AnimatedSection>

        {/* Separador Visual */}
        <AnimatedSection delay={0.52} className="my-2 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200 dark:bg-neutral-800" />
          <span className="text-xs text-slate-400 dark:text-neutral-500">o</span>
          <div className="h-px flex-1 bg-slate-200 dark:bg-neutral-800" />
        </AnimatedSection>

        {/* Autenticación con Google */}
        <AnimatedSection delay={0.6}>
          <Button
            type="button"
            variant="outline"
            disabled={isLoading}
            className="h-12 w-full gap-3 rounded-xl border-slate-200 bg-white text-sm font-semibold text-[#1B2559] hover:bg-slate-50 transition-colors cursor-pointer dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800 disabled:opacity-50"
          >
            <GoogleIcon />
            Continuar con Google
          </Button>
        </AnimatedSection>

        {/* Navegación al Registro */}
        <AnimatedSection delay={0.68} className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          ¿No tiene cuenta?{" "}
          <Link href="/client/register" className="font-bold text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 transition-colors">
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
      <path fill="#4285F4" d="M17.6 9.2c0-.6-.1-1.2-.2-1.8H9v3.4h4.8a4.1 4.1 0 0 1-1.8 2.7v2.2h2.9c1.7-1.6 2.7-3.9 2.7-6.5z" />
      <path fill="#34A853" d="M9 18c2.4 0 4.5-.8 6-2.2l-2.9-2.2c-.8.5-1.8.9-3.1.9-2.4 0-4.4-1.6-5.1-3.8H.9v2.3A9 9 0 0 0 9 18z" />
      <path fill="#FBBC05" d="M3.9 10.7a5.4 5.4 0 0 1 0-3.4V5H.9a9 9 0 0 0 0 8l3-2.3z" />
      <path fill="#EA4335" d="M9 3.6c1.3 0 2.5.5 3.4 1.3L15 2.3A9 9 0 0 0 .9 5l3 2.3C4.6 5.2 6.6 3.6 9 3.6z" />
    </svg>
  );
}