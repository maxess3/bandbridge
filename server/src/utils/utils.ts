import jwt from "jsonwebtoken";

export const generateAccessToken = (user: { id: string }) => {
  return jwt.sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "10s",
  });
};
