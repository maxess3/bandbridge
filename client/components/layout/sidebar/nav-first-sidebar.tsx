"use client";

import { cn } from "@/lib/utils";
import { getImageUrl } from "@/utils";
import { useUserBands } from "@/hooks/features/band/useUserBands";
import { useSidebarViewStore } from "@/stores/sidebarViewStore";
import { useProfile } from "@/hooks/features/profile/useProfile";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UsersIcon, UserIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@phosphor-icons/react";
import { Separator } from "@/components/ui/separator";

export function NavFirstSidebar() {
	const { data: bands, isLoading: isLoadingBands } = useUserBands();
	const { data: profile, isLoading: isLoadingProfile } = useProfile();
	const { activeBand, setActiveBand, setView, reset } = useSidebarViewStore();
	const pathname = usePathname();

	// Ne pas afficher si ni le profil ni les groupes ne sont disponibles
	if (isLoadingProfile && isLoadingBands) {
		return null;
	}

	// Vérifier si on est sur la page du profil utilisateur
	const isProfileActive = profile?.username && (
		pathname === `/${profile.username}` ||
		pathname.startsWith(`/${profile.username}/`)
	);

	return (
		<div className="flex flex-col items-center gap-2 py-3">
			{/* Photo du profil utilisateur */}
			{profile && !isLoadingProfile && (
				<Link
					href={`/${profile.username}`}
					onClick={() => {
						reset();
					}}
					className={cn(
						"relative transition-opacity hover:opacity-100",
						isProfileActive ? "opacity-100" : "opacity-60"
					)}
					title={profile.pseudonyme || profile.username}
				>
					<Avatar className="w-10 h-10 rounded-xl">
						<AvatarImage
							src={getImageUrl(profile.profilePictureKey || "", "thumbnail") || undefined}
						/>
						<AvatarFallback>
							<UserIcon className="size-5" />
						</AvatarFallback>
					</Avatar>
				</Link>
			)}
			<Separator className="w-7/12" />
			{/* Groupes */}
			{!isLoadingBands && bands && bands.length > 0 && bands.map((band) => {
				const isActive = activeBand?.id === band.id;
				const imageUrl = getImageUrl(
					band.profilePictureKey || "",
					"thumbnail"
				);

				return (
					<Link
						key={band.id}
						href={`/band/${band.slug}`}
						onClick={() => {
							setActiveBand(band);
							setView("band");
						}}
						className={cn(
							"relative transition-opacity hover:opacity-100",
							isActive ? "opacity-100" : "opacity-60"
						)}
						title={band.name}
					>
						<Avatar className="w-10 h-10 rounded-xl">
							<AvatarImage src={imageUrl || undefined} />
							<AvatarFallback>
								<UsersIcon className="size-5" />
							</AvatarFallback>
						</Avatar>
					</Link>
				);
			})}
			<Button variant="outline" className="w-10 h-10 rounded-xl">
				<PlusIcon className="size-4" />
			</Button>
		</div>
	);
}
