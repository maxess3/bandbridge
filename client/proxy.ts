import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(request: NextRequest) {
	// Ajouter le pathname aux headers pour l'utiliser dans les composants serveur
	const headers = new Headers(request.headers);
	headers.set("x-current-path", request.nextUrl.pathname);

	// Vérifier si l'utilisateur essaie d'accéder à la page settings
	if (request.nextUrl.pathname.startsWith("/settings")) {
		try {
			// Vérifier le token JWT avec validation complète
			const token = await getToken({
				req: request,
				secret: process.env.NEXTAUTH_SECRET,
			});

			// Si pas de token ou token invalide (utilisateur non authentifié), rediriger vers la page de connexion
			if (!token || !token.user) {
				const loginUrl = new URL("/auth/login", request.url);

				// Valider que le callbackUrl est sûr (seulement les routes internes)
				const callbackUrl = request.nextUrl.pathname;
				if (callbackUrl.startsWith("/settings")) {
					loginUrl.searchParams.set("callbackUrl", callbackUrl);
				}

				// Ajouter des headers de sécurité pour éviter les attaques CSRF et autres
				const response = NextResponse.redirect(loginUrl);
				response.headers.set("X-Frame-Options", "DENY");
				response.headers.set("X-Content-Type-Options", "nosniff");
				response.headers.set(
					"Referrer-Policy",
					"strict-origin-when-cross-origin"
				);

				return response;
			}
		} catch (error) {
			// En cas d'erreur de validation du token, rediriger vers la connexion
			console.error("Token validation error:", error);
			const loginUrl = new URL("/auth/login", request.url);

			// Ajouter des headers de sécurité
			const response = NextResponse.redirect(loginUrl);
			response.headers.set("X-Frame-Options", "DENY");
			response.headers.set("X-Content-Type-Options", "nosniff");
			response.headers.set(
				"Referrer-Policy",
				"strict-origin-when-cross-origin"
			);

			return response;
		}
	}

	return NextResponse.next({ headers });
}

export const config = {
	matcher: [
		// match all routes except static files and APIs
		"/((?!api|_next/static|_next/image|favicon.ico).*)",
	],
};
