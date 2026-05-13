"use client";

import { motion } from "framer-motion";
import { FaLinkedin, FaInstagram, FaTwitter } from "react-icons/fa";
import { Logo } from "../../layout/header/Logo";

const cols = [
  { title: "Producto", items: ["Funciones", "API", "Panel", "Integraciones", "Changelog"] },
  { title: "Empresa", items: ["Sobre nosotros", "Blog", "Carreras", "Socios", "Prensa"] },
  { title: "Soporte", items: ["Ayuda", "Estado", "Contacto", "Comunidad", "Seguridad"] },
];

export function Footer() {
  return (
    <motion.footer
      className="border-t border-black/5 dark:border-white/5 bg-neutral-50 dark:bg-neutral-950 px-5 pt-12 pb-8"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="mx-auto max-w-7xl">

        {/* TOP */}
        <div className="flex flex-col gap-10 md:grid md:grid-cols-4">

          {/* LOGO + TEXTO */}
          <div className="text-center md:text-left">
            <div className="flex justify-center md:justify-start">
              <Logo />
            </div>

            <p className="mt-4 font-serif-display text-base md:text-lg leading-snug">
              La revolución de la gestión inteligente de agendas.
            </p>

            <p className="mt-3 text-sm text-altair-muted max-w-xs mx-auto md:mx-0">
              Altair conecta tu agenda, tu WhatsApp y tus clientes en una experiencia sin fricción.
            </p>
          </div>

          {/* COLUNAS */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:contents">
            {cols.map((c) => (
              <div key={c.title} className="text-center sm:text-left">
                <p className="text-sm font-semibold mb-3">{c.title}</p>

                <ul className="space-y-2 text-sm text-altair-muted">
                  {c.items.map((i) => (
                    <li key={i}>
                      <a
                        href="#"
                        className="hover:text-foreground transition"
                      >
                        {i}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

        </div>

        {/* BOTTOM */}
        <div className="mt-12 flex flex-col items-center gap-5 border-t border-black/5 dark:border-white/5 pt-6 md:flex-row md:justify-between">

          {/* COPYRIGHT */}
          <p className="text-xs text-altair-muted text-center md:text-left">
            © 2026 Altair. Todos los derechos reservados.
          </p>

          {/* LINKS */}
          <div className="flex items-center gap-5 text-xs text-altair-muted">
            <a href="#" className="hover:text-foreground transition">Privacidad</a>
            <a href="#" className="hover:text-foreground transition">Términos</a>
          </div>

          {/* SOCIAL */}
          <div className="flex items-center gap-3">
            {[
              { I: FaInstagram, l: "Instagram" },
              { I: FaLinkedin, l: "LinkedIn" },
              { I: FaTwitter, l: "Twitter" },
            ].map(({ I, l }) => (
              <a
                key={l}
                href="#"
                aria-label={l}
                className="grid h-8 w-8 place-items-center rounded-full border border-black/10 dark:border-white/10 transition hover:bg-blue-600 hover:text-white hover:border-blue-600"
              >
                <I size={14} />
              </a>
            ))}
          </div>

        </div>
      </div>
    </motion.footer>
  );
}