"use client";

import { cn } from "@/lib/utils";
import { NavLogo } from "@/components/layout/sidebar/nav-logo";
import { getImageUrl } from "@/utils";
import { useUserBands } from "@/hooks/features/band/useUserBands";
import { useSidebarViewStore } from "@/stores/sidebarViewStore";
import { useProfile } from "@/hooks/features/profile/useProfile";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UsersIcon, UserIcon } from "@phosphor-icons/react";
import { PlusIcon } from "@phosphor-icons/react";
import { Separator } from "@/components/ui/separator";

export function NavFirstSidebar() {
	const { data: bands, isLoading: isLoadingBands } = useUserBands();
	const { data: profile, isLoading: isLoadingProfile } = useProfile();
	const { activeBand, setActiveBand, setView, reset } = useSidebarViewStore();
	const pathname = usePathname();

	const isProfileRelatedRoute = (
		currentPathname: string,
		username?: string | null,
	) => {
		if (!username) {
			return false;
		}

		const PROFILE_RELATED_PATHS = [
			"/settings",
			"/ads",
			"/musicians",
			"/bands",
			"/dashboard",
			"/search",
		];

		if (
			currentPathname === `/${username}` ||
			currentPathname.startsWith(`/${username}/`)
		) {
			return true;
		}

		return PROFILE_RELATED_PATHS.includes(currentPathname);
	};

	// Ne pas afficher si ni le profil ni les groupes ne sont disponibles
	if (isLoadingProfile && isLoadingBands) {
		return null;
	}

	// Vérifier si on est sur la page du profil utilisateur
	const isProfileActive = isProfileRelatedRoute(pathname, profile?.username);

	return (
		<div className="flex flex-col items-center gap-6 pt-3">
			<div className="flex flex-col items-center gap-2 w-full">
				{/* Photo du profil utilisateur */}
				{profile && !isLoadingProfile && (
					<Link
						href={`/dashboard`}
						onClick={() => {
							reset();
						}}
						className={cn(
							"relative transition-opacity hover:opacity-100",
							isProfileActive ? "opacity-100 relative" : "opacity-60",
						)}
						title={profile.pseudonyme || profile.username}
					>
						<NavLogo />
					</Link>
				)}
				<Separator className="w-7/12" />
				{/* Groupes */}
				{!isLoadingBands &&
					bands &&
					bands.length > 0 &&
					bands.map((band) => {
						const isActive = activeBand?.id === band.id;
						const imageUrl = getImageUrl(
							band.profilePictureKey || "",
							"thumbnail",
						);

						return (
							<Link
								key={band.id}
								href={`/band/${band.id}`}
								onClick={() => {
									setActiveBand(band);
									setView("band");
								}}
								className={cn(
									"relative transition-opacity hover:opacity-100",
									isActive ? "opacity-100 relative" : "opacity-60",
								)}
								title={band.name}
							>
								<Avatar className="w-12 h-12 overflow-hidden rounded-none [clip-path:polygon(25%_6.7%,75%_6.7%,100%_50%,75%_93.3%,25%_93.3%,0%_50%)]">
									<AvatarImage
										src={imageUrl || undefined}
										className="h-full w-full object-cover [clip-path:polygon(25%_6.7%,75%_6.7%,100%_50%,75%_93.3%,25%_93.3%,0%_50%)]"
									/>
									<AvatarFallback className="flex h-full w-full items-center justify-center bg-blue-600 text-white [clip-path:polygon(25%_6.7%,75%_6.7%,100%_50%,75%_93.3%,25%_93.3%,0%_50%)]">
										<UsersIcon className="size-5" />
									</AvatarFallback>
								</Avatar>
							</Link>
						);
					})}
				<Link
					href="/band/create-band"
					className="bg-secondary flex h-12 w-12 items-center justify-center border overflow-hidden rounded-none [clip-path:polygon(25%_6.7%,75%_6.7%,100%_50%,75%_93.3%,25%_93.3%,0%_50%)]"
				>
					<PlusIcon className="size-4" />
				</Link>
			</div>
		</div>
	);
}
