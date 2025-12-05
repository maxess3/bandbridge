import { useFormContext } from "react-hook-form";
import { FormFieldTextArea, FormField } from "@/components/shared/forms";
import { CreateBandFormValues } from "../types";

export const DescriptionSection = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<CreateBandFormValues>();

  return (
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
  );
};
