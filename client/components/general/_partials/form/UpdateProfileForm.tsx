"use client";

import { useFormContext, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { RadioGroup } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Radio } from "@/components/general/_partials/button/Radio";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const UpdateProfileForm = () => {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext();
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h4 className="font-semibold text-2xl">Informations de base</h4>
        <div className="space-y-3">
          <div className="space-y-6">
            <div className="space-y-1">
              <Label htmlFor="firstname" className="opacity-80">
                Prénom
              </Label>
              <Input
                id="firstname"
                {...register("firstname")}
                className={`${errors.firstname && "border-red-500"}`}
              />
              {errors.firstname && (
                <p className="text-red-500 text-sm">
                  {errors.firstname?.message?.toString()}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="username" className="opacity-80">
                Nom d'utilisateur
              </Label>
              <Input
                id="username"
                {...register("username")}
                className={`${errors.username && "border-red-500"}`}
              />
              {errors.username && (
                <p className="text-red-500 text-sm">
                  {errors.username?.message?.toString()}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="birthday" className="opacity-80">
                Date de naissance
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Jour"
                  id="birthday"
                  className="w-14"
                  maxLength={2}
                />
                <span className="w-1 flex justify-center">-</span>
                <Select>
                  <SelectTrigger className="w-32 h-9">
                    <SelectValue placeholder="Mois" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="01">Janvier</SelectItem>
                      <SelectItem value="02">Février</SelectItem>
                      <SelectItem value="03">Mars</SelectItem>
                      <SelectItem value="04">Avril</SelectItem>
                      <SelectItem value="mai">Mai</SelectItem>
                      <SelectItem value="juin">Juin</SelectItem>
                      <SelectItem value="juillet">Juillet</SelectItem>
                      <SelectItem value="aout">Aout</SelectItem>
                      <SelectItem value="septembre">Septembre</SelectItem>
                      <SelectItem value="octobre">Octobre</SelectItem>
                      <SelectItem value="novembre">Novembre</SelectItem>
                      <SelectItem value="decembre">Décembre</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <span className="w-1 flex justify-center">-</span>
                <Input
                  placeholder="Année"
                  className="w-20"
                  id="year"
                  maxLength={4}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="gender" className="opacity-80">
                Genre
              </Label>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    {...field}
                    onValueChange={field.onChange}
                    defaultValue="other"
                    value={field.value}
                    className="flex space-x-0.5"
                  >
                    <Radio title="Non défini" id="other" value="other" />
                    <Radio title="Homme" id="male" value="male" />
                    <Radio title="Femme" id="female" value="female" />
                  </RadioGroup>
                )}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="country" className="opacity-80">
                Pays
              </Label>
              <Controller
                name="country"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    {...field}
                    onValueChange={field.onChange}
                    defaultValue="france"
                    value={field.value}
                    className="flex space-x-0.5"
                  >
                    <Radio title="France" id="france" value="france" />
                  </RadioGroup>
                )}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="city" className="opacity-80">
                Ville
              </Label>
              <Input id="city" {...register("city")} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="zipcode" className="opacity-80">
                Code Postal
              </Label>
              <Input id="zipcode" {...register("zipcode")} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
