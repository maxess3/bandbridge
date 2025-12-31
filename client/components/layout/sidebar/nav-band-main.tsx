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
        title: "Annonces",
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
          <SidebarMenuItem className="py-1">
            <div className="flex items-center gap-3 px-2 py-2">
              <Avatar className="size-8">
                <AvatarImage src={imageUrl || undefined} />
                <AvatarFallback>
                  <UsersIcon className="size-4" />
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-sm font-medium truncate">
                  {activeBand.name}
                </span>
                <span className="text-xs opacity-70 truncate">
                  Groupe actif
                </span>
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
      <NavMain items={bandNavData.navMain} />
    </>
  );
}
