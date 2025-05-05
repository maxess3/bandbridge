import Link from "next/link";
import Image from "next/image";
import Logo from "@/public/chordeus_logo.png";
import { NavbarAuthBtn } from "@/components/general/header/NavbarAuthBtn";
import { MenuLinks } from "@/components/general/header/MenuLinks";

async function Navbar() {
  return (
    <nav className="flex items-center justify-center w-full border-b border-border h-14">
      <div className="flex justify-between items-center w-full max-w-[1240px] mx-auto px-4">
        <div>
          <div className="flex items-center gap-x-2.5">
            <Image src={Logo} alt="Logo" width={36} height={36} />
            <Link href={"/home"} className="text-2xl font-medium">
              Chordeus
            </Link>
          </div>
        </div>
        <MenuLinks />
        <NavbarAuthBtn />
      </div>
    </nav>
  );
}

export default Navbar;
