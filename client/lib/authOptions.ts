import { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import axios from "@/lib/axios";

async function refreshToken(token: JWT): Promise<JWT> {
	const res = await axios.post("/auth/refresh", {
		refreshToken: token.backendTokens.refreshToken,
	});

	const response = await res.data;

	// console.log("refresh", response.backendTokens.accessToken);

	return {
		...token,
		backendTokens: {
			accessToken: response.backendTokens.accessToken,
			refreshToken: response.backendTokens.refreshToken,
			expiresIn: response.backendTokens.expiresIn,
		},
	};
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

			return true; // Autoriser la connexion
		},
		async jwt({ token, user, account }) {
			if (account?.backendTokens && account?.user) {
				token.backendTokens = account.backendTokens;
				token.user = account.user;
			}

			if (user) return { ...token, ...user };

			if (new Date().getTime() < token.backendTokens.expiresIn) return token;

			return await refreshToken(token);
		},

		async session({ token, session }) {
			session.user = token.user;
			session.backendTokens = token.backendTokens;
			return session;
		},
	},
};
