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
        // Si c'est une route /settings, vérifier le token
        if (req.nextUrl.pathname.startsWith("/settings")) {
          return !!token?.user;
        }
        // Pour toutes les autres routes, autoriser l'accès
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
