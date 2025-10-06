"use client";

import { useMutation } from "@tanstack/react-query";
import axios from "@/lib/axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { formResetPwdSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";

type Inputs = z.infer<typeof formResetPwdSchema>;

type Payload = {
  id: string;
  token: string;
  password: string;
  confirm: string;
};

export default function ResetPasswordForm({
  userId,
  token,
}: {
  userId: string;
  token: string;
}) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");
  const mutation = useMutation({
    mutationFn: async (data: Payload) => {
      return await axios.post("/auth/reset-password", data);
    },
    onSuccess: (data) => {
      setCurrentStep(1);
      setSuccessMessage(data?.data?.message);
    },
    onError: () => {
      router.push("/auth/login");
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    mode: "onChange",
    resolver: zodResolver(formResetPwdSchema),
  });

  const validateReset = async (data: Inputs) => {
    const payload: Payload = {
      id: userId,
      token,
      password: data.password,
      confirm: data.confirm,
    };
    mutation.mutate(payload);
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          {currentStep === 0
            ? "Nouveau mot de passe"
            : "Mot de passe enregistré"}
        </CardTitle>
        <CardDescription>
          {currentStep === 0
            ? "Définissez un nouveau mot de passe pour vous connecter"
            : successMessage}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {currentStep === 0 && (
          <form className="grid gap-4" onSubmit={handleSubmit(validateReset)}>
            <div className="grid gap-2">
              <Label htmlFor="password">Entrez le mot de passe</Label>
              <Input
                id="password"
                type="password"
                className={`${errors.password && "border-[#ff4444]"}`}
                {...register("password")}
              />
              {errors.password && (
                <p className="text-[#ff4444] text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm">Confirmer le mot de passe</Label>
              <Input
                id="confirm"
                type="password"
                className={`${errors.confirm && "border-[#ff4444]"}`}
                {...register("confirm")}
              />
              {errors.confirm && (
                <p className="text-[#ff4444] text-sm">
                  {errors.confirm.message}
                </p>
              )}
            </div>
            <Button variant="primary" className="w-full font-semibold">
              Mettre à jour le mot de passe
            </Button>
            <div className="text-center">
              <Link href="/auth/login" className="text-sm underline">
                Revenir au formulaire de connexion
              </Link>
            </div>
          </form>
        )}
        {currentStep === 1 && (
          <div>
            <Button
              variant="primary"
              onClick={() => router.push("/auth/login")}
              className="w-full font-semibold"
            >
              Se connecter
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
