import Link from "next/link";
import Image from "next/image";
import Logo from "@/public/bandbridge.png";

import { NavbarAuthBtn } from "@/components/general/header/NavbarAuthBtn";
import { MenuLinks } from "@/components/general/header/MenuLinks";

async function Navbar() {
  return (
    <nav className="font-host-grotesk flex items-center justify-center w-full py-3 border-b border-secondary px-10 h-[60px]">
      <div className="container flex justify-between items-center">
        <div className="xl:w-[280px] lg:w-auto flex items-center gap-x-2.5">
          <Image src={Logo} alt="banshake logo" width={36} height={36} />
          <Link
            href={"/"}
            className="font-host-grotesk text-2xl font-extrabold font-maven"
          >
            Bandshake
          </Link>
        </div>
        <MenuLinks />
        <div className="xl:w-[280px] lg:w-auto flex justify-end gap-x-6">
          <div className="flex gap-x-2 justify-center items-center">
            <NavbarAuthBtn />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
