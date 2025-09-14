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
import { translateInstrument } from "@/utils/translations/instrumentTranslations";
import { useDebounce } from "@/hooks/useDebounce";
import { useClickOutside } from "@/hooks/useClickOutside";

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
	excludedInstruments?: string[]; // Nouvelle prop
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
			excludedInstruments = [], // Nouvelle prop avec valeur par défaut
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

		// Ajouter un debounce sur la valeur de recherche
		const debouncedSearchValue = useDebounce(searchValue, 300);

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

		// Filtrer les instruments basé sur la recherche debounced (en français et en anglais)
		const filteredInstruments = useMemo(() => {
			if (!debouncedSearchValue) {
				// Si pas de recherche, retourner tous les instruments sauf ceux exclus
				const allInstruments: InstrumentType[] = [];
				for (const category in instrumentTypes) {
					allInstruments.push(...instrumentTypes[category]);
				}
				return allInstruments.filter(
					(instrument) => !excludedInstruments.includes(instrument.id)
				);
			}

			const allInstruments: InstrumentType[] = [];
			for (const category in instrumentTypes) {
				const filteredInCategory = instrumentTypes[category].filter(
					(instrument) => {
						// Exclure les instruments déjà sélectionnés
						if (excludedInstruments.includes(instrument.id)) {
							return false;
						}

						const translatedName = translateInstrument(instrument.name);
						const searchValue = debouncedSearchValue.toLowerCase();

						// Recherche plus flexible : inclut, pas seulement startsWith
						return (
							instrument.name.toLowerCase().includes(searchValue) ||
							translatedName.toLowerCase().includes(searchValue)
						);
					}
				);
				allInstruments.push(...filteredInCategory);
			}

			return allInstruments;
		}, [instrumentTypes, debouncedSearchValue, excludedInstruments]);

		// Faire défiler la fenêtre dialog vers le bas quand la liste s'ouvre avec scroll smooth
		useEffect(() => {
			if (isOpen && debouncedSearchValue) {
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
						const spaceNeeded = dropdownRect.height + 20; // 20px de marge
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
		}, [isOpen, debouncedSearchValue]);

		// Faire défiler la liste d'autosuggestion pour garder l'élément sélectionné visible avec scroll smooth
		useEffect(() => {
			if (isOpen && selectedIndex >= 0 && listRef.current) {
				const listElement = listRef.current;
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
						});
					} else if (elementRect.top < listRect.top) {
						// L'élément est au-dessus de la zone visible, faire défiler vers le haut
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
						const elementRectInDialog = selectedElement.getBoundingClientRect();

						// Vérifier si l'élément sélectionné est visible dans la modale
						const isElementVisibleInModal =
							elementRectInDialog.top >= dialogRect.top &&
							elementRectInDialog.bottom <= dialogRect.bottom;

						if (!isElementVisibleInModal) {
							// Utiliser scrollIntoView pour centrer l'élément dans la modale
							selectedElement.scrollIntoView({
								block: "center",
								inline: "nearest",
								behavior: "smooth",
							});
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
					// Fermer la liste et laisser le focus passer au prochain élément
					setIsOpen(false);
					setSelectedIndex(-1);
					// Ne pas preventDefault pour permettre au focus de passer naturellement
					break;
				case "ArrowDown":
					e.preventDefault();
					e.stopPropagation();

					// Si le dropdown est fermé, l'ouvrir et sélectionner le premier élément
					// Seulement si on a au moins 1 caractère dans la recherche
					if (!isOpen) {
						if (filteredInstruments.length > 0 && searchValue.length >= 1) {
							setIsOpen(true);
							setSelectedIndex(0);
						}
						return;
					}

					// Si le dropdown est ouvert, naviguer dans la liste
					if (filteredInstruments.length === 0) return;
					setSelectedIndex((prev) => {
						// Si aucun élément n'est sélectionné, sélectionner le premier
						if (prev === -1) return 0;
						// Sinon, passer au suivant ou revenir au premier
						return prev < filteredInstruments.length - 1 ? prev + 1 : 0;
					});
					break;
				case "ArrowUp":
					e.preventDefault();
					e.stopPropagation();

					// Si le dropdown est fermé, l'ouvrir et sélectionner le dernier élément
					// Seulement si on a au moins 1 caractère dans la recherche
					if (!isOpen) {
						if (filteredInstruments.length > 0 && searchValue.length >= 1) {
							setIsOpen(true);
							setSelectedIndex(filteredInstruments.length - 1);
						}
						return;
					}

					// Si le dropdown est ouvert, naviguer dans la liste
					if (filteredInstruments.length === 0) return;
					setSelectedIndex((prev) => {
						// Si aucun élément n'est sélectionné, sélectionner le dernier
						if (prev === -1) return filteredInstruments.length - 1;
						// Sinon, passer au précédent ou aller au dernier
						return prev > 0 ? prev - 1 : filteredInstruments.length - 1;
					});
					break;
				case "Enter":
					e.preventDefault();
					e.stopPropagation();
					if (
						selectedIndex >= 0 &&
						selectedIndex < filteredInstruments.length
					) {
						const instrument = filteredInstruments[selectedIndex];
						handleSelectInstrument(
							instrument.id,
							translateInstrument(instrument.name)
						);
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

		// Gérer la sélection d'un instrument
		const handleSelectInstrument = (
			instrumentId: string,
			instrumentName: string
		) => {
			onValueChange(instrumentId);
			setSearchValue(instrumentName);
			setIsOpen(false);
			setSelectedIndex(-1);
			inputRef.current?.blur();
		};

		// Gérer le changement de l'input
		const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			const newValue = e.target.value;
			setSearchValue(newValue);

			// Ouvrir la liste si on tape au moins 1 caractère
			if (newValue.length >= 1) {
				setIsOpen(true);
				// Réinitialiser la sélection quand on tape
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
					className={cn("w-full", error && "border-red-500", className)}
					disabled={isLoading}
				/>

				{isOpen && (
					<div className="bg-popover absolute top-full left-0 right-0 z-50 mt-1 border rounded-md shadow-lg">
						<div
							ref={listRef}
							className="max-h-72 overflow-y-auto"
							onKeyDown={handleKeyDown}
							tabIndex={-1}
						>
							{filteredInstruments.length === 0 ? (
								<div className="py-6 text-center text-sm text-muted-foreground">
									Aucun instrument trouvé.
								</div>
							) : (
								filteredInstruments.map((instrument, index) => (
									<button
										key={instrument.id}
										type="button"
										tabIndex={-1}
										onClick={() =>
											handleSelectInstrument(
												instrument.id,
												translateInstrument(instrument.name)
											)
										}
										onKeyDown={(e) => {
											// Empêcher la propagation des événements clavier sur les boutons
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
											"font-medium w-full text-left px-4 py-2.5 text-sm cursor-pointer hover:bg-foreground/10 hover:text-foreground focus:bg-foreground/10 focus:text-foreground outline-none",
											index === selectedIndex &&
												"bg-foreground/10 border-[red] border-2"
										)}
									>
										{translateInstrument(instrument.name)}
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

InstrumentAutocomplete.displayName = "InstrumentAutocomplete";
