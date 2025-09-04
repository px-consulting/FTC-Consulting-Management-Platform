import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const admin = request.cookies.get("admin");
  const userId = request.cookies.get("userId");

  if (pathname.startsWith("/admin") && !admin) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  if (pathname.startsWith("/user") && !userId) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/user/:path*"],
};
