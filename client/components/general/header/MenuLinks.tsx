"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";

import { PiPlaylistFill } from "react-icons/pi";
import { PiUsersThreeFill } from "react-icons/pi";
import { FaHome } from "react-icons/fa";

export const MenuLinks = () => {
  const currentPath = usePathname();

  return (
    <div>
      <ul className="flex justify-center items-center gap-x-10 font-normal text-sm">
        <Link
          href={"/"}
          className={`inline-flex flex-col items-center opacity-85`}
        >
          <FaHome size={"1.7em"} />
          <span>Accueil</span>
        </Link>
        <Link
          href={"/"}
          className={`inline-flex flex-col items-center  ${
            currentPath === "/"
              ? "opacity-100 relative before:absolute before:w-full before:h-0.5 before:top-[3.7em] before:bg-border"
              : "opacity-85"
          }`}
        >
          <PiUsersThreeFill size={"1.7em"} />
          <span>Musiciens</span>
        </Link>
        <Link
          href={"/ads"}
          className={`inline-flex flex-col items-center ${
            currentPath === "/ads"
              ? "opacity-100 relative before:absolute before:w-full before:h-0.5 before:top-[3.7em] before:bg-border"
              : "opacity-85"
          }`}
        >
          <PiPlaylistFill size={"1.7em"} />
          <span>Annonces</span>
        </Link>
      </ul>
    </div>
  );
};
