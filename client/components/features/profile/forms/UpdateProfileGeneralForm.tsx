"use client";

import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/useDebounce";
import { useEffect, useRef, useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { FormInput } from "@/components/shared/forms/FormInput";
import {
  InstrumentAutocomplete,
  GenreAutocomplete,
} from "@/components/features/profile/autocomplete";
import { Button } from "@/components/ui/button";
import { Plus, X, Info } from "lucide-react";
import { translateInstrument } from "@/utils";
import { translateGenre } from "@/utils";
import { FormSelect } from "@/components/shared/forms/FormSelect";
import { RadioGroup } from "@/components/ui/radio-group";
import { Radio } from "@/components/shared/buttons/Radio";
import { GroupedInstruments } from "@/types/Instrument";

type FormValues = {
  pseudonyme: string;
  instruments: Array<{
    instrumentTypeId: string;
    level: string | null;
    order?: number;
  }>;
  genres: string[];
  country: string;
  zipcode: string;
  city: string;
};

interface UpdateProfileGeneralFormProps {
  instrumentTypes: GroupedInstruments;
  musicGenres: string[];
  isLoadingInstruments: boolean;
  isLoadingGenres: boolean;
}

export const UpdateProfileGeneralForm = ({
  instrumentTypes,
  musicGenres,
  isLoadingInstruments,
  isLoadingGenres,
}: UpdateProfileGeneralFormProps) => {
  const {
    control,
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<FormValues>();

  const zipcode = watch("zipcode");
  const debouncedZipcode = useDebounce(zipcode || "", 500);

  // Récupérer les instruments et genres directement depuis le formulaire
  const formInstruments = watch("instruments") || [];
  const formGenres = watch("genres") || [];

  // État local simplifié pour l'interface utilisateur
  const [isAddingInstrument, setIsAddingInstrument] = useState(false);
  const [isAddingGenre, setIsAddingGenre] = useState(false);

  // Ref pour l'input d'autocomplétion
  const instrumentInputRef = useRef<HTMLInputElement>(null);
  const addInstrumentButtonRef = useRef<HTMLButtonElement>(null);
  const accessibilityFocusRef = useRef<HTMLDivElement>(null);

  // Ref pour l'input d'autocomplétion des genres
  const genreInputRef = useRef<HTMLInputElement>(null);
  const addGenreButtonRef = useRef<HTMLButtonElement>(null);
  const accessibilityGenreFocusRef = useRef<HTMLDivElement>(null);

  const {
    data: cities,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: ["cities", debouncedZipcode],
    queryFn: async () => {
      if (!debouncedZipcode || debouncedZipcode.length !== 5) return [];

      try {
        const response = await fetch(
          `https://geo.api.gouv.fr/communes?codePostal=${debouncedZipcode}&fields=nom`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.map((item: { nom: string }) => item.nom);
      } catch (error) {
        console.error("Erreur API géolocalisation:", error);
        return [];
      }
    },
    enabled: debouncedZipcode.length === 5,
    retry: 2,
  });

  // SUPPRIMER les queries pour instrumentTypes et musicGenres
  // Utiliser directement les props passées

  useEffect(() => {
    if (debouncedZipcode !== zipcode) {
      setValue("city", "");
    }
  }, [debouncedZipcode, zipcode, setValue]);

  // Fonction utilitaire pour obtenir le nom d'un instrument
  const getInstrumentName = (instrumentId: string): string => {
    if (!instrumentTypes) return "";

    for (const category in instrumentTypes) {
      const instrument = instrumentTypes[category].find(
        (inst) => inst.id === instrumentId
      );
      if (instrument) {
        return translateInstrument(instrument.name);
      }
    }
    return "";
  };

  const handleAddInstrument = () => {
    setIsAddingInstrument(true);

    // Focus sur l'input après le rendu
    requestAnimationFrame(() => {
      instrumentInputRef.current?.focus();
    });
  };

  const handleInstrumentSelect = (instrumentId: string) => {
    // Vérifier que l'instrument n'est pas déjà présent
    const isAlreadyAdded = formInstruments.some(
      (inst) => inst.instrumentTypeId === instrumentId
    );

    if (isAlreadyAdded) {
      console.warn("Cet instrument est déjà ajouté");
      return;
    }

    // Ajouter l'instrument au formulaire
    const newInstrument = {
      instrumentTypeId: instrumentId,
      level: null,
      order: formInstruments.length,
    };

    setValue("instruments", [...formInstruments, newInstrument], {
      shouldDirty: true,
    });

    setIsAddingInstrument(false);

    // Focus sur le bouton "Ajouter un instrument" après le rendu
    requestAnimationFrame(() => {
      addInstrumentButtonRef.current?.focus();
    });
  };

  const handleRemoveInstrument = (index: number) => {
    const updatedInstruments = formInstruments.filter((_, i) => i !== index);

    // Mettre à jour l'ordre des instruments restants
    const reorderedInstruments = updatedInstruments.map((inst, newIndex) => ({
      ...inst,
      order: newIndex,
    }));

    setValue("instruments", reorderedInstruments, {
      shouldDirty: true,
    });

    // Rediriger le focus vers la div invisible après la suppression
    requestAnimationFrame(() => {
      accessibilityFocusRef.current?.focus();
    });
  };

  const handleLevelChange = (
    index: number,
    level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT" | null
  ) => {
    const updatedInstruments = formInstruments.map((inst, i) =>
      i === index ? { ...inst, level } : inst
    );

    setValue("instruments", updatedInstruments, {
      shouldDirty: true,
    });
  };

  // Gestionnaires pour les genres musicaux
  const handleAddGenre = () => {
    setIsAddingGenre(true);

    // Focus sur l'input après le rendu
    requestAnimationFrame(() => {
      genreInputRef.current?.focus();
    });
  };

  const handleGenreSelect = (genreId: string) => {
    // Vérifier que le genre n'est pas déjà présent
    const isAlreadyAdded = formGenres.includes(genreId);

    if (isAlreadyAdded) {
      console.warn("Ce genre est déjà ajouté");
      return;
    }

    // Ajouter le genre au formulaire
    setValue("genres", [...formGenres, genreId], {
      shouldDirty: true,
    });

    setIsAddingGenre(false);

    // Focus sur le bouton "Ajouter un genre" après le rendu
    requestAnimationFrame(() => {
      addGenreButtonRef.current?.focus();
    });
  };

  const handleRemoveGenre = (index: number) => {
    const updatedGenres = formGenres.filter((_, i) => i !== index);

    setValue("genres", updatedGenres, {
      shouldDirty: true,
    });

    // Rediriger le focus vers la div invisible après la suppression
    requestAnimationFrame(() => {
      accessibilityGenreFocusRef.current?.focus();
    });
  };

  return (
    <div className="space-y-6 pb-16">
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

      <div className="space-y-1">
        <div className="space-y-6">
          <div className="space-y-3">
            <div>
              <h4 className="font-semibold text-xl mb-1.5">
                Instruments pratiqués
              </h4>
              <p className="text-sm text-muted-foreground">
                Ajoutez vos instruments de musique et votre niveau d'expérience
              </p>
            </div>
            <div>
              {/* Instruments sélectionnés */}
              {formInstruments.map((instrument, index) => (
                <div
                  key={`${instrument.instrumentTypeId}-${index}`}
                  className="flex items-center justify-between gap-3"
                >
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveInstrument(index)}
                    className="text-muted-foreground hover:text-destructive rounded-full w-8 h-8"
                    aria-label={`Supprimer ${getInstrumentName(
                      instrument.instrumentTypeId
                    )}`}
                  >
                    <X className="!size-5" />
                  </Button>
                  <div
                    className={`flex justify-between items-center w-full ${
                      index < formInstruments.length - 1 ? "border-b" : ""
                    }`}
                  >
                    <div className="font-semibold h-full py-6">
                      {getInstrumentName(instrument.instrumentTypeId)}
                    </div>
                    <div className="flex items-center gap-2">
                      <FormSelect
                        value={instrument.level || ""}
                        onChange={(e) =>
                          handleLevelChange(
                            index,
                            e.target.value === ""
                              ? null
                              : (e.target.value as
                                  | "BEGINNER"
                                  | "INTERMEDIATE"
                                  | "ADVANCED"
                                  | "EXPERT")
                          )
                        }
                        options={[
                          { value: "BEGINNER", label: "Débutant" },
                          { value: "INTERMEDIATE", label: "Intermédiaire" },
                          { value: "ADVANCED", label: "Avancé" },
                          { value: "EXPERT", label: "Expert" },
                        ]}
                        placeholder="Niveau"
                        className="w-40"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {/* Interface d'ajout d'instrument */}
              {isAddingInstrument ? (
                <div>
                  <InstrumentAutocomplete
                    ref={instrumentInputRef}
                    value=""
                    onValueChange={handleInstrumentSelect}
                    instrumentTypes={instrumentTypes || {}}
                    isLoading={isLoadingInstruments} // Vrai état de loading
                    placeholder="Rechercher un instrument..."
                    excludedInstruments={formInstruments.map(
                      (inst) => inst.instrumentTypeId
                    )}
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  {/* Div invisible pour l'accessibilité - focus après suppression d'instrument */}
                  <div
                    ref={accessibilityFocusRef}
                    tabIndex={-1}
                    aria-hidden="true"
                    className="sr-only"
                  />

                  {formInstruments.length >= 10 && (
                    <p className="text-sm text-amber-600 rounded-md flex items-center gap-1.5">
                      <Info className="!size-4" />
                      Vous avez atteint le maximum de 10 instruments.
                    </p>
                  )}
                  <Button
                    ref={addInstrumentButtonRef}
                    type="button"
                    variant="outline"
                    onClick={handleAddInstrument}
                    onKeyDown={(e) => {
                      // Empêcher le scroll avec les touches fléchées
                      if (
                        [
                          "ArrowUp",
                          "ArrowDown",
                          "ArrowLeft",
                          "ArrowRight",
                        ].includes(e.key)
                      ) {
                        e.preventDefault();
                      }
                    }}
                    disabled={
                      isLoadingInstruments || formInstruments.length >= 10
                    } // Vrai état de loading
                    className="rounded-md"
                  >
                    <Plus className="!size-5" />
                    Ajouter un instrument
                  </Button>
                </div>
              )}

              {/* Affichage des erreurs */}
              {(errors.instruments?.root?.message ||
                errors.instruments?.message) && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.instruments?.root?.message ||
                    errors.instruments?.message}
                </p>
              )}
            </div>
          </div>

          {/* Section Genres Musicaux */}
          <div className="space-y-3">
            <div>
              <h4 className="font-semibold text-xl mb-1.5">Genres musicaux</h4>
              <p className="text-sm text-muted-foreground">
                Ajoutez vos genres musicaux préférés
              </p>
            </div>
            <div>
              {/* Genres sélectionnés */}
              {formGenres.map((genre, index) => (
                <div
                  key={`${genre}-${index}`}
                  className="flex items-center justify-between gap-3"
                >
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveGenre(index)}
                    className="text-muted-foreground hover:text-destructive rounded-full w-8 h-8"
                    aria-label={`Supprimer ${translateGenre(genre)}`}
                  >
                    <X className="!size-5" />
                  </Button>
                  <div
                    className={`flex justify-between items-center w-full ${
                      index < formGenres.length - 1 ? "border-b" : ""
                    }`}
                  >
                    <div className="font-semibold h-full py-6">
                      {translateGenre(genre)}
                    </div>
                  </div>
                </div>
              ))}

              {/* Interface d'ajout de genre */}
              {isAddingGenre ? (
                <div>
                  <GenreAutocomplete
                    ref={genreInputRef}
                    value=""
                    onValueChange={handleGenreSelect}
                    genres={musicGenres || []}
                    isLoading={isLoadingGenres} // Vrai état de loading
                    placeholder="Rechercher un genre..."
                    excludedGenres={formGenres}
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  {/* Div invisible pour l'accessibilité - focus après suppression de genre */}
                  <div
                    ref={accessibilityGenreFocusRef}
                    tabIndex={-1}
                    aria-hidden="true"
                    className="sr-only"
                  />

                  {formGenres.length >= 10 && (
                    <p className="text-sm text-amber-600 rounded-md flex items-center gap-1.5">
                      <Info className="!size-4" />
                      Vous avez atteint le maximum de 10 genres.
                    </p>
                  )}
                  <Button
                    ref={addGenreButtonRef}
                    type="button"
                    variant="outline"
                    onClick={handleAddGenre}
                    onKeyDown={(e) => {
                      // Empêcher le scroll avec les touches fléchées
                      if (
                        [
                          "ArrowUp",
                          "ArrowDown",
                          "ArrowLeft",
                          "ArrowRight",
                        ].includes(e.key)
                      ) {
                        e.preventDefault();
                      }
                    }}
                    disabled={isLoadingGenres || formGenres.length >= 10} // Vrai état de loading
                    className="rounded-md"
                  >
                    <Plus className="!size-5" />
                    Ajouter un genre
                  </Button>
                </div>
              )}

              {/* Affichage des erreurs */}
              {(errors.genres?.root?.message || errors.genres?.message) && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.genres?.root?.message || errors.genres?.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <h4 className="font-semibold text-xl mb-2">Localisation</h4>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="country" className="opacity-80 text-sm">
                  Pays
                </Label>
                <Controller
                  name="country"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      {...field}
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex space-x-0.5"
                    >
                      <Radio title="France" id="france" value="France" />
                    </RadioGroup>
                  )}
                />
                {errors.country && (
                  <p className="text-red-500 text-sm">
                    {errors.country?.message?.toString()}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="zipcode" className="opacity-80 text-sm">
                  Code Postal*
                </Label>
                <FormInput
                  id="zipcode"
                  {...register("zipcode")}
                  className={`${errors.zipcode && "border-red-500"}`}
                />
                {errors.zipcode && (
                  <p className="text-red-500 text-sm">
                    {errors.zipcode?.message?.toString()}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="city" className="opacity-80 text-sm">
                  Ville*
                </Label>
                <Controller
                  name="city"
                  control={control}
                  render={({ field }) => (
                    <FormSelect
                      {...field}
                      options={
                        cities?.map((city: string) => ({
                          value: city,
                          label: city,
                        })) || []
                      }
                      placeholder={
                        isLoading
                          ? "Chargement..."
                          : isSuccess && cities?.length
                          ? "Sélectionner une ville"
                          : "Aucune ville trouvée"
                      }
                      className={`w-full ${errors.city && "border-red-500"}`}
                      disabled={isLoading || !cities?.length}
                    />
                  )}
                />
                {errors.city && (
                  <p className="text-red-500 text-sm">
                    {errors.city?.message?.toString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
