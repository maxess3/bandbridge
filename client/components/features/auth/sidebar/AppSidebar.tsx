"use client";

import * as React from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  HelpCircle,
  Layers,
  Settings,
  Users,
} from "lucide-react";
import { NavMain } from "@/components/features/auth/sidebar/NavMain";
import { NavUser } from "@/components/features/auth/sidebar/NavUser";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Synthèse",
      url: "/lokzefzef",
      icon: LayoutDashboard,
    },
    {
      title: "Annonces",
      url: "/groups/ads",
      icon: Users,
      subItems: [
        {
          title: "Appels à candidatures",
          url: "/ads",
        },
        {
          title: "Projets ponctuels",
          url: "/groups/one-time",
        },
        {
          title: "Propositions de collaboration",
          url: "/groups/collaboration",
        },
      ],
    },
    {
      title: "Mes groupes",
      url: "/groups/my",
      icon: Users,
      subItems: [
        {
          title: "Gérer mes groupes",
          url: "/groups/my/history",
        },
        {
          title: "Calendrier de répétitions",
          url: "/groups/my/active",
        },
        {
          title: "Messagerie de groupe",
          url: "/groups/my/messages",
        },
      ],
    },
    {
      title: "Communauté",
      url: "/groups/search",
      icon: Users,
      subItems: [
        {
          title: "Profils de musiciens",
          url: "/groups/search/musicians",
        },
        {
          title: "Recherche de projets",
          url: "/groups/search/projects",
        },
        {
          title: "Matchmaking intelligent",
          url: "/groups/search/matchmaking",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Paramètres",
      url: "#",
      icon: Settings,
    },
    {
      title: "Besoin d'aide",
      url: "#",
      icon: HelpCircle,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="pt-6">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center relative">
            <SidebarMenuButton
              asChild
              className="group-data-[collapsible=icon]:justify-center gap-x-3 hover:bg-transparent cursor-default w-fit"
            >
              <Link
                href="/home"
                className="cursor-pointer hover:bg-transparent px-3"
              >
                <Layers className="!size-6 group-data-[state=collapsed]:group-hover:hidden" />
                <span className="text-xl font-extrabold group-data-[collapsible=icon]:hidden uppercase">
                  chordeus
                </span>
              </Link>
            </SidebarMenuButton>
            <SidebarTrigger className="rounded-full group-data-[collapsible=icon]:justify-center group-data-[state=expanded]:absolute group-data-[state=expanded]:right-0 group-data-[state=collapsed]:absolute group-data-[state=collapsed]:inset-0 group-data-[state=collapsed]:h-full group-data-[state=collapsed]:w-full h-9 w-9 [&>svg]:!size-5 opacity-0 group-data-[state=expanded]:group-hover:opacity-100 group-data-[state=collapsed]:group-hover:opacity-100 transition-opacity" />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter className="pb-6">
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
