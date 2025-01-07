import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { BASE_URL } from "./lib/constants";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const token = request.cookies.get("token");
  const refreshToken = request.cookies.get("refreshToken");

  console.log("Middleware called for path:", path);
  console.log("Token:", token);
  console.log("Refresh Token:", refreshToken);

  const response = await fetch(`${BASE_URL}/auth/refresh`, {
    headers: {
      Cookie: `${token?.name}=${token?.value};${refreshToken?.name}=${refreshToken?.value}`,
    },
    cache: "no-store",
  });

  // NOT AUTHENTICATED
  // Protected pages
  if (!response.ok) {
    let responseWithCookiesRemoved = NextResponse.next();

    if (path === "/me") {
      responseWithCookiesRemoved = NextResponse.redirect(
        new URL("/auth/login", request.url)
      );
    }
    responseWithCookiesRemoved.cookies.delete("token");
    responseWithCookiesRemoved.cookies.delete("refreshToken");
    return responseWithCookiesRemoved;
  }

  // USER AUTHENTICATED
  // Login and signup pages not accessible when authenticated
  if (path === "/auth/login") {
    console.log("User authenticated, redirecting from login...");
    return NextResponse.redirect(new URL("/", request.url));
  }
  if (path === "/auth/signup") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Protected route
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
