"use client";
import { useMutation } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import { AxiosError } from "axios";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { formLoginSchema } from "@/lib/schema";

type Inputs = z.infer<typeof formLoginSchema>;

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { FcGoogle } from "react-icons/fc";
import { MdError } from "react-icons/md";

export default function Login() {
	const router = useRouter();
	const mutation = useMutation({
		mutationFn: async (data: Inputs) => {
			const res = await apiClient.post("/auth/login", data);
			localStorage.setItem("token", res.data.token);
			router.push("/me");
		},
		onError: (err: unknown) => {
			setHasError((prevError) => ({
				...prevError,
				status: true,
				message:
					err instanceof AxiosError
						? err.response?.data.message
						: "Erreur interne",
			}));
		},
	});

	const [hasError, setHasError] = useState({
		status: false,
		message: "",
	});

	const {
		register,
		handleSubmit,
		trigger,
		formState: { errors },
	} = useForm<Inputs>({
		mode: "onChange",
		resolver: zodResolver(formLoginSchema),
	});

	type FieldName = keyof Inputs;

	const validateLogin = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const fields = ["email", "password"];
		const output = await trigger(fields as FieldName[]);

		if (!output) return;

		await handleSubmit(handleFormCompletion)();
	};

	const handleFormCompletion = async (data: Inputs) => {
		console.log("Formulaire soumis avec succès", data);
		mutation.mutate(data);
	};

	return (
		<Card className="mx-auto max-w-sm">
			<CardHeader>
				<CardTitle className="text-2xl font-bold">Se connecter</CardTitle>
				<CardDescription>
					Entrez votre email et votre mot de passe pour vous connecter.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="grid gap-4">
					<Button size="lg" variant="outline" className="w-full font-semibold">
						<FcGoogle style={{ width: "1.4em", height: "1.4em" }} />
						Se connecter avec Google
					</Button>
					<span className="my-2 border-b relative before:content-['ou'] before:absolute before:-translate-x-1/2 before:-translate-y-1/2 before:left-1/2 before:bg-card before:px-3 before:opacity-90"></span>
					<form className="space-y-4" onSubmit={validateLogin}>
						<div className="grid gap-2">
							<Label htmlFor="email">Email</Label>
							<Input
								className={`${
									(errors.email || hasError.status) && "border-[#ff4444]"
								}`}
								id="email"
								type="email"
								placeholder="m@exemple.com"
								onKeyDown={() =>
									hasError &&
									setHasError((prevError) => ({
										...prevError,
										status: false,
									}))
								}
								{...register("email")}
							/>
							{errors.email && (
								<p className="text-[#ff4444] text-sm">{errors.email.message}</p>
							)}
						</div>
						<div className="grid gap-2">
							<div className="flex items-center">
								<Label htmlFor="password">Mot de passe</Label>
								<Link
									href="/auth/forgot"
									className="ml-auto inline-block text-sm underline"
								>
									Mot de passe oublié?
								</Link>
							</div>
							<Input
								className={`${
									(errors.password || hasError.status) &&
									"border-[#ff4444] focus-visible:ring-transparent"
								}`}
								id="password"
								type="password"
								onKeyDown={() =>
									hasError &&
									setHasError((prevError) => ({
										...prevError,
										status: false,
									}))
								}
								{...register("password")}
							/>
							{errors.password && (
								<p className="text-[#ff4444] text-sm">
									{errors.password.message}
								</p>
							)}
							{hasError.status && (
								<div className="flex items-center gap-x-1.5 text-[#ff4444]">
									<MdError className="text-[#ff4444]" />
									<span className="text-sm">{hasError.message}</span>
								</div>
							)}
						</div>
						<Button
							size="lg"
							type="submit"
							className="w-full text-white font-semibold"
						>
							Se connecter
						</Button>
					</form>
				</div>
				<div className="mt-4 text-center text-sm">
					Vous n'avez pas de compte?{" "}
					<Link href="/auth/signup" className="underline">
						S'inscrire
					</Link>
				</div>
				<div className="mt-6 bg-[#141623] text-sm py-4 px-1 rounded-sm text-center">
					En continuant, vous acceptez les
					<Link href="" className="font-semibold hover:underline">
						{" "}
						CGU
					</Link>{" "}
					et la{" "}
					<Link href="" className="font-semibold hover:underline">
						politique de confidentialité
					</Link>{" "}
					de bandbridge
				</div>
			</CardContent>
		</Card>
	);
}
