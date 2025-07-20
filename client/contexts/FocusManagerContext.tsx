"use client";

import React, { createContext, useContext, useRef } from "react";

type FocusManagerContextType = {
	captureFocus: () => void;
	restoreFocus: () => void;
};

const FocusManagerContext = createContext<FocusManagerContextType | undefined>(
	undefined
);

export const FocusManagerProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const lastFocusedElement = useRef<HTMLElement | null>(null);

	const captureFocus = () => {
		if (typeof document !== "undefined") {
			lastFocusedElement.current = document.activeElement as HTMLElement;
		}
	};

	const restoreFocus = () => {
		if (
			lastFocusedElement.current &&
			typeof lastFocusedElement.current.focus === "function" &&
			document.contains(lastFocusedElement.current)
		) {
			lastFocusedElement.current?.focus();
		}
	};

	return (
		<FocusManagerContext.Provider value={{ captureFocus, restoreFocus }}>
			{children}
		</FocusManagerContext.Provider>
	);
};

export const useFocusManager = (): FocusManagerContextType => {
	const context = useContext(FocusManagerContext);
	if (!context) {
		throw new Error(
			"useFocusManager must be used within a FocusManagerProvider"
		);
	}
	return context;
};
