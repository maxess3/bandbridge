"use client";

import { useCallback } from "react";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  FormFieldInput,
  FormField,
  FormFieldTextArea,
  FormFieldSelect,
} from "@/components/shared/forms";
import { Button } from "@/components/ui/button";
import { RoleAutocomplete, Role } from "@/components/features/profile/autocomplete";
import { createBandHiringAdSchema } from "@/lib/zod";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { useTransitionDelay } from "@/hooks/ui";
import { translateRole } from "@/utils";
import { X } from "lucide-react";

type FormValues = z.infer<typeof createBandHiringAdSchema>;

const REHEARSAL_OPTIONS = [
  { value: "NOT_SPECIFIED", label: "Non spécifié" },
  { value: "ONCE_PER_WEEK", label: "Une fois par semaine" },
  { value: "TWO_TO_THREE_PER_WEEK", label: "2 à 3 fois par semaine" },
  { value: "MORE_THAN_THREE_PER_WEEK", label: "Plus de 3 fois par semaine" },
] as const;

interface CreateBandAdFormProps {
  bandId: string;
}

const getRoleDisplayName = (roleId: string, roles: Role[]): string => {
  const role = roles.find((r) => r.id === roleId);
  return role ? translateRole(role.name) : "";
};

export function CreateBandAdForm({ bandId }: CreateBandAdFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const axiosAuth = useAxiosAuth();
  const { isDelaying, withDelay } = useTransitionDelay(600);

  const { data: roles = [], isLoading: isLoadingRoles } = useQuery<Role[]>({
    queryKey: ["roles"],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/profile/roles`
      );
      if (!response.ok) {
        throw new Error("Impossible de récupérer les rôles");
      }
      return response.json();
    },
  });

  const methods = useForm<FormValues>({
    resolver: zodResolver(createBandHiringAdSchema),
    defaultValues: {
      title: "",
      content: "",
      rehearsalsPerWeek: undefined,
      country: "",
      city: "",
      zipCode: "",
      departmentName: "",
      requiredSlots: [],
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    control,
    watch,
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "requiredSlots",
  });

  const requiredSlots = watch("requiredSlots");
  const excludedRoleIds = (requiredSlots ?? []).map((slot) => slot.roleId);

  const handleRoleSelect = useCallback(
    (roleId: string) => {
      if ((requiredSlots ?? []).some((s) => s.roleId === roleId)) return;
      append({ roleId, quantity: 1 });
    },
    [append, requiredSlots]
  );

  const createAdMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const { data } = await axiosAuth.post(`/band/${bandId}/ads`, values);
      return data;
    },
  });

  const handleFormSubmit = (values: FormValues) => {
    return withDelay(async () => {
      await createAdMutation.mutateAsync(values);
      await queryClient.invalidateQueries({ queryKey: ["band"] });
      router.push(`/band/${bandId}`);
    });
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="space-y-6">
          <div className="space-y-4">
            <FormField
              label="Titre"
              htmlFor="ad-title"
              error={errors.title}
              required
            >
              <FormFieldInput
                id="ad-title"
                {...register("title")}
                error={errors.title}
                placeholder="Ex. Recherche batteur pour tournée"
              />
            </FormField>
            <FormField
              label="Description"
              htmlFor="ad-content"
              error={errors.content}
              required
              labelClassName="flex items-center"
            >
              <FormFieldTextArea
                id="ad-content"
                {...register("content")}
                error={errors.content}
                placeholder="Décrivez votre projet, le style musical, les disponibilités..."
                rows={5}
              />
            </FormField>

            <FormField
              label="Rythme de répétitions"
              htmlFor="ad-rehearsals"
              error={errors.rehearsalsPerWeek}
            >
              <FormFieldSelect
                id="ad-rehearsals"
                {...register("rehearsalsPerWeek")}
                options={REHEARSAL_OPTIONS.map((o) => ({
                  value: o.value,
                  label: o.label,
                }))}
                placeholder="Non spécifié"
                error={errors.rehearsalsPerWeek}
                className="w-full"
              />
            </FormField>

            <div className="space-y-2">
              <h4 className="font-semibold text-xl">Lieu (facultatif)</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  label="Pays"
                  htmlFor="ad-country"
                  error={errors.country}
                >
                  <FormFieldInput
                    id="ad-country"
                    {...register("country")}
                    error={errors.country}
                    placeholder="Ex. France"
                  />
                </FormField>
                <FormField
                  label="Ville"
                  htmlFor="ad-city"
                  error={errors.city}
                >
                  <FormFieldInput
                    id="ad-city"
                    {...register("city")}
                    error={errors.city}
                    placeholder="Ex. Paris"
                  />
                </FormField>
                <FormField
                  label="Code postal"
                  htmlFor="ad-zipCode"
                  error={errors.zipCode}
                >
                  <FormFieldInput
                    id="ad-zipCode"
                    {...register("zipCode")}
                    error={errors.zipCode}
                    placeholder="75001"
                  />
                </FormField>
                <FormField
                  label="Département"
                  htmlFor="ad-departmentName"
                  error={errors.departmentName}
                >
                  <FormFieldInput
                    id="ad-departmentName"
                    {...register("departmentName")}
                    error={errors.departmentName}
                    placeholder="Ex. Paris"
                  />
                </FormField>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-xl">Postes recherchés</h4>
              <p className="text-sm text-muted-foreground">
                Recherchez et sélectionnez un rôle pour l&apos;ajouter
              </p>
              <RoleAutocomplete
                value=""
                onValueChange={handleRoleSelect}
                roles={roles}
                isLoading={isLoadingRoles}
                placeholder="Tapez pour rechercher un rôle..."
                excludedRoleIds={excludedRoleIds}
              />

              {fields.length > 0 && (
                <ul className="space-y-2 mt-4">
                  {fields.map((field, index) => (
                    <li
                      key={field.id}
                      className="flex items-center gap-3 py-2 border-b border-border last:border-b-0"
                    >
                      <span className="font-medium min-w-[140px]">
                        {getRoleDisplayName(
                          requiredSlots?.[index]?.roleId ?? "",
                          roles
                        )}
                      </span>
                      <div className="flex items-center gap-2">
                        <label
                          htmlFor={`slot-quantity-${index}`}
                          className="sr-only"
                        >
                          Quantité
                        </label>
                        <input
                          id={`slot-quantity-${index}`}
                          type="number"
                          min={1}
                          max={10}
                          className="w-16 rounded-md border border-input bg-background px-2 py-1.5 text-sm"
                          {...register(`requiredSlots.${index}.quantity`, {
                            valueAsNumber: true,
                          })}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                        className="text-muted-foreground hover:text-destructive rounded-full w-8 h-8"
                        aria-label="Supprimer ce poste"
                      >
                        <X className="size-5!" />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}

              {(errors.requiredSlots?.root?.message ||
                errors.requiredSlots?.message) && (
                <p className="text-red-500 text-sm">
                  {errors.requiredSlots?.root?.message ??
                    errors.requiredSlots?.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex">
          <Button
            type="submit"
            disabled={
              !isDirty ||
              createAdMutation.isPending ||
              isDelaying ||
              (requiredSlots?.length ?? 0) === 0
            }
          >
            {createAdMutation.isPending || isDelaying
              ? "Création de l'annonce..."
              : "Créer l'annonce"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
