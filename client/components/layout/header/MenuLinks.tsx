"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const MenuLinks = () => {
  const currentPath = usePathname();

  return (
    <div>
      <ul className="flex justify-center items-center font-medium space-x-8">
        <Link
          href={"/"}
          className={`inline-flex flex-col items-center ${
            currentPath === "/musician"
              ? "opacity-100 relative before:absolute before:w-full before:h-0.5 before:top-[2.6em] before:bg-primary font-bold"
              : "opacity-90"
          }`}
        >
          <span>Musiciens</span>
        </Link>
        <Link
          href={"/"}
          className={`inline-flex flex-col items-center ${
            currentPath === "/groups"
              ? "opacity-100 relative before:absolute before:w-full before:h-0.5 before:top-[2.6em] before:bg-primary font-bold"
              : "opacity-90"
          }`}
        >
          <span>Groupes</span>
        </Link>
        <Link
          href={"/ads"}
          className={`inline-flex flex-col items-center ${
            currentPath === "/ads"
              ? "opacity-100 relative before:absolute before:w-full before:h-0.5 before:top-[2.6em] before:bg-primary font-bold"
              : "opacity-90"
          }`}
        >
          <span>Annonces</span>
        </Link>
      </ul>
    </div>
  );
};
