"use client";

import {
	HouseIcon,
	UsersIcon,
	GearIcon,
	SpeakerHighIcon,
} from "@phosphor-icons/react";
import { NavMain } from "@/components/layout/sidebar/nav-main";
import { useSidebarViewStore } from "@/stores/sidebarViewStore";
import { getImageUrl } from "@/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function NavBandMain() {
	const { activeBand } = useSidebarViewStore();

	if (!activeBand) {
		return null;
	}

	const imageUrl = getImageUrl(activeBand.profilePictureKey || "", "thumbnail");

	const bandNavData = {
		navMain: [
			{
				title: "Tableau de bord",
				url: `/band/${activeBand.id}`,
				icon: HouseIcon,
			},
			{
				title: "Membres",
				url: `/band/${activeBand.id}/members`,
				icon: UsersIcon,
			},
			{
				title: "Recrutement",
				url: `/band/${activeBand.id}/ads`,
				icon: SpeakerHighIcon,
			},
			{
				title: "Paramètres",
				url: `/band/${activeBand.id}/settings`,
				icon: GearIcon,
			},
		],
	};

	const initials = (activeBand.name || "")
		.trim()
		.split(/\s+/)
		.slice(0, 2)
		.map((part) => part[0]?.toUpperCase())
		.join("");

	return (
		<div className="pt-1.5">
			<div className="flex gap-3 border rounded-md p-3">
				<div className="min-w-0 flex-1">
					<div className="truncate text-base font-semibold">
						{activeBand.name}
					</div>
				</div>
			</div>
			<NavMain items={bandNavData.navMain} />
		</div>
	);
}
