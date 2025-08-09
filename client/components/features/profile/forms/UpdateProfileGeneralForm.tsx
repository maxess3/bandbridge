"use client";

import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/useDebounce";
import { useEffect, useRef, useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { RadioGroup } from "@/components/ui/radio-group";
import { FormInput } from "@/components/shared/forms/FormInput";
import { Radio } from "@/components/shared/buttons/Radio";
import { formGeneralProfile } from "@/lib/schema";
import { z } from "zod";
import { InstrumentAutocomplete } from "@/components/shared/forms/InstrumentAutocomplete";
import { GenreAutocomplete } from "@/components/shared/forms/GenreAutocomplete";
import { Button } from "@/components/ui/button";
import { Plus, X, Info } from "lucide-react";
import { translateInstrument } from "@/utils/translations/instrumentTranslations";
import { translateGenre } from "@/utils/translations/genreTranslations";
import { FormSelect } from "@/components/shared/forms/FormSelect";

type FormValues = z.input<typeof formGeneralProfile>;

interface InstrumentType {
	id: string;
	name: string;
	category: string;
}

interface GroupedInstruments {
	[key: string]: InstrumentType[];
}

interface SelectedInstrument {
	id: string;
	name: string;
	level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT" | null;
}

export const UpdateProfileGeneralForm = () => {
	const {
		control,
		register,
		setValue,
		watch,
		formState: { errors },
	} = useFormContext<FormValues>();

	const zipcode = watch("zipcode");
	const debouncedZipcode = useDebounce(zipcode || "", 500);

	// Récupérer les instruments et genres depuis le formulaire
	const formInstruments = watch("instruments");
	const formGenres = watch("genres");

	// État local pour gérer les instruments sélectionnés
	const [selectedInstruments, setSelectedInstruments] = useState<
		SelectedInstrument[]
	>([]);
	const [isAddingInstrument, setIsAddingInstrument] = useState(false);
	const [tempInstrumentId, setTempInstrumentId] = useState("");
	const [isInitialized, setIsInitialized] = useState(false); // Nouvel état

	// État local pour gérer les genres sélectionnés
	const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
	const [isAddingGenre, setIsAddingGenre] = useState(false);
	const [tempGenreId, setTempGenreId] = useState("");

	// Ref pour l'input d'autocomplétion
	const instrumentInputRef = useRef<HTMLInputElement>(null);
	const addInstrumentButtonRef = useRef<HTMLButtonElement>(null);
	// Ref pour la div invisible d'accessibilité
	const accessibilityFocusRef = useRef<HTMLDivElement>(null);

	// Ref pour l'input d'autocomplétion des genres
	const genreInputRef = useRef<HTMLInputElement>(null);
	const addGenreButtonRef = useRef<HTMLButtonElement>(null);
	// Ref pour la div invisible d'accessibilité des genres
	const accessibilityGenreFocusRef = useRef<HTMLDivElement>(null);

	const {
		data: cities,
		isLoading,
		isSuccess,
	} = useQuery({
		queryKey: ["cities", debouncedZipcode],
		queryFn: async () => {
			if (!debouncedZipcode || debouncedZipcode.length !== 5) return [];

			const response = await fetch(
				`https://geo.api.gouv.fr/communes?codePostal=${debouncedZipcode}&fields=nom`
			);
			const data = await response.json();

			return data.map((item: { nom: string }) => item.nom);
		},
		enabled: debouncedZipcode.length === 5,
	});

	const { data: instrumentTypes, isLoading: isLoadingInstruments } =
		useQuery<GroupedInstruments>({
			queryKey: ["instrumentTypes"],
			queryFn: async () => {
				const response = await fetch(
					`${process.env.NEXT_PUBLIC_API_URL}/profile/instruments`
				);
				if (!response.ok) {
					throw new Error("Impossible de récupérer les instruments");
				}
				return response.json();
			},
		});

	const { data: musicGenres, isLoading: isLoadingGenres } = useQuery<string[]>({
		queryKey: ["musicGenres"],
		queryFn: async () => {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/profile/genres`
			);
			if (!response.ok) {
				throw new Error("Impossible de récupérer les genres musicaux");
			}
			return response.json();
		},
	});

	useEffect(() => {
		if (debouncedZipcode !== zipcode) {
			setValue("city", "");
		}
	}, [debouncedZipcode, zipcode, setValue]);

	// Synchroniser les instruments sélectionnés avec le formulaire
	useEffect(() => {
		// Ne synchroniser que si l'initialisation est terminée
		if (!isInitialized) {
			return;
		}

		const instruments = selectedInstruments.map((inst, index) => ({
			instrumentTypeId: inst.id,
			level: inst.level,
			order: index,
		}));

		// Comparer avec les valeurs actuelles avant de setValue
		const currentInstruments = watch("instruments");
		if (JSON.stringify(instruments) !== JSON.stringify(currentInstruments)) {
			setValue("instruments", instruments, {
				shouldDirty: true,
			});
		}
	}, [selectedInstruments, setValue, watch, isInitialized]);

	// Synchroniser les genres sélectionnés avec le formulaire
	useEffect(() => {
		// Ne synchroniser que si l'initialisation est terminée
		if (!isInitialized) {
			return;
		}

		// Comparer avec les valeurs actuelles avant de setValue
		const currentGenres = watch("genres");
		if (JSON.stringify(selectedGenres) !== JSON.stringify(currentGenres)) {
			setValue("genres", selectedGenres, {
				shouldDirty: true,
			});
		}
	}, [selectedGenres, setValue, watch, isInitialized]);

	// Initialiser les instruments et genres avec les valeurs par défaut du formulaire
	useEffect(() => {
		// Si instrumentTypes ou musicGenres ne sont pas encore chargés, on attend
		if (!instrumentTypes || !musicGenres) {
			return;
		}

		// Si on n'est pas encore initialisé
		if (!isInitialized) {
			// Si on a des instruments existants, les initialiser
			if (formInstruments && formInstruments.length > 0) {
				const initializedInstruments: SelectedInstrument[] =
					formInstruments.map(
						(formInst: {
							instrumentTypeId: string;
							level: string | null;
							order?: number;
						}) => {
							// Trouver le nom de l'instrument
							let instrumentName = "";
							for (const category in instrumentTypes) {
								const instrument = instrumentTypes[category].find(
									(inst) => inst.id === formInst.instrumentTypeId
								);
								if (instrument) {
									instrumentName = translateInstrument(instrument.name);
									break;
								}
							}

							// Valider et typer le niveau
							const validLevels = [
								"BEGINNER",
								"INTERMEDIATE",
								"ADVANCED",
								"EXPERT",
							] as const;
							const level =
								formInst.level &&
								validLevels.includes(
									formInst.level as (typeof validLevels)[number]
								)
									? (formInst.level as (typeof validLevels)[number])
									: null;

							return {
								id: formInst.instrumentTypeId,
								name: instrumentName,
								level,
							};
						}
					);

				setSelectedInstruments(initializedInstruments);
			}

			// Si on a des genres existants, les initialiser
			if (formGenres && formGenres.length > 0) {
				setSelectedGenres(formGenres);
			}

			// Dans tous les cas, marquer comme initialisé
			setIsInitialized(true);
		}
	}, [
		formInstruments,
		formGenres,
		instrumentTypes,
		musicGenres,
		isInitialized,
	]);

	// Options pour les mois
	const monthOptions = Array.from({ length: 12 }, (_, i) => ({
		value: String(i + 1).padStart(2, "0"),
		label: new Date(0, i).toLocaleString("fr-FR", { month: "long" }),
	}));

	// Options pour les villes
	const cityOptions =
		cities?.map((city: string) => ({
			value: city,
			label: city,
		})) || [];

	const handleAddInstrument = () => {
		setIsAddingInstrument(true);
		setTempInstrumentId("");

		// Focus sur l'input après le rendu
		requestAnimationFrame(() => {
			instrumentInputRef.current?.focus();
		});
	};

	const handleInstrumentSelect = (instrumentId: string) => {
		if (!instrumentTypes) return;

		// Trouver le nom de l'instrument
		let instrumentName = "";
		for (const category in instrumentTypes) {
			const instrument = instrumentTypes[category].find(
				(inst) => inst.id === instrumentId
			);
			if (instrument) {
				instrumentName = translateInstrument(instrument.name);
				break;
			}
		}

		// Ajouter directement l'instrument avec le niveau par défaut
		const newInstrument: SelectedInstrument = {
			id: instrumentId,
			name: instrumentName,
			level: null,
		};

		setSelectedInstruments([...selectedInstruments, newInstrument]);
		setIsAddingInstrument(false);
		setTempInstrumentId("");

		// Focus sur le bouton "Ajouter un instrument" après le rendu
		requestAnimationFrame(() => {
			addInstrumentButtonRef.current?.focus();
		});
	};

	const handleRemoveInstrument = (index: number) => {
		const updatedInstruments = selectedInstruments.filter(
			(_, i) => i !== index
		);
		setSelectedInstruments(updatedInstruments);

		// Rediriger le focus vers la div invisible après la suppression
		requestAnimationFrame(() => {
			accessibilityFocusRef.current?.focus();
		});
	};

	const handleLevelChange = (
		index: number,
		level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT" | null
	) => {
		const updatedInstruments = selectedInstruments.map((inst, i) =>
			i === index ? { ...inst, level } : inst
		);
		setSelectedInstruments(updatedInstruments);
	};

	// Gestionnaires pour les genres musicaux
	const handleAddGenre = () => {
		setIsAddingGenre(true);
		setTempGenreId("");

		// Focus sur l'input après le rendu
		requestAnimationFrame(() => {
			genreInputRef.current?.focus();
		});
	};

	const handleGenreSelect = (genreId: string) => {
		// Ajouter directement le genre
		setSelectedGenres([...selectedGenres, genreId]);
		setIsAddingGenre(false);
		setTempGenreId("");

		// Focus sur le bouton "Ajouter un genre" après le rendu
		requestAnimationFrame(() => {
			addGenreButtonRef.current?.focus();
		});
	};

	const handleRemoveGenre = (index: number) => {
		const updatedGenres = selectedGenres.filter((_, i) => i !== index);
		setSelectedGenres(updatedGenres);

		// Rediriger le focus vers la div invisible après la suppression
		requestAnimationFrame(() => {
			accessibilityGenreFocusRef.current?.focus();
		});
	};

	return (
		<div className="space-y-6 pb-16">
			<div className="space-y-1">
				<h4 className="font-semibold text-2xl mb-2">Informations de base</h4>
				<div className="space-y-6">
					<div className="space-y-1.5">
						<Label htmlFor="firstname" className="opacity-80 text-sm">
							Prénom*
						</Label>
						<FormInput
							id="firstname"
							{...register("firstname")}
							className={`${errors.firstname && "border-red-500"}`}
						/>
						{errors.firstname && (
							<p className="text-red-500 text-sm">
								{errors.firstname?.message?.toString()}
							</p>
						)}
					</div>
					<div className="space-y-1">
						<Label htmlFor="lastname" className="opacity-80 text-sm">
							Nom*
						</Label>
						<FormInput
							id="lastname"
							{...register("lastname")}
							className={`${errors.lastname && "border-red-500"}`}
						/>
						{errors.lastname && (
							<p className="text-red-500 text-sm">
								{errors.lastname?.message?.toString()}
							</p>
						)}
					</div>
					<div className="space-y-1">
						<Label htmlFor="username" className="opacity-80 text-sm">
							Nom d'utilisateur*
						</Label>
						<FormInput
							id="username"
							{...register("username")}
							className={`${errors.username && "border-red-500"}`}
						/>
						{errors.username && (
							<p className="text-red-500 text-sm">
								{errors.username?.message?.toString()}
							</p>
						)}
					</div>
					<div className="space-y-1">
						<Label className="opacity-80 text-sm">Date de naissance*</Label>
						<div className="flex items-center gap-2">
							<FormInput
								{...register("birthdate.day")}
								placeholder="Jour"
								className={`w-14 ${errors.birthdate?.day && "border-red-500"}`}
								maxLength={2}
							/>
							<span className="w-1 flex justify-center">-</span>
							<Controller
								name="birthdate.month"
								control={control}
								render={({ field }) => (
									<FormSelect
										{...field}
										options={monthOptions}
										placeholder="Mois"
										className={`w-32 ${
											errors.birthdate?.month && "border-red-500"
										}`}
									/>
								)}
							/>
							<span className="w-1 flex justify-center">-</span>
							<FormInput
								{...register("birthdate.year")}
								placeholder="Année"
								className={`w-20 ${errors.birthdate?.year && "border-red-500"}`}
								maxLength={4}
							/>
						</div>
						{errors.birthdate?.day && (
							<p className="text-red-500 text-sm mt-1">
								{errors.birthdate.day.message?.toString()}
							</p>
						)}
						{errors.birthdate?.month && (
							<p className="text-red-500 text-sm mt-1">
								{errors.birthdate.month.message?.toString()}
							</p>
						)}
						{errors.birthdate?.year && (
							<p className="text-red-500 text-sm mt-1">
								{errors.birthdate.year.message?.toString()}
							</p>
						)}
						{errors.birthdate?.root?.message && (
							<p className="text-red-500 text-sm mt-1">
								{errors.birthdate.root.message?.toString()}
							</p>
						)}
					</div>
					<div className="space-y-1">
						<Label htmlFor="gender" className="opacity-80 text-sm">
							Genre
						</Label>
						<Controller
							name="gender"
							control={control}
							render={({ field }) => (
								<RadioGroup
									{...field}
									onValueChange={field.onChange}
									value={field.value}
									className="flex space-x-0.5"
								>
									<Radio title="Non défini" id="other" value="OTHER" />
									<Radio title="Homme" id="male" value="MALE" />
									<Radio title="Femme" id="female" value="FEMALE" />
								</RadioGroup>
							)}
						/>
						{errors.gender && (
							<p className="text-red-500 text-sm">
								{errors.gender?.message?.toString()}
							</p>
						)}
					</div>
					<div className="space-y-3">
						<div>
							<h4 className="font-semibold text-xl mb-1.5">
								Instruments pratiqués
							</h4>
							<p className="text-sm text-muted-foreground">
								Ajoutez vos instruments de musique et votre niveau d'expérience
							</p>
						</div>
						<div>
							{/* Instruments sélectionnés */}
							{selectedInstruments.map((instrument, index) => (
								<div
									key={`${instrument.id}-${index}`}
									className="flex items-center justify-between gap-3"
								>
									<Button
										type="button"
										variant="ghost"
										size="sm"
										onClick={() => handleRemoveInstrument(index)}
										className="text-muted-foreground hover:text-destructive rounded-full w-8 h-8"
										aria-label={`Supprimer ${instrument.name}`}
									>
										<X className="!size-5" />
									</Button>
									<div
										className={`flex justify-between items-center w-full ${
											index < selectedInstruments.length - 1 ? "border-b" : ""
										}`}
									>
										<div className="font-semibold h-full py-6">
											{instrument.name}
										</div>
										<div className="flex items-center gap-2">
											<FormSelect
												value={instrument.level || ""}
												onChange={(e) =>
													handleLevelChange(
														index,
														e.target.value === ""
															? null
															: (e.target.value as
																	| "BEGINNER"
																	| "INTERMEDIATE"
																	| "ADVANCED"
																	| "EXPERT")
													)
												}
												options={[
													{ value: "BEGINNER", label: "Débutant" },
													{ value: "INTERMEDIATE", label: "Intermédiaire" },
													{ value: "ADVANCED", label: "Avancé" },
													{ value: "EXPERT", label: "Expert" },
												]}
												placeholder="Niveau"
												className="w-40"
											/>
										</div>
									</div>
								</div>
							))}

							{/* Interface d'ajout d'instrument */}
							{isAddingInstrument ? (
								<div>
									<InstrumentAutocomplete
										ref={instrumentInputRef}
										value={tempInstrumentId}
										onValueChange={handleInstrumentSelect}
										instrumentTypes={instrumentTypes || {}}
										isLoading={isLoadingInstruments}
										placeholder="Rechercher un instrument..."
										excludedInstruments={selectedInstruments.map(
											(inst) => inst.id
										)}
									/>
								</div>
							) : (
								<div className="space-y-2">
									{/* Div invisible pour l'accessibilité - focus après suppression d'instrument */}
									<div
										ref={accessibilityFocusRef}
										tabIndex={-1}
										aria-hidden="true"
										className="sr-only"
									/>

									{selectedInstruments.length >= 10 && (
										<p className="text-sm text-amber-600 rounded-md flex items-center gap-1.5">
											<Info className="!size-4" />
											Vous avez atteint le maximum de 10 instruments.
										</p>
									)}
									<Button
										ref={addInstrumentButtonRef}
										type="button"
										variant="outline"
										onClick={handleAddInstrument}
										onKeyDown={(e) => {
											// Empêcher le scroll avec les touches fléchées
											if (
												[
													"ArrowUp",
													"ArrowDown",
													"ArrowLeft",
													"ArrowRight",
												].includes(e.key)
											) {
												e.preventDefault();
											}
										}}
										disabled={
											isLoadingInstruments || selectedInstruments.length >= 10
										}
										className="rounded-md"
									>
										<Plus className="!size-5" />
										Ajouter un instrument
									</Button>
								</div>
							)}

							{/* Affichage des erreurs */}
							{(errors.instruments?.root?.message ||
								errors.instruments?.message) && (
								<p className="text-red-500 text-sm mt-1">
									{errors.instruments?.root?.message ||
										errors.instruments?.message}
								</p>
							)}
						</div>
					</div>

					{/* Section Genres Musicaux */}
					<div className="space-y-3">
						<div>
							<h4 className="font-semibold text-xl mb-1.5">Genres musicaux</h4>
							<p className="text-sm text-muted-foreground">
								Ajoutez vos genres musicaux préférés
							</p>
						</div>
						<div>
							{/* Genres sélectionnés */}
							{selectedGenres.map((genre, index) => (
								<div
									key={`${genre}-${index}`}
									className="flex items-center justify-between gap-3"
								>
									<Button
										type="button"
										variant="ghost"
										size="sm"
										onClick={() => handleRemoveGenre(index)}
										className="text-muted-foreground hover:text-destructive rounded-full w-8 h-8"
										aria-label={`Supprimer ${translateGenre(genre)}`}
									>
										<X className="!size-5" />
									</Button>
									<div
										className={`flex justify-between items-center w-full ${
											index < selectedGenres.length - 1 ? "border-b" : ""
										}`}
									>
										<div className="font-semibold h-full py-6">
											{translateGenre(genre)}
										</div>
									</div>
								</div>
							))}

							{/* Interface d'ajout de genre */}
							{isAddingGenre ? (
								<div>
									<GenreAutocomplete
										ref={genreInputRef}
										value={tempGenreId}
										onValueChange={handleGenreSelect}
										genres={musicGenres || []}
										isLoading={isLoadingGenres}
										placeholder="Rechercher un genre..."
										excludedGenres={selectedGenres}
									/>
								</div>
							) : (
								<div className="space-y-2">
									{/* Div invisible pour l'accessibilité - focus après suppression de genre */}
									<div
										ref={accessibilityGenreFocusRef}
										tabIndex={-1}
										aria-hidden="true"
										className="sr-only"
									/>

									{selectedGenres.length >= 10 && (
										<p className="text-sm text-amber-600 rounded-md flex items-center gap-1.5">
											<Info className="!size-4" />
											Vous avez atteint le maximum de 10 genres.
										</p>
									)}
									<Button
										ref={addGenreButtonRef}
										type="button"
										variant="outline"
										onClick={handleAddGenre}
										onKeyDown={(e) => {
											// Empêcher le scroll avec les touches fléchées
											if (
												[
													"ArrowUp",
													"ArrowDown",
													"ArrowLeft",
													"ArrowRight",
												].includes(e.key)
											) {
												e.preventDefault();
											}
										}}
										disabled={isLoadingGenres || selectedGenres.length >= 10}
										className="rounded-md"
									>
										<Plus className="!size-5" />
										Ajouter un genre
									</Button>
								</div>
							)}

							{/* Affichage des erreurs */}
							{(errors.genres?.root?.message || errors.genres?.message) && (
								<p className="text-red-500 text-sm mt-1">
									{errors.genres?.root?.message || errors.genres?.message}
								</p>
							)}
						</div>
					</div>
					<div className="space-y-1">
						<h4 className="font-semibold text-xl mb-2">Localisation</h4>
						<Label htmlFor="country" className="opacity-80 text-sm">
							Pays
						</Label>
						<Controller
							name="country"
							control={control}
							render={({ field }) => (
								<RadioGroup
									{...field}
									onValueChange={field.onChange}
									value={field.value}
									className="flex space-x-0.5"
								>
									<Radio title="France" id="france" value="France" />
								</RadioGroup>
							)}
						/>
						{errors.country && (
							<p className="text-red-500 text-sm">
								{errors.country?.message?.toString()}
							</p>
						)}
					</div>
					<div className="space-y-1">
						<Label htmlFor="zipcode" className="opacity-80 text-sm">
							Code Postal*
						</Label>
						<FormInput
							id="zipcode"
							{...register("zipcode")}
							className={`${errors.zipcode && "border-red-500"}`}
						/>
						{errors.zipcode && (
							<p className="text-red-500 text-sm">
								{errors.zipcode?.message?.toString()}
							</p>
						)}
					</div>
					<div className="space-y-1">
						<Label htmlFor="city" className="opacity-80 text-sm">
							Ville*
						</Label>
						<Controller
							name="city"
							control={control}
							render={({ field }) => (
								<FormSelect
									{...field}
									options={cityOptions}
									placeholder={
										isLoading
											? "Chargement..."
											: isSuccess && cities?.length
											? "Sélectionner une ville"
											: "Aucune ville trouvée"
									}
									className={`w-full ${errors.city && "border-red-500"}`}
									disabled={isLoading || !cities?.length}
								/>
							)}
						/>
						{errors.city && (
							<p className="text-red-500 text-sm">
								{errors.city?.message?.toString()}
							</p>
						)}
					</div>
				</div>
			</div>

			{/* Section Instruments Simplifiée */}
		</div>
	);
};
