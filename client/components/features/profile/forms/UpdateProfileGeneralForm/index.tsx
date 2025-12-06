"use client";

import { UpdateProfileGeneralFormProps } from "./types";
import { BasicInfoSection } from "./components/BasicInfoSection";
import { InstrumentsSection } from "./components/InstrumentsSection";
import { GenresSection } from "@/components/shared/forms/genres";
import { LocationSection } from "@/components/shared/forms/location";

export const UpdateProfileGeneralForm = ({
  instrumentTypes,
  musicGenres,
  isLoadingInstruments,
  isLoadingGenres,
}: UpdateProfileGeneralFormProps) => {
  return (
    <div className="space-y-6 pb-16">
      <BasicInfoSection />
      <InstrumentsSection
        instrumentTypes={instrumentTypes}
        isLoadingInstruments={isLoadingInstruments}
      />
      <GenresSection
        musicGenres={musicGenres}
        isLoadingGenres={isLoadingGenres}
        description="Ajoutez vos genres musicaux préférés"
      />
      <LocationSection />
    </div>
  );
};
