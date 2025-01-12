import Link from "next/link";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import { Button } from "./ui/button";

export const NavbarAuthBtn = async () => {
  const session = await getServerSession(authOptions);

  console.log(session?.backendTokens);

  if (session?.user)
    return (
      <div className="items-center text-sm relative">
        <Button className="rounded-full w-8 h-8 bg-slate-500 opacity-70 p-0 border-2 border-slate-400"></Button>
        <Link
          className="hover:bg-primary/90 bg-primary text-white text-sm px-4 py-2 h-9 rounded-md inline-flex items-center font-semibold"
          href={"/api/auth/signout"}
        >
          Se déconnecter
        </Link>
      </div>
    );

  return (
    <div className="flex gap-x-2 justify-center items-center">
      <Link
        className="hover:bg-accent border justify-center text-sm px-4 py-2 h-9 rounded-md inline-flex items-center font-medium"
        href={"/api/auth/signin"}
      >
        Se connecter
      </Link>
      <Link
        className="hover:bg-primary/90 bg-primary text-white text-sm px-4 py-2 h-9 rounded-md inline-flex items-center font-semibold"
        href={"/auth/signup"}
      >
        S'inscrire
      </Link>
    </div>
  );
};
