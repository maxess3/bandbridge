import Link from "next/link";

export function Navbar() {
  return (
    <nav className="font-geist-sans flex items-center w-full py-4 border-b px-16">
      <div className="w-2/12">
        <Link href={"/"} className="font-host-grotesk font-bold text-2xl">
          BandBridge
        </Link>
      </div>
      <div className="w-8/12">
        <ul className="flex justify-center items-center gap-8 font-normal">
          <Link href={"/home"}>Accueil</Link>
          <Link href={"/ads"}>Annonces</Link>
          <Link href={"/contact"}>Contact</Link>
        </ul>
      </div>
      <div className="w-2/12 text-right">
        <Link
          className="bg-[black] text-white text-sm px-4 py-2 h-9 rounded-lg inline-flex font-medium hover:bg-primary/90"
          href={"/login"}
        >
          Se connecter
        </Link>
      </div>
    </nav>
  );
}
