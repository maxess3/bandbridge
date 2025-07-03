"use client";

import { useRouter } from "next/navigation";
import { BaseEditModal } from "./BaseEditModal";
import { FieldValues, DefaultValues } from "react-hook-form";
import { z } from "zod";

interface ModalProps<T extends FieldValues> {
	children: React.ReactNode;
	route?: string;
	title: string;
	onSubmit: (data: T) => Promise<void>;
	formSchema: z.ZodType<T>;
	defaultValues?: DefaultValues<T>;
	isSubmitting?: boolean;
	open?: boolean;
	closeTooltipText?: string;
}

export function EditModalWithNavigation<T extends FieldValues>({
	children,
	route,
	title,
	onSubmit,
	formSchema,
	defaultValues,
	isSubmitting = false,
	open = true,
}: ModalProps<T>) {
	const router = useRouter();

	const handleFocus = () => {
		setTimeout(() => {
			if (
				typeof window !== "undefined" &&
				window.__lastFocusedElement instanceof HTMLElement
			) {
				window.__lastFocusedElement.focus();
				window.__lastFocusedElement = null;
			}
		}, 100);
	};

	const handleOpenChange = () => {
		if (window.history.length > 2) {
			router.back();
		} else if (route) {
			router.push(route);
		}
		handleFocus();
	};

	return (
		<BaseEditModal
			open={open}
			title={title}
			onSubmit={onSubmit}
			formSchema={formSchema}
			defaultValues={defaultValues}
			isSubmitting={isSubmitting}
			onOpenChange={handleOpenChange}
		>
			{children}
		</BaseEditModal>
	);
}
