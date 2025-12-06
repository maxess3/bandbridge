"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { FormFieldInput, FormField } from "@/components/shared/forms";
import { Button } from "@/components/ui/button";
import { formCreateBandSchema } from "@/lib/zod";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { useTransitionDelay } from "@/hooks/ui";
import { DescriptionSection } from "./components";
import { LocationSection } from "@/components/shared/forms/location";
import { GenresSection } from "@/components/shared/forms/genres";
import { CameraIcon, PlusIcon } from "@phosphor-icons/react";
import { CreateBandFormValues } from "./types";

export function CreateBandForm() {
  const queryClient = useQueryClient();
  const axiosAuth = useAxiosAuth();
  const { isDelaying, withDelay } = useTransitionDelay(600);

  // Fetch music genres
  const { data: musicGenres, isLoading: isLoadingGenres } = useQuery<string[]>({
    queryKey: ["musicGenres"],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/profile/genres`
      );
      if (!response.ok) {
        throw new Error("Impossible de récupérer les genres musicaux");
      }
      return response.json();
    },
  });

  const methods = useForm<CreateBandFormValues>({
    resolver: zodResolver(formCreateBandSchema),
    defaultValues: {
      name: "",
      slug: "",
      genres: [],
      description: "",
      country: "France",
      zipcode: "",
      city: "",
    },
  });

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = methods;

  const createBandMutation = useMutation({
    mutationFn: async (values: CreateBandFormValues) => {
      const { data: responseData } = await axiosAuth.put("/band/create", {
        name: values.name,
        slug: values.slug,
        genres: values.genres,
        description: values.description,
        country: values.country,
        city: values.city,
        zipcode: values.zipcode,
      });
      return responseData;
    },
  });

  const handleFormSubmit = (values: CreateBandFormValues) => {
    console.log(values);
    // return withDelay(() => createBandMutation.mutateAsync(data));
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="relative w-28 h-28 rounded-full border-dashed border-2 border-gray-300 flex flex-col items-center justify-center">
                <CameraIcon
                  className="text-foreground/50"
                  weight="fill"
                  size={28}
                />
                <p className="text-xs text-center uppercase font-bold">
                  upload
                </p>
                <div className="bg-primary absolute top-0 right-0 w-7 h-7 rounded-full flex items-center justify-center">
                  <PlusIcon size={18} className="text-white" />
                </div>
              </div>
            </div>
            <FormField
              label="Nom du groupe"
              htmlFor="band-name"
              error={errors.name}
              required
            >
              <FormFieldInput
                id="band-name"
                {...register("name")}
                error={errors.name}
                placeholder="Votre nom de groupe"
              />
            </FormField>
            <FormField
              label="Lien de la page"
              htmlFor="band-slug"
              error={errors.slug}
              required
            >
              <FormFieldInput
                id="band-slug"
                {...register("slug")}
                error={errors.slug}
                placeholder="/nom-de-votre-groupe"
              />
            </FormField>
            <DescriptionSection />
            <GenresSection
              musicGenres={musicGenres || []}
              isLoadingGenres={isLoadingGenres}
              description="Ajoutez les genres musicaux de votre groupe"
            />
            <LocationSection />
          </div>
        </div>
        <div className="flex">
          <Button
            type="submit"
            disabled={!isDirty || createBandMutation.isPending || isDelaying}
          >
            {createBandMutation.isPending || isDelaying
              ? "Création du groupe..."
              : "Créer le groupe"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
