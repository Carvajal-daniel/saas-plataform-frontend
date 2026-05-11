"use client";

import { useState } from "react";

import Link from "next/link";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  Menu,
  X,
} from "lucide-react";

import { Logo } from "./Logo";

const links = [
  { label: "Inicio", href: "#inicio" },
  { label: "Funciones", href: "#funciones" },
  { label: "Precios", href: "#precios" },
  { label: "Integraciones", href: "#integraciones" },
  { label: "Contacto", href: "#contacto" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-40 w-full"
      style={{
        background: "white",
        borderBottom: "1px solid #E2E8F0",
      }}
    >
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-4">
        {/* LOGO */}
        <Link href="/" aria-label="Altair home">
          <Logo />
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-[14px] transition-colors"
              style={{ color: "#64748B" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "#1B2559")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "#64748B")
              }
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* DESKTOP ACTIONS */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/client/login"
            className="rounded-md px-3 py-2 text-[14px] font-medium transition-colors hover:bg-[#F0F2F8]"
            style={{ color: "#1B2559" }}
          >
            Iniciar sesión
          </Link>

          <Link
            href="/registro"
            className="rounded-lg text-[14px] font-semibold text-white"
            style={{
              padding: "10px 20px",
              background: "linear-gradient(to right, #FF6B35, #C026D3, #7C3AED)",
            }}
          >
            Prueba gratis
          </Link>
        </div>

        {/* MOBILE BUTTON */}
        <button
          className="md:hidden"
          onClick={() => setOpen(true)}
          aria-label="Abrir menú"
          style={{ color: "#1B2559" }}
        >
          <Menu size={22} />
        </button>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[999] md:hidden">
            {/* BACKDROP */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0"
              style={{ background: "rgba(0,0,0,0.35)" }}
              onClick={() => setOpen(false)}
            />

            {/* DRAWER — desliza de baixo */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
              className="fixed bottom-0 left-0 right-0 z-[1000] overflow-hidden"
              style={{
                background: "#F4F2EE",
                borderRadius: "20px 20px 0 0",
                maxHeight: "90vh",
              }}
            >
              {/* HANDLE */}
              <div className="flex justify-center pt-3 pb-1">
                <div
                  style={{
                    width: 36,
                    height: 4,
                    borderRadius: 100,
                    background: "rgba(0,0,0,0.15)",
                  }}
                />
              </div>

              {/* HEADER */}
              <div
                className="flex items-center justify-between px-6 py-4"
                style={{ borderBottom: "1px solid rgba(0,0,0,0.07)" }}
              >
                <Logo />
                <button
                  onClick={() => setOpen(false)}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: "rgba(0,0,0,0.06)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#1A1A1A",
                    border: "none",
                    cursor: "pointer",
                  }}
                  aria-label="Cerrar menú"
                >
                  <X size={18} />
                </button>
              </div>

              {/* LINKS */}
              <motion.nav
                initial="hidden"
                animate="show"
                variants={{
                  hidden: {},
                  show: { transition: { staggerChildren: 0.06 } },
                }}
                className="flex flex-col px-4 pt-3 pb-2"
              >
                {links.map((l) => (
                  <motion.a
                    key={l.label}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    variants={{
                      hidden: { opacity: 0, y: 12 },
                      show: { opacity: 1, y: 0 },
                    }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-center justify-between px-3 py-4 text-[17px] font-medium"
                    style={{
                      color: "#1A1A1A",
                      borderBottom: "1px solid rgba(0,0,0,0.06)",
                      textDecoration: "none",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {l.label}
                    <span style={{ color: "rgba(0,0,0,0.25)", fontSize: 18 }}>→</span>
                  </motion.a>
                ))}
              </motion.nav>

              {/* ACTIONS */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col gap-3 px-4 py-5"
              >
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="flex h-13 items-center justify-center text-[15px] font-medium"
                  style={{
                    height: 52,
                    borderRadius: 100,
                    border: "1px solid rgba(0,0,0,0.15)",
                    color: "#1A1A1A",
                    background: "transparent",
                    textDecoration: "none",
                  }}
                >
                  Iniciar sesión
                </Link>

                <Link
                  href="/client/register"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 text-[15px] font-semibold text-white"
                  style={{
                    height: 52,
                    borderRadius: 100,
                    background: "#1A1A1A",
                    textDecoration: "none",
                  }}
                >
                  Comenzar gratis
                  <span style={{ fontSize: 16 }}>→</span>
                </Link>
              </motion.div>

              {/* SAFE AREA */}
              <div style={{ height: "env(safe-area-inset-bottom, 16px)" }} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}
