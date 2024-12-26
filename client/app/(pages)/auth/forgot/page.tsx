"use client";

// import apiClient from "@/lib/apiClient";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import Link from "next/link";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { useForm } from "react-hook-form";

import { z } from "zod";
import { formForgotPwdSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";

// import { AxiosError } from "axios";

type Input = z.infer<typeof formForgotPwdSchema>;

export default function Forgot() {
	const {
		register,
		handleSubmit,
		trigger,
		reset,
		formState: { errors },
	} = useForm<Input>({
		resolver: zodResolver(formForgotPwdSchema),
	});

	type FieldName = keyof Input;

	const validateForgotPassword = async (
		e: React.FormEvent<HTMLFormElement>
	) => {
		e.preventDefault();
		const field = ["email"];
		const output = await trigger(field as FieldName[]);

		if (!output) return;

		await handleSubmit(handleFormCompletion)();
	};

	const handleFormCompletion = async (data: Input) => {
		console.log(data);
		console.log("submit validated");
		reset();
	};
	return (
		<Card className="mx-auto max-w-sm">
			<CardHeader>
				<CardTitle className="text-2xl font-bold">
					Mot de passe oublié
				</CardTitle>
				<CardDescription>
					Entrez votre email pour réinitialiser votre mot de passe.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form className="grid gap-4" onSubmit={validateForgotPassword}>
					<div className="grid gap-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							type="email"
							placeholder="m@exemple.com"
							className={`${errors.email && "border-[#ff4444]"}`}
							{...register("email")}
						/>
						{errors.email && (
							<p className="text-[#ff4444] text-sm">{errors.email.message}</p>
						)}
					</div>
					<Button
						size="lg"
						type="submit"
						className="w-full text-white font-semibold"
					>
						Continuer
					</Button>
					<div className="text-center mt-2">
						<Link href="/auth/login" className="text-sm underline">
							Revenir au formulaire de connexion
						</Link>
					</div>
				</form>
			</CardContent>
		</Card>
	);
}
