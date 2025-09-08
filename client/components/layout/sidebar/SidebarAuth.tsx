"use client";

import * as React from "react";
import { SidebarNavMain } from "@/components/layout/sidebar/SidebarNavMain";
import { SidebarNavHeader } from "@/components/layout/sidebar/SidebarNavHeader";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { LayoutDashboard, Newspaper, Users, User, MapPin } from "lucide-react";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Synthèse",
      url: "/home",
      icon: LayoutDashboard,
    },
    {
      title: "Annonces",
      url: "/ads",
      icon: Newspaper,
    },
    {
      title: "Groupes",
      url: "/lokzefzef",
      icon: Users,
    },
    {
      title: "Artistes",
      url: "/lokzefzef",
      icon: User,
    },
    {
      title: "Concerts",
      url: "/concerts",
      icon: MapPin,
    },
  ],
};

export function SidebarAuth({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      className="top-14 h-[calc(100vh-2.5rem)]"
      collapsible="icon"
      {...props}
    >
      <SidebarHeader className="md:hidden sm:block">
        <SidebarNavHeader />
      </SidebarHeader>
      <SidebarContent>
        <SidebarNavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
    </Sidebar>
  );
}
