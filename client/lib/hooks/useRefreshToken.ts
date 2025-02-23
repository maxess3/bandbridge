"use client";

import axios from "@/lib/axios";

import { signIn, useSession } from "next-auth/react";

export const useRefreshToken = () => {
  const { data: session } = useSession();

  const refreshToken = async () => {
    const res = await axios.post("/auth/refresh", {
      refreshToken: session?.backendTokens.refreshToken,
    });

    if (session)
      session.backendTokens.accessToken = res.data.backendTokens.accessToken;
    else signIn();
  };
  return refreshToken;
};
