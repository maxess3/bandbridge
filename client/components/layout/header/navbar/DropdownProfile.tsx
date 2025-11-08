"use client";

import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { getProfileImageUrl } from "@/utils";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { FiMoon } from "react-icons/fi";
import { LuLogOut } from "react-icons/lu";
import { LuSettings } from "react-icons/lu";
import { RiBugLine } from "react-icons/ri";
import { LuPencil } from "react-icons/lu";
import { LuUser } from "react-icons/lu";
import { DefaultProfilePicture } from "@/components/features/profile/avatar/DefaultProfilePicture";

export const DropdownProfile = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { resolvedTheme, setTheme } = useTheme();
  const [isChecked, setChecked] = useState(
    resolvedTheme === "light" ? false : true
  );
  const [isOpen, setIsOpen] = useState(false);
  const imageURL = getProfileImageUrl(
    session?.user?.profilePictureKey || "",
    "thumbnail"
  );

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    if (resolvedTheme === "dark") {
      setChecked(false);
      setTheme("light");
    }
    if (resolvedTheme === "light") {
      setChecked(true);
      setTheme("dark");
    }
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  return (
    <DropdownMenu modal={false} open={isOpen} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center justify-center bg-transparent rounded-full hover:bg-secondary cursor-pointer p-1"
          aria-label={`Menu profil de ${
            session?.user.pseudonyme || "utilisateur"
          }`}
        >
          <Avatar className="w-8 h-8">
            <AvatarImage
              src={imageURL || undefined}
              alt="Profile picture"
              className="rounded-full object-cover pointer-events-none"
              sizes="36px"
            />
            <AvatarFallback className="bg-secondary pointer-events-none">
              <DefaultProfilePicture className="mt-6 mr-1 w-[45px] h-[45px] text-background" />
            </AvatarFallback>
          </Avatar>
          <span className="absolute flex w-3 h-3 bg-green-600 rounded-full bottom-1.5 right-3.5 border-2 border-background"></span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60 mt-1 mr-2">
        <DropdownMenuGroup className="space-y-1">
          <div className="p-2">
            <div className="w-full space-y-3">
              <div className="flex items-center space-x-2.5">
                <Avatar>
                  <AvatarImage
                    src={imageURL || undefined}
                    alt="Profile picture"
                    className="rounded-full object-cover pointer-events-none"
                    sizes="36px"
                  />
                  <AvatarFallback className="bg-secondary pointer-events-none">
                    <DefaultProfilePicture className="mt-7 mr-1 w-[50px]! h-[50px]! text-background" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col ml-0.5 min-w-0 flex-1">
                  <span className="text-base font-semibold truncate">
                    {session?.user.pseudonyme}
                  </span>
                  <span className="text-xs opacity-80 truncate font-medium">
                    {session?.user.email}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <DropdownMenuSeparator className="bg-border" />
          <DropdownMenuItem
            onClick={() => router.push(`/${session?.user.username}`)}
          >
            <LuUser className="size-6!" />
            Voir le profil
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push(`/${session?.user.username}`)}
          >
            <LuPencil className="size-5!" />
            Éditer le profil
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-border" />
          <DropdownMenuItem
            className="flex justify-between"
            onClick={(e) => handleClick(e)}
          >
            <div className="flex gap-x-2.5 items-center">
              <FiMoon className="size-5!" />
              Mode sombre
            </div>
            <Switch checked={isChecked} />
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/")}>
            <RiBugLine className="size-5!" />
            Signaler un bug
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/settings")}>
            <LuSettings className="size-5!" />
            Paramètres
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-border" />
          <DropdownMenuItem onClick={() => signOut()}>
            <LuLogOut className="size-5!" />
            Se déconnecter
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
