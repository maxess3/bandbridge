"use client";

import { usePathname } from "next/navigation";

import Link from "next/link";

import Image from "next/image";

import ThemeSwitch from "@/components/ThemeSwitch";

function Navbar() {
  const currentPath = usePathname();

  return (
    <div>
      <nav className="font-host-grotesk flex items-center justify-center w-full py-3 border-b px-10">
        <div className="container flex justify-between items-center">
          <div className="xl:w-[280px] lg:w-auto flex items-center gap-x-3">
            <Image
              src="/bandbridge.png"
              alt="bandbridge logo"
              width={32}
              height={32}
            />
            <Link href={"/"} className="font-host-grotesk text-xl">
              <span className="font-semibold">band</span>bridge
            </Link>
          </div>
          <div>
            <ul className="flex justify-center items-center gap-x-12 font-normal">
              <Link
                href={"/band"}
                className={`inline-flex items-center opacity-90 ${
                  currentPath === "/band"
                    ? "font-semibold opacity-100 relative before:absolute before:w-full before:h-0.5 before:top-10 before:bg-primary"
                    : "font-normal"
                }`}
              >
                Groupes
              </Link>
              <Link
                href={"/ads"}
                className={`inline-flex items-center opacity-90 ${
                  currentPath === "/ads"
                    ? "font-semibold opacity-100 relative before:absolute before:w-full before:h-0.5 before:top-10 before:bg-primary"
                    : "font-normal"
                }`}
              >
                Annonces
              </Link>
              <Link
                href={"/musician"}
                className={`inline-flex items-center opacity-90 ${
                  currentPath === "/musician"
                    ? "font-semibold opacity-100 relative before:absolute before:w-full before:h-0.5 before:top-10 before:bg-primary"
                    : "font-normal"
                }`}
              >
                Musiciens
              </Link>
              <Link
                href={"/forum"}
                className={`inline-flex items-center opacity-90 ${
                  currentPath === "/forum"
                    ? "font-semibold opacity-100 relative before:absolute before:w-full before:h-0.5 before:top-10 before:bg-primary"
                    : "font-normal"
                }`}
              >
                Forum
              </Link>
            </ul>
          </div>
          <div className="xl:w-[280px] lg:w-auto flex justify-end gap-x-6">
            <div className="flex gap-x-2">
              <Link
                className="hover:bg-accent border justify-center text-sm px-4 py-2 h-9 rounded-md inline-flex items-center font-medium"
                href={"/login"}
              >
                Se connecter
              </Link>
              <Link
                className="hover:bg-primary/90 bg-primary text-white text-sm px-4 py-2 h-9 rounded-md inline-flex items-center font-semibold"
                href={"/signup"}
              >
                S'inscrire
              </Link>
            </div>
            <div>
              <ThemeSwitch />
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
