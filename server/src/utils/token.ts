import jwt from "jsonwebtoken";
import { Response } from "express";

export const generateAccessToken = (userId: string) => {
  return jwt.sign({ userId: userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "10s",
  });
};

const createAuthTokens = (
  userId: string
): { accessToken: string; refreshToken: string } => {
  const accessToken = jwt.sign(
    { userId: userId },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "10s",
    }
  );

  const refreshToken = jwt.sign(
    { userId: userId },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "30s",
    }
  );

  return { accessToken, refreshToken };
};

const cookieOpts = {
  httpOnly: true,
  secure: process.env.ENV_MODE === "PROD",
  sameSite: "lax",
  maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
} as const;

export const sendAuthCookies = (res: Response, userId: string) => {
  const { accessToken, refreshToken } = createAuthTokens(userId);
  res.cookie("token", accessToken, cookieOpts);
  res.cookie("refreshToken", refreshToken, cookieOpts);
};

export const clearAuthCookies = (res: Response) => {
  res.clearCookie("token");
  res.clearCookie("refreshToken");
};
