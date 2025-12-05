"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FormFieldInput,
  FormFieldSelect,
  FormField,
  FormFieldRadioGroup,
} from "@/components/shared/forms";
import { formatBirthdateForForm } from "@/utils/date";
import { Button } from "@/components/ui/button";
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

    return {
      firstname: userData.firstName || "",
      lastname: userData.lastName || "",
      username: userData.username || "",
      birthdate: formatBirthdateForForm(userData.birthDate),
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
      const formData = {
        ...data.user,
        birthdate: formatBirthdateForForm(data?.user?.birthDate || null),
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
        <h2 className="text-xl mb-4">Informations personnelles</h2>
        <div className="space-y-4">
          <FormField
            label="Prénom"
            htmlFor="firstname"
            error={errors.firstname}
            required
          >
            <FormFieldInput
              id="firstname"
              {...register("firstname")}
              error={errors.firstname}
              placeholder="Votre prénom"
            />
          </FormField>
          <FormField
            label="Nom"
            htmlFor="lastname"
            error={errors.lastname}
            required
          >
            <FormFieldInput
              id="lastname"
              {...register("lastname")}
              error={errors.lastname}
              placeholder="Votre nom"
            />
          </FormField>
          <FormField
            label="Nom d'utilisateur"
            htmlFor="username"
            error={errors.username}
            required
          >
            <FormFieldInput
              id="username"
              {...register("username")}
              error={errors.username}
              placeholder="Votre nom d'utilisateur"
            />
          </FormField>
          <FormField label="Date de naissance" htmlFor="birthdate-day">
            <div className="flex items-center space-x-2">
              <FormFieldInput
                {...register("birthdate.day")}
                placeholder="Jour"
                error={errors.birthdate?.day}
                className="w-20"
                maxLength={2}
              />
              <span className="text-muted-foreground">-</span>
              <Controller
                name="birthdate.month"
                control={control}
                render={({ field }) => (
                  <FormFieldSelect
                    {...field}
                    options={monthOptions}
                    placeholder="Mois"
                    error={errors.birthdate?.month}
                    className="w-32"
                  />
                )}
              />
              <span className="text-muted-foreground">-</span>
              <FormFieldInput
                {...register("birthdate.year")}
                placeholder="Année"
                error={errors.birthdate?.year}
                className="w-20"
                maxLength={4}
              />
            </div>
            {errors.birthdate?.message && (
              <p className="text-red-500 text-sm">{errors.birthdate.message}</p>
            )}
          </FormField>
          <FormField label="Genre" htmlFor="gender" error={errors.gender}>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <FormFieldRadioGroup
                  {...field}
                  onValueChange={field.onChange}
                  value={field.value}
                  error={errors.gender}
                  className="flex space-x-0.5"
                >
                  <Radio title="Non défini" id="other" value="OTHER" />
                  <Radio title="Homme" id="male" value="MALE" />
                  <Radio title="Femme" id="female" value="FEMALE" />
                </FormFieldRadioGroup>
              )}
            />
          </FormField>
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
