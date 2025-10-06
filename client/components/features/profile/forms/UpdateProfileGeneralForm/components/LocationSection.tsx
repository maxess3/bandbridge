import { useFormContext, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { FormInput } from "@/components/shared/forms/FormInput";
import { FormSelect } from "@/components/shared/forms/FormSelect";
import { RadioGroup } from "@/components/ui/radio-group";
import { Radio } from "@/components/shared/buttons/Radio";
import { useLocationSearch } from "../hooks/useLocationSearch";
import { FormValues } from "../types/index";

export const LocationSection = () => {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<FormValues>();

  const { cities, isLoading, isSuccess } = useLocationSearch();

  return (
    <div className="space-y-1">
      <h4 className="font-semibold text-xl mb-2">Localisation</h4>
      <div className="space-y-4">
        {/* Pays */}
        <div className="space-y-2">
          <Label htmlFor="country" className="opacity-80 text-sm">
            Pays
          </Label>
          <Controller
            name="country"
            control={control}
            render={({ field }) => (
              <RadioGroup
                {...field}
                onValueChange={field.onChange}
                value={field.value}
                className="flex space-x-0.5"
              >
                <Radio title="France" id="france" value="France" />
              </RadioGroup>
            )}
          />
          {errors.country && (
            <p className="text-red-500 text-sm">
              {errors.country?.message?.toString()}
            </p>
          )}
        </div>

        {/* Code Postal */}
        <div className="space-y-2">
          <Label htmlFor="zipcode" className="opacity-80 text-sm">
            Code Postal*
          </Label>
          <FormInput
            id="zipcode"
            {...register("zipcode")}
            className={`${errors.zipcode && "border-red-500"}`}
          />
          {errors.zipcode && (
            <p className="text-red-500 text-sm">
              {errors.zipcode?.message?.toString()}
            </p>
          )}
        </div>

        {/* Ville */}
        <div className="space-y-2">
          <Label htmlFor="city" className="opacity-80 text-sm">
            Ville*
          </Label>
          <Controller
            name="city"
            control={control}
            render={({ field }) => (
              <FormSelect
                {...field}
                options={
                  cities?.map((city: string) => ({
                    value: city,
                    label: city,
                  })) || []
                }
                placeholder={
                  isLoading
                    ? "Chargement..."
                    : isSuccess && cities?.length
                    ? "Sélectionner une ville"
                    : "Aucune ville trouvée"
                }
                className={`w-full ${errors.city && "border-red-500"}`}
                disabled={isLoading || !cities?.length}
              />
            )}
          />
          {errors.city && (
            <p className="text-red-500 text-sm">
              {errors.city?.message?.toString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
