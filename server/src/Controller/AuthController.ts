import prisma from "../db/db.config";
import { compareSync, hashSync } from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { formatName, generateUniqueUsername } from "../utils/utils";
import { createAuthTokens } from "../utils/token";
import nodemailer from "nodemailer";

export const signup = async (req: Request, res: Response) => {
  const { email, password, firstName } = req.body;

  const findUser = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (findUser) {
    res.status(400).json({ message: "L'adresse email est déjà utilisée" });
    return;
  }

  const formatFirstName = formatName(firstName);

  try {
    await prisma.$transaction(async (prisma) => {
      const user = await prisma.user.create({
        data: {
          email,
          password: hashSync(password, 10),
          provider: "MANUAL",
        },
      });

      const username = await generateUniqueUsername(formatFirstName, prisma);

      const profile = await prisma.profile.create({
        data: {
          firstName: formatFirstName,
          username,
          userId: user.id,
        },
      });
    });
  } catch (error) {
    res.status(500).json({ error: "Signup failed." });
    return;
  }

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

  if (!user) {
    res.status(400).json({ message: "Email ou mot de passe incorrect" });
    return;
  }

  if (!compareSync(password, user.password)) {
    res.status(400).json({ message: "Email ou mot de passe incorrect" });
    return;
  }

  const userId = user.id;
  const userEmail = user.email;
  const userFirstName = user.Profile?.firstName;
  const username = user.Profile?.username;
  const profilePictureKey = user.Profile?.profilePictureKey;

  const { backendTokens } = createAuthTokens(userId);

  const currentUser = {
    id: userId,
    email: userEmail,
    firstName: userFirstName,
    username,
    profilePictureKey,
  };

  res.status(200).json({
    user: currentUser,
    backendTokens,
  });
};

export const google = async (req: Request, res: Response) => {
  try {
    const { email, name } = req.body;

    const result = await prisma.$transaction(async (prisma) => {
      let findUser = await prisma.user.findFirst({
        where: { email },
        include: { Profile: true },
      });

      if (!findUser) {
        const newUser = await prisma.user.create({
          data: {
            email,
            provider: "GOOGLE",
          },
        });

        const username = await generateUniqueUsername(name, prisma);

        const profile = await prisma.profile.create({
          data: {
            firstName: name,
            username,
            userId: newUser.id,
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
    const userFirstName = result.Profile?.firstName;
    const username = result.Profile?.username;
    const profilePictureKey = result.Profile?.profilePictureKey;

    const { backendTokens } = createAuthTokens(userId);

    const currentUser = {
      id: userId,
      email: userEmail,
      firstName: userFirstName,
      username,
      profilePictureKey,
    };

    res.status(200).json({
      user: currentUser,
      backendTokens,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const refreshToken = (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    res.sendStatus(401);
    return;
  }

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET as string,
    (err: Error | null, user: any) => {
      if (err) return res.sendStatus(403);

      const userId = user.userId;
      const { backendTokens } = createAuthTokens(userId);

      console.log(backendTokens.accessToken);

      res.status(200).json({ backendTokens });
    }
  );
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  const user = await prisma.user.findFirst({
    where: {
      email,
      provider: "MANUAL",
    },
  });

  // Send no errors (for security), but don't send email.
  if (!user) {
    res.status(200).json({ message: "Email de réinitialisation envoyé" });
    return;
  }

  const forgotToken = jwt.sign(
    { id: user.id },
    process.env.FORGOT_TOKEN_SECRET,
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
      res.status(500).json({ message: "Erreur lors de l'envoi de l'email" });
      return;
    }
    res.status(200).json({ message: "Email de réinitialisation envoyé" });
  });
};

export const resetPassword = async (req: Request, res: Response) => {
  const { id, token, password } = req.body;

  jwt.verify(
    token,
    process.env.FORGOT_TOKEN_SECRET,
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

      res
        .status(200)
        .json({ message: "Mot de passe réinitialisé avec succès" });
    }
  );
};

export const validateResetToken = async (req: Request, res: Response) => {
  const { token } = req.query;

  if (typeof token !== "string") {
    res.status(400).json({ valid: false, error: "Invalid token" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.FORGOT_TOKEN_SECRET);
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
