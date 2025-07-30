"use client";

import React, {
	useState,
	useRef,
	useImperativeHandle,
	useEffect,
	useMemo,
} from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
	Command,
	CommandEmpty,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { useAutocompleteState } from "@/contexts/AutocompleteContext";
import { translateInstrument } from "@/lib/instrumentTranslations";

interface InstrumentType {
	id: string;
	name: string;
	category: string;
}

interface GroupedInstruments {
	[key: string]: InstrumentType[];
}

interface InstrumentAutocompleteProps {
	value?: string;
	onValueChange: (value: string) => void;
	instrumentTypes: GroupedInstruments;
	isLoading?: boolean;
	placeholder?: string;
	className?: string;
	error?: boolean;
	onDropdownStateChange?: (isOpen: boolean) => void;
}

export const InstrumentAutocomplete = React.forwardRef<
	HTMLInputElement,
	InstrumentAutocompleteProps
>(
	(
		{
			value,
			onValueChange,
			instrumentTypes,
			isLoading = false,
			placeholder = "Tapez pour rechercher un instrument...",
			className,
			error = false,
		},
		ref
	) => {
		const [searchValue, setSearchValue] = useState("");
		const [isOpen, setIsOpen] = useState(false);
		const inputRef = useRef<HTMLInputElement>(null);
		const containerRef = useRef<HTMLDivElement>(null);
		const { setAutocompleteOpen } = useAutocompleteState();

		// Exposer la référence pour React Hook Form
		useImperativeHandle(ref, () => inputRef.current!, []);

		// Mettre à jour searchValue quand value change (pour l'affichage initial)
		useEffect(() => {
			if (value) {
				// Trouver l'instrument sélectionné pour afficher son nom traduit
				for (const category in instrumentTypes) {
					const instrument = instrumentTypes[category].find(
						(inst) => inst.id === value
					);
					if (instrument) {
						setSearchValue(translateInstrument(instrument.name));
						break;
					}
				}
			} else {
				setSearchValue("");
			}
		}, [value, instrumentTypes]);

		// Filtrer les instruments basé sur la recherche (en français et en anglais)
		const filteredInstruments = useMemo(() => {
			if (!searchValue) {
				// Si pas de recherche, retourner tous les instruments
				const allInstruments: InstrumentType[] = [];
				for (const category in instrumentTypes) {
					allInstruments.push(...instrumentTypes[category]);
				}
				return allInstruments;
			}

			const allInstruments: InstrumentType[] = [];
			for (const category in instrumentTypes) {
				const filteredInCategory = instrumentTypes[category].filter(
					(instrument) => {
						const translatedName = translateInstrument(instrument.name);
						return (
							instrument.name
								.toLowerCase()
								.includes(searchValue.toLowerCase()) ||
							translatedName.toLowerCase().includes(searchValue.toLowerCase())
						);
					}
				);
				allInstruments.push(...filteredInCategory);
			}

			return allInstruments;
		}, [instrumentTypes, searchValue]);

		// Gérer le focus et la fermeture
		useEffect(() => {
			const handleClickOutside = (event: MouseEvent) => {
				if (
					containerRef.current &&
					!containerRef.current.contains(event.target as Node)
				) {
					setIsOpen(false);
				}
			};

			document.addEventListener("mousedown", handleClickOutside);
			return () =>
				document.removeEventListener("mousedown", handleClickOutside);
		}, []);

		// Notifier le contexte du changement d'état
		useEffect(() => {
			setAutocompleteOpen(isOpen);
		}, [isOpen, setAutocompleteOpen]);

		// Gérer les touches clavier
		const handleKeyDown = (e: React.KeyboardEvent) => {
			if (e.key === "Escape") {
				setIsOpen(false);
			}
		};

		// Gérer la sélection d'un instrument
		const handleSelectInstrument = (
			instrumentId: string,
			instrumentName: string
		) => {
			onValueChange(instrumentId);
			setSearchValue(instrumentName);
			setIsOpen(false);
			inputRef.current?.blur();
		};

		// Gérer le changement de l'input
		const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			const newValue = e.target.value;
			setSearchValue(newValue);

			// Ouvrir la liste si on tape quelque chose
			if (newValue.length > 0) {
				setIsOpen(true);
			} else {
				setIsOpen(false);
			}
		};

		return (
			<div ref={containerRef} className="relative">
				<Input
					ref={inputRef}
					value={searchValue}
					onChange={handleInputChange}
					onKeyDown={handleKeyDown}
					placeholder={placeholder}
					className={cn("w-full", error && "border-red-500", className)}
					disabled={isLoading}
				/>

				{isOpen && (
					<div className="absolute top-full left-0 right-0 z-50 mt-1 border rounded-md bg-popover shadow-lg">
						<Command>
							<CommandList className="max-h-60">
								<CommandEmpty>Aucun instrument trouvé.</CommandEmpty>
								{filteredInstruments.map((instrument) => (
									<CommandItem
										key={instrument.id}
										value={instrument.name}
										onSelect={() =>
											handleSelectInstrument(
												instrument.id,
												translateInstrument(instrument.name)
											)
										}
										className="cursor-pointer text-sm"
									>
										{translateInstrument(instrument.name)}
									</CommandItem>
								))}
							</CommandList>
						</Command>
					</div>
				)}
			</div>
		);
	}
);

InstrumentAutocomplete.displayName = "InstrumentAutocomplete";
