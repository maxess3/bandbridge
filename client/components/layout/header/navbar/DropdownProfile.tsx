"use client";

import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { getImageUrl } from "@/utils";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  UserIcon,
  PencilSimpleLineIcon,
  MoonIcon,
  BugBeetleIcon,
  GearIcon,
  SignOutIcon,
  CaretDownIcon,
} from "@phosphor-icons/react";
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
import { DefaultProfilePicture } from "@/components/features/profile/avatar/DefaultProfilePicture";

export const DropdownProfile = ({
  showText = true,
}: {
  showText?: boolean;
}) => {
  const router = useRouter();
  const { data: session } = useSession();
  const { resolvedTheme, setTheme } = useTheme();
  const [isChecked, setChecked] = useState(
    resolvedTheme === "light" ? false : true
  );
  const [isOpen, setIsOpen] = useState(false);
  const imageURL = getImageUrl(
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
          className="flex items-center rounded-full cursor-pointer gap-x-2 w-full"
          aria-label={`Menu profil de ${
            session?.user?.pseudonyme || "utilisateur"
          }`}
        >
          <span className="relative">
            <Avatar>
              <AvatarImage
                src={imageURL || undefined}
                alt="Profile picture"
                className="object-cover pointer-events-none"
              />
              <AvatarFallback className="bg-secondary pointer-events-none">
                <DefaultProfilePicture className="mt-6 mr-1 w-[45px] h-[45px] text-background" />
              </AvatarFallback>
            </Avatar>
            <span className="absolute -bottom-1.5 -right-1 bg-background rounded-full flex justify-center items-center w-5 h-5">
              <CaretDownIcon weight="bold" className="size-3" />
            </span>
          </span>

          {showText && (
            <span className="flex flex-col justify-center items-start flex-1 min-w-0">
              <span className="text-sm font-medium truncate w-full text-left">
                {session?.user?.pseudonyme ? session?.user?.pseudonyme : "..."}
              </span>
              <span className="text-xs opacity-80 font-medium truncate w-full text-left">
                {session?.user?.username
                  ? `@${session?.user?.username}`
                  : "..."}
              </span>
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-60 mt-2">
        <DropdownMenuGroup className="space-y-0.5">
          <div className="px-1 py-1">
            <div className="w-full">
              <div className="flex items-center space-x-2.5">
                <Avatar>
                  <AvatarImage
                    src={imageURL || undefined}
                    alt="Profile picture"
                    className="rounded-full object-cover pointer-events-none"
                  />
                  <AvatarFallback className="bg-secondary pointer-events-none">
                    <DefaultProfilePicture className="mt-7 mr-1 w-[50px]! h-[50px]! text-background" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col ml-0.5 min-w-0 flex-1">
                  <span className="text-sm font-medium truncate">
                    {session?.user?.pseudonyme
                      ? session?.user?.pseudonyme
                      : "..."}
                  </span>
                  <span className="text-xs opacity-80 truncate font-medium">
                    {session?.user?.username
                      ? `@${session?.user?.username}`
                      : "..."}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <DropdownMenuSeparator className="bg-border" />
          <DropdownMenuItem
            className="gap-x-6"
            onClick={() => router.push(`/${session?.user?.username}`)}
          >
            <UserIcon weight="bold" />
            Voir le profil
          </DropdownMenuItem>
          <DropdownMenuItem
            className="gap-x-6"
            onClick={() => router.push(`/${session?.user?.username}`)}
          >
            <PencilSimpleLineIcon weight="bold" />
            Éditer le profil
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-border" />
          <DropdownMenuItem
            className="flex justify-between gap-x-6"
            onClick={(e) => handleClick(e)}
          >
            <div className="flex gap-x-6 items-center">
              <MoonIcon weight="bold" />
              Mode sombre
            </div>
            <Switch checked={isChecked} />
          </DropdownMenuItem>
          <DropdownMenuItem
            className="gap-x-6"
            onClick={() => router.push("/")}
          >
            <BugBeetleIcon weight="bold" />
            Signaler un bug
          </DropdownMenuItem>
          <DropdownMenuItem
            className="gap-x-6"
            onClick={() => router.push("/settings")}
          >
            <GearIcon weight="bold" />
            Paramètres
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-border" />
          <DropdownMenuItem className="gap-x-6" onClick={() => signOut()}>
            <SignOutIcon weight="bold" />
            Se déconnecter
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
