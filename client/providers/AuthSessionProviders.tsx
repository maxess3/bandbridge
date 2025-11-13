"use client";

import { SessionProvider, useSession } from "next-auth/react";
import {
  SessionLoaderProvider,
  useSessionLoader,
} from "@/contexts/SessionLoaderContext";
import { LoadingSession } from "@/components/shared/loader/LoadingSession";
import { useState, useEffect, useRef } from "react";
import { signOut } from "next-auth/react";

type SessionProps = {
  children: React.ReactNode;
};

function SessionLoader({ children }: { children: React.ReactNode }) {
  const { status, data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const { ignoreLoader } = useSessionLoader();

  // Fake delay to show the loading spinner for 1 second
  useEffect(() => {
    if (status !== "loading") {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [status]);

  // Détecter quand la session devient invalide et rediriger automatiquement
  useEffect(() => {
    // Détecter si la session est invalide
    const sessionHasError =
      (session as any)?.error === "RefreshAccessTokenError";

    // Si la session est invalide (erreur)
    if (sessionHasError) {
      // Déclencher la déconnexion avec redirection
      signOut({ redirect: true, callbackUrl: "/auth/login" });
    }
  }, [status, session, isLoading]);

  // If the status is loading or the fake delay is not over, show the loading spinner
  if ((status === "loading" || isLoading) && !ignoreLoader) {
    return <LoadingSession />;
  }

  return <>{children}</>;
}

export default function AuthSessionProviders({ children }: SessionProps) {
  return (
    <SessionProvider>
      <SessionLoaderProvider>
        <SessionLoader>{children}</SessionLoader>
      </SessionLoaderProvider>
    </SessionProvider>
  );
}
