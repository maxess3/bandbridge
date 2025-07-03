"use client";

import { BaseEditModal } from "./BaseEditModal";
import { FieldValues, DefaultValues } from "react-hook-form";
import { z } from "zod";

interface ModalProps<T extends FieldValues> {
	children: React.ReactNode;
	title: string;
	onSubmit: (data: T) => Promise<void>;
	formSchema: z.ZodType<T>;
	defaultValues?: DefaultValues<T>;
	isSubmitting?: boolean;
	open?: boolean;
	onClose?: () => void;
	closeTooltipText?: string;
	footer?: React.ReactNode;
	showOverlay?: boolean;
}

export function EditModal<T extends FieldValues>({
	children,
	title,
	onSubmit,
	formSchema,
	defaultValues,
	isSubmitting = false,
	open = true,
	onClose = () => {},
	footer,
	showOverlay = true,
}: ModalProps<T>) {
	return (
		<BaseEditModal
			open={open}
			title={title}
			onSubmit={onSubmit}
			formSchema={formSchema}
			defaultValues={defaultValues}
			isSubmitting={isSubmitting}
			onOpenChange={onClose}
			footer={footer}
			showOverlay={showOverlay}
		>
			{children}
		</BaseEditModal>
	);
}
