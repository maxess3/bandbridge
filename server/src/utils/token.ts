import jwt from "jsonwebtoken";
import { env } from "../config/env.config";

const EXPIRE_TIME = 15 * 60 * 1000; // 15 minutes en millisecondes

export const createAuthTokens = (userId: string) => {
  const accessToken = jwt.sign({ userId: userId }, env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign({ userId: userId }, env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });

  const backendTokens = {
    accessToken,
    refreshToken,
    expiresIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME),
  };

  return { backendTokens };
};
