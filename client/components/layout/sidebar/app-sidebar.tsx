"use client";

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
import { NavBands } from "@/components/layout/sidebar/nav-bands";
import { NavBandMain } from "@/components/layout/sidebar/nav-band-main";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarRail,
} from "@/components/ui/sidebar";
import { useSidebarViewStore } from "@/stores/sidebarViewStore";
import { useSyncSidebarView } from "@/hooks/features/band/useSyncSidebarView";
import { NavSocials } from "@/components/layout/sidebar/nav-socials";

const userNavData = {
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
			title: "Mon profil",
			url: "/profile",
			icon: UserIcon,
		},
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { view } = useSidebarViewStore();
	const { isReady } = useSyncSidebarView();

	return (
		<Sidebar
			className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
			collapsible="icon"
			{...props}
		>
			<SidebarContent className="pt-1.5">
				{!isReady ? null : view === "user" ? ( // Afficher un état de chargement ou rien pendant la synchronisation
					<div className="px-1.5">
						<NavMain items={userNavData.navMain} />
						<NavBands />
					</div>
				) : (
					<div className="px-1.5">
						<NavBandMain />
					</div>
				)}
			</SidebarContent>
			<SidebarFooter>
				<NavSocials />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
