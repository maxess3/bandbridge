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
import { SidebarNavMain } from "@/components/features/auth/sidebar/SidebarNavMain";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
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

export function SidebarAuthContainer({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { state, isMobile, openMobile } = useSidebar();
  const isCollapsed = isMobile ? !openMobile : state === "collapsed";

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="h-16">
        <SidebarMenu className="h-full">
          <SidebarMenuItem className="flex items-center relative h-full">
            <SidebarMenuButton
              asChild
              className="hover:bg-transparent !pl-[0.75rem] h-12"
            >
              <Link href="/home" className="cursor-pointer">
                <Layers className="!size-5 mr-1" />
                <span
                  className={`font-newKansas font-semibold text-2xl transition-all duration-200 ease-in-out whitespace-nowrap ${
                    isCollapsed
                      ? "opacity-0 scale-0 max-w-0"
                      : "opacity-100 scale-100 max-w-none"
                  }`}
                >
                  Chordeus
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarNavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
    </Sidebar>
  );
}
