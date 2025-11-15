import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { DropdownProfile } from "@/components/layout/header/navbar/DropdownProfile";
import { buttonVariants } from "@/components/ui/button";

export const NavbarAuthBtn = async () => {
  const session = await getServerSession(authOptions);

  if (session?.user)
    return (
      <div className="flex justify-end items-center text-sm">
        <DropdownProfile />
      </div>
    );

  return (
    <>
      <Link
        className={buttonVariants({ variant: "outline" })}
        href={"/api/auth/signin"}
      >
        Se connecter
      </Link>
      <Link
        className={buttonVariants({ variant: "outline" })}
        href={"/auth/signup"}
      >
        S'inscrire
      </Link>
    </>
  );
};
