import jwt from "jsonwebtoken";

const EXPIRE_TIME = 20 * 1000;

export const generateAccessToken = (userId: string) => {
  return jwt.sign({ userId: userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "20s",
  });
};

export const createAuthTokens = (userId: string) => {
  const accessToken = jwt.sign(
    { userId: userId },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "20s",
    }
  );

  const refreshToken = jwt.sign(
    { userId: userId },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
    }
  );

  const backendTokens = {
    accessToken,
    refreshToken,
    expiresIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME),
  };

  return { backendTokens };
};
