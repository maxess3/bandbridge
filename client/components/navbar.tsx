"use client";

import { usePathname } from "next/navigation";

import Link from "next/link";

import Image from "next/image";

import { Button } from "./ui/button";

import ThemeSwitch from "@/components/ThemeSwitch";

function Navbar() {
  const currentPath = usePathname();

  return (
    <div>
      <nav className="font-host-grotesk flex items-center justify-center w-full py-3 border-b px-10 h-[62px]">
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
                href={"/ads"}
                className={`inline-flex items-center opacity-90 ${
                  currentPath === "/ads"
                    ? "font-semibold opacity-100 relative before:absolute before:w-full before:h-0.5 before:top-10 before:bg-primary"
                    : "font-normal"
                }`}
              >
                Groupes
              </Link>
              <Link
                href={"/artist"}
                className={`inline-flex items-center opacity-90 ${
                  currentPath === "/artist"
                    ? "font-semibold opacity-100 relative before:absolute before:w-full before:h-0.5 before:top-10 before:bg-primary"
                    : "font-normal"
                }`}
              >
                Artistes
              </Link>
              <Link
                href={"/forum"}
                className={`inline-flex items-center opacity-90 ${
                  currentPath === "/forum"
                    ? "font-semibold opacity-100 relative before:absolute before:w-full before:h-0.5 before:top-10 before:bg-primary"
                    : "font-normal"
                }`}
              >
                Creator Site
              </Link>
            </ul>
          </div>
          <div className="xl:w-[280px] lg:w-auto flex justify-end gap-x-6">
            <div className="flex gap-x-2 justify-center items-center">
              {/* <div className="flex items-center text-sm relative">
                <Button className="rounded-full w-8 h-8 bg-slate-500 opacity-70 p-0 border-2 border-slate-400"></Button>
                <span className="absolute w-2.5 h-2.5 bg-white rounded-full top-0 right-0"></span>
              </div> */}
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
