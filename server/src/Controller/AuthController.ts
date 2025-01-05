import prisma from "../db/db.config";
import { compareSync, hashSync } from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import { formatName } from "../utils/utils";
import { generateAccessToken, generateRefreshToken } from "../utils/token";
import nodemailer from "nodemailer";
import {
  formSignUpSchema,
  formLoginSchema,
  formForgotPwdSchema,
  formResetPwdSchema,
} from "../lib/schema";
import { ZodError } from "zod";

// Google auth client
const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.REDIRECT_URI
);

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

  const { email, password, firstName } = req.body;

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

  const newUser = await prisma.user.create({
    data: {
      email,
      password: hashSync(password, 10),
      firstName: formatFirstName,
      provider: "MANUAL",
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
  const refreshToken = generateRefreshToken(userId);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    // USE SECURE: TRUE IN PROD
    secure: false,
    sameSite: "strict",
    // 7 days
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({ token: accessToken });
};

export const google = async (req: Request, res: Response) => {
  try {
    const { code } = req.query;
    if (typeof code === "string") {
      const { tokens } = await client.getToken(code);
      const { id_token } = tokens;

      // Check token and extract user data
      const ticket = await client.verifyIdToken({
        idToken: id_token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      const { sub: googleId, email, given_name } = payload;

      const formatFirstName = formatName(given_name);

      let findUser = await prisma.user.findFirst({ where: { email } });

      if (!findUser) {
        const newUser = await prisma.user.create({
          data: {
            email,
            firstName: formatFirstName,
            provider: "GOOGLE",
          },
        });
      }
    }

    return res.redirect(process.env.CLIENT_URL);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
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
      provider: "MANUAL",
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
      expiresIn: "15m",
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
    text: `Bonjour, \n\nCliquez sur le lien ci-dessous pour réinitialiser votre mot de passe: \n${link}. \n\nLe lien est valable pendant 15 minutes. \n\nSi vous n'êtes pas à l'origine de cette demande, merci de l'ignorer.`,
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
          password_changed_at: new Date(),
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
      if (user.password_changed_at) {
        const passwordChangedTimestamp = Math.floor(
          user.password_changed_at.getTime() / 1000
        );
        if (decoded.iat < passwordChangedTimestamp) {
          console.log("Token invalid due to password change");
          throw new Error("Token invalid due to password change");
        }
      }
    }
    res.status(200).json({ valid: true });
  } catch (error) {
    res.status(400).json({ valid: false });
  }
};
