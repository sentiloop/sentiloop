import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

const authPages = ["/login", "/register", "/forgot-password", "/verify-email", "/otp", "/two-factor"];
const protectedPaths = ["/dashboard"];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isAuthenticated = !!req.auth;

  // Redirect authenticated users away from auth pages
  const isAuthPage = authPages.some((page) => pathname.startsWith(page));
  if (isAuthPage && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl.origin));
  }

  // Protect dashboard routes
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));
  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register", "/forgot-password", "/verify-email", "/otp", "/two-factor"],
};