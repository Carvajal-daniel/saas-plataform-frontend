import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(3, "El nombre deve tener al menos 3 caracteres"),
  email: z.string().email("Formato de correo inválido"),
  phone: z.string().min(10, "Número de teléfono inválido"),
  password: z.string().min(8, "La contraseña deve tener al menos 8 caracteres"),
});



export type RegisterInput = z.infer<typeof registerSchema>;