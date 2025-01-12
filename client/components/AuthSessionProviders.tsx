"use client";

import { SessionProvider } from "next-auth/react";

type sessionProps = {
  children: React.ReactNode;
};

export default function AuthSessionProviders({ children }: sessionProps) {
  return <SessionProvider>{children}</SessionProvider>;
}
