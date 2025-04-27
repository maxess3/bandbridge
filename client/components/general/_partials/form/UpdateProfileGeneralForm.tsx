"use client";

import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/useDebounce";
import { useEffect, useCallback } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { RadioGroup } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Radio } from "@/components/general/_partials/button/Radio";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { formGeneralProfile } from "@/lib/schema";
import { z } from "zod";

type FormValues = z.input<typeof formGeneralProfile>;

export const UpdateProfileGeneralForm = () => {
	const {
		control,
		register,
		setValue,
		watch,
		formState: { errors },
	} = useFormContext<FormValues>();

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

			console.log(data);

			return data.map((item: { nom: string }) => item.nom);
		},
		enabled: debouncedZipcode.length === 5,
	});

	useEffect(() => {
		if (debouncedZipcode !== zipcode) {
			setValue("city", "");
		}
	}, [debouncedZipcode, zipcode, setValue]);

	return (
		<div className="space-y-6">
			<div className="space-y-1">
				<h4 className="font-semibold text-2xl">Informations de base</h4>
				<div className="space-y-3">
					<div className="space-y-6">
						<div className="space-y-1">
							<Label htmlFor="firstname" className="opacity-80">
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
							<Label htmlFor="username" className="opacity-80">
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
							<Label className="opacity-80">Date de naissance*</Label>
							<div className="flex items-center gap-2">
								<Input
									{...register("birthdate.day")}
									placeholder="Jour"
									id="birthday"
									className={`w-14 ${
										errors.birthdate?.day && "border-red-500"
									}`}
									maxLength={2}
								/>
								<span className="w-1 flex justify-center">-</span>
								<Controller
									name="birthdate.month"
									control={control}
									render={({ field }) => (
										<Select onValueChange={field.onChange} value={field.value}>
											<SelectTrigger
												className={`w-32 h-9 ${
													errors.birthdate?.month && "border-red-500"
												}`}
											>
												<SelectValue placeholder="Mois" />
											</SelectTrigger>
											<SelectContent>
												<SelectGroup>
													{Array.from({ length: 12 }, (_, i) => (
														<SelectItem
															key={i + 1}
															value={String(i + 1).padStart(2, "0")}
														>
															{new Date(0, i).toLocaleString("fr-FR", {
																month: "long",
															})}
														</SelectItem>
													))}
												</SelectGroup>
											</SelectContent>
										</Select>
									)}
								/>
								<span className="w-1 flex justify-center">-</span>
								<Input
									{...register("birthdate.year")}
									placeholder="Année"
									className={`w-20 ${
										errors.birthdate?.year && "border-red-500"
									}`}
									id="year"
									maxLength={4}
								/>
							</div>
							<Input
								type="hidden"
								readOnly
								{...register("formattedBirthdate")}
							/>
							{errors.formattedBirthdate && (
								<p className="text-red-500 text-sm">
									{errors.formattedBirthdate?.message?.toString()}
								</p>
							)}
						</div>
						<div className="space-y-1.5">
							<Label htmlFor="gender" className="opacity-80">
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
							<Label htmlFor="country" className="opacity-80">
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
							<Label htmlFor="zipcode" className="opacity-80">
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
							<Label htmlFor="city" className="opacity-80">
								Ville*
							</Label>
							<Controller
								name="city"
								control={control}
								render={({ field }) => (
									<Select onValueChange={field.onChange} value={field.value}>
										<SelectTrigger
											className={`w-full h-9 ${
												errors.city && "border-red-500"
											}`}
										>
											<SelectValue
												placeholder={
													field.value
														? field.value
														: isLoading
														? "Chargement..."
														: isSuccess && cities?.length
														? "Sélectionner une ville"
														: "Aucune ville trouvée"
												}
											/>
										</SelectTrigger>
										<SelectContent>
											<SelectGroup>
												{cities?.map((city: string) => (
													<SelectItem key={city} value={city}>
														{city}
													</SelectItem>
												))}
											</SelectGroup>
										</SelectContent>
									</Select>
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
			</div>
		</div>
	);
};
