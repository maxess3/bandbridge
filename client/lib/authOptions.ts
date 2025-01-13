import { BASE_URL } from "@/lib/constants";
import { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

async function refreshToken(token: JWT): Promise<JWT> {
  try {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        authorization: `refresh ${token.backendTokens.refreshToken}`,
      },
    });

    const response = await res.json();

    if (!response.ok) {
      throw response;
    }

    console.log("refresh", response);

    return {
      ...token,
      backendTokens: {
        accessToken: response.backendTokens.accessToken,
        refreshToken: response.backendTokens.refreshToken,
        expiresIn: response.backendTokens.expiresIn,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      ...token,
      error: "RefreshTokenError",
    };
  }
}

export const authOptions: NextAuthOptions = {
  secret: process.env.AUTH_SECRET,
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
        const res = await fetch(`${BASE_URL}/auth/login`, {
          method: "POST",
          body: JSON.stringify(credentials),
          headers: { "Content-Type": "application/json" },
        });
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
        // console.log("user google", user);
        // console.log("account google", account);
        // console.log("profile google", profile);

        const res = await fetch(`${BASE_URL}/auth/google-login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: profile?.email,
            name: profile?.name,
          }),
        });

        if (!res.ok) {
          console.error("Failed to fetch user info from API");
          return false;
        }

        const data = await res.json();

        account.backendTokens = data.backendTokens;
        account.user = data.user;
      }

      return true; // Autoriser la connexion
    },
    async jwt({ token, user, account }) {
      console.log("JWT callback - token:", token);
      console.log("JWT callback - account:", account);

      if (account?.backendTokens && account?.user) {
        token.backendTokens = account.backendTokens;
        token.user = account.user;
      }
      // console.log("token jwt", token);
      // console.log("user jwt", user);
      // console.log("token", token.backendTokens);
      if (user) return { ...token, ...user };

      if (new Date().getTime() < token.backendTokens.expiresIn) return token;

      console.log("expiration de l'acces token, appel de la fonction refresg");

      return await refreshToken(token);
    },

    async session({ token, session }) {
      session.user = token.user;
      session.backendTokens = token.backendTokens;
      console.log("token session", token);
      console.log("session session", session);
      return session;
    },
  },
};
