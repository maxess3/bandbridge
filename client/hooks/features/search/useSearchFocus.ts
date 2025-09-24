import { useRef, useCallback } from "react";
import { useClickOutside } from "@/hooks/ui/useClickOutside";

export interface UseSearchFocusProps {
  isOpen: boolean;
  onCloseDropdown: () => void;
}

export const useSearchFocus = ({
  isOpen,
  onCloseDropdown,
}: UseSearchFocusProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Gestion du clic extérieur
  useClickOutside({
    ref: dropdownRef,
    onOutsideClick: onCloseDropdown,
    enabled: isOpen,
  });

  const handleFocus = useCallback(() => {
    // Le focus sera géré par le composant parent
  }, []);

  const handleBlur = useCallback(() => {
    // Le blur sera géré par le composant parent
  }, []);

  const blurInput = useCallback(() => {
    inputRef.current?.blur();
  }, []);

  return {
    inputRef,
    dropdownRef,
    handleFocus,
    handleBlur,
    blurInput,
  };
};
