// components/layout/header/navbar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { Menu } from "lucide-react";

import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";
import { links } from "./navbar-links";

// Tipamos explícitamente las variantes para eliminar el error de TypeScript
const navContainerVariants: Variants = {
  hidden: { opacity: 0, y: -15 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8, // Más lento para una entrada sutil
      ease: [0.16, 1, 0.3, 1], // Curva ultra suave (easeOutExpo)
      staggerChildren: 0.08, // Espaciado rítmico entre elementos
    },
  },
};

const navItemVariants: Variants = {
  hidden: { opacity: 0, y: -10 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.header
        initial="hidden"
        animate="show"
        variants={navContainerVariants}
        className="fixed top-0 z-40 w-full border-b border-slate-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 transition-colors duration-200"
      >
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-3">
          
          {/* LOGO */}
          <motion.div variants={navItemVariants}>
            <Link href="/" aria-label="Altair home">
              <Logo />
            </Link>
          </motion.div>

          {/* DESKTOP NAV */}
          <nav className="hidden items-center gap-8 md:flex">
            {links.map((l) => (
              <motion.a
                key={l.label}
                variants={navItemVariants}
                href={l.href}
                className="text-[14px] font-medium text-slate-500 hover:text-[#1B2559] dark:text-neutral-400 dark:hover:text-white transition-colors duration-150"
              >
                {l.label}
              </motion.a>
            ))}
          </nav>

          {/* DESKTOP ACTIONS */}
          <motion.div variants={navItemVariants} className="hidden items-center gap-3 md:flex">
            <Link
              href="/client/login"
              className="rounded-md px-3 py-2 text-[14px] font-medium text-[#1B2559] hover:bg-[#F0F2F8] dark:text-neutral-200 dark:hover:bg-neutral-800 transition-colors duration-150"
            >
              Iniciar sesión
            </Link>

            <Link
              href="/registro"
              className="btn-primary-gradient rounded-lg px-5 py-2.5 text-[14px] font-semibold text-white transition-transform duration-150 active:scale-95"
            >
              Prueba gratis
            </Link>
          </motion.div>

          {/* MOBILE BUTTON */}
          <motion.button
            variants={navItemVariants}
            className="md:hidden text-[#1B2559] dark:text-white cursor-pointer"
            onClick={() => setOpen(true)}
            aria-label="Abrir menú"
          >
            <Menu size={22} />
          </motion.button>
        </div>
      </motion.header>

      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </>
  );
}