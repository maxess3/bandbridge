import { NextAuth } from "next-auth";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: { id: string; email: string; firstName: string };
    backendTokens: {
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
    };
  }
  interface Account {
    backendTokens: {
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
    };
    user: {
      id: string;
      email: string;
      firstName: string;
    };
  }
}

import { JWT } from "next-auth/jwt";

declare module "next-auth/jwt" {
  interface JWT {
    user: { id: string; email: string; firstName: string };
    backendTokens: {
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
    };
  }
}
