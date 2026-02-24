"use client";

import React, { useMemo } from "react";
import { BaseAutocomplete } from "@/components/shared/autocomplete/BaseAutocomplete";
import { BaseAutocompleteItem } from "@/components/shared/autocomplete/types/autocomplete";
import { translateRole } from "@/utils";

export interface Role {
  id: string;
  name: string;
}

interface RoleItem extends BaseAutocompleteItem {
  name: string;
  translatedName: string;
}

interface RoleAutocompleteProps {
  value?: string;
  onValueChange: (value: string) => void;
  roles: Role[];
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
  error?: boolean;
  onDropdownStateChange?: (isOpen: boolean) => void;
  excludedRoleIds?: string[];
}

export const RoleAutocomplete = React.forwardRef<
  HTMLInputElement,
  RoleAutocompleteProps
>(
  (
    {
      value = "",
      onValueChange,
      roles,
      isLoading = false,
      placeholder = "Tapez pour rechercher un rôle...",
      className,
      error = false,
      excludedRoleIds = [],
      onDropdownStateChange,
    },
    ref
  ) => {
    const roleItems: RoleItem[] = useMemo(
      () =>
        roles.map((role) => ({
          id: role.id,
          name: role.name,
          translatedName: translateRole(role.name),
        })),
      [roles]
    );

    const filterRoles = (items: RoleItem[], searchValue: string) => {
      if (!searchValue) {
        return items.filter((item) => !excludedRoleIds.includes(item.id));
      }
      const searchValueLower = searchValue.toLowerCase();
      return items.filter((item) => {
        if (excludedRoleIds.includes(item.id)) return false;
        return (
          item.name.toLowerCase().includes(searchValueLower) ||
          item.translatedName.toLowerCase().includes(searchValueLower)
        );
      });
    };

    const getRoleDisplayValue = (item: RoleItem) => item.translatedName;

    const renderRoleItem = (item: RoleItem) => item.translatedName;

    const handleRoleSelect = (item: RoleItem) => {
      onValueChange(item.id);
    };

    const getDisplayValue = () => {
      if (!value) return "";
      const role = roles.find((r) => r.id === value);
      return role ? translateRole(role.name) : "";
    };

    return (
      <BaseAutocomplete
        ref={ref}
        items={roleItems}
        value={getDisplayValue()}
        onValueChange={(displayValue) => {
          const exactMatch = roleItems.find(
            (item) => item.translatedName === displayValue
          );
          if (exactMatch) onValueChange(exactMatch.id);
        }}
        onItemSelect={handleRoleSelect}
        renderItem={renderRoleItem}
        filterItems={filterRoles}
        getItemDisplayValue={getRoleDisplayValue}
        placeholder={placeholder}
        isLoading={isLoading}
        error={error}
        className={className}
        minSearchLength={1}
        onDropdownStateChange={onDropdownStateChange}
      />
    );
  }
);

RoleAutocomplete.displayName = "RoleAutocomplete";
