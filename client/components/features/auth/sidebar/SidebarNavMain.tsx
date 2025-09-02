"use client";

import { type LucideIcon, ChevronRight } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export function SidebarNavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    subItems?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const { state, isMobile, openMobile } = useSidebar();
  const isCollapsed = isMobile ? !openMobile : state === "collapsed";

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <Collapsible key={item.title} asChild className="group/collapsible">
              <SidebarMenuItem key={item.title}>
                {item.subItems ? (
                  <>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        className="h-12 py-3 pl-[0.825rem] pr-3 text-lg"
                        tooltip={item.title}
                      >
                        {item.icon && <item.icon className="mr-1.5 !size-5" />}
                        <span
                          className={`transition-all duration-200 ease-in-out whitespace-nowrap ${
                            isCollapsed
                              ? "opacity-0 scale-0 max-w-0"
                              : "opacity-100 scale-100 max-w-none"
                          }`}
                        >
                          {item.title}
                        </span>
                        <ChevronRight
                          className={`ml-auto transition-all duration-200 ease-in-out group-data-[state=open]/collapsible:rotate-90 ${
                            isCollapsed
                              ? "opacity-0 scale-0"
                              : "opacity-100 scale-100"
                          }`}
                        />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub className="mx-0 border-none">
                        {item.subItems.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              href={subItem.url}
                              className="h-12 py-3 pl-[0.825rem] pr-3 text-lg"
                            >
                              <span
                                className={`transition-all duration-200 ease-in-out whitespace-nowrap ${
                                  isCollapsed
                                    ? "opacity-0 scale-0 max-w-0"
                                    : "opacity-100 scale-100 max-w-none"
                                }`}
                              >
                                {subItem.title}
                              </span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </>
                ) : (
                  <SidebarMenuButton
                    className="h-14 pl-[0.825rem] pr-3 text-lg"
                    tooltip={item.title}
                  >
                    {item.icon && <item.icon className="mr-1.5 !size-5" />}
                    <span
                      className={`transition-all duration-200 ease-in-out whitespace-nowrap ${
                        isCollapsed
                          ? "opacity-0 scale-0 max-w-0"
                          : "opacity-100 scale-100 max-w-none"
                      }`}
                    >
                      {item.title}
                    </span>
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
            </Collapsible>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
