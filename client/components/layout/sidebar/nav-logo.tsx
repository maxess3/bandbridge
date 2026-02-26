"use client";

import Link from "next/link";
import Image from "next/image";
import Logo from "@/public/logo/chordeus_logo.png";

export function NavLogo() {
  return (
    <div className="flex items-center">
      <Link
        href={"/home"}
        className="font-medium flex items-center gap-x-2 w-full"
      >
        <Image src={Logo} alt="Logo" width={34} height={34} />
      </Link>
    </div>
  );
}
