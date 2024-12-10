import Image from "next/image";

import Link from "next/link";

import { FaFacebookF } from "react-icons/fa";
import { FaInstagram, FaXTwitter } from "react-icons/fa6";

function Footer() {
  return (
    <footer>
      <div className="flex justify-center">
        <div className="container">
          <div className="flex justify-between w-full border-b pb-10">
            <div>
              <div className="flex flex-col gap-y-4">
                <Image
                  src="/bandbridge.png"
                  alt="bandbridge logo"
                  width={32}
                  height={32}
                />
                <h2 className="text-2xl">
                  <span className="font-semibold">
                    Ne faites pas que de la musique.
                  </span>
                </h2>
                <p className="text-lg">
                  <span className="font-semibold">band</span>bridge, 2024.
                </p>
              </div>
            </div>
            <div className="flex gap-x-12">
              <div className="space-y-4">
                <h2 className="text-sm">Entreprise</h2>
                <ul className="space-y-2">
                  <li>
                    <Link href={"/signin"}>Blog</Link>
                  </li>
                  <li>
                    <Link href={"/signin"}>Carrière</Link>
                  </li>
                  <li>
                    <Link href={"/signin"}>Tarif</Link>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h2 className="text-sm">Liens rapide</h2>
                <ul className="space-y-2">
                  <li>
                    <Link href={"/signin"}>Article 1</Link>
                  </li>
                  <li>
                    <Link href={"/signin"}>Article 2</Link>
                  </li>
                  <li>
                    <Link href={"/signin"}>Article 3</Link>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h2 className="text-sm">Légal</h2>
                <ul className="space-y-2">
                  <li>
                    <Link href={"/signin"}>Politique de confidentialité</Link>
                  </li>
                  <li>
                    <Link href={"/signin"}>Mentions légales</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="py-4 flex justify-between items-center">
            <div>
              © 2024 <span className="font-semibold">band</span>bridge. Tous
              droits réservés.{" "}
            </div>
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
                <FaFacebookF className="text-xl" />
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full py-0.5 bg-primary"></div>
    </footer>
  );
}

export default Footer;
