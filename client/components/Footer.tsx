import Image from "next/image";
import Logo from "@/public/bandbridge.png";
import Link from "next/link";

import { FaFacebookF, FaInstagram, FaXTwitter } from "react-icons/fa6";

import { Button } from "@/components/ui/button";

function Footer() {
  return (
    <footer className="mt-12">
      <div className="flex justify-center px-10">
        <div className="container">
          <div className="flex justify-between w-full border-b border-secondary pb-10">
            <div>
              <div className="flex flex-col gap-y-4">
                <Image src={Logo} alt="bandzik logo" width={36} height={36} />
                <h2 className="text-2xl">
                  <span className="font-semibold">
                    Faite des rencontres et secouez la scène.
                  </span>
                </h2>
                <p className="text-lg">
                  <span className="font-extrabold">Bandshake</span>, 2025.
                </p>
              </div>
            </div>
            <div className="flex gap-x-12">
              <div className="space-y-4">
                <h2 className="text-sm opacity-90">Rejoindre un groupe</h2>
                <ul className="space-y-2">
                  <li>
                    <Link href={"/"}>Groupes sur Paris</Link>
                  </li>
                  <li>
                    <Link href={"/"}>Groupes sur Lyon</Link>
                  </li>
                  <li>
                    <Link href={"/"}>Groupes sur Marseille</Link>
                  </li>
                  <li>
                    <Link href={"/"}>Groupes sur Toulouse</Link>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h2 className="text-sm opacity-90">Touver un musicien</h2>
                <ul className="space-y-2">
                  <li>
                    <Link href={"/"}>Musiciens sur Paris</Link>
                  </li>
                  <li>
                    <Link href={"/"}>Musiciens sur Lyon</Link>
                  </li>
                  <li>
                    <Link href={"/"}>Musiciens sur Marseille</Link>
                  </li>
                  <li>
                    <Link href={"/"}>Musiciens sur Toulouse</Link>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h2 className="text-sm opacity-80">Entreprise</h2>
                <ul className="space-y-2">
                  <li>
                    <Link href={"/"}>Blog</Link>
                  </li>
                  <li>
                    <Link href={"/"}>Carrière</Link>
                  </li>
                  <li>
                    <Link href={"/"}>Tarif</Link>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h2 className="text-sm opacity-90">Légal</h2>
                <ul className="space-y-2">
                  <li>
                    <Link href={"/"}>Politique de confidentialité</Link>
                  </li>
                  <li>
                    <Link href={"/"}>Mentions légales</Link>
                  </li>
                  <li>
                    <Link href={"/"}>Contact</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="py-4 flex justify-between items-center">
            <div>
              © 2025 <span className="font-extrabold">Bandshake</span>. Tous
              droits réservés.
            </div>
            <div className="flex space-x-6">
              <Button variant="outline" className="hover:bg-secondary/30">
                Signaler un bug
              </Button>
              <div className="flex space-x-3">
                <Link
                  href={""}
                  className="rounded-full w-9 h-9 flex justify-center items-center"
                >
                  <FaXTwitter className="text-xl" />
                </Link>
                <Link
                  href={""}
                  className="rounded-full w-9 h-9 flex justify-center items-center"
                >
                  <FaInstagram className="text-xl" />
                </Link>
                <Link
                  href={""}
                  className="rounded-full w-9 h-9 flex justify-center items-center"
                >
                  <FaFacebookF className="text-lg" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full py-0.5 bg-primary"></div>
    </footer>
  );
}

export default Footer;
