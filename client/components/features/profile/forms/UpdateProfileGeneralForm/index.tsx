"use client";

import { BasicInfoSection } from "./components/BasicInfoSection";
import { LocationSection } from "./components/LocationSection";
import { InstrumentsSection } from "./components/InstrumentsSection";
import { GenresSection } from "./components/GenresSection";
import { UpdateProfileGeneralFormProps } from "./types";

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
      />
      <LocationSection />
    </div>
  );
};
