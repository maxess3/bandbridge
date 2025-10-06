import { useState, useRef, useCallback } from "react";
import { useFormContext } from "react-hook-form";
import { translateInstrument } from "@/utils";
import { GroupedInstruments } from "@/types/Instrument";
import { FormValues } from "../types/index";

export const useInstruments = () => {
  const { watch, setValue } = useFormContext<FormValues>();
  const formInstruments = watch("instruments");

  const [isAddingInstrument, setIsAddingInstrument] = useState(false);
  const instrumentInputRef = useRef<HTMLInputElement>(null);
  const addInstrumentButtonRef = useRef<HTMLButtonElement>(null);
  const accessibilityFocusRef = useRef<HTMLDivElement>(null);

  // Fonction utilitaire pour obtenir le nom d'un instrument
  const getInstrumentName = useCallback(
    (instrumentId: string, instrumentTypes: GroupedInstruments): string => {
      if (!instrumentTypes) return "";
      for (const category in instrumentTypes) {
        const instrument = instrumentTypes[category].find(
          (inst) => inst.id === instrumentId
        );
        if (instrument) return translateInstrument(instrument.name);
      }
      return "";
    },
    []
  );

  const handleAddInstrument = useCallback(() => {
    setIsAddingInstrument(true);
    requestAnimationFrame(() => instrumentInputRef.current?.focus());
  }, []);

  const handleInstrumentSelect = useCallback(
    (instrumentId: string) => {
      const isAlreadyAdded = formInstruments.some(
        (inst) => inst.instrumentTypeId === instrumentId
      );
      if (isAlreadyAdded) return;

      const newInstrument = {
        instrumentTypeId: instrumentId,
        level: null,
        order: formInstruments.length,
      };

      setValue("instruments", [...formInstruments, newInstrument], {
        shouldDirty: true,
      });
      setIsAddingInstrument(false);
      requestAnimationFrame(() => addInstrumentButtonRef.current?.focus());
    },
    [formInstruments, setValue]
  );

  const handleRemoveInstrument = useCallback(
    (index: number) => {
      const updatedInstruments = formInstruments.filter((_, i) => i !== index);
      const reorderedInstruments = updatedInstruments.map((inst, newIndex) => ({
        ...inst,
        order: newIndex,
      }));

      setValue("instruments", reorderedInstruments, { shouldDirty: true });
      requestAnimationFrame(() => accessibilityFocusRef.current?.focus());
    },
    [formInstruments, setValue]
  );

  const handleLevelChange = useCallback(
    (
      index: number,
      level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT" | null
    ) => {
      const updatedInstruments = formInstruments.map((inst, i) =>
        i === index ? { ...inst, level } : inst
      );
      setValue("instruments", updatedInstruments, { shouldDirty: true });
    },
    [formInstruments, setValue]
  );

  return {
    formInstruments,
    isAddingInstrument,
    setIsAddingInstrument,
    instrumentInputRef,
    addInstrumentButtonRef,
    accessibilityFocusRef,
    getInstrumentName,
    handleAddInstrument,
    handleInstrumentSelect,
    handleRemoveInstrument,
    handleLevelChange,
  };
};
