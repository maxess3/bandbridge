export interface BaseAutocompleteItem {
  id: string;
  [key: string]: unknown;
}

export interface BaseAutocompleteProps<T extends BaseAutocompleteItem> {
  items: T[];
  value: string;
  onValueChange: (value: string) => void;
  onItemSelect: (item: T) => void;
  renderItem: (item: T, index: number, isSelected: boolean) => React.ReactNode;
  filterItems: (items: T[], searchValue: string) => T[];
  getItemDisplayValue: (item: T) => string;
  placeholder?: string;
  isLoading?: boolean;
  error?: boolean;
  className?: string;
  minSearchLength?: number;
  disabled?: boolean;
  onDropdownStateChange?: (isOpen: boolean) => void;
}

export interface AutocompleteState {
  searchValue: string;
  isOpen: boolean;
  selectedIndex: number;
}

export interface AutocompleteRefs {
  inputRef: React.RefObject<HTMLInputElement>;
  containerRef: React.RefObject<HTMLDivElement>;
  listRef: React.RefObject<HTMLDivElement>;
}
