import prisma from "../db/db.config";
import { compareSync, hashSync } from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { formatName } from "../utils/utils";
import { createAuthTokens } from "../utils/token";
import nodemailer from "nodemailer";
import {
  formSignUpSchema,
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
  const { email, password } = req.body;

  const user = await prisma.user.findFirst({
    where: {
      email,
      provider: "MANUAL",
    },
  });

  if (!user) {
    return res.status(400).json({ message: "Email ou mot de passe incorrect" });
  }

  if (!compareSync(password, user.password)) {
    return res.status(400).json({ message: "Email ou mot de passe incorrect" });
  }

  const userId = user.id;
  const userEmail = user.email;
  const userFirstName = user.firstName;

  const { backendTokens } = createAuthTokens(userId);

  const currentUser = {
    id: userId,
    email: userEmail,
    firstName: userFirstName,
  };

  return res.status(200).json({
    user: currentUser,
    backendTokens,
  });
};

export const google = async (req: Request, res: Response) => {
  try {
    const { email, name } = req.body;

    let findUser = await prisma.user.findFirst({ where: { email } });

    if (!findUser) {
      const newUser = await prisma.user.create({
        data: {
          email,
          firstName: name,
          provider: "GOOGLE",
        },
      });
      findUser = newUser;
    }

    const userId = findUser.id;
    const userEmail = findUser.email;
    const userFirstName = findUser.firstName;

    const { backendTokens } = createAuthTokens(userId);

    const currentUser = {
      id: userId,
      email: userEmail,
      firstName: userFirstName,
    };

    return res.status(200).json({
      user: currentUser,
      backendTokens,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const refreshToken = (req: Request, res: Response) => {
  const authHeader = req.headers["authorization"];
  const refreshToken = authHeader && authHeader.split(" ")[1];

  if (!refreshToken) {
    return res.sendStatus(401);
  }

  const decodedToken = jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET as string,
    (err: Error | null, user: any) => {
      if (err) return res.sendStatus(403);
      const userId = user.userId;
      const { backendTokens } = createAuthTokens(userId);
      return res.status(200).json({ backendTokens });
    }
  );

  (req as any).user = decodedToken;
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
