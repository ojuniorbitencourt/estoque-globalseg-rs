import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Verificar se estamos em um redirecionamento de falha de autenticação
  const authFailed = request.nextUrl.searchParams.get("auth_failed")

  // Se já estamos em um redirecionamento de falha, não interferir
  if (authFailed) {
    return NextResponse.next()
  }

  const path = request.nextUrl.pathname
  const isPublicPath = path === "/login"
  const token = request.cookies.get("auth_token")?.value || ""

  // Redirecionar para login se não estiver autenticado e tentar acessar rota protegida
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Redirecionar para dashboard se já estiver autenticado e tentar acessar login
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Adicione esta condição para a rota raiz
  if (path === "/") {
    if (token) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    } else {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/", "/login", "/dashboard/:path*"],
}
