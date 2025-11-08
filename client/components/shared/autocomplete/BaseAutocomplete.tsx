"use client";

import React, {
  useImperativeHandle,
  useMemo,
  useState,
  useEffect,
} from "react";
import { cn } from "@/lib/utils";
import { FormInput } from "@/components/shared/forms/FormInput";
import {
  BaseAutocompleteProps,
  BaseAutocompleteItem,
} from "./types/autocomplete";
import { useAutocompleteFocus } from "./hooks/useAutocompleteFocus";
import { useAutocompleteKeyboard } from "./hooks/useAutocompleteKeyboard";
import { useAutocompleteScroll } from "./hooks/useAutocompleteScroll";

const BaseAutocompleteComponent = <T extends BaseAutocompleteItem>(
  props: BaseAutocompleteProps<T>,
  ref: React.Ref<HTMLInputElement>
) => {
  const {
    items,
    value,
    onValueChange,
    onItemSelect,
    renderItem,
    filterItems,
    getItemDisplayValue,
    placeholder = "Tapez pour rechercher...",
    isLoading = false,
    error = false,
    className,
    minSearchLength = 1,
    disabled = false,
    onDropdownStateChange,
  } = props;

  // État interne pour la valeur de recherche
  const [searchValue, setSearchValue] = useState(value);

  // Synchroniser avec la valeur externe
  useEffect(() => {
    setSearchValue(value);
  }, [value]);

  const {
    isOpen,
    selectedIndex,
    inputRef,
    containerRef,
    listRef,
    handleFocus,
    handleInputChange: handleFocusInputChange,
    navigateDown,
    navigateUp,
    selectItem,
    handleEscape,
    handleTab,
    forceOpen,
  } = useAutocompleteFocus({
    searchValue,
    minSearchLength,
    onDropdownStateChange,
  });

  // Exposer la référence pour React Hook Form
  useImperativeHandle(ref, () => inputRef.current!, [inputRef]);

  // Filtrer les éléments basé sur la recherche
  const filteredItems = useMemo(() => {
    return filterItems(items, searchValue);
  }, [items, searchValue, filterItems]);

  // Utiliser le hook de scroll
  useAutocompleteScroll({
    isOpen,
    selectedIndex,
    searchValue,
    containerRef,
    listRef,
    inputRef,
  });

  // Utiliser le hook de gestion des touches clavier
  const { handleKeyDown } = useAutocompleteKeyboard({
    isOpen,
    selectedIndex,
    filteredItems,
    searchValue,
    minSearchLength,
    onArrowDown: () => navigateDown(filteredItems.length),
    onArrowUp: () => navigateUp(filteredItems.length),
    onEnter: () => {
      if (selectedIndex >= 0 && selectedIndex < filteredItems.length) {
        const item = filteredItems[selectedIndex];
        onItemSelect(item);
        onValueChange(getItemDisplayValue(item));
        selectItem();
      }
    },
    onEscape: handleEscape,
    onTab: handleTab,
    onForceOpen: forceOpen,
  });

  // Gérer le changement de l'input
  const handleInputChangeEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchValue(newValue);
    onValueChange(newValue);
    handleFocusInputChange(newValue);
  };

  // Gérer la sélection d'un élément
  const handleItemClick = (item: T) => {
    onItemSelect(item);
    onValueChange(getItemDisplayValue(item));
    selectItem();
  };

  return (
    <div ref={containerRef} className="relative">
      <FormInput
        ref={inputRef}
        value={searchValue}
        onChange={handleInputChangeEvent}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        placeholder={placeholder}
        className={cn("w-full", error && "border-red-500", className)}
        disabled={isLoading || disabled}
      />

      {isOpen && (
        <div className="bg-popover absolute top-full left-0 right-0 z-50 border rounded-md shadow-lg">
          <div
            ref={listRef}
            className="max-h-72 overflow-y-auto"
            onKeyDown={handleKeyDown}
            tabIndex={-1}
          >
            {filteredItems.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                Aucun élément trouvé.
              </div>
            ) : (
              filteredItems.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  tabIndex={-1}
                  onClick={() => handleItemClick(item)}
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
                    "font-medium border border-transparent w-full text-left px-4 py-2.5 text-sm cursor-pointer hover:bg-foreground/10 hover:text-foreground focus:bg-foreground/10 focus:text-foreground outline-hidden",
                    index === selectedIndex && "bg-foreground/10 border-[red]"
                  )}
                >
                  {renderItem(item, index, index === selectedIndex)}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

BaseAutocompleteComponent.displayName = "BaseAutocompleteComponent";

export const BaseAutocomplete = React.forwardRef(BaseAutocompleteComponent) as <
  T extends BaseAutocompleteItem
>(
  props: BaseAutocompleteProps<T> & { ref?: React.Ref<HTMLInputElement> }
) => React.ReactElement;
