"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Label } from "@/components/ui/label";
import { FormInput } from "@/components/shared/forms/FormInput";
import { Button } from "@/components/ui/button";
import { formUserSettings } from "@/lib/zod";
import { SETTINGS_QUERY_KEY } from "@/hooks/features/settings/useSettings";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { useSession } from "next-auth/react";
import { useSessionUpdate } from "@/hooks/useSessionUpdate";
import { useTransitionDelay } from "@/hooks/ui";
import { DescriptionSection } from "./components/DescriptionSection";
import { LocationSection } from "./components/LocationSection";

type SettingsFormValues = z.infer<typeof formUserSettings>;

interface SettingsFormProps {
  userData: {
    firstName: string;
    lastName: string;
    username: string;
    birthDate: string | null;
    gender: "OTHER" | "MALE" | "FEMALE";
  } | null;
}

export function CreateBandForm({ userData }: SettingsFormProps) {
  const queryClient = useQueryClient();
  const axiosAuth = useAxiosAuth();
  const { data: session } = useSession();
  const { updateSession } = useSessionUpdate();
  const { isDelaying, withDelay } = useTransitionDelay(600);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(formUserSettings),
  });

  const updateUserSettingsMutation = useMutation({
    mutationFn: async (data: SettingsFormValues) => {
      const { data: responseData } = await axiosAuth.put(
        "/settings/user-settings",
        {
          firstname: data.firstname,
          lastname: data.lastname,
          username: data.username,
          birthdate: data.birthdate,
          gender: data.gender,
        }
      );
      return responseData;
    },
    onSuccess: async (data) => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  const handleFormSubmit = (data: SettingsFormValues) => {
    console.log(data);
    // return withDelay(() => updateUserSettingsMutation.mutateAsync(data));
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bandName" className="text-sm font-medium">
              Nom de groupe*
            </Label>
            <FormInput
              id="bandName"
              {...register("firstname")}
              className={errors.firstname ? "border-red-500" : ""}
              placeholder="Votre nom de groupe"
            />
            {errors.firstname && (
              <p className="text-red-500 text-sm">{errors.firstname.message}</p>
            )}
          </div>
          <DescriptionSection />
          <div className="space-y-2">
            <Label htmlFor="bandName" className="text-sm font-medium">
              Genres musicaux*
            </Label>
            <FormInput
              id="bandName"
              {...register("firstname")}
              className={errors.firstname ? "border-red-500" : ""}
              placeholder="Vos genres musicaux"
            />
            {errors.firstname && (
              <p className="text-red-500 text-sm">{errors.firstname.message}</p>
            )}
          </div>
        </div>
        <LocationSection />
      </div>
      <div className="flex">
        <Button
          type="submit"
          disabled={
            !isDirty || updateUserSettingsMutation.isPending || isDelaying
          }
        >
          {updateUserSettingsMutation.isPending || isDelaying
            ? "Mise à jour..."
            : "Créer le groupe"}
        </Button>
      </div>
    </form>
  );
}
