import prisma from "../db/db.config";
import { compareSync, hashSync } from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { formatName, generateUniqueUsername } from "../utils/utils";
import { createAuthTokens } from "../utils/token";
import nodemailer from "nodemailer";
import { env } from "../config/env.config";
import { ValidationError, UnauthorizedError, AppError } from "../errors";

export const signup = async (req: Request, res: Response) => {
  const { email, password, firstName, lastName } = req.body;

  const findUser = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (findUser) {
    throw new ValidationError("Email address already in use");
  }

  const formatFirstName = formatName(firstName);
  const formatLastName = formatName(lastName);

  await prisma.$transaction(async (prisma) => {
    const username = await generateUniqueUsername(formatFirstName, prisma);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashSync(password, 10),
        provider: "MANUAL",
        firstName: formatFirstName,
        lastName: formatLastName,
        username,
      },
    });

    await prisma.profile.create({
      data: {
        userId: user.id,
        pseudonyme: username, // Utiliser le username comme pseudonyme par défaut
      },
    });
  });

  res.status(200).json({ message: "User created." });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findFirst({
    where: {
      email,
      provider: "MANUAL",
    },
    include: {
      Profile: true,
    },
  });

  if (!user || !compareSync(password, user.password)) {
    // Message identique pour éviter l'énumération d'emails (sécurité)
    throw new ValidationError("Email or password incorrect");
  }

  const userId = user.id;
  const userEmail = user.email;
  const userFirstName = user.firstName;
  const userLastName = user.lastName;
  const username = user.username;
  const pseudonyme = user.Profile?.pseudonyme;
  const profilePictureKey = user.Profile?.profilePictureKey;

  const { backendTokens } = createAuthTokens(userId);

  const currentUser = {
    id: userId,
    email: userEmail,
    firstName: userFirstName,
    lastName: userLastName,
    username,
    pseudonyme,
    profilePictureKey,
  };

  res.status(200).json({
    user: currentUser,
    backendTokens,
  });
};

export const google = async (req: Request, res: Response) => {
  const { email, name } = req.body;

  const firstName = formatName(name.split(" ")[0]);
  const lastName = formatName(name.split(" ").slice(1).join(" "));

  const result = await prisma.$transaction(async (prisma) => {
    let findUser = await prisma.user.findFirst({
      where: { email },
      include: { Profile: true },
    });

    if (!findUser) {
      const username = await generateUniqueUsername(firstName, prisma);

      const newUser = await prisma.user.create({
        data: {
          email,
          provider: "GOOGLE",
          firstName: firstName,
          lastName: lastName,
          username,
        },
      });

      await prisma.profile.create({
        data: {
          userId: newUser.id,
          pseudonyme: username, // Utiliser le username comme pseudonyme par défaut
        },
      });

      findUser = await prisma.user.findFirst({
        where: { email },
        include: { Profile: true },
      });
    }

    return findUser;
  });

  const userId = result.id;
  const userEmail = result.email;
  const userFirstName = result.firstName;
  const userLastName = result.lastName;
  const username = result.username;
  const pseudonyme = result.Profile?.pseudonyme;
  const profilePictureKey = result.Profile?.profilePictureKey;

  const { backendTokens } = createAuthTokens(userId);

  const currentUser = {
    id: userId,
    email: userEmail,
    firstName: userFirstName,
    lastName: userLastName,
    username,
    pseudonyme,
    profilePictureKey,
  };

  res.status(200).json({
    user: currentUser,
    backendTokens,
  });
};

export const refreshToken = (req: Request, res: Response, next: any) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return next(new UnauthorizedError("Refresh token missing"));
  }

  jwt.verify(
    refreshToken,
    env.REFRESH_TOKEN_SECRET,
    (err: Error | null, user: any) => {
      if (err) {
        return next(new UnauthorizedError("Invalid refresh token"));
      }

      const userId = user.userId;
      const { backendTokens } = createAuthTokens(userId);

      res.status(200).json({ backendTokens });
    }
  );
};

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: any
) => {
  const { email } = req.body;

  const user = await prisma.user.findFirst({
    where: {
      email,
      provider: "MANUAL",
    },
  });

  // Send no errors (for security), but don't send email.
  if (!user) {
    res.status(200).json({ message: "Password reset email sent" });
    return;
  }

  const forgotToken = jwt.sign({ id: user.id }, env.FORGOT_TOKEN_SECRET, {
    expiresIn: "15m",
  });

  const link = `${env.CLIENT_URL}/auth/reset/${user.id}/${forgotToken}`;

  // Nodemailer config
  const transporter = nodemailer.createTransport({
    host: "smtp.hostinger.com",
    port: 465,
    secure: true,
    auth: {
      user: env.EMAIL_USER,
      pass: env.EMAIL_PWD,
    },
  });

  const mailOptions = {
    from: env.EMAIL_USER,
    to: email,
    subject: "Réinitialisation du mot de passe",
    text: `Bonjour, \n\nCliquez sur le lien ci-dessous pour réinitialiser votre mot de passe: \n${link}. \n\nLe lien est valable pendant 15 minutes. \n\nSi vous n'êtes pas à l'origine de cette demande, merci de l'ignorer.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return next(new AppError("Error sending email", 500));
    }
    res.status(200).json({ message: "Password reset email sent" });
  });
};

export const resetPassword = async (req: Request, res: Response) => {
  const { id, token, password } = req.body;

  try {
    jwt.verify(token, env.FORGOT_TOKEN_SECRET);

    const user = await prisma.user.findFirst({
      where: {
        id,
      },
    });

    if (!user) {
      throw new UnauthorizedError("Invalid token or user");
    }

    // Update the password
    await prisma.user.update({
      where: { id },
      data: {
        password: hashSync(password, 10),
        password_changed_at: new Date(),
      },
    });

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw error;
    }
    throw new UnauthorizedError("Invalid or expired token");
  }
};

export const validateResetToken = async (req: Request, res: Response) => {
  const { token } = req.query;

  if (typeof token !== "string") {
    throw new ValidationError("Invalid token");
  }

  try {
    const decoded = jwt.verify(token, env.FORGOT_TOKEN_SECRET);
    if (typeof decoded === "object" && decoded !== null && "id" in decoded) {
      const userId = decoded.id;
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new UnauthorizedError("Invalid token");
      }

      // Check if password has changed after token creation
      if (user.password_changed_at) {
        const passwordChangedTimestamp = Math.floor(
          user.password_changed_at.getTime() / 1000
        );
        if (decoded.iat < passwordChangedTimestamp) {
          throw new UnauthorizedError("Invalid token (password changed)");
        }
      }
    }
    res.status(200).json({ valid: true });
  } catch (error) {
    if (
      error instanceof UnauthorizedError ||
      error instanceof ValidationError
    ) {
      throw error;
    }
    throw new ValidationError("Invalid token");
  }
};
