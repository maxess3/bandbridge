"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { DropdownProfile } from "@/components/layout/header/DropdownProfile";
import SearchBar from "@/components/features/search/SearchBar";
import { LuMessageCircle } from "react-icons/lu";
import { IoNotificationsOutline } from "react-icons/io5";

export const NavbarAuth = () => {
  const { setOpenMobile } = useSidebar();

  const handleBurgerClick = () => {
    setOpenMobile(true);
  };

  return (
    <nav className="h-14 bg-background items-center flex px-6 sticky top-0 z-50 w-full border-b">
      <div className="flex justify-between items-center w-full h-full gap-x-6">
        <div className="flex items-center w-full">
          {/* Burger Menu - Mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="mr-2 md:hidden"
            onClick={handleBurgerClick}
            aria-label="Ouvrir le menu"
          >
            <Menu />
          </Button>

          {/* Logo */}
          <div className="flex items-center gap-x-3 md:hidden">
            <Link
              href="/home"
              className="font-medium flex items-center gap-x-3"
            >
              <span className="text-2xl font-semibold">chordeus</span>
            </Link>
          </div>

          <SearchBar />
        </div>

        <div className="flex items-center gap-x-6 h-full">
          <div className="flex items-center h-full">
            <div className="border-l h-full flex items-center justify-center w-16 hover:bg-hover cursor-pointer">
              <IoNotificationsOutline className="size-6 opacity-80" />
            </div>
            <div className="border-l border-r h-full flex items-center justify-center w-16 hover:bg-hover cursor-pointer">
              <LuMessageCircle className="size-6 opacity-80" />
            </div>
          </div>
          <DropdownProfile />
        </div>
      </div>
    </nav>
  );
};
