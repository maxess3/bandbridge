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
import { FormFieldInput, FormField } from "@/components/shared/forms";
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
            <FormField
              label="Entrez le mot de passe"
              htmlFor="password"
              error={errors.password}
            >
              <FormFieldInput
                id="password"
                type="password"
                {...register("password")}
                error={errors.password}
              />
            </FormField>
            <FormField
              label="Confirmer le mot de passe"
              htmlFor="confirm"
              error={errors.confirm}
            >
              <FormFieldInput
                id="confirm"
                type="password"
                {...register("confirm")}
                error={errors.confirm}
              />
            </FormField>
            <Button className="w-full font-semibold">
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
