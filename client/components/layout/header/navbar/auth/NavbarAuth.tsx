"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebarGlobal } from "@/contexts/SidebarGlobalContext";
import { DropdownProfile } from "@/components/layout/header/navbar/DropdownProfile";
import { SearchBar } from "@/components/features/search";
import { LuMessageCircle } from "react-icons/lu";
import { IoNotificationsOutline } from "react-icons/io5";
import Image from "next/image";
import Logo from "@/public/logo/chordeus_logo.png";

export const NavbarAuth = () => {
  const { setOpenMobile } = useSidebarGlobal();

  const handleBurgerClick = () => {
    setOpenMobile(true);
  };

  return (
    <nav className="h-14 bg-background items-center flex sticky top-0 z-50 w-full border-b px-3">
      <div className="flex justify-between items-center gap-x-6 w-full h-full">
        <div className="flex items-center">
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
          <Link
            href={"/home"}
            className="font-medium flex items-center gap-x-2 w-full"
          >
            <Image src={Logo} alt="Logo" width={34} height={34} />
            <span className="text-2xl font-medium md:block sm:hidden">
              chordeus
            </span>
          </Link>
        </div>
        <SearchBar />
        <div className="flex items-center h-full gap-x-2">
          <div className="flex items-center">
            <button className="w-10 h-10 flex items-center justify-center  hover:bg-hover cursor-pointer rounded-full">
              <IoNotificationsOutline className="!size-5 opacity-80" />
            </button>
            <button className="w-10 h-10 flex items-center justify-center  hover:bg-hover cursor-pointer rounded-full">
              <LuMessageCircle className="!size-5 opacity-80" />
            </button>
          </div>

          <DropdownProfile />
        </div>
      </div>
    </nav>
  );
};
