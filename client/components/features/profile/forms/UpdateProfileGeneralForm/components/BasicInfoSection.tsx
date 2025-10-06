import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { FormInput } from "@/components/shared/forms/FormInput";
import { FormValues } from "../types/index";

export const BasicInfoSection = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<FormValues>();

  return (
    <div className="space-y-1">
      <div className="space-y-2">
        <Label htmlFor="pseudonyme" className="opacity-80 text-sm">
          Pseudonyme*
        </Label>
        <FormInput
          id="pseudonyme"
          {...register("pseudonyme")}
          placeholder="Votre nom d'artiste"
          className={`${errors.pseudonyme && "border-red-500"}`}
        />
        {errors.pseudonyme && (
          <p className="text-red-500 text-sm">
            {errors.pseudonyme?.message?.toString()}
          </p>
        )}
      </div>
    </div>
  );
};
