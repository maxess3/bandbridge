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

  return <NavMain items={bandNavData.navMain} />;
}
