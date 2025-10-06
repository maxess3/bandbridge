import { useFormContext, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { FormSelect } from "@/components/shared/forms/FormSelect";
import { RadioGroup } from "@/components/ui/radio-group";
import { Radio } from "@/components/shared/buttons/Radio";
import { Switch } from "@/components/ui/switch";
import { FormValues } from "../types/index";

export const ExperienceSection = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<FormValues>();

  return (
    <div className="space-y-6">
      <h4 className="font-semibold text-xl">Expérience musicale</h4>

      {/* Concerts joués */}
      <div className="space-y-1">
        <Label htmlFor="concertsPlayed" className="opacity-80 text-sm">
          Concerts joués
        </Label>
        <Controller
          name="concertsPlayed"
          control={control}
          render={({ field }) => (
            <FormSelect
              {...field}
              id="concertsPlayed"
              options={[
                { value: "NOT_SPECIFIED", label: "Non spécifié" },
                { value: "LESS_THAN_10", label: "Moins de 10" },
                { value: "TEN_TO_FIFTY", label: "10 à 50" },
                { value: "FIFTY_TO_HUNDRED", label: "50 à 100" },
                { value: "MORE_THAN_HUNDRED", label: "100+" },
              ]}
              placeholder="Sélectionner une option"
              className={`w-full ${
                errors.concertsPlayed ? "border-red-500" : ""
              }`}
            />
          )}
        />
        {errors.concertsPlayed && (
          <p className="text-red-500 text-sm">
            {errors.concertsPlayed?.message?.toString()}
          </p>
        )}
      </div>

      {/* Répétitions par semaine */}
      <div className="space-y-1">
        <Label htmlFor="rehearsalsPerWeek" className="opacity-80 text-sm">
          Répétitions par semaine
        </Label>
        <Controller
          name="rehearsalsPerWeek"
          control={control}
          render={({ field }) => (
            <FormSelect
              {...field}
              id="rehearsalsPerWeek"
              options={[
                { value: "NOT_SPECIFIED", label: "Non spécifié" },
                { value: "ONCE_PER_WEEK", label: "1 fois par semaine" },
                {
                  value: "TWO_TO_THREE_PER_WEEK",
                  label: "2-3 fois par semaine",
                },
                {
                  value: "MORE_THAN_THREE_PER_WEEK",
                  label: "Plus de 3 fois par semaine",
                },
              ]}
              placeholder="Sélectionner une option"
              className={`w-full ${
                errors.rehearsalsPerWeek ? "border-red-500" : ""
              }`}
            />
          )}
        />
        {errors.rehearsalsPerWeek && (
          <p className="text-red-500 text-sm">
            {errors.rehearsalsPerWeek?.message?.toString()}
          </p>
        )}
      </div>

      {/* Type de pratique musicale */}
      <div className="space-y-1">
        <Label htmlFor="practiceType" className="opacity-80 text-sm">
          Type de pratique musicale
        </Label>
        <Controller
          name="practiceType"
          control={control}
          render={({ field }) => (
            <RadioGroup
              {...field}
              onValueChange={field.onChange}
              value={field.value}
              className="flex flex-wrap gap-2 w-full"
            >
              <Radio
                title="Non spécifié"
                id="practice-not-specified"
                value="NOT_SPECIFIED"
              />
              <Radio title="Loisir" id="hobby" value="HOBBY" />
              <Radio title="En activité" id="active" value="ACTIVE" />
            </RadioGroup>
          )}
        />
        {errors.practiceType && (
          <p className="text-red-500 text-sm">
            {errors.practiceType?.message?.toString()}
          </p>
        )}
      </div>

      {/* Recherche de groupe */}
      <div className="space-y-6">
        <h4 className="font-semibold text-xl">Recherche de groupe</h4>
        <div className="space-x-3 flex items-center">
          <Label htmlFor="isLookingForBand" className="opacity-80 text-sm">
            Activer la recherche pour rejoindre un groupe
          </Label>
          <Controller
            name="isLookingForBand"
            control={control}
            render={({ field }) => (
              <Switch
                id="isLookingForBand"
                onCheckedChange={field.onChange}
                checked={field.value}
              />
            )}
          />
          {errors.isLookingForBand && (
            <p className="text-red-500 text-sm">
              {errors.isLookingForBand?.message?.toString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
