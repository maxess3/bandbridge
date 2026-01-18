"use client";

import { useMemo } from "react";
import {
	UsersIcon,
	UserIcon,
	HouseIcon,
	WrenchIcon,
	ShoppingCartIcon,
	GlobeIcon,
	SpeakerHighIcon,
} from "@phosphor-icons/react";
import { NavMain } from "@/components/layout/sidebar/nav-main";
import { NavBandMain } from "@/components/layout/sidebar/nav-band-main";
import {
	Sidebar,
	SidebarContent,
	SidebarRail,
} from "@/components/ui/sidebar";
import { useSidebarViewStore } from "@/stores/sidebarViewStore";
import { useSyncSidebarView } from "@/hooks/features/band/useSyncSidebarView";
import { useProfile } from "@/hooks/features/profile/useProfile";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { view } = useSidebarViewStore();
	const { isReady } = useSyncSidebarView();
	const { data: profile } = useProfile();

	const userNavData = useMemo(() => ({
		navMain: [
			{
				title: "Accueil",
				url: "/home",
				icon: HouseIcon,
			},
			{
				title: "Artistes",
				url: "/artists",
				icon: UserIcon,
			},
			{
				title: "Pages",
				url: "/band/create-band",
				icon: UsersIcon,
			},
			{
				title: "Recrutement",
				url: "/ads",
				icon: SpeakerHighIcon,
			},
			{
				title: "Marketplace",
				url: "/marketplace",
				icon: ShoppingCartIcon,
			},
			{
				title: "Communauté",
				url: "/community",
				icon: GlobeIcon,
			},
			{
				title: "Outils",
				url: "#",
				icon: WrenchIcon,
				items: [
					{
						title: "Prix instrument",
						url: "#",
					},
					{
						title: "Partenaires",
						url: "#",
					},
				],
			},
			{
				title: "Profil",
				url: profile?.username ? `/${profile.username}` : "/profile",
				icon: UserIcon,
			},
		],
	}), [profile?.username]);

	return (
		<Sidebar
			collapsible="none"
			className="border-r"
			{...props}
		>
			<SidebarContent>
				{
					!isReady ? null : view === "user" ? ( // Afficher un état de chargement ou rien pendant la synchronisation
						<div className="px-1.5">
							<NavMain items={userNavData.navMain} />
						</div>
					) : (
						<div className="px-1.5">
							<NavBandMain />
						</div>
					)
				}
			</SidebarContent >
			<SidebarRail />
		</Sidebar >
	);
}
