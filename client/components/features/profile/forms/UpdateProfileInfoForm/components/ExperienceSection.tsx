import { useFormContext, Controller } from "react-hook-form";
import {
  FormFieldSelect,
  FormField,
  FormFieldRadioGroup,
  FormFieldSwitch,
} from "@/components/shared/forms";
import { Radio } from "@/components/shared/buttons/Radio";
import { FormValues } from "../types/index";
import { Label } from "@/components/ui/label";

export const ExperienceSection = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<FormValues>();

  return (
    <div className="space-y-6">
      <h4 className="font-semibold text-xl">Expérience musicale</h4>

      {/* Concerts played */}
      <FormField
        label="Concerts joués"
        htmlFor="concertsPlayed"
        error={errors.concertsPlayed}
      >
        <Controller
          name="concertsPlayed"
          control={control}
          render={({ field }) => (
            <FormFieldSelect
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
              error={errors.concertsPlayed}
            />
          )}
        />
      </FormField>

      {/* Rehearsals per week */}
      <FormField
        label="Répétitions par semaine"
        htmlFor="rehearsalsPerWeek"
        error={errors.rehearsalsPerWeek}
      >
        <Controller
          name="rehearsalsPerWeek"
          control={control}
          render={({ field }) => (
            <FormFieldSelect
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
              error={errors.rehearsalsPerWeek}
            />
          )}
        />
      </FormField>

      {/* Musical practice type */}
      <FormField
        label="Type de pratique musicale"
        htmlFor="practiceType"
        error={errors.practiceType}
      >
        <Controller
          name="practiceType"
          control={control}
          render={({ field }) => (
            <FormFieldRadioGroup
              {...field}
              onValueChange={field.onChange}
              value={field.value}
              error={errors.practiceType}
              className="flex flex-wrap gap-2"
            >
              <Radio
                title="Non spécifié"
                id="practice-not-specified"
                value="NOT_SPECIFIED"
              />
              <Radio title="Loisir" id="hobby" value="HOBBY" />
              <Radio title="En activité" id="active" value="ACTIVE" />
            </FormFieldRadioGroup>
          )}
        />
      </FormField>

      {/* Group search */}
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
              <FormFieldSwitch
                id="isLookingForBand"
                onCheckedChange={field.onChange}
                checked={field.value}
                error={errors.isLookingForBand}
              />
            )}
          />
        </div>
      </div>
    </div>
  );
};
