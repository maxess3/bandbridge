"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const MenuLinks = () => {
  const currentPath = usePathname();

  return (
    <div>
      <ul className="flex justify-center items-center font-medium">
        <Link
          href={"/ads"}
          className={`inline-flex flex-col items-center ${
            currentPath === "/ads"
              ? "opacity-100 relative before:absolute before:w-full before:h-0.5 before:top-[2.5em] before:bg-primary font-bold"
              : "opacity-90"
          }`}
        >
          <span>Annonces</span>
        </Link>
      </ul>
    </div>
  );
};
