import jwt from "jsonwebtoken";
import { env } from "../config/env.config";

let EXPIRE_TIME = 10 * 1000; // 10 seconds in milliseconds

if (env.NODE_ENV === "development") {
  EXPIRE_TIME = 1 * 10 * 1000; // 10 seconds in milliseconds
}

/**
 * Creates authentication tokens (access and refresh) for a user.
 *
 * @param userId - The user ID to create tokens for
 * @returns Object containing backendTokens with accessToken, refreshToken, and expiresIn
 *
 * @remarks
 * Access token expires in 15 minutes, refresh token expires in 7 days.
 */
export const createAuthTokens = (userId: string) => {
  const accessToken = jwt.sign({ userId: userId }, env.ACCESS_TOKEN_SECRET, {
    expiresIn: "10s",
  });

  const refreshToken = jwt.sign({ userId: userId }, env.REFRESH_TOKEN_SECRET, {
    expiresIn: "20s",
  });

  const backendTokens = {
    accessToken,
    refreshToken,
    expiresIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME),
  };

  return { backendTokens };
};
