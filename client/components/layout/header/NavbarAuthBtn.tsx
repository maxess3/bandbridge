import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { DropdownProfile } from "@/components/layout/header/DropdownProfile";
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
    <div className="flex gap-x-2 justify-center items-center">
      <Link
        className={buttonVariants({ variant: "outline", size: "md" })}
        href={"/api/auth/signin"}
      >
        Se connecter
      </Link>
      <Link
        className={buttonVariants({ variant: "primary", size: "md" })}
        href={"/auth/signup"}
      >
        S'inscrire
      </Link>
    </div>
  );
};
