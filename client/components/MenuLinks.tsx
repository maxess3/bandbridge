"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";

export const MenuLinks = () => {
  const currentPath = usePathname();

  return (
    <div>
      <ul className="flex justify-center items-center gap-x-10 font-normal font-montserrat">
        <Link
          href={"/ads"}
          className={`inline-flex items-center opacity-90 ${
            currentPath === "/ads"
              ? "font-semibold opacity-100 relative before:absolute before:w-full before:h-0.5 before:top-10 before:bg-primary"
              : "font-normal"
          }`}
        >
          Groupes
        </Link>
      </ul>
    </div>
  );
};
