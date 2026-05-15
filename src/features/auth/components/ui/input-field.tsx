"use client";
import { cn } from "@/features/lib/utils";
import { motion } from "framer-motion";

interface InputFieldProps {
  children: React.ReactNode;
  icon: React.ReactNode;
  right?: React.ReactNode;
  delay: number;
  error?: string; // Adicionado: recebe a string do erro
}

export function InputField({ children, icon, right, delay, error }: InputFieldProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
        className={cn(
          "flex h-12 items-center gap-3 rounded-xl px-3.5 transition-all duration-200 bg-white border-[1.5px]",
          error 
            ? "border-red-500 bg-red-50/30 focus-within:border-red-500 focus-within:ring-4 focus-within:ring-red-500/10" 
            : "border-[#E2E8F0] focus-within:border-purple-500 focus-within:ring-4 focus-within:ring-purple-500/10"
        )}
      >
        <div className={cn("text-slate-400", error && "text-red-400")}>
          {icon}
        </div>
        <div className="flex-1">{children}</div>
        {right}
      </motion.div>
      
      {/* Mensagem de erro animada abaixo do input */}
      {error && (
        <motion.span 
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[12px] font-medium text-red-500 pl-1"
        >
          {error}
        </motion.span>
      )}
    </div>
  );
}