import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the path is for admin-only routes
  const isAdminRoute =
    pathname.startsWith("/blog/new") || pathname.startsWith("/blog/edit") || pathname.startsWith("/admin")

  if (isAdminRoute) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
      secureCookie: process.env.NODE_ENV === "production",
    })

    // If not logged in or not an admin, redirect to login
    if (!token || token.role !== "admin") {
      const url = new URL("/login", request.url)
      url.searchParams.set("callbackUrl", encodeURI(pathname))
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/blog/new", "/blog/edit/:path*", "/admin/:path*"],
}
