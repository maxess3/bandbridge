import jwt from "jsonwebtoken";

export const generateAccessToken = (userId: string) => {
  console.log("User", userId);
  return jwt.sign({ userId: userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "10s",
  });
};

// Formats the name by capitalizing the first letter and converting the rest to lowercase
export const formatName = (name: string) => {
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
};
