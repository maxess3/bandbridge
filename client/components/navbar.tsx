import Link from "next/link";
import Image from "next/image";
import Logo from "@/public/bandbridge.png";

import ThemeSwitch from "@/components/ThemeSwitch";
import { NavbarAuthBtn } from "@/components/NavbarAuthBtn";

async function Navbar() {
  return (
    <div>
      <nav className="font-host-grotesk flex items-center justify-center w-full py-3 border-b px-10 h-[62px]">
        <div className="container flex justify-between items-center">
          <div className="xl:w-[280px] lg:w-auto flex items-center gap-x-2.5">
            <Image src={Logo} alt="bandbridge logo" width={32} height={32} />
            <Link
              href={"/"}
              className="font-host-grotesk text-2xl font-semibold"
            ></Link>
          </div>
          <div>
            <ul className="flex justify-center items-center gap-x-12 font-normal">
              <Link
                href={"/ads"}
                className={`inline-flex items-center opacity-90`}
              >
                Groupes
              </Link>
              <Link
                href={"/"}
                className={`inline-flex items-center opacity-90`}
              >
                Artistes
              </Link>
              <Link
                href={"/me"}
                className={`inline-flex items-center opacity-90`}
              >
                Creator Site
              </Link>
            </ul>
          </div>
          <div className="xl:w-[280px] lg:w-auto flex justify-end gap-x-6">
            <div className="flex gap-x-2 justify-center items-center">
              <NavbarAuthBtn />
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
