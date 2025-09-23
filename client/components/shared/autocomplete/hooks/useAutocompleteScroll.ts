import { useEffect } from "react";

export interface UseAutocompleteScrollProps {
  isOpen: boolean;
  selectedIndex: number;
  searchValue: string;
  containerRef: React.RefObject<HTMLDivElement>;
  listRef: React.RefObject<HTMLDivElement>;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const useAutocompleteScroll = ({
  isOpen,
  selectedIndex,
  searchValue,
  containerRef,
  listRef,
  inputRef,
}: UseAutocompleteScrollProps) => {
  // Faire défiler la fenêtre dialog vers le bas quand la liste s'ouvre
  useEffect(() => {
    if (isOpen && searchValue) {
      const scrollToShowDropdown = () => {
        const scrollableDiv = document.querySelector(
          '[role="dialog"] .overflow-y-auto'
        ) as HTMLElement;
        const inputElement = inputRef.current;
        const dropdownElement = containerRef.current?.querySelector(
          ".bg-popover"
        ) as HTMLElement;

        if (scrollableDiv && inputElement && dropdownElement) {
          const inputRect = inputElement.getBoundingClientRect();
          const dialogRect = scrollableDiv.getBoundingClientRect();
          const dropdownRect = dropdownElement.getBoundingClientRect();

          const spaceNeeded = dropdownRect.height;
          const currentScrollTop = scrollableDiv.scrollTop;
          const inputBottomInDialog = inputRect.bottom - dialogRect.top;
          const availableSpace = dialogRect.height - inputBottomInDialog;

          if (availableSpace < spaceNeeded) {
            const scrollAmount = spaceNeeded - availableSpace;
            scrollableDiv.scrollTo({
              top: currentScrollTop + scrollAmount,
              behavior: "smooth",
            });
          }
        }
      };

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          requestAnimationFrame(scrollToShowDropdown);
        });
      });
    }
  }, [isOpen, searchValue, containerRef, inputRef]);

  // Faire défiler la liste d'autosuggestion pour garder l'élément sélectionné visible
  useEffect(() => {
    if (isOpen && selectedIndex >= 0 && listRef.current) {
      const listElement = listRef.current;
      const selectedElement = listElement.children[
        selectedIndex
      ] as HTMLElement;

      if (selectedElement) {
        const listRect = listElement.getBoundingClientRect();
        const elementRect = selectedElement.getBoundingClientRect();

        if (elementRect.bottom > listRect.bottom) {
          const scrollDistance = elementRect.bottom - listRect.bottom;
          listElement.scrollBy({
            top: scrollDistance,
          });
        } else if (elementRect.top < listRect.top) {
          const scrollDistance = listRect.top - elementRect.top;
          listElement.scrollBy({
            top: -scrollDistance,
          });
        }

        // Faire défiler la modale vers l'élément sélectionné
        const scrollableDiv = document.querySelector(
          '[role="dialog"] .overflow-y-auto'
        ) as HTMLElement;

        if (scrollableDiv) {
          const dialogRect = scrollableDiv.getBoundingClientRect();
          const dropdownElement = containerRef.current?.querySelector(
            ".bg-popover"
          ) as HTMLElement;

          if (dropdownElement) {
            const dropdownRect = dropdownElement.getBoundingClientRect();

            const dropdownBottomInDialog = dropdownRect.bottom - dialogRect.top;
            const dialogHeight = dialogRect.height;

            if (dropdownBottomInDialog > dialogHeight) {
              const scrollAmount = dropdownBottomInDialog - dialogHeight;
              scrollableDiv.scrollTo({
                top: scrollableDiv.scrollTop + scrollAmount,
                behavior: "smooth",
              });
            } else if (dropdownRect.top < dialogRect.top) {
              const scrollAmount = dialogRect.top - dropdownRect.top;
              scrollableDiv.scrollTo({
                top: scrollableDiv.scrollTop - scrollAmount,
                behavior: "smooth",
              });
            }
          }
        }
      }
    }
  }, [selectedIndex, isOpen, listRef, containerRef]);
};
