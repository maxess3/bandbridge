"use client";

import axios from "@/lib/axios";

import { signIn, signOut, useSession } from "next-auth/react";
import { useSessionLoader } from "@/contexts/SessionLoaderContext";

export const useRefreshToken = () => {
  const { data: session, update } = useSession();
  const { setIgnoreLoader } = useSessionLoader();

  const refreshToken = async () => {
    try {
      const res = await axios.post("/auth/refresh", {
        refreshToken: session?.backendTokens.refreshToken,
      });

      const newTokens = res.data.backendTokens;

      if (session) {
        // Retourner les nouveaux tokens pour utilisation immédiate
        // La mise à jour de la session sera faite après que la requête soit complétée
        // pour éviter les re-renders qui pourraient fermer la modale
        return {
          tokens: newTokens,
          updateSession: async () => {
            // Ignorer le loader pendant la mise à jour de la session
            setIgnoreLoader(true);
            try {
              await update({
                backendTokens: {
                  accessToken: newTokens.accessToken,
                  refreshToken: newTokens.refreshToken,
                  expiresIn: newTokens.expiresIn,
                },
              });
            } catch (error) {
              console.error("Failed to update session:", error);
            } finally {
              // Réactiver le loader après un court délai
              setTimeout(() => {
                setIgnoreLoader(false);
              }, 100);
            }
          },
        };
      } else {
        signIn();
        return null;
      }
    } catch (error) {
      // Si le refresh token est invalide, déconnecter l'utilisateur
      console.error("Failed to refresh token, signing out:", error);
      await signOut({ redirect: true, callbackUrl: "/auth/login" });
      throw error;
    }
  };
  return refreshToken;
};
