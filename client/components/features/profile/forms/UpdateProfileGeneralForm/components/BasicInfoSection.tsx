import { useFormContext } from "react-hook-form";
import { FormFieldInput, FormField } from "@/components/shared/forms";
import { FormValues } from "../types/index";

export const BasicInfoSection = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<FormValues>();

  return (
    <FormField
      label="Pseudonyme"
      htmlFor="pseudonyme"
      error={errors.pseudonyme}
      required
    >
      <FormFieldInput
        id="pseudonyme"
        {...register("pseudonyme")}
        placeholder="Votre nom d'artiste"
        error={errors.pseudonyme}
      />
    </FormField>
  );
};
