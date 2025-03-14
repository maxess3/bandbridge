"use client";

import { useMutation } from "@tanstack/react-query";
import axios from "@/lib/axios";

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

import { useState } from "react";
import { useForm } from "react-hook-form";

import { z } from "zod";
import { formForgotPwdSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";

import { GoMail } from "react-icons/go";

type Input = z.infer<typeof formForgotPwdSchema>;

export default function Forgot() {
  const [currentStep, setCurrentStep] = useState(0);

  const mutation = useMutation({
    mutationFn: async (data: Input) => {
      return await axios.post("/auth/forgot-password", data);
    },
    onMutate: () => {
      setCurrentStep(1);
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Input>({
    resolver: zodResolver(formForgotPwdSchema),
  });

  const validateForgotPassword = async (data: Input) => {
    mutation.mutate(data);
    reset();
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Mot de passe oublié
        </CardTitle>
        <CardDescription>
          {currentStep < 1 &&
            "Entrez votre email pour réinitialiser votre mot de passe."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="grid gap-4"
          onSubmit={handleSubmit(validateForgotPassword)}
        >
          <div className="grid gap-2">
            {currentStep === 0 && (
              <>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@exemple.com"
                  className={`${errors.email && "border-[#ff4444]"}`}
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-[#ff4444] text-sm">
                    {errors.email.message}
                  </p>
                )}
                <Button
                  variant="primary"
                  type="submit"
                  className="mt-2 font-semibold"
                  disabled={mutation.isPending ? true : false}
                >
                  Envoyer
                </Button>
              </>
            )}
            {currentStep === 1 && (
              <div className="flex flex-col">
                <span className="w-full inline-flex justify-center">
                  <GoMail className="text-5xl" />
                </span>
                <p className="text-xl font-semibold text-center mt-2">
                  Consultez votre messagerie
                </p>
                <p className="text-sm opacity-90 mt-2">
                  Merci de regarder votre messagerie pour suivre les
                  instructions afin de réinitialiser votre mot de passe.
                </p>
                <div className="flex mt-4">
                  <Button
                    onClick={() => setCurrentStep(0)}
                    variant="outline"
                    size="lg"
                    type="button"
                    className="w-full text-white font-semibold"
                  >
                    Renvoyer l'email
                  </Button>
                </div>
              </div>
            )}
          </div>
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
