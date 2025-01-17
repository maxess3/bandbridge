"use client";

import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { useState } from "react";
import Image from "next/image";
import Logo from "@/public/bandbridge.png";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

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
import { FaRegUser } from "react-icons/fa6";
import { RiBugLine } from "react-icons/ri";

export const DropdownProfile = () => {
  const { data: session } = useSession();
  const [isChecked, setChecked] = useState(true);
  const { resolvedTheme, setTheme } = useTheme();
  const router = useRouter();

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
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Image
          src={Logo}
          width={36}
          height={36}
          alt="User profile"
          className="cursor-pointer filter grayscale"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 mt-[8px] rounded-t-none border-none rounded-b-md">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push("/me")}>
            <FaRegUser
              style={{ width: "1.4em", height: "1.4em" }}
              className="mr-1"
            />
            <div className="flex flex-col">
              <span className="text-md">Mon profil</span>
              <span className="text-xs opacity-80">
                {session?.user.firstName}
              </span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex justify-between"
            onClick={(e) => handleClick(e)}
          >
            <div className="flex gap-x-3.5">
              <FiMoon style={{ width: "1.4em", height: "1.4em" }} />
              Mode sombre
            </div>
            <Switch checked={isChecked} />
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/me")}>
            <RiBugLine
              style={{ width: "1.6em", height: "1.6em" }}
              className="mr-0.5"
            />
            Signaler un bug
          </DropdownMenuItem>
          <DropdownMenuItem
            className="dark:text-red-600 text-red-700"
            onClick={() => signOut()}
          >
            <LuLogOut
              style={{ width: "1.4em", height: "1.4em" }}
              className="mr-1.5"
            />
            Se déconnecter
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
