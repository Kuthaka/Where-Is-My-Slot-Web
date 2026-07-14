import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const payloadBase64 = token.split(".")[1];
    if (!payloadBase64) return null;
    const base64 = payloadBase64.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Read both tokens
  const userToken = request.cookies.get("token")?.value;
  const businessToken = request.cookies.get("businessToken")?.value;

  // ─── Route Classification ───────────────────────────────────────────────────
  const isUserAuthRoute =
    pathname === "/login" || pathname === "/register";

  const isBusinessAuthRoute =
    pathname === "/business/login" || pathname === "/business/register";

  const isAdminAuthRoute = pathname === "/admin/login";

  const isAuthRoute = isUserAuthRoute || isBusinessAuthRoute || isAdminAuthRoute;

  const isBusinessPage =
    pathname.startsWith("/business/") &&
    !isBusinessAuthRoute &&
    pathname !== "/business/register/success";

  const isAdminPage =
    pathname.startsWith("/admin/") && !isAdminAuthRoute;

  const isUserPage = pathname.startsWith("/profile");

  // ─── Decode tokens ─────────────────────────────────────────────────────────
  const userPayload = userToken ? decodeJwtPayload(userToken) : null;
  const bizPayload = businessToken ? decodeJwtPayload(businessToken) : null;

  const userRole = userPayload?.role as string | undefined;
  const bizRole = bizPayload?.role as string | undefined;

  const isValidUser = !!userPayload;
  const isValidBusiness = (bizRole === "BUSINESS" || bizRole === "SUPER_ADMIN") && !!bizPayload;

  // ─── Business pages: require businessToken ──────────────────────────────────
  if (isBusinessPage) {
    if (!isValidBusiness) {
      const res = NextResponse.redirect(new URL("/business/login", request.url));
      res.cookies.delete("businessToken");
      return res;
    }
    return NextResponse.next();
  }

  // ─── Admin pages: require userToken with SUPER_ADMIN role ──────────────────
  if (isAdminPage) {
    if (!isValidUser || userRole !== "SUPER_ADMIN") {
      const res = NextResponse.redirect(new URL("/admin/login", request.url));
      res.cookies.delete("token");
      return res;
    }
    return NextResponse.next();
  }

  // ─── User profile pages: require userToken ─────────────────────────────────
  if (isUserPage) {
    if (!isValidUser) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  // ─── Redirect already-logged-in users away from auth pages ─────────────────
  if (isAuthRoute) {
    if (isBusinessAuthRoute && isValidBusiness) {
      return NextResponse.redirect(new URL("/business/dashboard", request.url));
    }
    if (isUserAuthRoute && isValidUser) {
      if (userRole === "SUPER_ADMIN") {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }
      return NextResponse.redirect(new URL("/", request.url));
    }
    if (isAdminAuthRoute && isValidUser && userRole === "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
