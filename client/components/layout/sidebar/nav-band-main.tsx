"use client";

import {
	HouseIcon,
	UsersIcon,
	GearIcon,
	SpeakerHighIcon,
} from "@phosphor-icons/react";
import { NavMain } from "@/components/layout/sidebar/nav-main";
import { useSidebarViewStore } from "@/stores/sidebarViewStore";
import {
	SidebarGroup,
	SidebarMenu,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getImageUrl } from "@/utils";

export function NavBandMain() {
	const { activeBand } = useSidebarViewStore();

	if (!activeBand) {
		return null;
	}

	const imageUrl = getImageUrl(activeBand.profilePictureKey || "", "thumbnail");

	const bandNavData = {
		navMain: [
			{
				title: "Page du groupe",
				url: `/band/${activeBand.slug}`,
				icon: HouseIcon,
			},
			{
				title: "Membres",
				url: `/band/${activeBand.slug}/members`,
				icon: UsersIcon,
			},
			{
				title: "Recrutement",
				url: `/band/${activeBand.slug}/ads`,
				icon: SpeakerHighIcon,
			},
			{
				title: "Paramètres",
				url: `/band/${activeBand.slug}/settings`,
				icon: GearIcon,
			},
		],
	};

	return (
		<>
			<SidebarGroup>
				<SidebarMenu>
					<SidebarMenuItem>
						<div className="flex flex-col gap-y-3">
							<span className="text-xl font-medium">Gérer la page</span>
							<div className="flex items-center gap-2.5 pb-4">
								<Avatar className="size-10">
									<AvatarImage src={imageUrl || undefined} />
									<AvatarFallback>
										<UsersIcon className="size-4" />
									</AvatarFallback>
								</Avatar>
								<div className="flex flex-col min-w-0 flex-1">
									<span className="text-base font-medium truncate first-letter:uppercase">
										{activeBand.name}
									</span>
								</div>
							</div>
							<Separator />
						</div>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarGroup>
			<NavMain items={bandNavData.navMain} />
		</>
	);
}
