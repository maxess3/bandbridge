"use client";

import * as React from "react";
import { LayoutDashboard, Newspaper, Users } from "lucide-react";
import { SidebarNavMain } from "@/components/features/auth/sidebar/SidebarNavMain";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
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
      icon: Users,
    },
    {
      title: "Concerts",
      url: "/concerts",
      icon: Users,
    },
  ],
};

export function SidebarAuth({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar className="top-14" collapsible="icon" {...props}>
      <SidebarContent>
        <SidebarNavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
    </Sidebar>
  );
}
