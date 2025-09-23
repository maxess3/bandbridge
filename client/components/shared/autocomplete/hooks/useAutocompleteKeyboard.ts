import { useCallback } from "react";

export interface UseAutocompleteKeyboardProps<T> {
  isOpen: boolean;
  selectedIndex: number;
  filteredItems: T[];
  searchValue: string;
  minSearchLength: number;
  onArrowDown: () => void;
  onArrowUp: () => void;
  onEnter: () => void;
  onEscape: () => void;
  onTab: () => void;
  onForceOpen?: () => void; // Nouvelle prop pour forcer l'ouverture
}

export const useAutocompleteKeyboard = <T>({
  isOpen,
  selectedIndex,
  filteredItems,
  searchValue,
  minSearchLength,
  onArrowDown,
  onArrowUp,
  onEnter,
  onEscape,
  onTab,
  onForceOpen,
}: UseAutocompleteKeyboardProps<T>) => {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "Tab":
          onTab();
          break;
        case "ArrowDown":
          e.preventDefault();
          e.stopPropagation();

          if (!isOpen) {
            // Si le dropdown est fermé et qu'il y a des caractères dans l'input,
            // forcer l'ouverture du dropdown
            if (searchValue.length >= minSearchLength) {
              onForceOpen?.();
              onArrowDown();
            }
            return;
          }

          if (filteredItems.length === 0) return;
          onArrowDown();
          break;
        case "ArrowUp":
          e.preventDefault();
          e.stopPropagation();

          if (!isOpen) {
            // Si le dropdown est fermé et qu'il y a des caractères dans l'input,
            // forcer l'ouverture du dropdown
            if (searchValue.length >= minSearchLength) {
              onForceOpen?.();
              onArrowUp();
            }
            return;
          }

          if (filteredItems.length === 0) return;
          onArrowUp();
          break;
        case "Enter":
          e.preventDefault();
          e.stopPropagation();
          if (selectedIndex >= 0 && selectedIndex < filteredItems.length) {
            onEnter();
          }
          break;
        case "Escape":
          e.preventDefault();
          e.stopPropagation();
          onEscape();
          break;
      }
    },
    [
      isOpen,
      selectedIndex,
      filteredItems.length,
      searchValue.length,
      minSearchLength,
      onArrowDown,
      onArrowUp,
      onEnter,
      onEscape,
      onTab,
      onForceOpen,
    ]
  );

  return { handleKeyDown };
};
