"use client";

import { Button } from "@/components/ui/button";
import { ChatIcon, BellIcon } from "@phosphor-icons/react";
import { DropdownProfile } from "@/components/layout/header/navbar/DropdownProfile";
import { SearchBar } from "@/components/features/search";
import { NavLogo } from "@/components/layout/sidebar/nav-logo";

export function SiteHeader() {
  return (
    <header className="bg-background sticky top-0 z-50 flex w-full items-center border-b">
      <div className="flex h-(--header-height) w-full items-center pr-2 pl-4">
        <div className="flex justify-between items-center h-full w-full">
          <div className="w-auto">
            <NavLogo />
          </div>
          <div className="w-full flex justify-center">
            <SearchBar />
          </div>
          <div className="flex justify-end gap-x-2">
            <Button className="h-10 w-10 rounded-md bg-foreground/10">
              <ChatIcon className="size-4.5!" weight="bold" />
            </Button>
            <Button className="h-10 w-10 rounded-md bg-foreground/10">
              <BellIcon className="size-4.5!" weight="bold" />
            </Button>
            <DropdownProfile showText={false} />
          </div>
        </div>
      </div>
    </header>
  );
}
