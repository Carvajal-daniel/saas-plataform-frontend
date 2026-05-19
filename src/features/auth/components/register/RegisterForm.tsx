"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Mail,
  User,
  Phone,
  Lock,
  Building2,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
} from "lucide-react";

import { useRouter } from "next/navigation";

import { AnimatedSection } from "@/components/ui/animated-section";
import { Button } from "@/components/ui/Button";
import { InputField } from "../ui/input-field";
import { AuthLayout } from "../ui/auth-layout";
import { AuthHeroInfo } from "../ui/auth-hero-info";

import { PasswordRules } from "./password-rules";
import { RegisterHeader } from "./register-header";
import { RegisterFooter } from "./register-footer";
import { registerActions } from "./actions";

export default function RegisterPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // COMPANY STATES
  const [companyName, setCompanyName] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");

  // OWNER STATES
  const [ownerName, setOwnerName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");

  // PASSWORD
  const [password, setPassword] = useState("");

  // ERRORS
  const [errors, setErrors] = useState<{
    companyName?: string;
    companyEmail?: string;
    companyPhone?: string;

    ownerName?: string;
    ownerEmail?: string;
    ownerPhone?: string;

    password?: string;
    global?: string;
  }>({});

  const validations = {
    min: password.length >= 8,
    letter: /[a-zA-Z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const passwordIsValid = Object.values(validations).every(Boolean);

  const handleInputChange = (
    field: keyof typeof errors,
    value: string,
    setter: (val: string) => void
  ) => {
    setter(value);

    if (errors[field] || errors.global) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
        global: undefined,
      }));
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const localErrors: typeof errors = {};

    // COMPANY VALIDATION
    if (!companyName.trim()) {
      localErrors.companyName = "El nombre de la empresa es obligatorio";
    }

    if (!companyEmail.trim()) {
      localErrors.companyEmail = "El correo de la empresa es obligatorio";
    }

    if (!companyPhone.trim()) {
      localErrors.companyPhone = "El teléfono de la empresa es obligatorio";
    }

    // OWNER VALIDATION
    if (!ownerName.trim()) {
      localErrors.ownerName = "El nombre es obligatorio";
    }

    if (!ownerEmail.trim()) {
      localErrors.ownerEmail = "El correo es obligatorio";
    }

    if (!ownerPhone.trim()) {
      localErrors.ownerPhone = "El teléfono es obligatorio";
    }

    // PASSWORD
    if (!password) {
      localErrors.password = "La contraseña es obligatoria";
    }

    if (Object.keys(localErrors).length > 0) {
      setErrors(localErrors);
      return;
    }

    if (!passwordIsValid || isLoading) return;

    setIsLoading(true);

    try {
      const response = await registerActions({
        companyName,
        companyEmail,
        companyPhone,

        ownerName,
        ownerEmail,
        ownerPhone,

        password,
      });

      if (!response.success) {
        const errorMsg = response.error.toLowerCase();

        if (errorMsg.includes("empresa")) {
          setErrors({ companyEmail: response.error });
        } else if (
          errorMsg.includes("correo") ||
          errorMsg.includes("email")
        ) {
          setErrors({ ownerEmail: response.error });
        } else {
          setErrors({ global: response.error });
        }

        return;
      }

      router.push("/dashboard");
    } catch (error) {
      setErrors({
        global: "Ocurrió un error inesperado. Intente de nuevo.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout rightContent={<AuthHeroInfo />}>
      <RegisterHeader />

      <form className="mt-8 flex flex-col gap-4" onSubmit={onSubmit}>
        {/* GLOBAL ERROR */}
        {errors.global && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2.5 rounded-xl bg-red-50 border border-red-200 p-3.5 text-sm text-red-600 font-medium"
          >
            <AlertCircle size={18} className="shrink-0" />
            {errors.global}
          </motion.div>
        )}

        {/* COMPANY SECTION */}
        <AnimatedSection delay={0.1}>
          <h3 className="text-sm font-bold text-slate-700 mb-2">
            Datos de la empresa
          </h3>
        </AnimatedSection>

        {/* COMPANY NAME */}
        <InputField
          delay={0.2}
          icon={<Building2 size={18} color="#7C3AED" />}
          error={errors.companyName}
        >
          <input
            type="text"
            value={companyName}
            onChange={(e) =>
              handleInputChange(
                "companyName",
                e.target.value,
                setCompanyName
              )
            }
            placeholder="Nombre de la empresa"
            className="w-full bg-transparent outline-none text-[14px]"
            disabled={isLoading}
          />
        </InputField>

        {/* COMPANY EMAIL */}
        <InputField
          delay={0.28}
          icon={<Mail size={18} color="#7C3AED" />}
          error={errors.companyEmail}
        >
          <input
            type="email"
            value={companyEmail}
            onChange={(e) =>
              handleInputChange(
                "companyEmail",
                e.target.value,
                setCompanyEmail
              )
            }
            placeholder="empresa@ejemplo.com"
            className="w-full bg-transparent outline-none text-[14px]"
            disabled={isLoading}
          />
        </InputField>

        {/* COMPANY PHONE */}
        <InputField
          delay={0.36}
          icon={<Phone size={18} color="#7C3AED" />}
          error={errors.companyPhone}
        >
          <input
            type="tel"
            value={companyPhone}
            onChange={(e) =>
              handleInputChange(
                "companyPhone",
                e.target.value,
                setCompanyPhone
              )
            }
            placeholder="+58 412 000 0000"
            className="w-full bg-transparent outline-none text-[14px]"
            disabled={isLoading}
          />
        </InputField>

        {/* OWNER SECTION */}
        <AnimatedSection delay={0.42}>
          <h3 className="text-sm font-bold text-slate-700 mt-2 mb-2">
            Datos del administrador
          </h3>
        </AnimatedSection>

        {/* OWNER NAME */}
        <InputField
          delay={0.44}
          icon={<User size={18} color="#7C3AED" />}
          error={errors.ownerName}
        >
          <input
            type="text"
            value={ownerName}
            onChange={(e) =>
              handleInputChange(
                "ownerName",
                e.target.value,
                setOwnerName
              )
            }
            placeholder="Nombre completo"
            className="w-full bg-transparent outline-none text-[14px]"
            disabled={isLoading}
          />
        </InputField>

        {/* OWNER EMAIL */}
        <InputField
          delay={0.52}
          icon={<Mail size={18} color="#7C3AED" />}
          error={errors.ownerEmail}
        >
          <input
            type="email"
            value={ownerEmail}
            onChange={(e) =>
              handleInputChange(
                "ownerEmail",
                e.target.value,
                setOwnerEmail
              )
            }
            placeholder="correo@ejemplo.com"
            className="w-full bg-transparent outline-none text-[14px]"
            disabled={isLoading}
          />
        </InputField>

        {/* OWNER PHONE */}
        <InputField
          delay={0.6}
          icon={<Phone size={18} color="#7C3AED" />}
          error={errors.ownerPhone}
        >
          <input
            type="tel"
            value={ownerPhone}
            onChange={(e) =>
              handleInputChange(
                "ownerPhone",
                e.target.value,
                setOwnerPhone
              )
            }
            placeholder="+58 412 000 0000"
            className="w-full bg-transparent outline-none text-[14px]"
            disabled={isLoading}
          />
        </InputField>

        {/* PASSWORD */}
        <InputField
          delay={0.68}
          icon={<Lock size={18} color="#7C3AED" />}
          error={errors.password}
          right={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="cursor-pointer"
              disabled={isLoading}
            >
              {showPassword ? (
                <EyeOff size={18} color="#94A3B8" />
              ) : (
                <Eye size={18} color="#94A3B8" />
              )}
            </button>
          }
        >
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) =>
              handleInputChange(
                "password",
                e.target.value,
                setPassword
              )
            }
            placeholder="Digite su contraseña"
            className="w-full bg-transparent outline-none text-[14px]"
            disabled={isLoading}
          />
        </InputField>

        {/* PASSWORD RULES */}
        <AnimatedSection delay={0.76}>
          <PasswordRules validations={validations} />
        </AnimatedSection>

        {/* SUBMIT */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.8,
            duration: 0.4,
            ease: [0.25, 1, 0.5, 1],
          }}
        >
          <Button
            type="submit"
            disabled={!passwordIsValid || isLoading}
            className="h-12 w-full btn-primary-gradient rounded-xl font-bold text-white transition-all hover:opacity-90 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Creando cuenta...
              </>
            ) : (
              "Crear cuenta"
            )}
          </Button>
        </motion.div>

        <RegisterFooter />

        {/* LOGIN REDIRECT */}
        <AnimatedSection
          delay={0.92}
          className="mt-6 text-center text-sm text-slate-500"
        >
          ¿Ya tiene cuenta?{" "}
          <Link
            href="/client/login"
            className="font-bold text-purple-600 hover:underline"
          >
            Inicie sesión
          </Link>
        </AnimatedSection>
      </form>
    </AuthLayout>
  );
}