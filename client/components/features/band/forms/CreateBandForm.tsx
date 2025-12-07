"use client";

import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FormFieldInput,
  FormField,
  FormFieldTextArea,
} from "@/components/shared/forms";
import { Button } from "@/components/ui/button";
import { formCreateBandSchema } from "@/lib/zod";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { useTransitionDelay } from "@/hooks/ui";
import { useMusicGenres } from "@/hooks/features/music";
import { LocationSection } from "@/components/shared/forms/location";
import { GenresSection } from "@/components/shared/forms/genres";
import { ImageUploadField } from "@/components/shared/forms/upload";

export function CreateBandForm() {
  const queryClient = useQueryClient();
  const axiosAuth = useAxiosAuth();
  const { isDelaying, withDelay } = useTransitionDelay(600);

  // Fetch music genres
  const { data: musicGenres, isLoading: isLoadingGenres } = useMusicGenres();

  const methods = useForm<z.infer<typeof formCreateBandSchema>>({
    resolver: zodResolver(formCreateBandSchema),
    defaultValues: {
      name: "",
      slug: "",
      genres: [],
      description: "",
      country: "France",
      zipcode: "",
      city: "",
      bandPicture: undefined,
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
    mutationFn: async (values: z.infer<typeof formCreateBandSchema>) => {
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

  const handleFormSubmit = (values: z.infer<typeof formCreateBandSchema>) => {
    console.log(values);
    // return withDelay(() => createBandMutation.mutateAsync(data));
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <ImageUploadField<z.infer<typeof formCreateBandSchema>>
                fieldName="bandPicture"
                previewSize={{ width: 112, height: 112 }}
              />
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
            <FormField
              label="Description"
              htmlFor="band-description"
              error={errors.description}
              required
              labelClassName="flex items-center"
            >
              <FormFieldTextArea
                id="band-description"
                {...register("description")}
                error={errors.description}
              />
            </FormField>
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
