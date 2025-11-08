import { useEffect } from "react";

export interface UseSearchScrollProps {
  selectedIndex: number;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
}

export const useSearchScroll = ({
  selectedIndex,
  dropdownRef,
}: UseSearchScrollProps) => {
  // Faire défiler la liste pour garder l'élément sélectionné visible
  useEffect(() => {
    if (selectedIndex >= 0 && dropdownRef.current) {
      const listElement = dropdownRef.current.querySelector(
        '[role="listbox"]'
      ) as HTMLElement;
      if (!listElement) return;

      const selectedElement = listElement.children[
        selectedIndex
      ] as HTMLElement;

      if (selectedElement) {
        const listRect = listElement.getBoundingClientRect();
        const elementRect = selectedElement.getBoundingClientRect();

        // Vérifier si l'élément est en dehors de la zone visible
        if (elementRect.bottom > listRect.bottom) {
          // L'élément est en dessous de la zone visible, faire défiler vers le bas
          const scrollDistance = elementRect.bottom - listRect.bottom;
          listElement.scrollBy({
            top: scrollDistance,
            behavior: "smooth",
          });
        } else if (elementRect.top < listRect.top) {
          // L'élément est au-dessus de la zone visible, faire défiler vers le haut
          const scrollDistance = listRect.top - elementRect.top;
          listElement.scrollBy({
            top: -scrollDistance,
            behavior: "smooth",
          });
        }
      }
    }
  }, [selectedIndex, dropdownRef]);
};
