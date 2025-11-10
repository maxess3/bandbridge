"use client";

import { axiosAuth } from "@/lib/axios";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRefreshToken } from "@/lib/hooks/useRefreshToken";
import { signOut } from "next-auth/react";

const useAxiosAuth = () => {
  const { data: session } = useSession();
  const refreshToken = useRefreshToken();

  useEffect(() => {
    const requestIntercept = axiosAuth.interceptors.request.use(
      (config) => {
        // Remove Content-Type header for FormData to let axios set it automatically
        // with the correct boundary for multipart/form-data
        if (config.data instanceof FormData) {
          delete config.headers["Content-Type"];
        }

        if (!config.headers["Authorization"]) {
          config.headers[
            "Authorization"
          ] = `Bearer ${session?.backendTokens.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = axiosAuth.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 401 && !prevRequest?.sent) {
          prevRequest.sent = true;
          try {
            // Récupérer les nouveaux tokens directement
            const refreshResult = await refreshToken();

            if (refreshResult) {
              // Utiliser immédiatement le nouveau token pour la requête
              prevRequest.headers[
                "Authorization"
              ] = `Bearer ${refreshResult.tokens.accessToken}`;

              // Retenter la requête
              const response = await axiosAuth(prevRequest);

              // Mettre à jour la session après que la requête soit complétée avec succès
              // Cela évite les re-renders qui pourraient fermer la modale
              await refreshResult.updateSession();

              return response;
            } else {
              // Si pas de tokens, déconnecter
              await signOut({ redirect: true, callbackUrl: "/auth/login" });
              return Promise.reject(error);
            }
          } catch (refreshError) {
            // Si le refresh échoue, déconnecter l'utilisateur
            await signOut({ redirect: true, callbackUrl: "/auth/login" });
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosAuth.interceptors.request.eject(requestIntercept);
      axiosAuth.interceptors.response.eject(responseIntercept);
    };
  }, [session, refreshToken]);

  return axiosAuth;
};

export default useAxiosAuth;
