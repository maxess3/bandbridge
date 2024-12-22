import jwt from "jsonwebtoken";

export const generateAccessToken = (userId: string) => {
  console.log("User", userId);
  return jwt.sign({ userId: userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "10s",
  });
};
