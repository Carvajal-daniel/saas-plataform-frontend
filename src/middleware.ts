// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // 1. Tenta buscar o cookie do token que salvamos no login
  const token = request.cookies.get("auth_token")?.value;

  const isDashboardRoute = request.nextUrl.pathname.startsWith("/dashboard");

  // 2. Se o usuário tentar acessar o dashboard e NÃO tiver o token, redireciona
  if (isDashboardRoute && !token) {
    // ⚠️ Ajuste o '/login' abaixo para a rota real da sua página de login se for diferente
    const loginUrl = new URL("/client/login", request.url); 
    return NextResponse.redirect(loginUrl);
  }

  // Se tiver o token ou não for rota do dashboard, deixa a requisição continuar normal
  return NextResponse.next();
}

// 3. Define quais rotas o Next.js deve vigiar com este Middleware
export const config = {
  matcher: [
    /*
     * Protege a rota /dashboard e qualquer sub-rota dela (ex: /dashboard/usuarios, /dashboard/config)
     * Ignora arquivos estáticos (imagens, favicon, etc.) para não pesar a aplicação
     */
    "/dashboard/:path*",
  ],
};