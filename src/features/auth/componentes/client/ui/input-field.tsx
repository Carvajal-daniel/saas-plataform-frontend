"use client";
import { motion } from "framer-motion";

interface InputFieldProps {
  children: React.ReactNode;
  icon: React.ReactNode;
  right?: React.ReactNode;
  delay: number;
}

export function InputField({ children, icon, right, delay }: InputFieldProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
      className="flex h-12 items-center gap-3 rounded-xl px-3.5"
      style={{
        background: "white",
        border: "1.5px solid #E2E8F0",
      }}
    >
      {icon}
      <div className="flex-1">{children}</div>
      {right}
    </motion.div>
  );
}