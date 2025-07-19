"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface AutocompleteContextType {
	isAnyAutocompleteOpen: boolean;
	setAutocompleteOpen: (isOpen: boolean) => void;
}

const AutocompleteContext = createContext<AutocompleteContextType | undefined>(
	undefined
);

export function AutocompleteProvider({ children }: { children: ReactNode }) {
	const [isAnyAutocompleteOpen, setIsAnyAutocompleteOpen] = useState(false);

	return (
		<AutocompleteContext.Provider
			value={{
				isAnyAutocompleteOpen,
				setAutocompleteOpen: setIsAnyAutocompleteOpen,
			}}
		>
			{children}
		</AutocompleteContext.Provider>
	);
}

export function useAutocompleteState() {
	const context = useContext(AutocompleteContext);
	if (!context) {
		throw new Error(
			"useAutocompleteState must be used within AutocompleteProvider"
		);
	}
	return context;
}
