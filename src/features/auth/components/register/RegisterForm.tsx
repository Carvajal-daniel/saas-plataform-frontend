// auth/components/client/register/RegisterForm.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, User, Phone, Lock, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

import { AnimatedSection } from "@/components/ui/animated-section"; 
import { Button } from "@/components/ui/Button";
import { InputField } from "../ui/input-field";
import { AuthLayout } from "../ui/auth-layout";
import { AuthHeroInfo } from "../ui/auth-hero-info";

import { PasswordRules } from "./password-rules";
import { RegisterHeader } from "./register-header";
import { RegisterFooter } from "./register-footer";
import { registerActions } from "../../actions";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  // Error States
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
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

  const handleInputChange = (field: keyof typeof errors, value: string, setter: (val: string) => void) => {
    setter(value);
    if (errors[field] || errors.global) {
      setErrors((prev) => ({ ...prev, [field]: undefined, global: undefined }));
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const localErrors: typeof errors = {};
    if (!name.trim()) localErrors.name = "El nombre es obligatorio";
    if (!email.trim()) localErrors.email = "El correo es obligatorio";
    if (!phone.trim()) localErrors.phone = "El teléfono es obligatorio";
    if (!password) localErrors.password = "La contraseña es obligatoria";

    if (Object.keys(localErrors).length > 0) {
      setErrors(localErrors);
      return;
    }

    if (!passwordIsValid || isLoading) return;
    setIsLoading(true);

    try {
      const response = await registerActions({ name, phone, email, password });

      if (!response.success) {
        const errorMsg = response.error.toLowerCase();
        if (errorMsg.includes("correo") || errorMsg.includes("email")) {
          setErrors({ email: response.error });
        } else if (errorMsg.includes("telefono") || errorMsg.includes("phone")) {
          setErrors({ phone: response.error });
        } else if (errorMsg.includes("nombre") || errorMsg.includes("name")) {
          setErrors({ name: response.error });
        } else {
          setErrors({ global: response.error });
        }
        return;
      }

      router.push("/dashboard");
    } catch (error) {
      setErrors({ global: "Ocurrió un error inesperado. Intente de nuevo." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout rightContent={<AuthHeroInfo />}>
      <RegisterHeader />

      <form className="mt-8 flex flex-col gap-4" onSubmit={onSubmit}>
        {/* GLOBAL ERROR BANNER */}
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
        
        {/* FORM FIELDS */}
        <InputField delay={0.2} icon={<User size={18} color="#7C3AED" />} error={errors.name}>
          <input 
            type="text" 
            value={name}
            onChange={(e) => handleInputChange("name", e.target.value, setName)}
            placeholder="Nombre completo" 
            className="w-full bg-transparent outline-none text-[14px]" 
            disabled={isLoading}
          />
        </InputField>

        <InputField delay={0.28} icon={<Mail size={18} color="#7C3AED" />} error={errors.email}>
          <input 
            type="email" 
            value={email}
            onChange={(e) => handleInputChange("email", e.target.value, setEmail)}
            placeholder="correo@ejemplo.com" 
            className="w-full bg-transparent outline-none text-[14px]" 
            disabled={isLoading}
          />
        </InputField>

        <InputField delay={0.36} icon={<Phone size={18} color="#7C3AED" />} error={errors.phone}>
          <input 
            type="tel" 
            value={phone}
            onChange={(e) => handleInputChange("phone", e.target.value, setPhone)}
            placeholder="+58 412 000 0000" 
            className="w-full bg-transparent outline-none text-[14px]" 
            disabled={isLoading}
          />
        </InputField>

        <InputField 
          delay={0.44} 
          icon={<Lock size={18} color="#7C3AED" />}
          error={errors.password}
          right={
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="cursor-pointer" disabled={isLoading}>
              {showPassword ? <EyeOff size={18} color="#94A3B8" /> : <Eye size={18} color="#94A3B8" />}
            </button>
          }
        >
          <input 
            type={showPassword ? "text" : "password"} 
            value={password}
            onChange={(e) => handleInputChange("password", e.target.value, setPassword)}
            placeholder="Digite su contraseña" 
            className="w-full bg-transparent outline-none text-[14px]" 
            disabled={isLoading}
          />
        </InputField>

        {/* VALIDATION VALIDATORS */}
        <AnimatedSection delay={0.52}>
          <PasswordRules validations={validations} />
        </AnimatedSection>

        {/* SUBMIT BUTTON */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
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

        {/* BOTTOM REDIRECT ROUTE */}
        <AnimatedSection delay={0.76} className="mt-6 text-center text-sm text-slate-500">
          ¿Ya tiene cuenta?{" "}
          <Link href="/client/login" className="font-bold text-purple-600 hover:underline">
            Inicie sesión
          </Link>
        </AnimatedSection>
      </form>
    </AuthLayout>
  );
}