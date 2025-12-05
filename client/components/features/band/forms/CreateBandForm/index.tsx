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
import { CameraIcon, PlusIcon } from "@phosphor-icons/react";

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
            <div className="relative w-28 h-28 rounded-full border-dashed border-2 border-gray-300 flex flex-col items-center justify-center">
              <CameraIcon
                className="text-foreground/50"
                weight="fill"
                size={28}
              />
              <p className="text-xs text-center uppercase font-bold">upload</p>
              <div className="bg-primary absolute top-0 right-0 w-7 h-7 rounded-full flex items-center justify-center">
                <PlusIcon size={18} className="text-white" />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="band-name" className="text-sm font-medium">
              Nom du groupe*
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
