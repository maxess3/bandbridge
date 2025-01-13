"use client";

import { signOut } from "next-auth/react";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { LuLogOut } from "react-icons/lu";
import { FaRegUser } from "react-icons/fa6";

export const DropdownProfile = () => {
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="cursor-pointer rounded-full w-8 h-8 bg-slate-400 hover:bg-slate-400 opacity-70 border-slate-400 border-none outline-none"></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push("/me")}>
            <FaRegUser
              style={{ width: "1.4em", height: "1.4em" }}
              className="mr-0.5"
            />
            Voir mon profil
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuItem onClick={() => signOut()}>
          <LuLogOut
            style={{ width: "1.4em", height: "1.4em" }}
            className="mr-0.5"
          />
          Se déconnecter
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
