import { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import axios from "@/lib/axios";

async function refreshToken(token: JWT): Promise<JWT | null> {
  try {
    // Vérifier si le refresh token existe
    if (!token.backendTokens?.refreshToken) {
      return null;
    }

    const res = await axios.post("/auth/refresh", {
      refreshToken: token.backendTokens.refreshToken,
    });

    const response = await res.data;

    return {
      ...token,
      backendTokens: {
        accessToken: response.backendTokens.accessToken,
        refreshToken: response.backendTokens.refreshToken,
        expiresIn: response.backendTokens.expiresIn,
      },
    };
  } catch (error) {
    console.error("Failed to refresh token", error);
    // Retourner null pour déconnecter l'utilisateur
    return null;
  }
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "Credentials",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "j.lennon@gmail.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)
        if (!credentials?.email || !credentials.password) return null;
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
          {
            method: "POST",
            body: JSON.stringify(credentials),
            headers: { "Content-Type": "application/json" },
          }
        );
        const user = await res.json();
        // If no error and we have user data, return it
        if (res.ok && user) {
          return user;
        }
        // Return null if user data could not be retrieved
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google") {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/google-login`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: profile?.email,
              name: profile?.name,
            }),
          }
        );

        if (!res.ok) {
          console.error("Failed to fetch user info from API");
          return false;
        }

        const data = await res.json();

        account.backendTokens = data.backendTokens;
        account.user = data.user;
      }

      return true; // Allow the connection
    },
    async jwt({ token, user, account, trigger, session }) {
      if (account?.backendTokens && account?.user) {
        token.backendTokens = account.backendTokens;
        token.user = account.user;
        // Réinitialiser l'erreur lors d'une nouvelle connexion
        delete (token as any).error;
      }

      if (user) {
        // Réinitialiser l'erreur lors d'une nouvelle connexion
        delete (token as any).error;
        return { ...token, ...user };
      }

      // Update the token with the session user
      if (trigger === "update" && session) {
        if (session.user) {
          token.user = { ...token.user, ...session.user };
        }
        if (session.backendTokens) {
          token.backendTokens = session.backendTokens;
        }
        // Réinitialiser l'erreur si la session est mise à jour avec succès
        delete (token as any).error;
      }

      // Vérifier si le token existe et a des backendTokens avant de vérifier l'expiration
      if (token.backendTokens?.expiresIn) {
        // Refresh the token if it is expired
        if (new Date().getTime() >= token.backendTokens.expiresIn) {
          const refreshedToken = await refreshToken(token);
          // Si le refresh échoue, marquer l'erreur dans le token
          if (!refreshedToken) {
            return {
              ...token,
              error: "RefreshAccessTokenError",
            } as any;
          }
          // Réinitialiser l'erreur si le refresh réussit
          delete (refreshedToken as any).error;
          return refreshedToken;
        }
      } else if (!token.user) {
        // Si pas de backendTokens et pas de user, le token est invalide
        return {
          ...token,
          error: "RefreshAccessTokenError",
        } as any;
      }

      return token;
    },

    async session({ token, session }) {
      // Si le token contient une erreur de refresh, la propager dans la session
      if ((token as any).error === "RefreshAccessTokenError") {
        (session as any).error = "RefreshAccessTokenError";
        return session;
      }

      // Si le token est null ou n'a pas de user, la session est invalide
      if (!token || !token.user) {
        (session as any).error = "RefreshAccessTokenError";
        return session;
      }

      session.user = token.user;
      session.backendTokens = token.backendTokens;
      return session;
    },
  },
};
