import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { FormTextArea } from "@/components/shared/forms/FormTextArea";
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
    <div className="space-y-1">
      <Label
        htmlFor="description"
        className="opacity-80 flex items-center text-sm"
      >
        Vous pouvez évoquer votre expérience, votre domaine d'activité ou vos
        compétences.
      </Label>
      <FormTextArea
        id="description"
        {...register("description")}
        className={`${errors.description && "border-red-500"}`}
      />
      <div className="flex justify-between items-center">
        {errors.description && (
          <p className="text-red-500 text-sm">
            {errors.description?.message?.toString()}
          </p>
        )}
        <p
          className={`text-sm ml-auto ${
            currentChars > maxChars ? "text-red-500" : "text-foreground/80"
          }`}
        >
          {currentChars} / {maxChars}
        </p>
      </div>
    </div>
  );
};
