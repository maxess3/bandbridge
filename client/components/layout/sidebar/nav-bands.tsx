"use client";

import { useUserBands } from "@/hooks/features/band/useUserBands";
import { useSidebarViewStore } from "@/stores/sidebarViewStore";
import Link from "next/link";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getImageUrl } from "@/utils";
import { UsersIcon } from "@phosphor-icons/react";

export function NavBands() {
  const { data: bands, isLoading } = useUserBands();
  const { activeBand, setActiveBand, setView } = useSidebarViewStore();

  if (isLoading || !bands || bands.length === 0) {
    return null;
  }

  return (
    <SidebarGroup>
      <SidebarMenu>
        {bands.map((band) => {
          const isActive = activeBand?.id === band.id;
          const imageUrl = getImageUrl(
            band.profilePictureKey || "",
            "thumbnail"
          );

          return (
            <SidebarMenuItem key={band.id} className="py-1">
              <SidebarMenuButton
                className={`h-8 ${
                  isActive ? "opacity-100" : "opacity-60 hover:opacity-100"
                } gap-3`}
                asChild
                tooltip={band.name}
                isActive={isActive}
              >
                <Link
                  href={`/band/${band.slug}`}
                  onClick={() => {
                    // Mettre à jour le store quand on clique
                    setActiveBand(band);
                    setView("band");
                  }}
                >
                  <Avatar className="size-4.5">
                    <AvatarImage src={imageUrl || undefined} />
                    <AvatarFallback>
                      <UsersIcon className="size-3" />
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-base font-medium truncate">
                    {band.name}
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
