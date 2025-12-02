"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Label } from "@/components/ui/label";
import { FormInput } from "@/components/shared/forms/FormInput";
import { FormSelect } from "@/components/shared/forms/FormSelect";
import { Button } from "@/components/ui/button";
import { RadioGroup } from "@/components/ui/radio-group";
import { Radio } from "@/components/shared/buttons/Radio";
import React from "react";
import { formUserSettings } from "@/lib/zod";
import { SETTINGS_QUERY_KEY } from "@/hooks/features/settings/useSettings";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { useSession } from "next-auth/react";
import { useSessionUpdate } from "@/hooks/useSessionUpdate";
import { useTransitionDelay } from "@/hooks/ui";

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

export default function SettingsForm({ userData }: SettingsFormProps) {
  const queryClient = useQueryClient();
  const axiosAuth = useAxiosAuth();
  const { data: session } = useSession();
  const { updateSession } = useSessionUpdate();
  const { isDelaying, withDelay } = useTransitionDelay(600);

  // Préparer les defaultValues avec les données utilisateur
  const defaultValues = React.useMemo(() => {
    if (!userData) {
      return {
        firstname: "",
        lastname: "",
        username: "",
        birthdate: {
          day: "",
          month: "",
          year: "",
        },
        gender: "OTHER" as const,
      };
    }

    const birthdate = userData.birthDate ? new Date(userData.birthDate) : null;

    return {
      firstname: userData.firstName || "",
      lastname: userData.lastName || "",
      username: userData.username || "",
      birthdate: {
        day: birthdate ? String(birthdate.getUTCDate()).padStart(2, "0") : "",
        month: birthdate
          ? String(birthdate.getUTCMonth() + 1).padStart(2, "0")
          : "",
        year: birthdate ? String(birthdate.getUTCFullYear()) : "",
      },
      gender: userData.gender || "OTHER",
    };
  }, [userData]);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(formUserSettings),
    defaultValues,
  });

  // Mutation pour mettre à jour les paramètres utilisateur
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
      // Vérifier si les informations de base ont changé
      const usernameChanged =
        data?.user?.username &&
        session?.user?.username !== data?.user?.username;
      const firstnameChanged =
        data?.user?.firstName &&
        session?.user?.firstName !== data?.user?.firstName;
      const lastnameChanged =
        data?.user?.lastName &&
        session?.user?.lastName !== data?.user?.lastName;

      // Mettre à jour la session si nécessaire
      if (usernameChanged || firstnameChanged || lastnameChanged) {
        await updateSession({
          username: data?.user?.username,
          firstName: data?.user?.firstName,
          lastName: data?.user?.lastName,
        });
      }

      // Transformer les données pour le formulaire
      const birthdate = data?.user?.birthDate
        ? new Date(data.user.birthDate)
        : null;
      const formData = {
        ...data.user,
        birthdate: {
          day: birthdate ? String(birthdate.getUTCDate()).padStart(2, "0") : "",
          month: birthdate
            ? String(birthdate.getUTCMonth() + 1).padStart(2, "0")
            : "",
          year: birthdate ? String(birthdate.getUTCFullYear()) : "",
        },
      };
      // Réinitialiser le formulaire avec les nouvelles valeurs
      reset(formData);

      // Invalider le cache pour forcer la mise à jour
      queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  const handleFormSubmit = (data: SettingsFormValues) => {
    return withDelay(() => updateUserSettingsMutation.mutateAsync(data));
  };

  // Options pour les mois
  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    value: String(i + 1).padStart(2, "0"),
    label: new Date(0, i).toLocaleString("fr-FR", { month: "long" }),
  }));

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl mb-4">Informations personnelles</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="firstname" className="text-sm font-medium">
                Prénom*
              </Label>
              <FormInput
                id="firstname"
                {...register("firstname")}
                className={errors.firstname ? "border-red-500" : ""}
                placeholder="Votre prénom"
              />
              {errors.firstname && (
                <p className="text-red-500 text-sm">
                  {errors.firstname.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastname" className="text-sm font-medium">
                Nom*
              </Label>
              <FormInput
                id="lastname"
                {...register("lastname")}
                className={errors.lastname ? "border-red-500" : ""}
                placeholder="Votre nom"
              />
              {errors.lastname && (
                <p className="text-red-500 text-sm">
                  {errors.lastname.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium">
                Nom d'utilisateur*
              </Label>
              <FormInput
                id="username"
                {...register("username")}
                className={errors.username ? "border-red-500" : ""}
                placeholder="Votre nom d'utilisateur"
              />
              {errors.username && (
                <p className="text-red-500 text-sm">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Date de naissance</Label>
              <div className="flex items-center space-x-2">
                <FormInput
                  {...register("birthdate.day")}
                  placeholder="Jour"
                  className={`w-20 ${
                    errors.birthdate?.day ? "border-red-500" : ""
                  }`}
                  maxLength={2}
                />
                <span className="text-muted-foreground">-</span>
                <Controller
                  name="birthdate.month"
                  control={control}
                  render={({ field }) => (
                    <FormSelect
                      {...field}
                      options={monthOptions}
                      placeholder="Mois"
                      className={`w-32 ${
                        errors.birthdate?.month ? "border-red-500" : ""
                      }`}
                    />
                  )}
                />
                <span className="text-muted-foreground">-</span>
                <FormInput
                  {...register("birthdate.year")}
                  placeholder="Année"
                  className={`w-20 ${
                    errors.birthdate?.year ? "border-red-500" : ""
                  }`}
                  maxLength={4}
                />
              </div>
              {errors.birthdate?.message && (
                <p className="text-red-500 text-sm">
                  {errors.birthdate.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Genre</Label>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    {...field}
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex space-x-0.5"
                  >
                    <Radio title="Non défini" id="other" value="OTHER" />
                    <Radio title="Homme" id="male" value="MALE" />
                    <Radio title="Femme" id="female" value="FEMALE" />
                  </RadioGroup>
                )}
              />
              {errors.gender && (
                <p className="text-red-500 text-sm">{errors.gender.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-6 border-t">
        <Button
          type="submit"
          disabled={
            !isDirty || updateUserSettingsMutation.isPending || isDelaying
          }
        >
          {updateUserSettingsMutation.isPending || isDelaying
            ? "Mise à jour..."
            : "Enregistrer"}
        </Button>
      </div>
    </form>
  );
}
