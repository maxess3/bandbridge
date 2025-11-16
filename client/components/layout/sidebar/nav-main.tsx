"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: React.ComponentType<{
      className?: string;
      weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone";
      size?: string | number;
    }>;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          const isItemActive = pathname === item.url;

          // Si l'item n'a pas de sous-items, le rendre comme un simple lien
          if (!item.items || item.items.length === 0) {
            return (
              <SidebarMenuItem className="py-1" key={item.title}>
                <SidebarMenuButton
                  className={`h-8 ${
                    isItemActive
                      ? "opacity-100"
                      : "opacity-60 hover:opacity-100"
                  } gap-3`}
                  asChild
                  tooltip={item.title}
                  isActive={isItemActive}
                >
                  <Link href={item.url}>
                    {item.icon && (
                      <item.icon className="size-4.5" weight="bold" />
                    )}
                    <span className="text-base font-medium">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          }

          // Si l'item a des sous-items, le rendre comme un collapsible
          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem className="py-1">
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    className={`h-8 cursor-pointer ${
                      isItemActive
                        ? "opacity-100"
                        : "opacity-60 hover:opacity-100"
                    } gap-3`}
                    tooltip={item.title}
                  >
                    {item.icon && (
                      <item.icon className="size-4.5" weight="bold" />
                    )}
                    <span className="text-base font-medium">{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 size-5" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items.map((subItem) => {
                      const isSubItemActive = pathname === subItem.url;
                      return (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            className={`h-8 ${
                              isSubItemActive
                                ? "opacity-100"
                                : "opacity-60 hover:opacity-100"
                            }`}
                            asChild
                          >
                            <Link href={subItem.url}>
                              <span className="text-base font-medium">
                                {subItem.title}
                              </span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      );
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
