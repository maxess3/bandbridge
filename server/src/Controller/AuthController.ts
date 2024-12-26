import prisma from "../db/db.config";
import { compareSync, hashSync } from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { generateAccessToken } from "../utils/utils";
import nodemailer from "nodemailer";
import {
	formSignUpSchema,
	formLoginSchema,
	formForgotPwdSchema,
} from "../lib/schema";
import { ZodError } from "zod";

export const signup = async (req: Request, res: Response) => {
	// Validate signup inputs with zod
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
			.json({ message: "L'adresse email renseignée est déjà utilisée" });
	}

	const newUser = await prisma.user.create({
		data: {
			email,
			password: hashSync(password, 10),
			firstName,
			lastName,
		},
	});

	return res.status(200).json({ data: newUser, message: "User created." });
};

export const login = async (req: Request, res: Response) => {
	// Validate login inputs with zod
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
	// Validate email input with zod
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

	if (!user) {
		return res
			.status(400)
			.json({ message: "Aucun compte associé à cette adresse email." });
	}

	const forgotToken = jwt.sign(
		{ id: user.id, email: user.email },
		process.env.FORGOTPWD_TOKEN_SECRET,
		{
			expiresIn: "15m",
		}
	);

	const link = `http://localhost:3000/auth/reset?token=${forgotToken}`;

	// Nodemailer config
	const transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASS,
		},
	});

	const mailOptions = {
		from: process.env.EMAIL_USER,
		to: email,
		subject: "Réinitialisation du mot de passe",
		text: `Cliquez sur ce lien pour réinitialiser votre mot de passe: ${link}`,
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

export const resetPassword = (req: Request, res: Response) => {};
