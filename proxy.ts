import { NextResponse, type NextRequest } from "next/server"
import createIntlMiddleware from "next-intl/middleware"
import { unsealData } from "iron-session"
import { routing } from "./i18n/routing"

const intlMiddleware = createIntlMiddleware(routing)

interface AdminSession {
  isAdmin?: boolean
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Admin routes — not internationalised
  if (pathname.startsWith("/admin")) {
    // Login page is always public
    if (pathname === "/admin/login") {
      return NextResponse.next()
    }

    const secret = process.env.ADMIN_SESSION_SECRET
    if (!secret) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }

    const rawCookie = request.cookies.get("kansei_admin_session")?.value
    if (!rawCookie) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }

    try {
      const sessionData = await unsealData<AdminSession>(rawCookie, { password: secret })
      if (!sessionData.isAdmin) {
        return NextResponse.redirect(new URL("/admin/login", request.url))
      }
    } catch {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }

    return NextResponse.next()
  }

  // All other routes: next-intl locale routing
  return intlMiddleware(request)
}

export const config = {
  matcher: [
    // Match everything except api routes, _next internals, and static files with extensions
    "/((?!api|_next|.*\\..*).*)",
  ],
}
