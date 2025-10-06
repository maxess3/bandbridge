"use client";

import Image from "next/image";
import Logo from "@/public/logo/chordeus_logo.png";
import Link from "next/link";
import { FaInstagram, FaXTwitter } from "react-icons/fa6";
import { FiFacebook } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";

function Footer() {
  const axiosAuth = useAxiosAuth();
  const fetchPost = async () => {
    await axiosAuth.get("/user");
  };
  return (
    <footer className="bg-transparent mt-16 py-6 border-t space-y-6">
      <div className="max-w-7xl lg:px-6 md:px-4 px-2 mx-auto flex justify-between w-full text-sm">
        <div>
          <div className="flex flex-col gap-y-4">
            <Image src={Logo} alt="Chordeus Logo" width={36} height={36} />
            <h2 className="text-2xl">
              <span className="font-medium">
                La musique qui nous rassemble.
              </span>
            </h2>
            <p className="text-lg">
              <span className="font-semibold">chordeus</span>
              <span>, 2025</span>.
            </p>
          </div>
        </div>
        <div className="flex gap-x-12">
          <div className="space-y-6">
            <h2 className="text-sm opacity-90">Rejoindre un groupe</h2>
            <ul className="space-y-3">
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
          <div className="space-y-6">
            <h2 className="text-sm opacity-80">Entreprise</h2>
            <ul className="space-y-3">
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
          <div className="space-y-6">
            <h2 className="text-sm opacity-90">Légal</h2>
            <ul className="space-y-3">
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
      <div className="max-w-7xl lg:px-6 md:px-4 px-2 mx-auto flex items-center justify-between">
        <div className="flex items-center justify-start">
          <div>
            ©2025 <span className="font-semibold">🇫🇷 chordeus</span>. Tous
            droits réservés.
          </div>
        </div>
        <div className="flex space-x-3 justify-center items-center">
          <div className="flex space-x-6 items-center">
            <Button onClick={fetchPost} variant="outline" size="md">
              Signaler un bug
            </Button>
          </div>
          <Link
            href={""}
            className={
              buttonVariants({ variant: "ghost" }) + " w-10 h-10 !rounded-full"
            }
          >
            <FaXTwitter style={{ width: "1.4em", height: "1.4em" }} />
          </Link>
          <Link
            href={""}
            className={
              buttonVariants({ variant: "ghost" }) + " w-10 h-10 !rounded-full"
            }
          >
            <FaInstagram style={{ width: "1.45em", height: "1.45em" }} />
          </Link>
          <Link
            href={""}
            className={
              buttonVariants({ variant: "ghost" }) + " w-10 h-10 !rounded-full"
            }
          >
            <FiFacebook
              style={{ width: "1.5em", height: "1.5em" }}
              className="relative right-[2px]"
            />
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
