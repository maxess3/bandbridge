"use client";

import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { formLoginSchema } from "@/lib/schema";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleButton } from "@/components/shared/buttons/GoogleButton";
import { MdError } from "react-icons/md";

type Inputs = z.infer<typeof formLoginSchema>;

export default function Login() {
	const router = useRouter();
	const [hasError, setHasError] = useState({
		status: false,
		message: "",
	});

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<Inputs>({
		mode: "onChange",
		resolver: zodResolver(formLoginSchema),
	});

	const handleFormCompletion = async (data: Inputs) => {
		console.log(data);
		const res = await signIn("credentials", {
			email: data.email,
			password: data.password,
			redirect: false,
			callbackUrl: `${process.env.NEXT_PUBLIC_FRONT_URL}`,
		});
		if (res?.error) {
			setHasError({
				status: true,
				message: "L'email ou le mot de passe est incorrect",
			});
		} else if (res?.ok) {
			router.push(res.url || "/");
			router.refresh();
		}
	};

	return (
		<Card className="mx-auto max-w-sm">
			<CardHeader>
				<CardTitle className="text-2xl font-semibold">Se connecter</CardTitle>
				<CardDescription>
					Entrez votre email et votre mot de passe pour vous connecter.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="grid gap-4">
					<GoogleButton title="Se connecter avec Google" />
					<span className="my-2 border-b relative before:content-['ou'] before:absolute before:-translate-x-1/2 before:-translate-y-1/2 before:left-1/2 before:bg-card before:px-3 before:opacity-90"></span>
					<form
						className="space-y-4"
						onSubmit={handleSubmit(handleFormCompletion)}
					>
						<div className="grid gap-2">
							<Label htmlFor="email">Email</Label>
							<Input
								className={`${
									errors.email && "border-[#ff4444]"
								} bg-transparent`}
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
									errors.password &&
									"border-[#ff4444] focus-visible:ring-transparent"
								} bg-transparent`}
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
							{hasError.status && hasError.message !== undefined && (
								<div className="flex items-center gap-x-1.5 text-[#ff4444]">
									<MdError className="text-[#ff4444]" />
									<span className="text-sm">{hasError.message}</span>
								</div>
							)}
						</div>
						<Button
							variant="primary"
							size="lg"
							type="submit"
							className="w-full font-semibold"
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
				<div className="mt-6 bg-secondary text-sm py-4 px-1 rounded-sm text-center">
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
