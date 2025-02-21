"use client";

import axios from "@/lib/axios";

import { signIn, useSession } from "next-auth/react";

export const useRefreshToken = () => {
  const { data: session } = useSession();

  const refreshToken = async () => {
    const res = await axios.post("/auth/refresh", {
      refresh: session?.backendTokens.refreshToken,
    });

    if (session) session.backendTokens.accessToken = res.data.accessToken;
    else signIn();
  };
  return refreshToken;
};
