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

import { formLoginSchema } from "@/lib/schema";

type Inputs = z.infer<typeof formLoginSchema>;

function LoginForm() {
  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(formLoginSchema),
  });

  type FieldName = keyof Inputs;

  const validateLogin = async () => {
    const fields = ["email", "password"];
    const output = await trigger(fields as FieldName[]);

    if (!output) return;

    await handleSubmit(handleFormCompletion)();
  };

  const handleFormCompletion = (data: Inputs) => {
    console.log("Formulaire soumis avec succès", data);
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
        <form
          className="grid gap-4"
          onSubmit={handleSubmit(handleFormCompletion)}
        >
          <Button
            variant="outline"
            className="w-full"
            onClick={(e) => e.preventDefault()}
          >
            <FcGoogle style={{ width: "1.4em", height: "1.4em" }} />
            Se connecter avec Google
          </Button>
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
              {...register("password")}
            />
            {errors.password && (
              <p className="text-[#ff4444] text-sm">
                {errors.password.message}
              </p>
            )}
          </div>
          <Button
            onClick={validateLogin}
            type="submit"
            className="w-full text-white font-semibold"
          >
            Se connecter
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          Vous n'avez pas de compte?{" "}
          <Link href="/signup" className="underline">
            S'inscrire
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default LoginForm;
