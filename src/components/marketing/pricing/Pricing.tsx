"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Emprendedor",
    price: "$15",
    features: [
      "IA para WhatsApp (500 conversaciones)",
      "Gestión básica de ingresos (USD/VES)",
      "1 usuario",
    ],
    cta: "Seleccionar plan",
    highlighted: false,
  },
  {
    name: "Profesional",
    price: "$35",
    features: [
      "IA para WhatsApp (ilimitado)",
      "Gestión avanzada multimoneda",
      "Panel de control predictivo",
      "Soporte prioritario",
    ],
    cta: "Obtener plan Pro",
    highlighted: true,
  },
  {
    name: "Empresarial",
    price: "$70",
    features: [
      "Múltiples sucursales",
      "Integración API personalizada",
      "Auditoría mensual de IA",
    ],
    cta: "Seleccionar plan",
    highlighted: false,
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const stagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const Pricing = () => {
  return (
    <section id="pricing" className="py-24 px-6 relative">

      <div className="container mx-auto text-center">

        {/* label */}
        <motion.span
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="label-tech text-muted-foreground mb-2 block"
        >
          TRANSPARENCIA TOTAL
        </motion.span>

        {/* título */}
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="display-md mb-10"
        >
          Inversión para crecer
        </motion.h2>

        {/* grid */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto"
        >
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              variants={fadeUp}
              className={`rounded-lg bg-white/80 border border-primary/20 p-8 text-left flex flex-col justify-between bg-surface shadow-xl ${
                plan.highlighted
                  ? "bg-surface-high neon-border-active relative"
                  : "bg-surface-high ghost-border"
              }`}
            >

              {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-full">
                  MÁS POPULAR
                </span>
              )}

              <div>
                <h3 className="text-lg font-semibold mb-2">
                  {plan.name}
                </h3>

                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground text-sm">
                    /mes
                  </span>
                </div>

                <ul className="space-y-4">
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-3 text-sm text-muted-foreground"
                    >
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                <Button
                  variant="outline"
                  className={plan.highlighted ? "bg-primary text-primary-foreground" : ""}
                >
                  {plan.cta}
                </Button>
              </div>

            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default Pricing;