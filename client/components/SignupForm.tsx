"use client";

import Link from "next/link";

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

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email("Adresse email invalide"),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(
      /[\W_]/,
      "Le mot de passe doit contenir au moins un caractère spécial"
    ),
});

type FormData = z.infer<typeof formSchema>;

function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: FormData) => {
    console.log("Formulaire soumis avec succès", data);
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">S'inscrire</CardTitle>
        <CardDescription>
          Entrez un email et un mot de passe pour vous inscrire.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
          <Button
            variant="outline"
            className="w-full"
            onClick={(e) => e.preventDefault()}
          >
            <FcGoogle style={{ width: "1.4em", height: "1.4em" }} />
            S'inscrire avec Google
          </Button>
          <span className="my-2 border-b relative before:content-['ou'] before:absolute before:-translate-x-1/2 before:-translate-y-1/2 before:left-1/2 before:bg-card before:px-3 before:opacity-90"></span>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              className={`${errors.email && "border-[#ff4444]"}`}
              id="email"
              type="email"
              placeholder="m@exemple.com"
              required
              {...register("email")}
            />
            {errors.email && (
              <p className="text-[#ff4444] text-sm">{errors.email.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Mot de passe</Label>
              <Link href="#" className="ml-auto inline-block text-sm underline">
                Mot de passe oublié?
              </Link>
            </div>
            <Input
              className={`${
                errors.password &&
                "border-[#ff4444] focus-visible:ring-transparent"
              }`}
              id="password"
              type="password"
              required
              {...register("password")}
            />
            {errors.password && (
              <p className="text-[#ff4444] text-sm">
                {errors.password.message}
              </p>
            )}
          </div>
          <Button type="submit" className="w-full text-white font-semibold">
            S'inscrire
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          Vous avez déjà un compte ?&nbsp;
          <Link href="/login" className="underline">
            Se connecter
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default SignupForm;
