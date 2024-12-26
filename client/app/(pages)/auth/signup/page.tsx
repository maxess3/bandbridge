"use client";

import apiClient from "@/lib/apiClient";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

import { z } from "zod";
import { formSignUpSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";

import Link from "next/link";
import { useRouter } from "next/navigation";

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

import { AxiosError } from "axios";

type Inputs = z.infer<typeof formSignUpSchema>;

const MAX_STEPS = 2;
const steps = [
	{
		fields: ["email", "password"],
		title: "S'inscrire",
		description:
			"Entrez votre email et votre mot de passe pour vous connecter.",
	},
	{
		fields: ["firstName", "lastName"],
		title: "S'inscrire",
		description: "Entrez votre nom et prénom pour finaliser votre inscription.",
	},
	{
		fields: [],
		title: "Inscription terminée",
		description: "Votre inscription a été effectuée avec succès.",
	},
];

export default function Signup() {
	const [hasError, setHasError] = useState({
		status: false,
		message: "",
	});
	const router = useRouter();
	const [currentStep, setCurrentStep] = useState(0);
	const {
		register,
		handleSubmit,
		reset,
		trigger,
		formState: { errors },
	} = useForm<Inputs>({
		mode: "onChange",
		resolver: zodResolver(formSignUpSchema),
	});

	type FieldName = keyof Inputs;

	const getCurrentStepFields = (): FieldName[] => {
		return steps[currentStep].fields as FieldName[];
	};

	const handleStepCompletion = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const fields = getCurrentStepFields();
		const output = await trigger(fields);

		if (!output) return;

		if (currentStep < MAX_STEPS) {
			if (currentStep === 1) {
				await handleSubmit(handleFormCompletion)();
			}
			setCurrentStep((cur) => cur + 1);
		}
	};

	const handleFormCompletion: SubmitHandler<Inputs> = async (data) => {
		console.log(data);
		try {
			await apiClient.post("/auth/signup", data);
		} catch (err) {
			setHasError((prevError) => ({
				...prevError,
				status: true,
				message:
					err instanceof AxiosError
						? err.response?.data.message
						: "Erreur interne",
			}));
		}
		reset();
	};

	return (
		<div>
			<Card className="mx-auto max-w-sm">
				<CardHeader>
					<CardTitle className="text-2xl font-bold">
						{hasError.status ? "Erreur" : steps[currentStep].title}
					</CardTitle>
					<CardDescription>
						{hasError.status
							? hasError.message
							: steps[currentStep].description}
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					{currentStep === 0 && (
						<Button
							size="lg"
							variant="outline"
							className="w-full font-semibold"
						>
							<FcGoogle style={{ width: "1.4em", height: "1.4em" }} />
							Se connecter avec Google
						</Button>
					)}
					<form onSubmit={handleStepCompletion}>
						{currentStep === 0 && (
							<div className="grid gap-4">
								<span className="my-2 border-b relative before:content-['ou'] before:absolute before:-translate-x-1/2 before:-translate-y-1/2 before:left-1/2 before:bg-card before:px-3 before:opacity-90"></span>
								<div className="grid gap-2">
									<Label htmlFor="email">Email</Label>
									<Input
										className={`${errors.email && "border-[#ff4444]"}`}
										id="email"
										type="email"
										placeholder="m@exemple.com"
										{...register("email")}
									/>
									{errors.email && (
										<p className="text-[#ff4444] text-sm">
											{errors.email.message}
										</p>
									)}
								</div>
								<div className="grid gap-2">
									<Label htmlFor="password">Mot de passe</Label>
									<Input
										className={`${errors.password && "border-[#ff4444]"}`}
										id="password"
										type="password"
										{...register("password")}
									/>
									{errors.password && (
										<p className="text-[#ff4444] text-sm">
											{errors.password.message}
										</p>
									)}
								</div>
							</div>
						)}
						{currentStep === 1 && (
							<div className="grid gap-4">
								<div className="grid gap-2">
									<Label htmlFor="firstName">Prénom</Label>
									<Input
										className={`${errors.firstName && "border-[#ff4444]"}`}
										id="firstName"
										type="text"
										placeholder="John"
										{...register("firstName")}
									/>
									{errors.firstName && (
										<p className="text-[#ff4444] text-sm">
											{errors.firstName.message}
										</p>
									)}
								</div>
								<div className="grid gap-2">
									<Label htmlFor="lastName">Nom</Label>
									<Input
										className={`${errors.lastName && "border-[#ff4444]"}`}
										id="lastName"
										type="text"
										placeholder="Lennon"
										{...register("lastName")}
									/>
									{errors.lastName && (
										<p className="text-[#ff4444] text-sm">
											{errors.lastName.message}
										</p>
									)}
								</div>
							</div>
						)}
						<div className="grid gap-4">
							{currentStep < MAX_STEPS && (
								<Button
									size="lg"
									type="submit"
									className="w-full text-white font-semibold mt-4"
								>
									Accepter et s'inscrire
								</Button>
							)}

							{currentStep === 0 && (
								<div className="text-center text-sm">
									Vous avez déjà un compte?{" "}
									<Link href="/auth/login" className="underline">
										Se connecter
									</Link>
								</div>
							)}
							{currentStep === 2 && (
								<Button
									size="lg"
									type="button"
									onClick={() => {
										if (hasError.status) {
											setHasError((prevError) => ({
												...prevError,
												status: false,
											}));
											setCurrentStep(0);
										} else {
											router.push("/auth/login");
										}
									}}
									className="w-full text-white font-semibold"
								>
									{hasError.status
										? "Revenir au formulaire d'inscription"
										: "Se connecter"}
								</Button>
							)}
							{currentStep < 2 && (
								<div className="mt-2 bg-[#141623] text-sm py-4 px-1 rounded-sm text-center">
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
							)}
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}