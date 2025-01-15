import Link from "next/link";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

import { DropdownProfile } from "@/components/DropdownProfile";
import { Button } from "@/components/ui/button";
import { FiPlusCircle } from "react-icons/fi";

export const NavbarAuthBtn = async () => {
  const session = await getServerSession(authOptions);

  if (session?.user)
    return (
      <div className="flex items-center text-sm relative gap-x-4">
        <Button className="text-white font-semibold">
          <FiPlusCircle style={{ width: "18px" }} />
          Déposer une annonce
        </Button>
        <DropdownProfile />
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
