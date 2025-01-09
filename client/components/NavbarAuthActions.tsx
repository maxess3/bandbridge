"use client";

import Link from "next/link";

import { useAuth } from "@/context/AuthContext";

import { Skeleton } from "./ui/skeleton";
import { Button } from "./ui/button";

import ThemeSwitch from "@/components/ThemeSwitch";

const NavbarAuthActions = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading)
    return (
      <div className="xl:w-[280px] lg:w-auto flex justify-end gap-x-6">
        <Skeleton className="h-9 w-[250px] bg-secondary" />
      </div>
    );

  return (
    <div className="xl:w-[280px] lg:w-auto flex justify-end gap-x-6">
      <div className="flex gap-x-2 justify-center items-center">
        {isAuthenticated ? (
          <div className="items-center text-sm relative">
            <Button className="rounded-full w-8 h-8 bg-slate-500 opacity-70 p-0 border-2 border-slate-400"></Button>
          </div>
        ) : (
          <>
            <Link
              className="hover:bg-accent border justify-center text-sm px-4 py-2 h-9 rounded-md inline-flex items-center font-medium"
              href={"/auth/login"}
            >
              Se connecter
            </Link>
            <Link
              className="hover:bg-primary/90 bg-primary text-white text-sm px-4 py-2 h-9 rounded-md inline-flex items-center font-semibold"
              href={"/auth/signup"}
            >
              S'inscrire
            </Link>
          </>
        )}
      </div>
      <div>
        <ThemeSwitch />
      </div>
    </div>
  );
};

export default NavbarAuthActions;
