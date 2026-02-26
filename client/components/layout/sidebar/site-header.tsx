"use client";

import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChatIcon, BellIcon, GlobeIcon } from "@phosphor-icons/react";
import { SearchBar } from "@/components/features/search";
import { DropdownProfile } from "@/components/layout/header/navbar/DropdownProfile";
import { NavLogo } from "@/components/layout/sidebar/nav-logo";

const USER_PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Tableau de bord",
  "/bands": "Groupes",
  "/musicians": "Musiciens",
  "/ads": "Annonces",
  "/marketplace": "Achat/Vente",
  "/community": "Forum",
  "/settings": "Paramètres",
  "/search": "Recherche",
  "/band/create-band": "Créer un groupe",
};

function getPageTitle(pathname: string): string | null {
  const exact = USER_PAGE_TITLES[pathname];
  if (exact) return exact;

  const bandMatch = pathname.match(/^\/band\/([^/]+)(?:\/(.*))?$/);
  if (bandMatch) {
    const subPath = bandMatch[2];
    if (!subPath) return "Tableau de bord";
    if (subPath === "members") return "Membres";
    if (subPath === "ads") return "Recrutement";
    if (subPath === "create-ads") return "Créer une annonce";
    if (subPath === "settings") return "Paramètres";
  }

  const profileSegmentMatch = pathname.match(/^\/([^/]+)(?:\/|$)/);
  if (profileSegmentMatch) {
    const firstSegment = profileSegmentMatch[1];
    const reserved = [
      "dashboard", "bands", "musicians", "ads", "marketplace",
      "community", "settings", "search", "band", "auth", "articles",
    ];
    if (!reserved.includes(firstSegment)) return "Profil";
  }

  return null;
}

export function SiteHeader() {
  const pathname = usePathname();
  const pageTitle = getPageTitle(pathname);

  return (
    <header className="bg-background sticky top-0 z-50 flex w-full items-center border-b">
      <div className="flex h-(--header-height) w-full items-center pr-2 pl-3.5">
        <div className="flex w-78 items-center gap-x-3">
          <NavLogo />
          <SearchBar />
        </div>
        <div className="flex flex-1 items-center justify-center overflow-hidden">
          {pageTitle ? (
            <span
              className="truncate text-center text-sm font-medium"
              title={pageTitle}
            >
              {pageTitle}
            </span>
          ) : (
            <span className="flex-1" aria-hidden />
          )}
        </div>
        <div className="flex items-center justify-end gap-x-2">
          <Button className="h-10 w-10 rounded-md bg-foreground/10">
            <ChatIcon className="size-4.5!" weight="bold" />
          </Button>
          <Button className="h-10 w-10 rounded-md bg-foreground/10">
            <BellIcon className="size-4.5!" weight="bold" />
          </Button>
          <DropdownProfile showText={false} />
        </div>
      </div>
    </header>
  );
}
