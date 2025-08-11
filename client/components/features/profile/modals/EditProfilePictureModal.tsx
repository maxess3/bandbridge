"use client";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog";
import { ProfilePictureForm } from "@/components/features/profile/forms/ProfilePictureForm";
import { UpdateProfilePictureForm } from "@/components/features/profile/forms/UpdateProfilePictureForm";
import { formProfilePicture } from "@/lib/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useProfile } from "@/hooks/useProfile";
import { PROFILE_QUERY_KEY } from "@/hooks/useProfile";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { Button } from "../../../ui/button";
import { Loader2, Trash2, Upload, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useTransitionDelay } from "@/hooks/useTransitionDelay";
import { useSession } from "next-auth/react";
import { useSessionLoader } from "@/contexts/SessionLoaderContext";
import { z } from "zod";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFocusManager } from "@/contexts/FocusManagerContext";

interface EditProfilePictureModalProps {
	onClose: () => void;
	open: boolean;
}

type ModalView = "view" | "upload";

export function EditProfilePictureModal({
	onClose,
	open,
}: EditProfilePictureModalProps) {
	const { data: session, update } = useSession();
	const axiosAuth = useAxiosAuth();
	const { setIgnoreLoader } = useSessionLoader();
	const queryClient = useQueryClient();
	const { data: profile, isLoading: loadingProfile } = useProfile();
	const [currentView, setCurrentView] = useState<ModalView>("view");
	const { isDelaying, withDelay } = useTransitionDelay(600);
	const { restoreFocus } = useFocusManager();

	const methods = useForm<z.infer<typeof formProfilePicture>>({
		mode: "onChange",
		resolver: zodResolver(formProfilePicture),
		defaultValues: {},
	});

	const deleteProfilePictureMutation = useMutation({
		mutationFn: async () => {
			const { data } = await axiosAuth.delete("/profile/me/picture");
			return data;
		},
		onSuccess: async (data) => {
			await queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });

			setIgnoreLoader(true);
			await update({
				user: {
					...session?.user,
					profilePictureKey: data?.user?.profilePictureKey,
				},
			});
			setTimeout(() => setIgnoreLoader(false), 1000);

			onClose(); // Changed from handleModalClose(onClose)
		},
	});

	const updateProfilePictureMutation = useMutation({
		mutationFn: async (values: z.infer<typeof formProfilePicture>) => {
			const formData = new FormData();
			formData.append("file", values.profilePicture);

			const { data } = await axiosAuth.post("/profile/me/picture", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});

			return data;
		},
		onSuccess: async (data) => {
			await queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });

			if (data?.user?.profilePictureKey) {
				setIgnoreLoader(true);
				await update({
					user: {
						...session?.user,
						profilePictureKey: data?.user?.profilePictureKey,
					},
				});
				setTimeout(() => setIgnoreLoader(false), 1000);
			}

			onClose();
		},
	});

	const handleClose = () => {
		if (currentView === "upload") {
			setCurrentView("view");
			methods.reset();
		} else {
			onClose();
		}
	};

	const handleOpenChange = () => {
		handleClose();
	};

	const handleSubmit: SubmitHandler<
		z.infer<typeof formProfilePicture>
	> = async (data) => {
		return withDelay(() => updateProfilePictureMutation.mutateAsync(data));
	};

	const customFooter = (
		<div
			className={`w-full flex gap-2 ${
				profile?.profilePictureKey ? "justify-between" : "justify-end"
			}`}
		>
			{profile?.profilePictureKey && (
				<Button
					variant="outline"
					onClick={() =>
						withDelay(() => deleteProfilePictureMutation.mutateAsync())
					}
					disabled={deleteProfilePictureMutation.isPending || isDelaying}
					icon={<Trash2 className="!size-4" />}
				>
					Supprimer
					{deleteProfilePictureMutation.isPending || isDelaying ? (
						<Loader2 className="animate-spin" />
					) : null}
				</Button>
			)}
			<Button
				onClick={() => setCurrentView("upload")}
				icon={<Upload className="!size-4" />}
			>
				<span className="inline-flex gap-x-1">
					Ajouter
					<span className="sm:block hidden">une photo</span>
				</span>
			</Button>
		</div>
	);

	const uploadFooter = (
		<div className="w-full flex gap-2 justify-between">
			<Button
				variant="outline"
				onClick={() => {
					setCurrentView("view");
					methods.reset();
				}}
				icon={<ArrowLeft className="w-4 h-4" />}
			>
				Retour
			</Button>
			<Button
				onClick={methods.handleSubmit(handleSubmit)}
				disabled={updateProfilePictureMutation.isPending || isDelaying}
			>
				{updateProfilePictureMutation.isPending || isDelaying ? (
					<Loader2 className="animate-spin" />
				) : null}
				Enregistrer
			</Button>
		</div>
	);

	return (
		<>
			{profile && (
				<Dialog open={open && !loadingProfile} onOpenChange={handleOpenChange}>
					<DialogContent
						className="sm:max-w-2xl max-w-full sm:max-h-[85%] max-h-full p-0"
						onCloseAutoFocus={(e) => {
							e.preventDefault();
							restoreFocus();
						}}
					>
						<DialogHeader>
							<DialogTitle>
								<DialogDescription className="text-xl text-foreground font-medium">
									{currentView === "view"
										? "Photo de profil"
										: "Ajouter une photo de profil"}
								</DialogDescription>
							</DialogTitle>
						</DialogHeader>

						<div className="overflow-y-auto p-6 space-y-6">
							{currentView === "view" ? (
								<ProfilePictureForm />
							) : (
								<FormProvider {...methods}>
									<UpdateProfilePictureForm />
								</FormProvider>
							)}
						</div>

						<DialogFooter>
							{currentView === "view" ? customFooter : uploadFooter}
						</DialogFooter>
					</DialogContent>
				</Dialog>
			)}
		</>
	);
}
