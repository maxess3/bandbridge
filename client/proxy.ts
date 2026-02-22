import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

// Middleware avec withAuth pour les routes protégées
export default withAuth(
  function middleware(req) {
    // Ajouter le header x-current-path pour toutes les routes
    const headers = new Headers(req.headers);
    headers.set("x-current-path", req.nextUrl.pathname);

    // Créer la réponse avec les headers
    const response = NextResponse.next({ headers });
    return response;
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;
        // Routes protégées : exiger le token pour accès immédiat (redirect sans attendre la page)
        if (pathname.startsWith("/settings")) {
          return !!token?.user;
        }
        if (/^\/band\/[^/]+\/members\/?$/.test(pathname)) {
          return !!token?.user;
        }
        return true;
      },
    },
    pages: {
      signIn: "/auth/login",
    },
  }
);

export const config = {
  matcher: [
    // Matcher toutes les routes sauf les fichiers statiques
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
