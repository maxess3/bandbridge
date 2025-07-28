"use client";

import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/useDebounce";
import { useEffect, useCallback, useRef } from "react";
import { useFormContext, Controller, useFieldArray } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { RadioGroup } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Radio } from "@/components/shared/buttons/Radio";
import { formGeneralProfile } from "@/lib/schema";
import { z } from "zod";
import { NativeSelect } from "@/components/shared/forms/NativeSelect";
import { InstrumentAutocomplete } from "@/components/shared/forms/InstrumentAutocomplete";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { MdOutlineDragHandle } from "react-icons/md";
import { translateInstrument } from "@/lib/instrumentTranslations";

type FormValues = z.input<typeof formGeneralProfile>;

interface InstrumentType {
	id: string;
	name: string;
	category: string;
}

interface GroupedInstruments {
	[key: string]: InstrumentType[];
}

export const UpdateProfileGeneralForm = () => {
	const {
		control,
		register,
		setValue,
		watch,
		trigger, // Ajouter trigger pour déclencher la validation manuellement
		formState: { errors },
	} = useFormContext<FormValues>();

	// Debug temporaire pour voir la structure des erreurs
	console.log("Form errors:", errors);
	console.log("Instruments errors:", errors.instruments);

	const { fields, append, remove } = useFieldArray({
		control,
		name: "instruments",
	});

	const instrumentRefs = useRef<(HTMLInputElement | null)[]>([]);

	const day = watch("birthdate.day");
	const month = watch("birthdate.month");
	const year = watch("birthdate.year");
	const zipcode = watch("zipcode");

	const debouncedZipcode = useDebounce(zipcode || "", 500);

	const setFormattedBirthdate = useCallback(() => {
		if (day !== undefined && month !== undefined && year !== undefined) {
			const formattedDay = day.padStart(2, "0");
			setValue("formattedBirthdate", `${year}-${month}-${formattedDay}`, {
				shouldValidate: true,
			});
		}
	}, [day, month, year, setValue]);

	useEffect(() => {
		if (day && month && year) {
			setFormattedBirthdate();
		}
	}, [day, month, year, setFormattedBirthdate]);

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

	useEffect(() => {
		if (debouncedZipcode !== zipcode) {
			setValue("city", "");
		}
	}, [debouncedZipcode, zipcode, setValue]);

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

	const addInstrument = () => {
		if (fields.length < 10) {
			append({
				instrumentTypeId: "",
				level: "BEGINNER",
				order: fields.length,
			});

			// Focus immédiat sur l'input instrument du nouvel élément
			requestAnimationFrame(() => {
				const newIndex = fields.length;
				instrumentRefs.current[newIndex]?.focus();
			});
		}
	};

	const removeInstrument = (index: number) => {
		remove(index);

		// Logique d'accessibilité : focus le bouton de suppression précédent ou le bouton d'ajout
		requestAnimationFrame(() => {
			const remainingInstruments = fields.length - 1; // -1 car on vient de supprimer un élément

			if (remainingInstruments > 0) {
				// S'il reste des instruments, focus le bouton de suppression de l'instrument précédent
				const targetIndex = Math.min(index, remainingInstruments - 1);
				const removeButtons = document.querySelectorAll(
					'[data-testid="remove-instrument-button"]'
				);
				const targetButton = removeButtons[targetIndex] as HTMLButtonElement;
				if (targetButton) {
					targetButton.focus();
				}
			} else {
				// S'il n'y a plus d'instruments, focus le bouton "Ajouter un instrument"
				const addButton = document.querySelector(
					'[data-testid="add-instrument-button"]'
				) as HTMLButtonElement;
				if (addButton) {
					addButton.focus();
				}
			}
		});
	};

	// Fonction helper pour obtenir le message d'erreur des instruments
	const getInstrumentsErrorMessage = () => {
		if (errors.instruments?.root?.message) {
			return errors.instruments.root.message;
		}
		if (errors.instruments?.message) {
			return errors.instruments.message;
		}
		return null;
	};

	// Fonction pour gérer le changement d'instrument avec validation en temps réel
	const handleInstrumentChange = async (index: number, value: string) => {
		// Mettre à jour la valeur
		setValue(`instruments.${index}.instrumentTypeId`, value, {
			shouldValidate: true,
		});

		// Déclencher la validation du champ instruments complet
		await trigger("instruments");
	};

	// Fonction pour obtenir le nom d'un instrument par son ID (traduit en français)
	const getInstrumentName = (instrumentId: string) => {
		if (!instrumentTypes || !instrumentId) return "";

		for (const category in instrumentTypes) {
			const instrument = instrumentTypes[category].find(
				(inst) => inst.id === instrumentId
			);
			if (instrument) {
				return translateInstrument(instrument.name);
			}
		}
		return "";
	};

	return (
		<div className="space-y-6">
			<div className="space-y-1">
				<h4 className="font-semibold text-2xl mb-2">Informations de base</h4>
				<div className="space-y-6">
					<div className="space-y-1.5">
						<Label htmlFor="firstname" className="opacity-80 text-sm">
							Prénom*
						</Label>
						<Input
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
						<Input
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
						<Input
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
							<Input
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
									<NativeSelect
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
							<Input
								{...register("birthdate.year")}
								placeholder="Année"
								className={`w-20 ${errors.birthdate?.year && "border-red-500"}`}
								maxLength={4}
							/>
						</div>
						<Input type="hidden" readOnly {...register("formattedBirthdate")} />
						{errors.formattedBirthdate && (
							<p className="text-red-500 text-sm">
								{errors.formattedBirthdate?.message?.toString()}
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
						<Input
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
								<NativeSelect
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

			{/* Section Instruments */}
			<div className="space-y-1">
				<div className="mb-3">
					<h4 className="font-semibold text-xl mb-2">Instruments pratiqués</h4>
					<p className="text-sm text-muted-foreground">
						Ajoutez vos instruments de musique et votre niveau d'expérience
					</p>
				</div>
				<div className="space-y-3">
					{fields.map((field, index) => {
						const instrumentId = watch(`instruments.${index}.instrumentTypeId`);
						const instrumentName = getInstrumentName(instrumentId);
						const isInstrumentSelected = !!instrumentId;

						return (
							<div
								key={field.id}
								className="flex flex-col w-full items-start rounded-lg border pr-4 py-4"
							>
								<div className="flex w-full justify-between">
									<div className="flex items-center">
										<Button
											type="button"
											variant="ghost"
											size="sm"
											onClick={() => removeInstrument(index)}
											data-testid="remove-instrument-button"
										>
											<X style={{ width: "1.5em", height: "1.5em" }} />
										</Button>
										<span className="text-base font-medium text-muted-foreground opacity-80">
											{index === 0
												? "Principal"
												: index === 1
												? "Secondaire"
												: `${index + 1}e`}
										</span>
									</div>

									<div className="flex">
										<div className="flex items-center gap-2">
											<MdOutlineDragHandle
												style={{ width: "1.8em", height: "1.8em" }}
												className="cursor-move"
											/>
										</div>
									</div>
								</div>

								<div className="space-y-3 w-full pt-3 px-4">
									{!isInstrumentSelected ? (
										<div className="space-y-1">
											<Label className="opacity-80">Instrument*</Label>
											<Controller
												name={`instruments.${index}.instrumentTypeId`}
												control={control}
												render={({ field }) => (
													<InstrumentAutocomplete
														ref={(el) => {
															instrumentRefs.current[index] = el;
														}}
														value={field.value}
														onValueChange={(value) =>
															handleInstrumentChange(index, value)
														}
														instrumentTypes={instrumentTypes || {}}
														isLoading={isLoadingInstruments}
														placeholder="Rechercher un instrument..."
														error={
															!!errors.instruments?.[index]?.instrumentTypeId
														}
													/>
												)}
											/>
											{errors.instruments?.[index]?.instrumentTypeId && (
												<p className="text-red-500 text-sm">
													{errors.instruments[
														index
													]?.instrumentTypeId?.message?.toString()}
												</p>
											)}
										</div>
									) : (
										<div className="space-y-3">
											<div className="space-y-1">
												<Label className="opacity-80">
													Instrument sélectionné
												</Label>
												<div className="flex items-center justify-between p-3 bg-muted rounded-md">
													<span className="font-medium">{instrumentName}</span>
													<Button
														type="button"
														variant="ghost"
														size="sm"
														onClick={() => {
															setValue(
																`instruments.${index}.instrumentTypeId`,
																""
															);
															setValue(
																`instruments.${index}.level`,
																"BEGINNER"
															);
														}}
													>
														Modifier
													</Button>
												</div>
											</div>
											<div className="space-y-1">
												<Label className="opacity-80">Niveau*</Label>
												<Controller
													name={`instruments.${index}.level`}
													control={control}
													render={({ field }) => (
														<NativeSelect
															{...field}
															options={[
																{ value: "BEGINNER", label: "Débutant" },
																{
																	value: "INTERMEDIATE",
																	label: "Intermédiaire",
																},
																{ value: "ADVANCED", label: "Avancé" },
																{
																	value: "PROFESSIONAL",
																	label: "Professionnel",
																},
															]}
															placeholder="Sélectionner un niveau..."
															className={`w-full ${
																errors.instruments?.[index]?.level &&
																"border-red-500"
															}`}
														/>
													)}
												/>
												{errors.instruments?.[index]?.level && (
													<p className="text-red-500 text-sm">
														{errors.instruments[
															index
														]?.level?.message?.toString()}
													</p>
												)}
											</div>
										</div>
									)}
								</div>
							</div>
						);
					})}

					{fields.length < 10 && (
						<Button
							type="button"
							variant="secondary"
							onClick={addInstrument}
							disabled={isLoadingInstruments}
							data-testid="add-instrument-button"
						>
							<Plus className="h-4 w-4" />
							Ajouter un instrument
						</Button>
					)}

					{getInstrumentsErrorMessage() && (
						<p className="text-red-500 text-sm">
							{getInstrumentsErrorMessage()}
						</p>
					)}
				</div>
			</div>
		</div>
	);
};
