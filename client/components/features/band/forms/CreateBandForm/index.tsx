"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Label } from "@/components/ui/label";
import { FormInput } from "@/components/shared/forms/FormInput";
import { Button } from "@/components/ui/button";
import { formCreateBandSchema } from "@/lib/zod";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { useTransitionDelay } from "@/hooks/ui";
import { DescriptionSection } from "./components/DescriptionSection";

type CreateBandFormValues = z.infer<typeof formCreateBandSchema>;

export function CreateBandForm() {
  const queryClient = useQueryClient();
  const axiosAuth = useAxiosAuth();
  const { isDelaying, withDelay } = useTransitionDelay(600);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<CreateBandFormValues>({
    resolver: zodResolver(formCreateBandSchema),
  });

  const createBandMutation = useMutation({
    mutationFn: async (data: CreateBandFormValues) => {
      const { data: responseData } = await axiosAuth.put("/band/create", {
        name: data.name,
        slug: data.slug,
        genres: data.genres,
        description: data.description,
        country: data.country,
        city: data.city,
        zipCode: data.zipCode,
        departmentName: data.departmentName,
      });
      return responseData;
    },
  });

  const handleFormSubmit = (data: CreateBandFormValues) => {
    console.log(data);
    // return withDelay(() => createBandMutation.mutateAsync(data));
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="band-name" className="text-sm font-medium">
              Nom de groupe*
            </Label>
            <FormInput
              id="band-name"
              {...register("name")}
              className={errors.name ? "border-red-500" : ""}
              placeholder="Votre nom de groupe"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="band-slug" className="text-sm font-medium">
              Lien de la page*
            </Label>
            <FormInput
              id="band-slug"
              {...register("slug")}
              className={errors.slug ? "border-red-500" : ""}
              placeholder="/nom-de-votre-groupe"
            />
            {errors.slug && (
              <p className="text-red-500 text-sm">{errors.slug.message}</p>
            )}
          </div>
          <DescriptionSection />
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
  );
}
