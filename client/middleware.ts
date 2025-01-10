import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { BASE_URL } from "./lib/constants";

function isTokenExpired(token: string | undefined): boolean {
  if (!token) return true;
  const payload = JSON.parse(atob(token.split(".")[1])); // Décoder le payload du JWT
  const exp = payload.exp * 1000; // Convertir en millisecondes
  const now = Date.now();
  return exp < now; // Vérifier si le token expire dans moins de 5 minutes
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get("token");
  const refreshToken = request.cookies.get("refreshToken");
  let response;

  if (isTokenExpired(token?.value)) {
    try {
      response = await fetch(`${BASE_URL}/auth/refresh`, {
        headers: {
          Cookie: `${token?.name}=${token?.value};${refreshToken?.name}=${refreshToken?.value}`,
        },
        cache: "no-store",
      });
    } catch {
      if (path !== "/") {
        return NextResponse.redirect(new URL("/", request.url));
      }
      return NextResponse.next();
    }
  } else {
    return NextResponse.next();
  }

  console.log(response.ok);

  // USER NOT AUTHENTICATED
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
