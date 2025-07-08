import { useRef, useCallback } from "react";

export function useDynamicModalFocus() {
  const originalFocusElement = useRef<HTMLElement | null>(null);

  const saveOriginalFocus = useCallback(() => {
    if (typeof window !== "undefined") {
      originalFocusElement.current = document.activeElement as HTMLElement;
    }
  }, []);

  const restoreOriginalFocus = useCallback(() => {
    if (
      originalFocusElement.current &&
      document.contains(originalFocusElement.current)
    ) {
      originalFocusElement.current.focus();
    }
    originalFocusElement.current = null;
  }, []);

  const handleModalClose = useCallback(
    (onClose: () => void) => {
      onClose();
      // Utiliser setTimeout pour laisser Radix UI fermer la modale d'abord
      setTimeout(() => {
        restoreOriginalFocus();
      }, 0);
    },
    [restoreOriginalFocus]
  );

  return {
    saveOriginalFocus,
    restoreOriginalFocus,
    handleModalClose,
  };
}
