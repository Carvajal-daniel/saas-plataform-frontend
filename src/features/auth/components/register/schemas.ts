import { z } from "zod";

export const registerSchema = z.object({
  companyName: z
    .string()
    .min(3, "El nombre de la empresa debe tener al menos 3 caracteres"),

  companyEmail: z
    .string()
    .email("Formato de correo empresarial inválido"),

  companyPhone: z
    .string()
    .min(10, "Número de teléfono empresarial inválido"),

  ownerName: z
    .string()
    .min(3, "El nombre del responsable debe tener al menos 3 caracteres"),

  ownerEmail: z
    .string()
    .email("Formato de correo personal inválido"),

  ownerPhone: z
    .string()
    .min(10, "Número de teléfono personal inválido"),

  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres"),
});

export type RegisterInput = z.infer<typeof registerSchema>;