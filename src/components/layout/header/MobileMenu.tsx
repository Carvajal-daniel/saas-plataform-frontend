// components/layout/header/MobileMenu.tsx
"use client";

import Link from "next/link";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { X } from "lucide-react";

import { Logo } from "./Logo";
import { links } from "./navbar-links";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

// TIPADO DE VARIANTES (Elimina errores de TypeScript y mantiene la animación original)
const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const drawerVariants: Variants = {
  hidden: { y: "100%" },
  show: { 
    y: 0, 
    transition: { duration: 0.38, ease: [0.16, 1, 0.3, 1] } 
  },
  exit: { 
    y: "100%", 
    transition: { duration: 0.38, ease: [0.16, 1, 0.3, 1] } 
  },
};

const navContainerVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06 }, // Tu efecto cascada original
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } 
  },
};

const actionsVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { delay: 0.28, duration: 0.35, ease: [0.16, 1, 0.3, 1] } 
  },
};

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[999] md:hidden">
          
          {/* BACKDROP ANIMADO */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            className="fixed inset-0 bg-black/35"
            onClick={onClose}
          />

          {/* DRAWER ANIMADO */}
          <motion.div
            variants={drawerVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            className="fixed bottom-0 left-0 right-0 z-[1000] max-h-[90vh] overflow-hidden rounded-t-[20px] bg-[#F4F2EE] pb-[env(safe-area-inset-bottom,16px)] shadow-2xl"
          >
            {/* HANDLE */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="h-1 w-9 rounded-full bg-black/15" />
            </div>

            {/* HEADER */}
            <div className="flex items-center justify-between border-b border-black/5 px-6 py-4">
              <Logo />

              <button
                onClick={onClose}
                aria-label="Cerrar menú"
                className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-black/5 text-neutral-900 border-none cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* LINKS NAVEGACIÓN (Animación Stagger Activa) */}
            <motion.nav
              variants={navContainerVariants}
              initial="hidden"
              animate="show"
              className="flex flex-col px-4 pt-3 pb-2"
            >
              {links.map((l) => (
                <motion.a
                  key={l.label}
                  href={l.href}
                  onClick={onClose}
                  variants={itemVariants}
                  className="flex items-center justify-between border-b border-black/5 px-3 py-4 text-[17px] font-medium text-neutral-900 no-underline tracking-tight"
                >
                  {l.label}
                  <span className="text-black/25 text-[18px]">→</span>
                </motion.a>
              ))}
            </motion.nav>

            {/* BOTONES DE ACCIÓN ANIMADOS */}
            <motion.div
              variants={actionsVariants}
              initial="hidden"
              animate="show"
              className="flex flex-col gap-3 px-4 py-5"
            >
              <Link
                href="/client/login"
                onClick={onClose}
                className="flex h-13 items-center justify-center rounded-full border border-black/15 text-[15px] font-medium text-neutral-900 bg-transparent no-underline"
              >
                Iniciar sesión
              </Link>

              <Link
                href="/client/register"
                onClick={onClose}
                className="flex h-13 items-center justify-center gap-2 rounded-full bg-neutral-900 text-[15px] font-semibold text-white no-underline"
              >
                Comenzar gratis
                <span className="text-[16px]">→</span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}