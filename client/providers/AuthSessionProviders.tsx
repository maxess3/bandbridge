"use client";

import { useSession } from "next-auth/react";
import { SessionProvider } from "next-auth/react";
import { LoadingSpinner } from "@/components/loader/LoadingSpinner";
import { useEffect, useState } from "react";

type SessionProps = {
  children: React.ReactNode;
};

function SessionLoader({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (status === "loading" || isLoading) {
    return <LoadingSpinner />;
  }

  return <>{children}</>;
}

export default function AuthSessionProviders({ children }: SessionProps) {
  return (
    <SessionProvider>
      <SessionLoader>{children}</SessionLoader>
    </SessionProvider>
  );
}
