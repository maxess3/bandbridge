import { useState, useEffect, useRef } from "react";
import { useClickOutside } from "@/hooks/ui/useClickOutside";
import { useAutocompleteState } from "@/contexts/AutocompleteContext";

export interface UseAutocompleteFocusProps {
  searchValue: string;
  minSearchLength: number;
  onDropdownStateChange?: (isOpen: boolean) => void;
}

export const useAutocompleteFocus = ({
  searchValue,
  minSearchLength,
  onDropdownStateChange,
}: UseAutocompleteFocusProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const { setAutocompleteOpen } = useAutocompleteState();

  // Utiliser le custom hook pour la détection de clic extérieur
  useClickOutside({
    ref: containerRef,
    onOutsideClick: () => {
      setIsOpen(false);
      setSelectedIndex(-1);
    },
    enabled: isOpen,
  });

  // Notifier le contexte du changement d'état
  useEffect(() => {
    setAutocompleteOpen(isOpen);
    onDropdownStateChange?.(isOpen);
  }, [isOpen, setAutocompleteOpen, onDropdownStateChange]);

  const openDropdown = () => {
    if (searchValue.length >= minSearchLength) {
      setIsOpen(true);
      setSelectedIndex(-1);
    }
  };

  const closeDropdown = () => {
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  const handleFocus = () => {
    openDropdown();
  };

  const handleInputChange = (newValue: string) => {
    if (newValue.length >= minSearchLength) {
      setIsOpen(true);
      setSelectedIndex(-1);
    } else {
      setIsOpen(false);
      setSelectedIndex(-1);
    }
  };

  const navigateDown = (filteredItemsLength: number) => {
    setSelectedIndex((prev) => {
      if (prev === -1) return 0;
      return prev < filteredItemsLength - 1 ? prev + 1 : 0;
    });
  };

  const navigateUp = (filteredItemsLength: number) => {
    setSelectedIndex((prev) => {
      if (prev === -1) return filteredItemsLength - 1;
      return prev > 0 ? prev - 1 : filteredItemsLength - 1;
    });
  };

  const selectItem = () => {
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.blur();
    // Forcer la mise à jour du contexte global
    setAutocompleteOpen(false);
  };

  const handleEscape = () => {
    setIsOpen(false);
    setSelectedIndex(-1);
    // Forcer la mise à jour du contexte global
    setAutocompleteOpen(false);
  };

  const handleTab = () => {
    setIsOpen(false);
    setSelectedIndex(-1);
    // Forcer la mise à jour du contexte global
    setAutocompleteOpen(false);
  };

  const forceOpen = () => {
    setIsOpen(true);
    setSelectedIndex(-1);
  };

  return {
    isOpen,
    selectedIndex,
    inputRef,
    containerRef,
    listRef,
    openDropdown,
    closeDropdown,
    forceOpen,
    handleFocus,
    handleInputChange,
    navigateDown,
    navigateUp,
    selectItem,
    handleEscape,
    handleTab,
  };
};
