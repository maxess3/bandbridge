"use client";

import React, { useMemo } from "react";
import { BaseAutocomplete } from "@/components/shared/autocomplete/BaseAutocomplete";
import { BaseAutocompleteItem } from "@/components/shared/autocomplete/types/autocomplete";
import { translateInstrument } from "@/utils";

interface InstrumentType {
  id: string;
  name: string;
  category: string;
}

interface GroupedInstruments {
  [key: string]: InstrumentType[];
}

interface InstrumentItem extends BaseAutocompleteItem {
  name: string;
  category: string;
  translatedName: string;
}

interface InstrumentAutocompleteProps {
  value?: string;
  onValueChange: (value: string) => void;
  instrumentTypes: GroupedInstruments;
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
  error?: boolean;
  onDropdownStateChange?: (isOpen: boolean) => void;
  excludedInstruments?: string[];
}

export const InstrumentAutocomplete = React.forwardRef<
  HTMLInputElement,
  InstrumentAutocompleteProps
>(
  (
    {
      value = "",
      onValueChange,
      instrumentTypes,
      isLoading = false,
      placeholder = "Tapez pour rechercher un instrument...",
      className,
      error = false,
      excludedInstruments = [],
      onDropdownStateChange,
    },
    ref
  ) => {
    // Convertir les instruments en format BaseAutocompleteItem
    const instrumentItems: InstrumentItem[] = useMemo(() => {
      const allInstruments: InstrumentItem[] = [];
      for (const category in instrumentTypes) {
        allInstruments.push(
          ...instrumentTypes[category].map((instrument) => ({
            id: instrument.id,
            name: instrument.name,
            category: instrument.category,
            translatedName: translateInstrument(instrument.name),
          }))
        );
      }
      return allInstruments;
    }, [instrumentTypes]);

    // Fonction de filtrage des instruments
    const filterInstruments = (
      items: InstrumentItem[],
      searchValue: string
    ) => {
      if (!searchValue) {
        return items.filter((item) => !excludedInstruments.includes(item.id));
      }

      const searchValueLower = searchValue.toLowerCase();
      return items.filter((item) => {
        if (excludedInstruments.includes(item.id)) {
          return false;
        }

        return (
          item.name.toLowerCase().includes(searchValueLower) ||
          item.translatedName.toLowerCase().includes(searchValueLower)
        );
      });
    };

    // Fonction pour obtenir la valeur d'affichage
    const getInstrumentDisplayValue = (item: InstrumentItem) => {
      return item.translatedName;
    };

    // Fonction de rendu des éléments
    const renderInstrumentItem = (item: InstrumentItem) => {
      return item.translatedName;
    };

    // Gérer la sélection d'un instrument
    const handleInstrumentSelect = (item: InstrumentItem) => {
      onValueChange(item.id);
    };

    // Trouver l'instrument sélectionné pour l'affichage
    const getDisplayValue = () => {
      if (!value) return "";

      for (const category in instrumentTypes) {
        const instrument = instrumentTypes[category].find(
          (inst) => inst.id === value
        );
        if (instrument) {
          return translateInstrument(instrument.name);
        }
      }
      return "";
    };

    return (
      <BaseAutocomplete
        ref={ref}
        items={instrumentItems}
        value={getDisplayValue()}
        onValueChange={(displayValue) => {
          // Si l'utilisateur tape quelque chose qui correspond exactement à un instrument traduit
          const exactMatch = instrumentItems.find(
            (item) => item.translatedName === displayValue
          );
          if (exactMatch) {
            onValueChange(exactMatch.id);
            return;
          }

          // Sinon, permettre à l'utilisateur de taper librement
          // On ne fait rien ici, la valeur reste dans l'input pour la recherche
        }}
        onItemSelect={handleInstrumentSelect}
        renderItem={renderInstrumentItem}
        filterItems={filterInstruments}
        getItemDisplayValue={getInstrumentDisplayValue}
        placeholder={placeholder}
        isLoading={isLoading}
        error={error}
        className={className}
        minSearchLength={1}
        onDropdownStateChange={onDropdownStateChange}
      />
    );
  }
);

InstrumentAutocomplete.displayName = "InstrumentAutocomplete";
