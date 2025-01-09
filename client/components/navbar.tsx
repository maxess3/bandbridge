"use client";

import { usePathname } from "next/navigation";

import Link from "next/link";
import Image from "next/image";
import Logo from "@/public/bandbridge.png";

import NavbarAuthActions from "@/components/NavbarAuthActions";

function Navbar() {
  const currentPath = usePathname();

  return (
    <div>
      <nav className="font-host-grotesk flex items-center justify-center w-full py-3 border-b px-10 h-[62px]">
        <div className="container flex justify-between items-center">
          <div className="xl:w-[280px] lg:w-auto flex items-center gap-x-2.5">
            <Image src={Logo} alt="bandbridge logo" width={32} height={32} />
            <Link
              href={"/"}
              className="font-host-grotesk text-2xl font-semibold"
            >
              Bandwiiz
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
                href={"/"}
                className={`inline-flex items-center opacity-90 ${
                  currentPath === "/artist"
                    ? "font-semibold opacity-100 relative before:absolute before:w-full before:h-0.5 before:top-10 before:bg-primary"
                    : "font-normal"
                }`}
              >
                Artistes
              </Link>
              <Link
                href={"/me"}
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
          <NavbarAuthActions />
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
