"use client";

import { z } from "zod";
import {
	useForm,
	FormProvider,
	SubmitHandler,
	FieldValues,
	DefaultValues,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "../ui/dialog";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { useState, useCallback, useEffect, useMemo } from "react";

interface BaseModalProps<T extends FieldValues> {
	children: React.ReactNode;
	title: string;
	onSubmit: (data: T) => Promise<void>;
	formSchema: z.ZodType<T>;
	defaultValues?: DefaultValues<T>;
	isSubmitting?: boolean;
	open?: boolean;
	onOpenChange: () => void;
	footer?: React.ReactNode;
	showOverlay?: boolean;
}

// Fonction utilitaire pour normaliser les valeurs (convertir les chaînes vides en undefined)
function normalizeValue(value: unknown): unknown {
	if (value === "") return undefined;
	if (value === null) return undefined;
	if (typeof value === "object" && value !== null) {
		if (Array.isArray(value)) {
			return value.map(normalizeValue);
		}
		const normalized: Record<string, unknown> = {};
		for (const key in value) {
			const normalizedValue = normalizeValue(
				(value as Record<string, unknown>)[key]
			);
			if (normalizedValue !== undefined) {
				normalized[key] = normalizedValue;
			}
		}
		return Object.keys(normalized).length > 0 ? normalized : undefined;
	}
	return value;
}

// Fonction utilitaire pour comparer deux objets de manière profonde
function deepEqual(obj1: unknown, obj2: unknown): boolean {
	// Normaliser les deux objets
	const normalized1 = normalizeValue(obj1);
	const normalized2 = normalizeValue(obj2);

	// Si les deux sont undefined après normalisation, ils sont égaux
	if (normalized1 === undefined && normalized2 === undefined) return true;

	// Si un seul est undefined, ils sont différents
	if (normalized1 === undefined || normalized2 === undefined) return false;

	if (normalized1 === normalized2) return true;

	if (typeof normalized1 !== typeof normalized2) return false;

	if (typeof normalized1 !== "object") return normalized1 === normalized2;

	if (Array.isArray(normalized1) !== Array.isArray(normalized2)) return false;

	if (Array.isArray(normalized1)) {
		if (normalized1.length !== (normalized2 as unknown[]).length) return false;
		for (let i = 0; i < normalized1.length; i++) {
			if (!deepEqual(normalized1[i], (normalized2 as unknown[])[i]))
				return false;
		}
		return true;
	}

	const keys1 = Object.keys(normalized1 as Record<string, unknown>);
	const keys2 = Object.keys(normalized2 as Record<string, unknown>);

	if (keys1.length !== keys2.length) return false;

	for (const key of keys1) {
		if (!keys2.includes(key)) return false;
		if (
			!deepEqual(
				(normalized1 as Record<string, unknown>)[key],
				(normalized2 as Record<string, unknown>)[key]
			)
		)
			return false;
	}

	return true;
}

// Fonction utilitaire pour exclure les champs calculés de la comparaison
function excludeComputedFields<T extends Record<string, unknown>>(
	obj: T,
	excludedFields: string[]
): T {
	const result = { ...obj };
	excludedFields.forEach((field) => {
		delete result[field];
	});
	return result;
}

export function BaseEditModal<T extends FieldValues>({
	children,
	title,
	onSubmit,
	formSchema,
	defaultValues,
	isSubmitting = false,
	open = true,
	onOpenChange,
	footer,
	showOverlay = true,
}: BaseModalProps<T>) {
	const [showExitConfirmation, setShowExitConfirmation] = useState(false);

	const methods = useForm<T>({
		mode: "onChange",
		resolver: zodResolver(formSchema),
		defaultValues,
	});

	// Obtenir les valeurs actuelles du formulaire
	const currentValues = methods.watch();

	// Comparer les valeurs actuelles avec les valeurs initiales
	const hasRealChanges = useMemo(() => {
		if (!defaultValues) return false;

		// Créer un objet avec les valeurs actuelles, en incluant les valeurs par défaut pour les champs non définis
		const normalizedCurrentValues = { ...defaultValues, ...currentValues };

		// Exclure les champs calculés de la comparaison (comme formattedBirthdate)
		const fieldsToExclude = ["formattedBirthdate"];
		const currentValuesWithoutComputed = excludeComputedFields(
			normalizedCurrentValues,
			fieldsToExclude
		);
		const defaultValuesWithoutComputed = excludeComputedFields(
			defaultValues,
			fieldsToExclude
		);

		return !deepEqual(
			currentValuesWithoutComputed,
			defaultValuesWithoutComputed
		);
	}, [currentValues, defaultValues]);

	const formSubmit = useCallback<SubmitHandler<T>>(
		async (data) => {
			await onSubmit(data);
			methods.reset(defaultValues);
		},
		[onSubmit, methods, defaultValues]
	);

	// Handle the open change
	const handleOpenChange = useCallback(() => {
		if (hasRealChanges) {
			setShowExitConfirmation(true);
		} else {
			onOpenChange();
		}
	}, [hasRealChanges, onOpenChange]);

	// Handle closing the modal
	const handleCloseModal = useCallback(() => {
		setShowExitConfirmation(false);
		methods.reset(defaultValues);
		onOpenChange();
	}, [onOpenChange, methods, defaultValues]);

	// Clean the state when the modal is closed
	useEffect(() => {
		if (!open) {
			setShowExitConfirmation(false);
		}
	}, [open]);

	return (
		<div>
			<Dialog open={open} onOpenChange={handleOpenChange}>
				<DialogContent
					showOverlay={showOverlay}
					className="md:max-w-2xl sm:max-w-2xl max-w-full sm:max-h-[85%] max-h-full p-0"
				>
					<DialogHeader>
						<DialogTitle>
							<DialogDescription className="text-xl text-foreground">
								{title}
							</DialogDescription>
						</DialogTitle>
					</DialogHeader>
					<div className="overflow-y-auto p-6 space-y-6">
						<FormProvider {...methods}>
							<form id="modalForm" onSubmit={methods.handleSubmit(formSubmit)}>
								{children}
							</form>
						</FormProvider>
					</div>
					<DialogFooter>
						{footer || (
							<div className="flex w-full justify-end">
								<Button
									className="self-end"
									disabled={isSubmitting}
									type="submit"
									variant="default"
									form="modalForm"
								>
									Enregistrer
									{isSubmitting ? <Loader2 className="animate-spin" /> : ""}
								</Button>
							</div>
						)}
					</DialogFooter>
				</DialogContent>
			</Dialog>
			<AlertDialog
				open={showExitConfirmation}
				onOpenChange={setShowExitConfirmation}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Modifications non sauvegardées</AlertDialogTitle>
						<AlertDialogDescription className="text-base opacity-80">
							Annuler les modifications ?
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel onClick={() => setShowExitConfirmation(false)}>
							Ignorer
						</AlertDialogCancel>
						<AlertDialogAction onClick={handleCloseModal}>
							Annuler
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
