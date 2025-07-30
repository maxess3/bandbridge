"use client";

import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/useDebounce";
import { useEffect, useRef, useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
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

interface SelectedInstrument {
	id: string;
	name: string;
	level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "PROFESSIONAL";
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

	// État local pour gérer les instruments sélectionnés
	const [selectedInstruments, setSelectedInstruments] = useState<
		SelectedInstrument[]
	>([]);
	const [isAddingInstrument, setIsAddingInstrument] = useState(false);
	const [tempInstrumentId, setTempInstrumentId] = useState("");

	// Ref pour l'input d'autocomplétion
	const instrumentInputRef = useRef<HTMLInputElement>(null);

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

	// Synchroniser les instruments sélectionnés avec le formulaire
	useEffect(() => {
		const instruments = selectedInstruments.map((inst, index) => ({
			instrumentTypeId: inst.id,
			level: inst.level,
			order: index,
		}));
		setValue("instruments", instruments);
	}, [selectedInstruments, setValue]);

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
			level: "BEGINNER",
		};

		setSelectedInstruments([...selectedInstruments, newInstrument]);
		setIsAddingInstrument(false);
		setTempInstrumentId("");
	};

	const handleRemoveInstrument = (index: number) => {
		const updatedInstruments = selectedInstruments.filter(
			(_, i) => i !== index
		);
		setSelectedInstruments(updatedInstruments);
	};

	const handleLevelChange = (
		index: number,
		level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "PROFESSIONAL"
	) => {
		const updatedInstruments = selectedInstruments.map((inst, i) =>
			i === index ? { ...inst, level } : inst
		);
		setSelectedInstruments(updatedInstruments);
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

			{/* Section Instruments Simplifiée */}
			<div className="space-y-1">
				<div className="mb-3">
					<h4 className="font-semibold text-xl mb-2">Instruments pratiqués</h4>
					<p className="text-sm text-muted-foreground">
						Ajoutez vos instruments de musique et votre niveau d'expérience
					</p>
				</div>

				<div className="space-y-3">
					{/* Instruments sélectionnés */}
					{selectedInstruments.map((instrument, index) => (
						<div
							key={`${instrument.id}-${index}`}
							className="flex items-center justify-between p-4 border rounded-lg bg-muted/30"
						>
							<div className="flex-1">
								<div className="font-medium mb-2">{instrument.name}</div>
								<div className="flex items-center gap-2">
									<Label className="text-sm opacity-80">Niveau:</Label>
									<NativeSelect
										value={instrument.level}
										onChange={(e) =>
											handleLevelChange(
												index,
												e.target.value as
													| "BEGINNER"
													| "INTERMEDIATE"
													| "ADVANCED"
													| "PROFESSIONAL"
											)
										}
										options={[
											{ value: "BEGINNER", label: "Débutant" },
											{ value: "INTERMEDIATE", label: "Intermédiaire" },
											{ value: "ADVANCED", label: "Avancé" },
											{ value: "PROFESSIONAL", label: "Professionnel" },
										]}
										className="w-40"
									/>
								</div>
							</div>
							<Button
								type="button"
								variant="ghost"
								size="sm"
								onClick={() => handleRemoveInstrument(index)}
								className="text-muted-foreground hover:text-destructive"
							>
								<X className="h-4 w-4" />
							</Button>
						</div>
					))}

					{/* Interface d'ajout d'instrument */}
					{isAddingInstrument ? (
						<div className="space-y-2">
							<Label className="opacity-80">Sélectionner un instrument</Label>
							<InstrumentAutocomplete
								ref={instrumentInputRef}
								value={tempInstrumentId}
								onValueChange={handleInstrumentSelect}
								instrumentTypes={instrumentTypes || {}}
								isLoading={isLoadingInstruments}
								placeholder="Rechercher un instrument..."
							/>
						</div>
					) : (
						<Button
							type="button"
							variant="secondary"
							onClick={handleAddInstrument}
							disabled={isLoadingInstruments}
							className="w-full"
						>
							<Plus className="h-4 w-4 mr-2" />
							Ajouter un instrument
						</Button>
					)}

					{/* Affichage des erreurs */}
					{errors.instruments?.root?.message && (
						<p className="text-red-500 text-sm">
							{errors.instruments.root.message}
						</p>
					)}
				</div>
			</div>
		</div>
	);
};
