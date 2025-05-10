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
	DialogOverlay,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

interface ModalProps<T extends FieldValues> {
	children: React.ReactNode;
	title: string;
	onSubmit: (data: T) => Promise<void>;
	formSchema: z.ZodType<T>;
	defaultValues?: DefaultValues<T>;
	isSubmitting?: boolean;
	open?: boolean;
	onClose?: () => void;
}

export function EditModalWithoutParallel<T extends FieldValues>({
	children,
	title,
	onSubmit,
	formSchema,
	defaultValues,
	isSubmitting = false,
	open = true,
	onClose,
}: ModalProps<T>) {
	const methods = useForm<T>({
		mode: "onChange",
		resolver: zodResolver(formSchema),
		defaultValues,
	});

	const formSubmit: SubmitHandler<T> = async (data) => {
		await onSubmit(data);
	};

	return (
		<div>
			<Dialog open={open} onOpenChange={onClose}>
				<DialogOverlay>
					<DialogContent className="md:max-w-2xl sm:max-w-2xl max-w-full sm:max-h-[85%] max-h-full p-0">
						<DialogHeader>
							<DialogTitle>
								<DialogDescription className="text-xl text-foreground">
									{title}
								</DialogDescription>
							</DialogTitle>
						</DialogHeader>
						<div className="overflow-y-auto p-6 space-y-6">
							<FormProvider {...methods}>
								<form
									id="modalForm"
									onSubmit={methods.handleSubmit(formSubmit)}
								>
									{children}
								</form>
							</FormProvider>
						</div>
						<DialogFooter>
							<Button
								disabled={isSubmitting}
								type="submit"
								variant="default"
								form="modalForm"
							>
								Enregistrer
								{isSubmitting ? <Loader2 className="animate-spin" /> : ""}
							</Button>
						</DialogFooter>
					</DialogContent>
				</DialogOverlay>
			</Dialog>
		</div>
	);
}
