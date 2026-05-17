import { NextRequest, NextResponse } from "next/server";

const authRoutes = [
  "/client/login",
  "/client/register",
];

const privateRoutes = [
  "/dashboard",
];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;

  const pathname = request.nextUrl.pathname;

  const isHomeRoute = pathname === "/";

  const isAuthRoute = authRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Home
  if (isHomeRoute && token) {
      return NextResponse.redirect(
        new URL("/dashboard", request.url)
      );
  }

  // Rotas privadas sem token
  if (isPrivateRoute && !token) {
    return NextResponse.redirect(
      new URL("/client/login", request.url)
    );
  }

  // Login/Register com token
  if (isAuthRoute && token) {
    return NextResponse.redirect(
      new URL("/dashboard", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/client/:path*",
    "/dashboard/:path*",
  ],
};