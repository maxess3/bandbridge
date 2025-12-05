import { useFormContext } from "react-hook-form";
import { FormFieldTextArea, FormField } from "@/components/shared/forms";
import { FormValues } from "../types/index";

export const DescriptionSection = () => {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<FormValues>();

  const descriptionValue = watch("description") || "";
  const maxChars = 2600;
  const currentChars = descriptionValue.length;

  return (
    <FormField
      label="Vous pouvez évoquer votre expérience, votre domaine d'activité ou vos compétences."
      htmlFor="description"
      error={errors.description}
    >
      <div className="space-y-1">
        <FormFieldTextArea
          id="description"
          {...register("description")}
          error={errors.description}
        />
        <div className="flex justify-end">
          <p
            className={`text-sm ${
              currentChars > maxChars ? "text-red-500" : "text-foreground/80"
            }`}
          >
            {currentChars} / {maxChars}
          </p>
        </div>
      </div>
    </FormField>
  );
};
