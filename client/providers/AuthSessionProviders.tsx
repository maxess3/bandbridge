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
  const hasRedirected = useRef(false);
  const previousSessionRef = useRef(session);

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
    // Attendre que le chargement soit terminé
    if (status === "loading" || isLoading) return;

    // Éviter les redirections multiples
    if (hasRedirected.current) return;

    // Détecter si la session est invalide
    const sessionHasError =
      (session as any)?.error === "RefreshAccessTokenError";
    const sessionIsUndefined = !session || !session.user;
    const previousWasValid =
      previousSessionRef.current?.user !== null &&
      previousSessionRef.current?.user !== undefined &&
      !(previousSessionRef.current as any)?.error;

    // Si la session devient invalide (erreur ou undefined) et qu'elle était valide avant
    if ((sessionHasError || sessionIsUndefined) && previousWasValid) {
      hasRedirected.current = true;
      // Déclencher la déconnexion avec redirection
      signOut({ redirect: true, callbackUrl: "/auth/login" });
    }

    // Mettre à jour la référence de la session précédente
    previousSessionRef.current = session;
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
