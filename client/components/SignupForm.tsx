"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

import { z } from "zod";
import { formSignUpSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";

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
    title: "Finaliser l'inscription",
    description: "Entrez votre nom et prénom pour finaliser votre inscription.",
  },
  {
    fields: [],
    title: "Inscription terminée",
    description: "Votre inscription a été effectuée avec succès.",
  },
];

function SignupForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    trigger,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(formSignUpSchema),
  });

  type FieldName = keyof Inputs;

  const getCurrentStepFields = (): FieldName[] => {
    return steps[currentStep].fields as FieldName[];
  };

  const handleStepCompletion = async () => {
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

  const handleFormCompletion: SubmitHandler<Inputs> = (data) => {
    console.log(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(handleFormCompletion)}>
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {steps[currentStep].title}
          </CardTitle>
          <CardDescription>{steps[currentStep].description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentStep === 0 && (
            <div className="grid gap-4">
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
                <Label htmlFor="lastName">Nom</Label>
                <Input
                  className={`${errors.lastName && "border-[#ff4444]"}`}
                  id="lastName"
                  type="text"
                  placeholder="John"
                  {...register("lastName")}
                />
                {errors.lastName && (
                  <p className="text-[#ff4444] text-sm">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Prénom</Label>
                <Input
                  className={`${errors.firstName && "border-[#ff4444]"}`}
                  id="firstName"
                  type="text"
                  placeholder="Doe"
                  {...register("firstName")}
                />
                {errors.firstName && (
                  <p className="text-[#ff4444] text-sm">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
            </div>
          )}
          <div className="grid gap-4">
            {currentStep < MAX_STEPS && (
              <Button
                type="button"
                onClick={handleStepCompletion}
                className="w-full text-white font-semibold"
              >
                Accepter et s'inscrire
              </Button>
            )}

            {currentStep === 0 && (
              <div className="text-center text-sm">
                Vous avez déjà un compte?{" "}
                <Link href="/login" className="underline">
                  Se connecter
                </Link>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </form>
  );
}

export default SignupForm;
