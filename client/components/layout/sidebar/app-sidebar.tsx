"use client";

import {
  MagnifyingGlassIcon,
  UsersIcon,
  UserIcon,
  HouseIcon,
  WrenchIcon,
  ShoppingCartIcon,
  GlobeIcon,
} from "@phosphor-icons/react";
import { NavMain } from "@/components/layout/sidebar/nav-main";
import { NavUpgradePro } from "@/components/layout/sidebar/nav-upgrade-pro";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavProfile } from "@/components/layout/sidebar/nav-profile";

const data = {
  navMain: [
    {
      title: "Accueil",
      url: "/home",
      icon: HouseIcon,
    },
    {
      title: "Groupes",
      url: "#",
      icon: UsersIcon,
    },
    {
      title: "Artistes",
      url: "/artists",
      icon: UserIcon,
    },
    {
      title: "Communauté",
      url: "/community",
      icon: GlobeIcon,
    },
    {
      title: "Marketplace",
      url: "/marketplace",
      icon: ShoppingCartIcon,
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
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]! pt-4"
      collapsible="icon"
      {...props}
    >
      <SidebarHeader>
        <NavProfile />
      </SidebarHeader>
      <SidebarContent className="px-1.5">
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUpgradePro />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
