import { useFormContext, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { FormInput } from "@/components/shared/forms/FormInput";
import { FormSelect } from "@/components/shared/forms/FormSelect";
import { RadioGroup } from "@/components/ui/radio-group";
import { Radio } from "@/components/shared/buttons/Radio";

export const LocationSection = () => {
  return (
    <div className="space-y-1">
      <h4 className="font-semibold text-xl mb-2">Localisation</h4>
      <div className="space-y-4">
        {/* Ville */}
        <div className="space-y-2">
          <Label htmlFor="city" className="opacity-80 text-sm">
            Ville*
          </Label>
          <FormSelect
            options={[
              { value: "Paris", label: "Paris" },
              { value: "Lyon", label: "Lyon" },
              { value: "Marseille", label: "Marseille" },
              { value: "Toulouse", label: "Toulouse" },
              { value: "Nice", label: "Nice" },
              { value: "Nantes", label: "Nantes" },
              { value: "Strasbourg", label: "Strasbourg" },
              { value: "Lille", label: "Lille" },
              { value: "Bordeaux", label: "Bordeaux" },
            ]}
            placeholder={"Sélectionner une ville"}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};
