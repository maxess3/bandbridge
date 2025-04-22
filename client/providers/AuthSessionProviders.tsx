"use client";

import { SessionProvider } from "next-auth/react";

type SessionProps = {
  children: React.ReactNode;
};

function SessionLoader({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export default function AuthSessionProviders({ children }: SessionProps) {
  return (
    <SessionProvider>
      <SessionLoader>{children}</SessionLoader>
    </SessionProvider>
  );
}
