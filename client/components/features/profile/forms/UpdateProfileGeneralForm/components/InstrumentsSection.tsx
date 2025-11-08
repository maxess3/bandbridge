import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Plus, Info } from "lucide-react";
import { InstrumentAutocomplete } from "@/components/features/profile/autocomplete";
import { InstrumentItem } from "../components/InstrumentItem";
import { useInstruments } from "../hooks/useInstruments";
import { FormValues } from "../types/index";
import { GroupedInstruments } from "@/types/Instrument";

interface InstrumentsSectionProps {
  instrumentTypes: GroupedInstruments;
  isLoadingInstruments: boolean;
}

export const InstrumentsSection = ({
  instrumentTypes,
  isLoadingInstruments,
}: InstrumentsSectionProps) => {
  const {
    formState: { errors },
  } = useFormContext<FormValues>();

  const {
    formInstruments,
    isAddingInstrument,
    instrumentInputRef,
    addInstrumentButtonRef,
    accessibilityFocusRef,
    getInstrumentName,
    handleAddInstrument,
    handleInstrumentSelect,
    handleRemoveInstrument,
    handleLevelChange,
  } = useInstruments();

  return (
    <div className="space-y-3">
      <div>
        <h4 className="font-semibold text-xl mb-1.5">Instruments pratiqués</h4>
        <p className="text-sm text-muted-foreground">
          Ajoutez vos instruments de musique et votre niveau d'expérience
        </p>
      </div>
      <div>
        {/* Instruments sélectionnés */}
        {formInstruments.map((instrument, index) => (
          <InstrumentItem
            key={`${instrument.instrumentTypeId}-${index}`}
            instrument={instrument}
            index={index}
            instrumentName={getInstrumentName(
              instrument.instrumentTypeId,
              instrumentTypes
            )}
            onRemove={handleRemoveInstrument}
            onLevelChange={handleLevelChange}
            isLast={index === formInstruments.length - 1}
          />
        ))}

        {/* Interface d'ajout d'instrument */}
        {isAddingInstrument ? (
          <div>
            <InstrumentAutocomplete
              ref={instrumentInputRef}
              value=""
              onValueChange={handleInstrumentSelect}
              instrumentTypes={instrumentTypes || {}}
              isLoading={isLoadingInstruments}
              placeholder="Rechercher un instrument..."
              excludedInstruments={formInstruments.map(
                (inst) => inst.instrumentTypeId
              )}
            />
          </div>
        ) : (
          <div className="space-y-2">
            <div
              ref={accessibilityFocusRef}
              tabIndex={-1}
              aria-hidden="true"
              className="sr-only"
            />

            {formInstruments.length >= 10 && (
              <p className="text-sm text-amber-600 rounded-md flex items-center gap-1.5">
                <Info className="size-4!" />
                Vous avez atteint le maximum de 10 instruments.
              </p>
            )}

            <Button
              ref={addInstrumentButtonRef}
              type="button"
              variant="outline"
              onClick={handleAddInstrument}
              disabled={isLoadingInstruments || formInstruments.length >= 10}
              className="rounded-md"
            >
              <Plus className="size-5!" />
              Ajouter un instrument
            </Button>
          </div>
        )}

        {/* Erreurs instruments */}
        {(errors.instruments?.root?.message || errors.instruments?.message) && (
          <p className="text-red-500 text-sm mt-1">
            {errors.instruments?.root?.message || errors.instruments?.message}
          </p>
        )}
      </div>
    </div>
  );
};
