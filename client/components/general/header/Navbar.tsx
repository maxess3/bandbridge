import Link from "next/link";
import Image from "next/image";
import Logo from "@/public/bandbridge.png";

import { NavbarAuthBtn } from "@/components/general/header/NavbarAuthBtn";
import { MenuLinks } from "@/components/general/header/MenuLinks";

async function Navbar() {
  return (
    <nav className="font-host-grotesk flex items-center justify-center w-full py-3 border-b border-secondary h-[60px] max-w-7xl mx-auto px-8">
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center gap-x-2.5">
          <Image src={Logo} alt="banshake logo" width={36} height={36} />
          <Link
            href={"/"}
            className="font-host-grotesk text-2xl font-extrabold font-maven bg-gradient-to-l"
          >
            Bandshake
          </Link>
        </div>
        <MenuLinks />
        <div className="flex justify-end gap-x-6">
          <div className="flex gap-x-2 justify-center items-center">
            <NavbarAuthBtn />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
