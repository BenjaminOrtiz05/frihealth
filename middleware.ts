
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value

  const isAuthPage =
    req.nextUrl.pathname.startsWith("/login") ||
    req.nextUrl.pathname.startsWith("/register")

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/chat", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/login", "/register"], // 👈 solo aplicamos en auth pages
}
