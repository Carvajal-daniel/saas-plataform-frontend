"use client";
import { motion } from "framer-motion";

export function AuthLayout({ children, rightContent }: { children: React.ReactNode; rightContent?: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-white overflow-hidden">
      {/* LADO ESQUERDO: Formulário com subida suave e lenta */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
        className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-[45%] xl:w-[40%]"
      >
        <div className="w-full max-w-[420px]">
          {children}
        </div>
      </motion.div>

      {/* LADO DIREITO: Gradiente (Fixo/Sem animação para focar no form) */}
      <div 
        className="relative hidden flex-1 items-center justify-center lg:flex"
        style={{ background: "linear-gradient(135deg, #FF6B35 0%, #7C3AED 50%, #5B21B6 100%)" }}
      >
        <div className="relative z-10 w-full max-w-[500px] px-12">
          {rightContent}
        </div>
      </div>
    </div>
  );
}