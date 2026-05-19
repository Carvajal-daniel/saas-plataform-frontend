
"use server" 

import { registerSchema, type RegisterInput } from "./schemas";
import "dotenv/config"

export async function registerActions(data: RegisterInput) {

  const result = registerSchema.safeParse(data);

  if (!result.success) {
    return { success: false, error: "Dados inválidos" };
  }

  try {

    const response = await fetch(`${process.env.API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(result.data)
    });

    const body = await response.json();


    if (!response.ok) {
      return { success: false, error: body.message || "Erro ao cadastrar" };
    }


    return { success: true, data: body };

  } catch (error) {
    return { success: false, error: "Falha na conexão com o servidor" };
  }
}