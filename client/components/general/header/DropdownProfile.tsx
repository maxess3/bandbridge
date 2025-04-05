"use client";

import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
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

export const DropdownProfile = () => {
  const router = useRouter();

  const { data: session } = useSession();

  const { resolvedTheme, setTheme } = useTheme();
  const [isChecked, setChecked] = useState(
    resolvedTheme === "light" ? false : true
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="w-auto h-auto flex p-0 rounded-full">
          <Avatar className="w-9 h-9 cursor-pointer">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60 mt-[7px] border-border-light">
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => router.push(`/${session?.user.username}`)}
          >
            <div className="w-full space-y-3">
              <div className="flex space-x-2">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex flex-col ml-0.5">
                  <span className="text-md">{session?.user.firstName}</span>
                  <span className="text-xs opacity-80">
                    {session?.user.email}
                  </span>
                </div>
              </div>
              <span className="w-full border flex rounded-full justify-center py-1 font-medium">
                Voir mon profil
              </span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-border-light" />
          <DropdownMenuItem
            className="flex justify-between"
            onClick={(e) => handleClick(e)}
          >
            <div className="flex gap-x-2.5 items-center">
              <FiMoon style={{ width: "1.25em", height: "1.25em" }} />
              Mode sombre
            </div>
            <Switch checked={isChecked} />
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/me")}>
            <RiBugLine style={{ width: "1.4em", height: "1.4em" }} />
            Signaler un bug
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/me")}>
            <LuSettings style={{ width: "1.35em", height: "1.35em" }} />
            Paramètres
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-border-light" />
          <DropdownMenuItem onClick={() => signOut()}>
            <LuLogOut style={{ width: "1.25em", height: "1.25em" }} />
            Se déconnecter
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
