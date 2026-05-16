// modules/auth/infra/actions/auth.actions.ts
"use server";

import { cookies } from "next/headers"; // 👈 Importe os cookies do Next.js

export async function loginAction(email: string, password: string) {
  if (!email || !password) {
    return { success: false, error: "Por favor, llene todos los campos." };
  }

  try {
    const response = await fetch(`${process.env.API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    
    const body = await response.json();

    if (!response.ok) {
      return { 
        success: false, 
        error: body.message || "Credenciales inválidas o error no servidor." 
      };
    }

  
    if (body.token) {
      const cookieStore = await cookies();
      cookieStore.set("auth_token", body.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 dias
      });
    }

    return { success: true, data: body };

  } catch (error) {
    return { success: false, error: "Falha na conexão com o servidor." };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  
  cookieStore.delete("auth_token");
}