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
} from "@/components/shared/forms";
import { Button } from "@/components/ui/button";
import { InstrumentAutocomplete } from "@/components/features/profile/autocomplete";
import { createBandHiringAdSchema } from "@/lib/zod";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { useTransitionDelay } from "@/hooks/ui";
import { translateInstrument } from "@/utils";
import { GroupedInstruments } from "@/types/Instrument";
import { X } from "lucide-react";

type FormValues = z.infer<typeof createBandHiringAdSchema>;

interface CreateBandAdFormProps {
  bandId: string;
}

const getInstrumentDisplayName = (
  instrumentId: string,
  instrumentTypes: GroupedInstruments
): string => {
  if (!instrumentTypes) return "";
  for (const category in instrumentTypes) {
    const instrument = instrumentTypes[category].find(
      (inst) => inst.id === instrumentId
    );
    if (instrument) return translateInstrument(instrument.name);
  }
  return "";
};

export function CreateBandAdForm({ bandId }: CreateBandAdFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const axiosAuth = useAxiosAuth();
  const { isDelaying, withDelay } = useTransitionDelay(600);

  const { data: instrumentTypes, isLoading: isLoadingInstruments } =
    useQuery<GroupedInstruments>({
      queryKey: ["instrumentTypes"],
      queryFn: async () => {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/profile/instruments`
        );
        if (!response.ok) {
          throw new Error("Impossible de récupérer les instruments");
        }
        return response.json();
      },
    });

  const methods = useForm<FormValues>({
    resolver: zodResolver(createBandHiringAdSchema),
    defaultValues: {
      title: "",
      content: "",
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
  const excludedInstrumentIds = (requiredSlots ?? []).map(
    (slot) => slot.instrumentTypeId
  );

  const handleInstrumentSelect = useCallback(
    (instrumentTypeId: string) => {
      if ((requiredSlots ?? []).some((s) => s.instrumentTypeId === instrumentTypeId)) return;
      append({ instrumentTypeId, quantity: 1 });
    },
    [append, requiredSlots]
  );

  const createAdMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const { data } = await axiosAuth.post(
        `/band/${bandId}/ads`,
        values
      );
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

            <div className="space-y-3">
              <h4 className="font-semibold text-xl">Postes recherchés</h4>
              <p className="text-sm text-muted-foreground">
                Recherchez et sélectionnez un instrument pour l&apos;ajouter
              </p>
              <InstrumentAutocomplete
                value=""
                onValueChange={handleInstrumentSelect}
                instrumentTypes={instrumentTypes ?? {}}
                isLoading={isLoadingInstruments}
                placeholder="Tapez pour rechercher un instrument..."
                excludedInstruments={excludedInstrumentIds}
              />

              {fields.length > 0 && (
                <ul className="space-y-2 mt-4">
                  {fields.map((field, index) => (
                    <li
                      key={field.id}
                      className="flex items-center gap-3 py-2 border-b border-border last:border-b-0"
                    >
                      <span className="font-medium min-w-[140px]">
                        {getInstrumentDisplayName(
                          requiredSlots?.[index]?.instrumentTypeId ?? "",
                          instrumentTypes ?? {}
                        )}
                      </span>
                      <div className="flex items-center gap-2">
                        <label htmlFor={`slot-quantity-${index}`} className="sr-only">
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
