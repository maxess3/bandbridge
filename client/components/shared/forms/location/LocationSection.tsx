import { useFormContext, Controller } from "react-hook-form";
import {
  FormFieldInput,
  FormFieldSelect,
  FormFieldRadioGroup,
  FormField,
} from "@/components/shared/forms";
import { Radio } from "@/components/shared/buttons/Radio";
import { useLocationSearch } from "./hooks/useLocationSearch";

type LocationFormValues = {
  zipcode?: string;
  city?: string;
  country?: string;
};

const LocationSectionComponent = () => {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<LocationFormValues>();

  const { cities, isLoading, isSuccess } = useLocationSearch();

  return (
    <div className="space-y-1">
      <h4 className="font-semibold text-xl mb-2">Localisation</h4>
      <div className="space-y-4">
        {/* Pays */}
        <FormField label="Pays" htmlFor="country" error={errors.country}>
          <Controller
            name="country"
            control={control}
            render={({ field }) => (
              <FormFieldRadioGroup
                {...field}
                onValueChange={field.onChange}
                value={field.value}
                error={errors.country}
                className="flex space-x-0.5"
              >
                <Radio
                  className="h-10.5"
                  title="France"
                  id="france"
                  value="France"
                />
              </FormFieldRadioGroup>
            )}
          />
        </FormField>

        {/* Code Postal */}
        <FormField
          label="Code Postal"
          htmlFor="zipcode"
          error={errors.zipcode}
          required
        >
          <FormFieldInput
            id="zipcode"
            {...register("zipcode")}
            error={errors.zipcode}
          />
        </FormField>

        {/* Ville */}
        <FormField label="Ville" htmlFor="city" error={errors.city} required>
          <Controller
            name="city"
            control={control}
            render={({ field }) => (
              <FormFieldSelect
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
                error={errors.city}
                className="w-full"
                disabled={isLoading || !cities?.length}
              />
            )}
          />
        </FormField>
      </div>
    </div>
  );
};

export const LocationSection = LocationSectionComponent;
