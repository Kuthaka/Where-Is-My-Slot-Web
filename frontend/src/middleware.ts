import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  const isBusinessOnboarding =
    pathname.startsWith("/business/register/onboarding") ||
    pathname === "/business/register/success";

  const isAuthRoute =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/business/login" ||
    pathname === "/business/register" ||
    pathname === "/admin/login";

  const isBusinessPage =
    pathname.startsWith("/business/") && !isAuthRoute && !isBusinessOnboarding;
    
  const isAdminPage =
    pathname.startsWith("/admin/") && !pathname.startsWith("/admin/login");

  const isUserPage = pathname.startsWith("/profile");

  if (!token) {
    if (isBusinessPage || isBusinessOnboarding) {
      return NextResponse.redirect(new URL("/business/login", request.url));
    }
    if (isAdminPage) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    if (isUserPage) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  // Decode token payload (Basic base64 decode without signature verification)
  try {
    const payloadBase64 = token.split(".")[1];
    if (!payloadBase64) throw new Error("Invalid token");

    // Replace base64url characters with standard base64 characters
    const base64 = payloadBase64.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const payload = JSON.parse(jsonPayload);
    const role = payload.role;

    // Redirect logged in users away from auth pages
    if (isAuthRoute) {
      if (role === "SUPER_ADMIN") {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      } else if (role === "BUSINESS") {
        return NextResponse.redirect(new URL("/business/dashboard", request.url));
      } else {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }

    // Role-based protection for Admin routes
    if (isAdminPage && role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Role-based protection for Business routes
    if (isBusinessPage && role !== "BUSINESS" && role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (isBusinessOnboarding && role !== "BUSINESS" && role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    // If token is invalid, clear it and redirect to appropriate login
    if (isBusinessPage || isBusinessOnboarding) {
      const bizResponse = NextResponse.redirect(new URL("/business/login", request.url));
      bizResponse.cookies.delete("token");
      return bizResponse;
    }
    if (isAdminPage) {
      const adminResponse = NextResponse.redirect(new URL("/admin/login", request.url));
      adminResponse.cookies.delete("token");
      return adminResponse;
    }
    
    // Default response for user routes or general invalid token
    const defaultResponse = isUserPage 
        ? NextResponse.redirect(new URL("/login", request.url)) 
        : NextResponse.next();
        
    defaultResponse.cookies.delete("token");
    return defaultResponse;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - static files (svg, png, jpg, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
