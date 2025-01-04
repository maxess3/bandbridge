import prisma from "../db/db.config";
import { compareSync, hashSync } from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { generateAccessToken, formatName } from "../utils/utils";
import nodemailer from "nodemailer";
import {
  formSignUpSchema,
  formLoginSchema,
  formForgotPwdSchema,
  formResetPwdSchema,
} from "../lib/schema";
import { ZodError } from "zod";

export const signup = async (req: Request, res: Response) => {
  // Validate user inputs with zod
  try {
    const validatedData = formSignUpSchema.parse(req.body);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ errors: error.errors });
    } else {
      return res.status(500).json({ message: "Erreur interne du serveur" });
    }
  }

  const { email, password, firstName, lastName } = req.body;

  const findUser = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (findUser) {
    return res
      .status(400)
      .json({ message: "L'adresse email est déjà utilisée" });
  }

  const formatFirstName = formatName(firstName);
  const formatLastName = formatName(lastName);

  const newUser = await prisma.user.create({
    data: {
      email,
      password: hashSync(password, 10),
      firstName: formatFirstName,
      lastName: formatLastName,
    },
  });

  return res.status(200).json({ data: newUser, message: "User created." });
};

export const login = async (req: Request, res: Response) => {
  // Validate user inputs with zod
  try {
    const validatedData = formLoginSchema.parse(req.body);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ errors: error.errors });
    } else {
      return res.status(500).json({ message: "Erreur interne du serveur" });
    }
  }

  const { email, password } = req.body;

  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (!user) {
    return res.status(400).json({ message: "Email ou mot de passe incorrect" });
  }

  if (!compareSync(password, user.password)) {
    return res.status(400).json({ message: "Email ou mot de passe incorrect" });
  }

  const userId = user.id;
  const accessToken = generateAccessToken(userId);

  const refreshToken = jwt.sign(
    { userId: user.id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    // 7 days
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({ token: accessToken });
};

export const refresh = (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.sendStatus(403);
  }

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err: Error | null, user: any) => {
      if (err) return res.sendStatus(403);
      const userId = user.userId;
      const accessToken = generateAccessToken(userId);
      return res.status(200).json({ token: accessToken });
    }
  );
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("refreshToken");
  return res.sendStatus(200);
};

export const forgotPassword = async (req: Request, res: Response) => {
  // Validate user inputs with zod
  try {
    const validatedData = formForgotPwdSchema.parse(req.body);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ errors: error.errors });
    } else {
      return res.status(500).json({ message: "Erreur interne du serveur" });
    }
  }

  const { email } = req.body;

  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  // Send no errors (for security), but don't send email.
  if (!user) {
    return res
      .status(200)
      .json({ message: "Email de réinitialisation envoyé." });
  }

  const forgotToken = jwt.sign(
    { id: user.id },
    process.env.FORGOTPWD_TOKEN_SECRET,
    {
      expiresIn: "10m",
    }
  );

  const link = `${process.env.CLIENT_URL}/auth/reset/${user.id}/${forgotToken}`;

  // Nodemailer config
  const transporter = nodemailer.createTransport({
    host: "smtp.hostinger.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PWD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Réinitialisation du mot de passe",
    text: `Bonjour, \n\nCliquez sur le lien ci-dessous pour réinitialiser votre mot de passe: \n${link}. \n\nLe lien est valable pendant 10 minutes. \n\nSi vous n'êtes pas à l'origine de cette demande, merci de l'ignorer.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res
        .status(500)
        .json({ message: "Erreur lors de l'envoi de l'email." });
    }
    return res
      .status(200)
      .json({ message: "Email de réinitialisation envoyé." });
  });
};

export const resetPassword = async (req: Request, res: Response) => {
  const { id, token, password } = req.body;

  // Validate user inputs with zod
  try {
    const validatedData = formResetPwdSchema.parse(req.body);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ errors: error.errors });
    } else {
      return res.status(500).json({ message: "Erreur interne du serveur" });
    }
  }

  jwt.verify(
    token,
    process.env.FORGOTPWD_TOKEN_SECRET,
    async (err: Error | null) => {
      // Invalid token
      if (err) return res.sendStatus(403);

      const user = await prisma.user.findFirst({
        where: {
          id,
        },
      });

      if (!user) return res.sendStatus(403);

      // Update the password
      await prisma.user.update({
        where: { id },
        data: {
          password: hashSync(password, 10),
          passwordChangedAt: new Date(),
        },
      });

      return res
        .status(200)
        .json({ message: "Mot de passe réinitialisé avec succès." });
    }
  );
};

export const validateResetToken = async (req: Request, res: Response) => {
  const { token } = req.query;

  if (typeof token !== "string") {
    return res.status(400).json({ valid: false, error: "Invalid token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.FORGOTPWD_TOKEN_SECRET);
    if (typeof decoded === "object" && decoded !== null && "id" in decoded) {
      const userId = decoded.id;
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new Error("User not found");
      }

      // Check if password has changed after token creation
      if (user.passwordChangedAt) {
        const passwordChangedTimestamp = Math.floor(
          user.passwordChangedAt.getTime() / 1000
        );
        if (decoded.iat < passwordChangedTimestamp) {
          console.log("probleme");
          throw new Error("Token invalid due to password change");
        }
      }
    }
    res.status(200).json({ valid: true });
  } catch (error) {
    res.status(400).json({ valid: false });
  }
};
