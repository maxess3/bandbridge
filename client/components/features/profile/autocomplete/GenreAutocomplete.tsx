"use client";

import React, {
  useState,
  useRef,
  useImperativeHandle,
  useEffect,
  useMemo,
} from "react";
import { cn } from "@/lib/utils";
import { FormInput } from "@/components/shared/forms/FormInput";
import { useAutocompleteState } from "@/contexts/AutocompleteContext";
import { translateGenre } from "@/utils/translations/genreTranslations";
import { useClickOutside } from "@/hooks/useClickOutside";

interface GenreAutocompleteProps {
  value?: string;
  onValueChange: (value: string) => void;
  genres: string[];
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
  error?: boolean;
  onDropdownStateChange?: (isOpen: boolean) => void;
  excludedGenres?: string[];
}

export const GenreAutocomplete = React.forwardRef<
  HTMLInputElement,
  GenreAutocompleteProps
>(
  (
    {
      value,
      onValueChange,
      genres,
      isLoading = false,
      placeholder = "Tapez pour rechercher un genre...",
      className,
      error = false,
      excludedGenres = [],
    },
    ref
  ) => {
    const [searchValue, setSearchValue] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const { setAutocompleteOpen } = useAutocompleteState();

    // Exposer la référence pour React Hook Form
    useImperativeHandle(ref, () => inputRef.current!, []);

    // Utiliser le custom hook pour la détection de clic extérieur
    useClickOutside({
      ref: containerRef,
      onOutsideClick: () => {
        setIsOpen(false);
        setSelectedIndex(-1);
      },
      enabled: isOpen,
    });

    // Mettre à jour searchValue quand value change (pour l'affichage initial)
    useEffect(() => {
      if (value) {
        setSearchValue(translateGenre(value));
      } else {
        setSearchValue("");
      }
    }, [value]);

    // Filtrer les genres basé sur la recherche
    const filteredGenres = useMemo(() => {
      if (!searchValue) {
        // Utiliser searchValue au lieu de debouncedSearchValue
        // Si pas de recherche, retourner tous les genres sauf ceux exclus
        return genres.filter((genre) => !excludedGenres.includes(genre));
      }

      const searchValueLower = searchValue.toLowerCase(); // Utiliser searchValue

      return genres.filter((genre) => {
        // Exclure les genres déjà sélectionnés
        if (excludedGenres.includes(genre)) {
          return false;
        }

        const translatedName = translateGenre(genre);

        // Recherche plus flexible : inclut, pas seulement startsWith
        return (
          genre.toLowerCase().includes(searchValueLower) ||
          translatedName.toLowerCase().includes(searchValueLower)
        );
      });
    }, [genres, searchValue, excludedGenres]); // Utiliser searchValue au lieu de debouncedSearchValue

    // Faire défiler la fenêtre dialog vers le bas quand la liste s'ouvre avec scroll smooth
    useEffect(() => {
      if (isOpen && searchValue) {
        // Utiliser searchValue au lieu de debouncedSearchValue
        // Utiliser requestAnimationFrame plusieurs fois pour s'assurer que le DOM est mis à jour
        const scrollToShowDropdown = () => {
          const scrollableDiv = document.querySelector(
            '[role="dialog"] .overflow-y-auto'
          ) as HTMLElement;
          const inputElement = inputRef.current;
          const dropdownElement = containerRef.current?.querySelector(
            ".bg-popover"
          ) as HTMLElement;

          if (scrollableDiv && inputElement && dropdownElement) {
            // Calculer la position de l'input dans la modale
            const inputRect = inputElement.getBoundingClientRect();
            const dialogRect = scrollableDiv.getBoundingClientRect();
            const dropdownRect = dropdownElement.getBoundingClientRect();

            // Calculer l'espace nécessaire basé sur la hauteur réelle de la liste déroulante
            const spaceNeeded = dropdownRect.height; // Supprimer les 20px de marge
            const currentScrollTop = scrollableDiv.scrollTop;
            const inputBottomInDialog = inputRect.bottom - dialogRect.top;
            const availableSpace = dialogRect.height - inputBottomInDialog;

            // Si il n'y a pas assez d'espace, scroller pour en faire
            if (availableSpace < spaceNeeded) {
              const scrollAmount = spaceNeeded - availableSpace;
              scrollableDiv.scrollTo({
                top: currentScrollTop + scrollAmount,
                behavior: "smooth",
              });
            }
          }
        };

        // Premier frame pour attendre le rendu initial
        requestAnimationFrame(() => {
          // Deuxième frame pour s'assurer que la liste est complètement rendue
          requestAnimationFrame(() => {
            // Troisième frame pour être sûr que tout est prêt
            requestAnimationFrame(scrollToShowDropdown);
          });
        });
      }
    }, [isOpen, searchValue]); // Utiliser searchValue au lieu de debouncedSearchValue

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

          // NOUVELLE FONCTIONNALITÉ: Faire défiler la modale vers l'élément sélectionné
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

              // Calculer la position du bas du dropdown par rapport à la modale
              const dropdownBottomInDialog =
                dropdownRect.bottom - dialogRect.top;
              const dialogHeight = dialogRect.height;

              // Si le dropdown dépasse en bas de la modale, ajuster le scroll
              if (dropdownBottomInDialog > dialogHeight) {
                const scrollAmount = dropdownBottomInDialog - dialogHeight;
                scrollableDiv.scrollTo({
                  top: scrollableDiv.scrollTop + scrollAmount,
                  behavior: "smooth",
                });
              }
              // Si le dropdown dépasse en haut de la modale, ajuster le scroll
              else if (dropdownRect.top < dialogRect.top) {
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
    }, [selectedIndex, isOpen]);

    // Notifier le contexte du changement d'état
    useEffect(() => {
      setAutocompleteOpen(isOpen);
    }, [isOpen, setAutocompleteOpen]);

    // Gérer les touches clavier
    const handleKeyDown = (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "Tab":
          setIsOpen(false);
          setSelectedIndex(-1);
          break;
        case "ArrowDown":
          e.preventDefault();
          e.stopPropagation();

          // Si le dropdown est fermé, l'ouvrir et sélectionner le premier élément
          // Seulement si on a au moins 1 caractère dans la recherche
          if (!isOpen) {
            if (filteredGenres.length > 0 && searchValue.length >= 1) {
              setIsOpen(true);
              setSelectedIndex(0);
            }
            return;
          }

          // Si le dropdown est ouvert, naviguer dans la liste
          if (filteredGenres.length === 0) return;
          setSelectedIndex((prev) => {
            if (prev === -1) return 0;
            return prev < filteredGenres.length - 1 ? prev + 1 : 0;
          });
          break;
        case "ArrowUp":
          e.preventDefault();
          e.stopPropagation();

          // Si le dropdown est fermé, l'ouvrir et sélectionner le dernier élément
          // Seulement si on a au moins 1 caractère dans la recherche
          if (!isOpen) {
            if (filteredGenres.length > 0 && searchValue.length >= 1) {
              setIsOpen(true);
              setSelectedIndex(filteredGenres.length - 1);
            }
            return;
          }

          // Si le dropdown est ouvert, naviguer dans la liste
          if (filteredGenres.length === 0) return;
          setSelectedIndex((prev) => {
            if (prev === -1) return filteredGenres.length - 1;
            return prev > 0 ? prev - 1 : filteredGenres.length - 1;
          });
          break;
        case "Enter":
          e.preventDefault();
          e.stopPropagation();
          if (selectedIndex >= 0 && selectedIndex < filteredGenres.length) {
            const genre = filteredGenres[selectedIndex];
            handleSelectGenre(genre);
          }
          break;
        case "Escape":
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(false);
          setSelectedIndex(-1);
          break;
      }
    };

    // Gérer la sélection d'un genre
    const handleSelectGenre = (genre: string) => {
      onValueChange(genre);
      setSearchValue(translateGenre(genre));
      setIsOpen(false);
      setSelectedIndex(-1);
      inputRef.current?.blur();
    };

    // Gérer le changement de l'input
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setSearchValue(newValue);

      if (newValue.length >= 1) {
        setIsOpen(true);
        setSelectedIndex(-1);
      } else {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    return (
      <div ref={containerRef} className="relative">
        <FormInput
          ref={inputRef}
          value={searchValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (searchValue.length >= 1) {
              setIsOpen(true);
            }
          }}
          placeholder={placeholder}
          className={cn(
            "w-full outline-double",
            error && "border-red-500",
            className
          )}
          disabled={isLoading}
        />

        {isOpen && (
          <div className="bg-popover absolute top-full left-0 right-0 z-50 border rounded-md shadow-lg">
            <div
              ref={listRef}
              className="max-h-72 overflow-y-auto"
              onKeyDown={handleKeyDown}
              tabIndex={-1}
            >
              {filteredGenres.length === 0 ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  Aucun genre trouvé.
                </div>
              ) : (
                filteredGenres.map((genre, index) => (
                  <button
                    key={genre}
                    type="button"
                    tabIndex={-1}
                    onClick={() => handleSelectGenre(genre)}
                    onKeyDown={(e) => {
                      if (
                        ["ArrowDown", "ArrowUp", "Enter", "Escape"].includes(
                          e.key
                        )
                      ) {
                        e.preventDefault();
                        e.stopPropagation();
                      }
                    }}
                    className={cn(
                      "font-medium border border-transparent w-full text-left px-4 py-2.5 text-sm cursor-pointer hover:bg-foreground/10 hover:text-foreground focus:bg-foreground/10 focus:text-foreground outline-none",
                      index === selectedIndex && "bg-foreground/10 border-[red]"
                    )}
                  >
                    {translateGenre(genre)}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
);

GenreAutocomplete.displayName = "GenreAutocomplete";
