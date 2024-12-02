import Link from "next/link";

import { MdOutlineForum } from "react-icons/md";
import { RiUserLine, RiFileList3Line } from "react-icons/ri";
import { PiUsersFour } from "react-icons/pi";

export function Navbar() {
  return (
    <nav className="font-geist-sans flex items-center justify-center w-full py-4 border-b px-10">
      <div className="container flex justify-center items-center">
        <div className="w-3/12 flex items-center">
          <Link href={"/"} className="font-host-grotesk font-bold text-2xl">
            BandBridge
          </Link>
        </div>
        <div className="w-6/12">
          <ul className="flex justify-center items-center gap-9 font-normal">
            <Link href={"/contact"} className="inline-flex items-center">
              <PiUsersFour className="text-2xl mr-2" />
              Groupes
            </Link>
            <Link href={"/ads"} className="inline-flex items-center">
              <RiFileList3Line className="text-lg mr-2" />
              Annonces
            </Link>
            <Link href={"/contact"} className="inline-flex items-center">
              <RiUserLine className="text-lg mr-2" />
              Musiciens
            </Link>
            <Link href={"/forum"} className="inline-flex items-center">
              <MdOutlineForum className="text-lg mr-2" />
              Forum
            </Link>
          </ul>
        </div>
        <div className="w-3/12 flex justify-end gap-x-2">
          <Link
            className="border justify-center border-black text-black text-sm px-4 py-2 h-9 rounded-lg inline-flex items-center font-medium hover:bg-primary/5"
            href={"/login"}
          >
            Se connecter
          </Link>
          <Link
            className="bg-[black] text-white text-sm px-4 py-2 h-9 rounded-lg inline-flex items-center font-medium hover:bg-primary/90"
            href={"/signup"}
          >
            S'inscrire
          </Link>
        </div>
      </div>
    </nav>
  );
}
