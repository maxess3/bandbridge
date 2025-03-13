"use client";

import React from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface AutocompleteProps {
  value: string;
  onValueChange: (value: string) => void;
  isLoading?: boolean;
  suggestions?: string[];
  placeholder?: string;
  emptyMessage?: string;
  loadingMessage?: string;
  className?: string;
}

export const Autocomplete = ({
  value,
  onValueChange,
  isLoading,
  suggestions = [],
  placeholder = "",
  emptyMessage = "Aucun résultat trouvé",
  loadingMessage = "Chargement...",
  className = "",
}: AutocompleteProps) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Command className={`relative rounded-lg border shadow-md ${className}`}>
      <CommandInput
        value={value}
        onValueChange={onValueChange}
        placeholder={placeholder}
        onFocus={() => setOpen(true)}
      />
      {open && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 rounded-lg border bg-white shadow-md">
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            {isLoading ? (
              <CommandGroup>
                <CommandItem disabled>{loadingMessage}</CommandItem>
              </CommandGroup>
            ) : (
              <CommandGroup>
                {suggestions.map((suggestion) => (
                  <CommandItem
                    key={`suggestion-${suggestion}`}
                    onSelect={() => {
                      onValueChange(suggestion);
                      setOpen(false);
                    }}
                  >
                    {suggestion}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </div>
      )}
    </Command>
  );
};
